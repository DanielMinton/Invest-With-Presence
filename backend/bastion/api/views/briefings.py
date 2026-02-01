"""
Briefing and Notification ViewSets
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
import markdown

from bastion.briefings.models import BriefingTemplate, Briefing, Notification
from bastion.api.serializers import (
    BriefingTemplateSerializer,
    BriefingTemplateListSerializer,
    BriefingSerializer,
    BriefingListSerializer,
    BriefingCreateSerializer,
    NotificationSerializer,
    NotificationListSerializer,
    NotificationMarkReadSerializer,
)
from bastion.audit.services import audit_log


class BriefingTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for briefing templates
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['template_type', 'is_active', 'requires_approval']
    search_fields = ['name', 'description']
    ordering = ['template_type', 'name']

    def get_queryset(self):
        return BriefingTemplate.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return BriefingTemplateListSerializer
        return BriefingTemplateSerializer

    def perform_create(self, serializer):
        template = serializer.save(created_by=self.request.user)
        audit_log(
            event_type='data.create',
            user=self.request.user,
            request=self.request,
            target=template,
            details={'model': 'BriefingTemplate'}
        )


class BriefingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for client briefings
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['household', 'client', 'template', 'status', 'delivery_method']
    search_fields = ['title', 'subject']
    ordering_fields = ['created_at', 'scheduled_for', 'sent_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Briefing.objects.select_related(
            'household', 'client', 'template', 'created_by', 'approved_by'
        ).prefetch_related('attachments')

    def get_serializer_class(self):
        if self.action == 'list':
            return BriefingListSerializer
        if self.action == 'create':
            return BriefingCreateSerializer
        return BriefingSerializer

    def perform_create(self, serializer):
        # Convert markdown to HTML
        body_markdown = serializer.validated_data.get('body_markdown', '')
        body_html = markdown.markdown(body_markdown, extensions=['tables', 'fenced_code'])

        briefing = serializer.save(body_html=body_html)
        audit_log(
            event_type='comm.briefing_sent',
            user=self.request.user,
            request=self.request,
            target=briefing,
            details={'status': 'created'}
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a briefing for sending"""
        briefing = self.get_object()

        if briefing.status not in ['draft', 'pending_review']:
            return Response(
                {'error': 'Briefing cannot be approved in current status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        briefing.status = 'approved'
        briefing.approved_by = request.user
        briefing.approved_at = timezone.now()
        briefing.save(update_fields=['status', 'approved_by', 'approved_at', 'updated_at'])

        audit_log(
            event_type='comm.briefing_sent',
            user=request.user,
            request=request,
            target=briefing,
            details={'status': 'approved'}
        )

        serializer = self.get_serializer(briefing)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Send an approved briefing"""
        briefing = self.get_object()

        if briefing.status != 'approved':
            return Response(
                {'error': 'Briefing must be approved before sending'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # TODO: Implement actual email/portal delivery
        briefing.status = 'sent'
        briefing.sent_at = timezone.now()
        briefing.save(update_fields=['status', 'sent_at', 'updated_at'])

        audit_log(
            event_type='comm.briefing_sent',
            user=request.user,
            request=request,
            target=briefing,
            details={'status': 'sent', 'delivery_method': briefing.delivery_method}
        )

        serializer = self.get_serializer(briefing)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get briefings pending review"""
        briefings = self.get_queryset().filter(status='pending_review')
        serializer = BriefingListSerializer(briefings, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def scheduled(self, request):
        """Get scheduled briefings"""
        briefings = self.get_queryset().filter(
            status='approved',
            scheduled_for__isnull=False,
            scheduled_for__gte=timezone.now()
        ).order_by('scheduled_for')
        serializer = BriefingListSerializer(briefings, many=True)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user notifications
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['notification_type', 'is_read']
    ordering = ['-created_at']

    def get_queryset(self):
        # Users can only see their own notifications
        return Notification.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return NotificationListSerializer
        if self.action == 'mark_read':
            return NotificationMarkReadSerializer
        return NotificationSerializer

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        notifications = self.get_queryset().filter(is_read=False)
        serializer = NotificationListSerializer(notifications, many=True)
        return Response({
            'count': notifications.count(),
            'notifications': serializer.data
        })

    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        """Mark notifications as read"""
        serializer = NotificationMarkReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if serializer.validated_data.get('mark_all'):
            updated = self.get_queryset().filter(is_read=False).update(
                is_read=True,
                read_at=timezone.now()
            )
        else:
            notification_ids = serializer.validated_data.get('notification_ids', [])
            updated = self.get_queryset().filter(
                id__in=notification_ids,
                is_read=False
            ).update(
                is_read=True,
                read_at=timezone.now()
            )

        return Response({'marked_read': updated})

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        """Mark a single notification as read"""
        notification = self.get_object()
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save(update_fields=['is_read', 'read_at'])

        serializer = self.get_serializer(notification)
        return Response(serializer.data)
