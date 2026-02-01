"""
Custom exception handling for the API
"""

import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404

logger = logging.getLogger('bastion.api')


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses
    and logs errors appropriately
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # Get request info for logging
    request = context.get('request')
    view = context.get('view')

    if response is not None:
        # Add custom error structure
        custom_response = {
            'error': {
                'code': response.status_code,
                'message': get_error_message(exc),
                'details': response.data if isinstance(response.data, dict) else {'detail': response.data},
            }
        }

        # Log the error
        if response.status_code >= 500:
            logger.error(
                f"API Error: {exc.__class__.__name__} | "
                f"path={request.path if request else 'unknown'} | "
                f"view={view.__class__.__name__ if view else 'unknown'} | "
                f"message={str(exc)}"
            )
        elif response.status_code >= 400:
            logger.warning(
                f"API Warning: {exc.__class__.__name__} | "
                f"path={request.path if request else 'unknown'} | "
                f"message={str(exc)}"
            )

        response.data = custom_response

    else:
        # Handle unexpected exceptions
        logger.exception(
            f"Unhandled Exception: {exc.__class__.__name__} | "
            f"path={request.path if request else 'unknown'} | "
            f"message={str(exc)}"
        )

        response = Response(
            {
                'error': {
                    'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                    'message': 'An unexpected error occurred',
                    'details': {},
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response


def get_error_message(exc):
    """Get a user-friendly error message"""
    if hasattr(exc, 'detail'):
        if isinstance(exc.detail, str):
            return exc.detail
        elif isinstance(exc.detail, list):
            return exc.detail[0] if exc.detail else 'An error occurred'
        elif isinstance(exc.detail, dict):
            # Get first error message from dict
            for key, value in exc.detail.items():
                if isinstance(value, list):
                    return f'{key}: {value[0]}'
                return f'{key}: {value}'

    return str(exc) or 'An error occurred'
