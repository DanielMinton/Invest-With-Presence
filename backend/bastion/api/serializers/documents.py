"""
Document serializers
"""

from rest_framework import serializers
from bastion.documents.models import Document, DocumentCategory, DocumentAccess


class DocumentCategorySerializer(serializers.ModelSerializer):
    """Serializer for DocumentCategory model"""
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = DocumentCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color', 'order', 'document_count']
        read_only_fields = ['id']

    def get_document_count(self, obj):
        return obj.documents.filter(status='active').count()


class DocumentSerializer(serializers.ModelSerializer):
    """Full serializer for Document model"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    household_name = serializers.CharField(source='household.name', read_only=True)
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.full_name', read_only=True)
    file_url = serializers.SerializerMethodField()
    file_size_display = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'description',
            'category', 'category_name', 'tags',
            'household', 'household_name', 'client', 'client_name',
            'file', 'file_url', 'file_name', 'file_size', 'file_size_display', 'file_type',
            'status', 'version',
            'uploaded_by', 'uploaded_by_name',
            'effective_date', 'expiration_date',
            'is_confidential', 'client_visible',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'file_name', 'file_size', 'file_type',
            'uploaded_by', 'version', 'created_at', 'updated_at'
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_file_size_display(self, obj):
        """Human-readable file size"""
        size = obj.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"


class DocumentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing documents"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    household_name = serializers.CharField(source='household.name', read_only=True)
    file_size_display = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'category_name', 'household_name',
            'file_name', 'file_size_display', 'file_type',
            'status', 'client_visible', 'created_at'
        ]

    def get_file_size_display(self, obj):
        size = obj.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"


class DocumentUploadSerializer(serializers.ModelSerializer):
    """Serializer for uploading documents"""

    class Meta:
        model = Document
        fields = [
            'title', 'description', 'category', 'tags',
            'household', 'client', 'file',
            'effective_date', 'expiration_date',
            'is_confidential', 'client_visible'
        ]

    def create(self, validated_data):
        # Extract file info
        file = validated_data.get('file')
        if file:
            validated_data['file_name'] = file.name
            validated_data['file_size'] = file.size
            validated_data['file_type'] = file.content_type or 'application/octet-stream'

        # Set uploaded_by from request
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['uploaded_by'] = request.user

        return super().create(validated_data)


class DocumentAccessSerializer(serializers.ModelSerializer):
    """Serializer for document access logs"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    document_title = serializers.CharField(source='document.title', read_only=True)

    class Meta:
        model = DocumentAccess
        fields = [
            'id', 'document', 'document_title',
            'user', 'user_email', 'access_type',
            'ip_address', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
