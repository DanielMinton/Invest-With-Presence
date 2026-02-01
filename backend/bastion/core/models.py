"""
Core models for the Bastion platform
Security-first, audit-ready design
"""

import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone


class TimeStampedModel(models.Model):
    """
    Abstract base model with created/updated timestamps
    """
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    """
    Abstract base model with UUID primary key
    More secure than sequential integers
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class BaseModel(UUIDModel, TimeStampedModel):
    """
    Standard base model combining UUID and timestamps
    """
    class Meta:
        abstract = True


# =============================================================================
# USER MODEL
# =============================================================================

class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, UUIDModel):
    """
    Custom user model with email as primary identifier
    """
    username = None  # Remove username field
    email = models.EmailField('email address', unique=True, db_index=True)

    # Profile
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)

    # Security
    mfa_enabled = models.BooleanField(default=False)
    last_password_change = models.DateTimeField(null=True, blank=True)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip() or self.email

    def is_locked(self):
        """Check if account is currently locked"""
        if self.locked_until and self.locked_until > timezone.now():
            return True
        return False


# =============================================================================
# CLIENT MODELS
# =============================================================================

class Household(BaseModel):
    """
    Client household - groups related clients and accounts
    """
    name = models.CharField(max_length=255)
    primary_contact = models.ForeignKey(
        'Client',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='primary_for_households'
    )
    notes = models.TextField(blank=True)

    # Metadata
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_households'
    )

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Client(BaseModel):
    """
    Individual client record
    """
    class ClientType(models.TextChoices):
        INDIVIDUAL = 'individual', 'Individual'
        JOINT = 'joint', 'Joint'
        TRUST = 'trust', 'Trust'
        ENTITY = 'entity', 'Entity'
        IRA = 'ira', 'IRA'

    # Identity
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)

    # Classification
    client_type = models.CharField(
        max_length=20,
        choices=ClientType.choices,
        default=ClientType.INDIVIDUAL
    )
    household = models.ForeignKey(
        Household,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clients'
    )

    # Portal access
    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='client_profile'
    )
    portal_enabled = models.BooleanField(default=False)

    # Risk profile
    risk_tolerance = models.CharField(max_length=50, blank=True)
    time_horizon = models.CharField(max_length=50, blank=True)

    # Status
    is_active = models.BooleanField(default=True)
    onboarded_at = models.DateTimeField(null=True, blank=True)

    # Notes (internal only)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'


class Account(BaseModel):
    """
    Custodial account linked to a client
    """
    class AccountType(models.TextChoices):
        INDIVIDUAL = 'individual', 'Individual'
        JOINT = 'joint', 'Joint'
        IRA_TRADITIONAL = 'ira_traditional', 'Traditional IRA'
        IRA_ROTH = 'ira_roth', 'Roth IRA'
        TRUST = 'trust', 'Trust'
        ENTITY = 'entity', 'Entity'

    # Identity
    account_number = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    account_type = models.CharField(
        max_length=20,
        choices=AccountType.choices
    )

    # Relationships
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='accounts'
    )
    household = models.ForeignKey(
        Household,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='accounts'
    )

    # Custodian info
    custodian = models.CharField(max_length=100, default='Fidelity')
    custodian_account_id = models.CharField(max_length=100, blank=True)

    # Status
    is_active = models.BooleanField(default=True)
    opened_date = models.DateField(null=True, blank=True)
    closed_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['client', 'name']

    def __str__(self):
        return f'{self.name} ({self.account_number})'


# =============================================================================
# RISK SNAPSHOT
# =============================================================================

class RiskSnapshot(BaseModel):
    """
    Point-in-time risk state for a client or household
    Immutable once created for audit purposes
    """
    # Target
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='risk_snapshots'
    )
    household = models.ForeignKey(
        Household,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='risk_snapshots'
    )

    # Snapshot time
    as_of_date = models.DateField(db_index=True)

    # Values (stored as JSON for flexibility)
    total_value = models.DecimalField(max_digits=15, decimal_places=2)
    equity_exposure = models.DecimalField(max_digits=5, decimal_places=2)  # Percentage
    fixed_income_exposure = models.DecimalField(max_digits=5, decimal_places=2)
    cash_exposure = models.DecimalField(max_digits=5, decimal_places=2)
    alternative_exposure = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Risk metrics
    risk_score = models.CharField(max_length=50, blank=True)  # e.g., "Moderate"
    max_drawdown_ytd = models.DecimalField(max_digits=5, decimal_places=2, null=True)

    # Provenance
    data_source = models.CharField(max_length=100)  # e.g., "Fidelity API"
    source_timestamp = models.DateTimeField()

    # Notes
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-as_of_date']
        unique_together = [
            ['client', 'as_of_date'],
            ['household', 'as_of_date'],
        ]

    def __str__(self):
        target = self.client or self.household
        return f'Risk Snapshot: {target} ({self.as_of_date})'
