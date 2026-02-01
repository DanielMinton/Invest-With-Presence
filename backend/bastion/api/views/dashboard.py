"""
Dashboard and Admin ViewSets
"""

from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta

from bastion.core.models import User, Client, Household, Account, RiskSnapshot
from bastion.documents.models import Document
from bastion.briefings.models import Briefing, Notification
from bastion.audit.models import AuditEvent
from bastion.api.serializers import UserSerializer, DashboardStatsSerializer
from bastion.audit.services import audit_log


class DashboardView(APIView):
    """
    Dashboard statistics endpoint
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Calculate stats
        total_clients = Client.objects.filter(is_active=True).count()
        total_households = Household.objects.count()
        total_accounts = Account.objects.filter(is_active=True).count()

        # Get total AUM from latest risk snapshots
        # For now, use a placeholder - would aggregate from RiskSnapshot
        total_aum = RiskSnapshot.objects.aggregate(
            total=Sum('total_value')
        )['total'] or 0

        pending_briefings = Briefing.objects.filter(
            status__in=['draft', 'pending_review']
        ).count()

        # Pending tasks would come from a Task model
        pending_tasks = 7  # Placeholder

        data = {
            'total_aum': total_aum,
            'total_clients': total_clients,
            'total_households': total_households,
            'total_accounts': total_accounts,
            'pending_tasks': pending_tasks,
            'pending_briefings': pending_briefings,
        }

        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)


class RecentActivityView(APIView):
    """
    Get recent activity for dashboard
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = int(request.query_params.get('limit', 10))

        # Get recent audit events
        events = AuditEvent.objects.select_related('user').order_by('-timestamp')[:limit]

        activity = []
        for event in events:
            activity.append({
                'id': str(event.id),
                'type': self._get_activity_type(event.event_type),
                'title': self._get_activity_title(event),
                'description': event.description or self._get_activity_description(event),
                'user': event.user_email,
                'timestamp': event.timestamp.isoformat(),
                'event_type': event.event_type,
            })

        return Response(activity)

    def _get_activity_type(self, event_type):
        type_map = {
            'auth.': 'auth',
            'data.': 'data',
            'doc.': 'document',
            'comm.': 'briefing',
            'admin.': 'admin',
            'sys.': 'system',
        }
        for prefix, activity_type in type_map.items():
            if event_type.startswith(prefix):
                return activity_type
        return 'other'

    def _get_activity_title(self, event):
        titles = {
            'auth.login': 'User logged in',
            'auth.logout': 'User logged out',
            'data.create': 'Record created',
            'data.update': 'Record updated',
            'data.view': 'Record viewed',
            'doc.upload': 'Document uploaded',
            'doc.download': 'Document downloaded',
            'doc.view': 'Document viewed',
            'comm.briefing_sent': 'Briefing activity',
        }
        return titles.get(event.event_type, event.event_type.replace('.', ' ').title())

    def _get_activity_description(self, event):
        if event.target_repr:
            return f"{event.target_type}: {event.target_repr}"
        return ''


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user management (admin only)
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_staff', 'is_superuser']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['email', 'date_joined', 'last_login']
    ordering = ['-date_joined']

    def get_queryset(self):
        return User.objects.all()

    def perform_create(self, serializer):
        user = serializer.save()
        audit_log(
            event_type='admin.user_create',
            user=self.request.user,
            request=self.request,
            target=user,
            details={'email': user.email}
        )

    def perform_update(self, serializer):
        user = serializer.save()
        audit_log(
            event_type='admin.user_update',
            user=self.request.user,
            request=self.request,
            target=user,
            details={'email': user.email, 'fields': list(serializer.validated_data.keys())}
        )

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user"""
        user = self.get_object()
        if user == request.user:
            return Response(
                {'error': 'Cannot deactivate your own account'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = False
        user.save(update_fields=['is_active'])

        audit_log(
            event_type='admin.user_deactivate',
            user=request.user,
            request=request,
            target=user,
            details={'email': user.email}
        )

        return Response({'status': 'deactivated'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user"""
        user = self.get_object()
        user.is_active = True
        user.save(update_fields=['is_active'])

        audit_log(
            event_type='admin.user_update',
            user=request.user,
            request=request,
            target=user,
            details={'email': user.email, 'action': 'activated'}
        )

        return Response({'status': 'activated'})

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """Send password reset email to user"""
        user = self.get_object()
        # TODO: Implement password reset email
        return Response({'status': 'password_reset_sent'})


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing audit logs (admin only)
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'severity', 'user']
    search_fields = ['user_email', 'description', 'target_repr']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']

    def get_queryset(self):
        return AuditEvent.objects.select_related('user')

    def get_serializer_class(self):
        from rest_framework import serializers

        class AuditEventSerializer(serializers.ModelSerializer):
            class Meta:
                model = AuditEvent
                fields = [
                    'id', 'timestamp', 'event_type', 'severity',
                    'user_email', 'target_type', 'target_id', 'target_repr',
                    'description', 'ip_address', 'data'
                ]

        return AuditEventSerializer

    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export audit logs (returns JSON for now)"""
        # Get filter parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        event_type = request.query_params.get('event_type')

        queryset = self.get_queryset()

        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        if event_type:
            queryset = queryset.filter(event_type=event_type)

        # Log the export
        from bastion.audit.models import AuditQueryLog
        AuditQueryLog.objects.create(
            user=request.user,
            query_type='export',
            query_params={
                'start_date': start_date,
                'end_date': end_date,
                'event_type': event_type,
            },
            result_count=queryset.count(),
            ip_address=self._get_client_ip(request)
        )

        serializer = self.get_serializer(queryset[:1000], many=True)  # Limit to 1000
        return Response(serializer.data)

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')


class SettingsView(APIView):
    """
    System settings endpoint
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Return current settings
        # In production, these would come from a Settings model or env vars
        settings = {
            'company_name': 'Bastion',
            'timezone': 'America/New_York',
            'date_format': 'MM/DD/YYYY',
            'currency': 'USD',
            'email_notifications': True,
            'mfa_required': False,
            'session_timeout_minutes': 30,
            'password_expiry_days': 90,
        }
        return Response(settings)

    def patch(self, request):
        # Update settings
        # In production, validate and save to Settings model
        audit_log(
            event_type='admin.settings_change',
            user=request.user,
            request=request,
            details={'changed_settings': list(request.data.keys())}
        )
        return Response({'status': 'settings_updated'})
