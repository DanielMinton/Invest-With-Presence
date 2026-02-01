"""
WSGI config for Bastion project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bastion.settings')
os.environ.setdefault('DJANGO_ENV', 'production')

application = get_wsgi_application()
