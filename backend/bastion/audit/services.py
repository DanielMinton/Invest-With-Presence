"""
Audit Service - Centralized audit logging
"""

import logging
from typing import Any, Optional
from django.conf import settings
from .models import AuditEvent

logger = logging.getLogger('bastion.audit')


class AuditService:
    """
    Service for creating audit events
    Use this instead of AuditEvent.log() for additional logging
    """

    @staticmethod
    def log_auth_event(
        event_type: str,
        user=None,
        ip_address: str = None,
        user_agent: str = '',
        success: bool = True,
        details: dict = None,
    ):
        """Log authentication-related events"""
        severity = 'info' if success else 'warning'

        event = AuditEvent.log(
            event_type=event_type,
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
            severity=severity,
            data=details or {},
        )

        logger.info(
            f"AUTH: {event_type} | user={user.email if user else 'anonymous'} | "
            f"ip={ip_address} | success={success}"
        )

        return event

    @staticmethod
    def log_data_access(
        event_type: str,
        user,
        target,
        client_id=None,
        ip_address: str = None,
        details: dict = None,
    ):
        """Log data access events"""
        event = AuditEvent.log(
            event_type=event_type,
            user=user,
            target=target,
            client_id=client_id,
            ip_address=ip_address,
            data=details or {},
        )

        logger.info(
            f"DATA: {event_type} | user={user.email} | "
            f"target={target.__class__.__name__}:{target.pk}"
        )

        return event

    @staticmethod
    def log_data_change(
        event_type: str,
        user,
        target,
        old_values: dict = None,
        new_values: dict = None,
        client_id=None,
        ip_address: str = None,
        description: str = '',
    ):
        """Log data modification events with before/after state"""
        event = AuditEvent.log(
            event_type=event_type,
            user=user,
            target=target,
            description=description,
            old_values=old_values or {},
            new_values=new_values or {},
            client_id=client_id,
            ip_address=ip_address,
        )

        logger.info(
            f"CHANGE: {event_type} | user={user.email} | "
            f"target={target.__class__.__name__}:{target.pk} | "
            f"changes={list(new_values.keys()) if new_values else 'none'}"
        )

        return event

    @staticmethod
    def log_document_event(
        event_type: str,
        user,
        document,
        client_id=None,
        ip_address: str = None,
        details: dict = None,
    ):
        """Log document-related events"""
        event = AuditEvent.log(
            event_type=event_type,
            user=user,
            target=document,
            client_id=client_id,
            ip_address=ip_address,
            data=details or {},
        )

        logger.info(
            f"DOC: {event_type} | user={user.email} | "
            f"document={document.pk}"
        )

        return event

    @staticmethod
    def log_system_event(
        event_type: str,
        description: str = '',
        severity: str = 'info',
        details: dict = None,
    ):
        """Log system events (no user context)"""
        event = AuditEvent.log(
            event_type=event_type,
            description=description,
            severity=severity,
            data=details or {},
        )

        log_func = getattr(logger, severity, logger.info)
        log_func(f"SYSTEM: {event_type} | {description}")

        return event


# Singleton instance for convenience
audit = AuditService()
