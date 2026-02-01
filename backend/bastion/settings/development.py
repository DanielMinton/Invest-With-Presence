"""
Development settings - NEVER use in production
"""

from .base import *

# =============================================================================
# DEBUG MODE
# =============================================================================
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# =============================================================================
# CORS - Allow local development
# =============================================================================
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
CORS_ALLOW_ALL_ORIGINS = False  # Still explicit, not wildcard

# =============================================================================
# DATABASE - SQLite for simplicity
# =============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# =============================================================================
# SECURITY - Relaxed for development only
# =============================================================================
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

# =============================================================================
# DEBUG TOOLBAR
# =============================================================================
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
INTERNAL_IPS = ['127.0.0.1']

# =============================================================================
# EMAIL - Console backend for development
# =============================================================================
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# =============================================================================
# LOGGING - More verbose in development
# =============================================================================
LOGGING['loggers']['django']['level'] = 'DEBUG'
LOGGING['loggers']['bastion'] = {
    'handlers': ['console'],
    'level': 'DEBUG',
}

# =============================================================================
# JWT - Longer tokens for development convenience
# =============================================================================
from datetime import timedelta
SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'] = timedelta(hours=1)
SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'] = timedelta(days=7)

# =============================================================================
# THROTTLING - Disabled in development
# =============================================================================
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': '1000/minute',
    'user': '5000/minute',
}

print("⚠️  Running with DEVELOPMENT settings - DO NOT USE IN PRODUCTION")
