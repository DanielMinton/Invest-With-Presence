"""
Document Vault Models
Secure document storage with version control and access logging
"""

import uuid
import os
from django.db import models
from django.conf import settings
from bastion.core.models import BaseModel, Client, Household


def document_upload_path(instance, filename):
    """Generate secure upload path: documents/{household_id}/{year}/{uuid}_{filename}"""
    ext = filename.split('.')[-1] if '.' in filename else ''
    unique_name = f"{uuid.uuid4().hex[:12]}_{filename}"
    household_id = instance.household_id or 'general'
    year = instance.created_at.year if instance.created_at else '2024'
    return f"documents/{household_id}/{year}/{unique_name}"


class DocumentCategory(BaseModel):
    """Categories for organizing documents"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='file')  # Lucide icon name
    color = models.CharField(max_length=20, default='brand')  # Tailwind color

    # Ordering
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'document categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Document(BaseModel):
    """
    Secure document storage with versioning support
    """
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        ACTIVE = 'active', 'Active'
        ARCHIVED = 'archived', 'Archived'

    # Identity
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Classification
    category = models.ForeignKey(
        DocumentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documents'
    )
    tags = models.JSONField(default=list, blank=True)  # Simple tag list

    # Ownership
    household = models.ForeignKey(
        Household,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='documents'
    )
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='documents'
    )

    # File info
    file = models.FileField(upload_to=document_upload_path)
    file_name = models.CharField(max_length=255)  # Original filename
    file_size = models.PositiveIntegerField(default=0)  # Bytes
    file_type = models.CharField(max_length=100)  # MIME type

    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )

    # Versioning
    version = models.PositiveIntegerField(default=1)
    parent_document = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='versions'
    )

    # Metadata
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_documents'
    )
    effective_date = models.DateField(null=True, blank=True)  # e.g., statement date
    expiration_date = models.DateField(null=True, blank=True)

    # Access control
    is_confidential = models.BooleanField(default=False)
    client_visible = models.BooleanField(default=True)  # Show in client portal

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['household', 'status']),
            models.Index(fields=['client', 'status']),
            models.Index(fields=['category', 'status']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Extract file metadata on save
        if self.file and not self.file_name:
            self.file_name = os.path.basename(self.file.name)
        super().save(*args, **kwargs)


class DocumentAccess(BaseModel):
    """
    Log of document access for audit trail
    """
    class AccessType(models.TextChoices):
        VIEW = 'view', 'Viewed'
        DOWNLOAD = 'download', 'Downloaded'
        SHARE = 'share', 'Shared'
        PRINT = 'print', 'Printed'

    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='access_logs'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='document_accesses'
    )
    access_type = models.CharField(
        max_length=20,
        choices=AccessType.choices
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'document accesses'

    def __str__(self):
        return f"{self.user} {self.access_type} {self.document}"
