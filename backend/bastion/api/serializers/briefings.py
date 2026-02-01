"""
Briefing and Notification serializers
"""

from rest_framework import serializers
from bastion.briefings.models import BriefingTemplate, Briefing, Notification


class BriefingTemplateSerializer(serializers.ModelSerializer):
    """Serializer for BriefingTemplate model"""
    template_type_display = serializers.CharField(
        source='get_template_type_display', read_only=True
    )
    usage_count = serializers.SerializerMethodField()

    class Meta:
        model = BriefingTemplate
        fields = [
            'id', 'name', 'template_type', 'template_type_display',
            'description', 'subject_template', 'body_template',
            'available_variables', 'is_active', 'requires_approval',
            'schedule_cron', 'usage_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_usage_count(self, obj):
        return obj.briefings.count()


class BriefingTemplateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing templates"""
    template_type_display = serializers.CharField(
        source='get_template_type_display', read_only=True
    )

    class Meta:
        model = BriefingTemplate
        fields = [
            'id', 'name', 'template_type', 'template_type_display',
            'is_active', 'requires_approval'
        ]


class BriefingSerializer(serializers.ModelSerializer):
    """Full serializer for Briefing model"""
    household_name = serializers.CharField(source='household.name', read_only=True)
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    delivery_method_display = serializers.CharField(
        source='get_delivery_method_display', read_only=True
    )
    attachment_count = serializers.SerializerMethodField()

    class Meta:
        model = Briefing
        fields = [
            'id', 'title', 'subject',
            'household', 'household_name', 'client', 'client_name',
            'template', 'template_name',
            'body_markdown', 'body_html',
            'status', 'status_display',
            'delivery_method', 'delivery_method_display',
            'scheduled_for', 'sent_at', 'opened_at',
            'created_by', 'created_by_name',
            'approved_by', 'approved_by_name', 'approved_at',
            'period_start', 'period_end',
            'attachment_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'body_html', 'sent_at', 'opened_at',
            'created_by', 'approved_at', 'created_at', 'updated_at'
        ]

    def get_attachment_count(self, obj):
        return obj.attachments.count()


class BriefingListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing briefings"""
    recipient = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Briefing
        fields = [
            'id', 'title', 'recipient', 'status', 'status_display',
            'delivery_method', 'scheduled_for', 'sent_at', 'created_at'
        ]

    def get_recipient(self, obj):
        if obj.client:
            return obj.client.full_name
        if obj.household:
            return obj.household.name
        return 'Unknown'


class BriefingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating briefings"""

    class Meta:
        model = Briefing
        fields = [
            'title', 'subject', 'household', 'client',
            'template', 'body_markdown',
            'delivery_method', 'scheduled_for',
            'period_start', 'period_end'
        ]

    def validate(self, attrs):
        if not attrs.get('household') and not attrs.get('client'):
            raise serializers.ValidationError(
                'Either household or client must be specified.'
            )
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        return super().create(validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    notification_type_display = serializers.CharField(
        source='get_notification_type_display', read_only=True
    )

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message',
            'notification_type', 'notification_type_display',
            'link', 'link_text',
            'is_read', 'read_at',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class NotificationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing notifications"""

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'notification_type',
            'is_read', 'created_at'
        ]


class NotificationMarkReadSerializer(serializers.Serializer):
    """Serializer for marking notifications as read"""
    notification_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False
    )
    mark_all = serializers.BooleanField(default=False)
