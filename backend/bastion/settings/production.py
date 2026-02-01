"""
Production settings - Security hardened
"""

import os
from .base import *

# =============================================================================
# SECURITY - CRITICAL
# =============================================================================
DEBUG = False
SECRET_KEY = os.environ['DJANGO_SECRET_KEY']  # Will raise if not set
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')

# =============================================================================
# DATABASE - PostgreSQL
# =============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'bastion'),
        'USER': os.environ.get('DB_USER', 'bastion'),
        'PASSWORD': os.environ['DB_PASSWORD'],  # Will raise if not set
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'CONN_MAX_AGE': 60,
        'OPTIONS': {
            'sslmode': os.environ.get('DB_SSLMODE', 'require'),
        },
    }
}

# =============================================================================
# CORS
# =============================================================================
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_ALL_ORIGINS = False

# =============================================================================
# SECURITY HEADERS
# =============================================================================
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# =============================================================================
# STATIC FILES - Use cloud storage in production
# =============================================================================
# Configure based on your CDN/S3 setup
# STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# =============================================================================
# CACHES
# =============================================================================
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://localhost:6379/1'),
    }
}

# =============================================================================
# EMAIL
# =============================================================================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', '')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@bastion.com')

# =============================================================================
# LOGGING - Production level
# =============================================================================
LOGGING['loggers']['django']['level'] = 'WARNING'
LOGGING['loggers']['bastion.audit']['level'] = 'INFO'

# Add error alerting handler in production
# Consider integrating with Sentry or similar

# =============================================================================
# Verify critical settings are present
# =============================================================================
assert SECRET_KEY != 'INSECURE-dev-key-change-in-production', 'Production SECRET_KEY not set!'
assert len(ALLOWED_HOSTS) > 0, 'ALLOWED_HOSTS not configured!'
