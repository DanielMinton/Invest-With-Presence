"""
Audit Event System
Append-only, immutable audit trail for compliance
"""

import uuid
import json
from django.db import models
from django.conf import settings
from django.utils import timezone


class AuditEvent(models.Model):
    """
    Immutable audit event record

    Design principles:
    - Append-only: No updates or deletes allowed
    - Queryable: Indexed for efficient retrieval
    - Exportable: All data in structured format
    - Provenance: Full context for every event
    """

    class EventType(models.TextChoices):
        # Authentication
        AUTH_LOGIN = 'auth.login', 'User Login'
        AUTH_LOGOUT = 'auth.logout', 'User Logout'
        AUTH_LOGIN_FAILED = 'auth.login_failed', 'Login Failed'
        AUTH_MFA_CHALLENGE = 'auth.mfa_challenge', 'MFA Challenge'
        AUTH_PASSWORD_CHANGE = 'auth.password_change', 'Password Change'
        AUTH_PASSWORD_RESET = 'auth.password_reset', 'Password Reset'

        # Data Access
        DATA_VIEW = 'data.view', 'Data Viewed'
        DATA_DOWNLOAD = 'data.download', 'Data Downloaded'
        DATA_EXPORT = 'data.export', 'Data Exported'

        # Data Modification
        DATA_CREATE = 'data.create', 'Data Created'
        DATA_UPDATE = 'data.update', 'Data Updated'
        DATA_DELETE = 'data.delete', 'Data Deleted'

        # Documents
        DOC_UPLOAD = 'doc.upload', 'Document Uploaded'
        DOC_VIEW = 'doc.view', 'Document Viewed'
        DOC_DOWNLOAD = 'doc.download', 'Document Downloaded'
        DOC_SHARE = 'doc.share', 'Document Shared'
        DOC_DELETE = 'doc.delete', 'Document Deleted'

        # Client Communications
        COMM_BRIEFING_SENT = 'comm.briefing_sent', 'Briefing Sent'
        COMM_MEETING_PACK = 'comm.meeting_pack', 'Meeting Pack Generated'
        COMM_REPORT_SENT = 'comm.report_sent', 'Report Sent'

        # Administrative
        ADMIN_USER_CREATE = 'admin.user_create', 'User Created'
        ADMIN_USER_UPDATE = 'admin.user_update', 'User Updated'
        ADMIN_USER_DEACTIVATE = 'admin.user_deactivate', 'User Deactivated'
        ADMIN_PERMISSION_CHANGE = 'admin.permission_change', 'Permission Changed'
        ADMIN_SETTINGS_CHANGE = 'admin.settings_change', 'Settings Changed'

        # System
        SYS_INTEGRATION_SYNC = 'sys.integration_sync', 'Integration Sync'
        SYS_INTEGRATION_ERROR = 'sys.integration_error', 'Integration Error'
        SYS_BACKUP = 'sys.backup', 'System Backup'
        SYS_ERROR = 'sys.error', 'System Error'

    class Severity(models.TextChoices):
        DEBUG = 'debug', 'Debug'
        INFO = 'info', 'Info'
        WARNING = 'warning', 'Warning'
        ERROR = 'error', 'Error'
        CRITICAL = 'critical', 'Critical'

    # Identity - UUID for security, no sequential exposure
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Timestamp - When the event occurred
    timestamp = models.DateTimeField(default=timezone.now, db_index=True, editable=False)

    # Event classification
    event_type = models.CharField(
        max_length=50,
        choices=EventType.choices,
        db_index=True
    )
    severity = models.CharField(
        max_length=10,
        choices=Severity.choices,
        default=Severity.INFO
    )

    # Actor - Who performed the action
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_events'
    )
    user_email = models.EmailField(blank=True)  # Preserved even if user deleted

    # Target - What was affected
    target_type = models.CharField(max_length=100, blank=True, db_index=True)  # e.g., 'Client', 'Document'
    target_id = models.CharField(max_length=100, blank=True, db_index=True)  # UUID as string
    target_repr = models.CharField(max_length=255, blank=True)  # Human readable, e.g., "John Smith"

    # Client context - For client-specific queries
    client_id = models.UUIDField(null=True, blank=True, db_index=True)
    household_id = models.UUIDField(null=True, blank=True, db_index=True)

    # Description
    description = models.TextField(blank=True)

    # Detailed data - JSON for flexibility
    data = models.JSONField(default=dict, blank=True)

    # Change tracking
    old_values = models.JSONField(default=dict, blank=True)  # Before state
    new_values = models.JSONField(default=dict, blank=True)  # After state

    # Request context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    request_id = models.CharField(max_length=100, blank=True)  # Correlation ID

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['event_type', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['client_id', 'timestamp']),
            models.Index(fields=['target_type', 'target_id']),
        ]
        # Prevent modifications - enforced at application level
        # Consider database-level triggers for additional protection

    def __str__(self):
        return f'{self.event_type} by {self.user_email or "system"} at {self.timestamp}'

    def save(self, *args, **kwargs):
        # Preserve user email at time of event
        if self.user and not self.user_email:
            self.user_email = self.user.email

        # Prevent updates to existing events (append-only)
        if self.pk and AuditEvent.objects.filter(pk=self.pk).exists():
            raise ValueError('Audit events are immutable and cannot be modified')

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError('Audit events cannot be deleted')

    @classmethod
    def log(
        cls,
        event_type: str,
        user=None,
        target=None,
        description: str = '',
        data: dict = None,
        old_values: dict = None,
        new_values: dict = None,
        client_id=None,
        household_id=None,
        ip_address: str = None,
        user_agent: str = '',
        request_id: str = '',
        severity: str = 'info',
    ):
        """
        Convenience method to create audit events
        """
        event = cls(
            event_type=event_type,
            user=user,
            description=description,
            data=data or {},
            old_values=old_values or {},
            new_values=new_values or {},
            client_id=client_id,
            household_id=household_id,
            ip_address=ip_address,
            user_agent=user_agent,
            request_id=request_id,
            severity=severity,
        )

        # Set target info if provided
        if target:
            event.target_type = target.__class__.__name__
            event.target_id = str(target.pk)
            event.target_repr = str(target)[:255]

        event.save()
        return event


class AuditQueryLog(models.Model):
    """
    Log of audit event queries - who accessed what audit data
    Meta-audit for compliance
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    query_type = models.CharField(max_length=50)  # e.g., 'search', 'export', 'view'
    query_params = models.JSONField(default=dict)  # Filters applied
    result_count = models.PositiveIntegerField(default=0)

    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f'Audit query by {self.user} at {self.timestamp}'
