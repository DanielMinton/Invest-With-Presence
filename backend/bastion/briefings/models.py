"""
Client Briefing System
Automated and manual client communications
"""

from django.db import models
from django.conf import settings
from bastion.core.models import BaseModel, Client, Household


class BriefingTemplate(BaseModel):
    """
    Reusable templates for client briefings
    """
    class TemplateType(models.TextChoices):
        WEEKLY_UPDATE = 'weekly_update', 'Weekly Update'
        MONTHLY_SUMMARY = 'monthly_summary', 'Monthly Summary'
        QUARTERLY_REVIEW = 'quarterly_review', 'Quarterly Review'
        MARKET_ALERT = 'market_alert', 'Market Alert'
        PORTFOLIO_CHANGE = 'portfolio_change', 'Portfolio Change'
        ONBOARDING = 'onboarding', 'Onboarding'
        CUSTOM = 'custom', 'Custom'

    name = models.CharField(max_length=255)
    template_type = models.CharField(
        max_length=30,
        choices=TemplateType.choices,
        default=TemplateType.CUSTOM
    )
    description = models.TextField(blank=True)

    # Template content (supports markdown and variables)
    subject_template = models.CharField(max_length=500)
    body_template = models.TextField()

    # Available variables: {{client_name}}, {{portfolio_value}}, {{period}}, etc.
    available_variables = models.JSONField(default=list)

    # Settings
    is_active = models.BooleanField(default=True)
    requires_approval = models.BooleanField(default=True)

    # Scheduling (for automated briefings)
    schedule_cron = models.CharField(max_length=100, blank=True)  # e.g., "0 9 * * 1" for Monday 9am

    # Metadata
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_templates'
    )

    class Meta:
        ordering = ['template_type', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"


class Briefing(BaseModel):
    """
    Individual client briefing instance
    """
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PENDING_REVIEW = 'pending_review', 'Pending Review'
        APPROVED = 'approved', 'Approved'
        SENT = 'sent', 'Sent'
        FAILED = 'failed', 'Failed'

    class DeliveryMethod(models.TextChoices):
        EMAIL = 'email', 'Email'
        PORTAL = 'portal', 'Client Portal'
        BOTH = 'both', 'Email & Portal'

    # Identity
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=500)

    # Recipients
    household = models.ForeignKey(
        Household,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='briefings'
    )
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='briefings'
    )

    # Template (optional - can be manual)
    template = models.ForeignKey(
        BriefingTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='briefings'
    )

    # Content
    body_markdown = models.TextField()  # Markdown content
    body_html = models.TextField(blank=True)  # Rendered HTML

    # Attachments (document references)
    attachments = models.ManyToManyField(
        'documents.Document',
        blank=True,
        related_name='attached_to_briefings'
    )

    # Status & Workflow
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )
    delivery_method = models.CharField(
        max_length=20,
        choices=DeliveryMethod.choices,
        default=DeliveryMethod.PORTAL
    )

    # Timestamps
    scheduled_for = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)  # Email tracking

    # Provenance
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_briefings'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_briefings'
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    # Period reference (for reports)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['household', 'status']),
            models.Index(fields=['client', 'status']),
            models.Index(fields=['status', 'scheduled_for']),
        ]

    def __str__(self):
        recipient = self.client or self.household
        return f"{self.title} - {recipient}"


class Notification(BaseModel):
    """
    System notifications for users
    """
    class NotificationType(models.TextChoices):
        INFO = 'info', 'Information'
        WARNING = 'warning', 'Warning'
        ALERT = 'alert', 'Alert'
        SUCCESS = 'success', 'Success'
        TASK = 'task', 'Task'

    # Recipient
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    # Content
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        default=NotificationType.INFO
    )

    # Link to related object
    link = models.CharField(max_length=500, blank=True)  # Internal URL
    link_text = models.CharField(max_length=100, blank=True)

    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # Email notification
    email_sent = models.BooleanField(default=False)
    email_sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f"{self.title} - {self.user}"
