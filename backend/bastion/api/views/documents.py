"""
Document ViewSets
"""

from rest_framework import viewsets, status, filters, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from bastion.documents.models import Document, DocumentCategory, DocumentAccess
from bastion.api.serializers import (
    DocumentSerializer,
    DocumentListSerializer,
    DocumentUploadSerializer,
    DocumentCategorySerializer,
    DocumentAccessSerializer,
)
from bastion.audit.services import audit_log


class DocumentCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for document categories
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentCategorySerializer
    queryset = DocumentCategory.objects.all()
    filter_backends = [filters.OrderingFilter]
    ordering = ['order', 'name']


class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for document management
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'household', 'client', 'status', 'is_confidential', 'client_visible']
    search_fields = ['title', 'description', 'file_name', 'tags']
    ordering_fields = ['title', 'created_at', 'file_size']
    ordering = ['-created_at']

    def get_queryset(self):
        return Document.objects.select_related(
            'category', 'household', 'client', 'uploaded_by'
        ).filter(status__in=['active', 'draft'])

    def get_serializer_class(self):
        if self.action == 'list':
            return DocumentListSerializer
        if self.action == 'create':
            return DocumentUploadSerializer
        return DocumentSerializer

    def perform_create(self, serializer):
        document = serializer.save()
        audit_log(
            event_type='doc.upload',
            user=self.request.user,
            request=self.request,
            target=document,
            details={
                'file_name': document.file_name,
                'file_size': document.file_size,
                'file_type': document.file_type,
            }
        )

    def perform_destroy(self, instance):
        # Soft delete - archive instead of delete
        instance.status = 'archived'
        instance.save(update_fields=['status', 'updated_at'])
        audit_log(
            event_type='doc.delete',
            user=self.request.user,
            request=self.request,
            target=instance,
            details={'file_name': instance.file_name}
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Log view access
        self._log_access(instance, 'view')
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Get download URL and log access"""
        document = self.get_object()
        self._log_access(document, 'download')

        audit_log(
            event_type='doc.download',
            user=request.user,
            request=request,
            target=document,
            details={'file_name': document.file_name}
        )

        serializer = self.get_serializer(document)
        return Response({
            'download_url': serializer.data.get('file_url'),
            'file_name': document.file_name,
            'file_type': document.file_type,
        })

    @action(detail=True, methods=['get'])
    def access_log(self, request, pk=None):
        """Get access log for this document"""
        document = self.get_object()
        accesses = document.access_logs.select_related('user').order_by('-created_at')[:50]
        serializer = DocumentAccessSerializer(accesses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recently uploaded documents"""
        documents = self.get_queryset().order_by('-created_at')[:10]
        serializer = DocumentListSerializer(documents, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_household(self, request):
        """Get documents grouped by household"""
        household_id = request.query_params.get('household_id')
        if not household_id:
            return Response(
                {'error': 'household_id parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        documents = self.get_queryset().filter(household_id=household_id)
        serializer = DocumentListSerializer(documents, many=True)
        return Response(serializer.data)

    def _log_access(self, document, access_type):
        """Helper to log document access"""
        DocumentAccess.objects.create(
            document=document,
            user=self.request.user,
            access_type=access_type,
            ip_address=self._get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', '')[:500]
        )

    def _get_client_ip(self):
        """Extract client IP from request"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return self.request.META.get('REMOTE_ADDR')
