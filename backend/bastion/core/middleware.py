"""
Custom middleware for the Bastion platform
"""

import uuid
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('bastion.audit')


class AuditMiddleware(MiddlewareMixin):
    """
    Middleware to capture request context for audit logging
    Attaches request_id and client info to each request
    """

    def process_request(self, request):
        # Generate unique request ID for correlation
        request.request_id = str(uuid.uuid4())

        # Capture IP address (handle proxies)
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            request.client_ip = x_forwarded_for.split(',')[0].strip()
        else:
            request.client_ip = request.META.get('REMOTE_ADDR')

        # Capture user agent
        request.client_user_agent = request.META.get('HTTP_USER_AGENT', '')

        return None

    def process_response(self, request, response):
        # Add request ID to response headers for debugging
        if hasattr(request, 'request_id'):
            response['X-Request-ID'] = request.request_id

        return response


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Additional security headers beyond Django defaults
    """

    def process_response(self, request, response):
        # Content Security Policy
        # Customize based on your requirements
        # response['Content-Security-Policy'] = "default-src 'self'"

        # Prevent caching of sensitive data
        if request.path.startswith('/api/'):
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
            response['Pragma'] = 'no-cache'

        return response
