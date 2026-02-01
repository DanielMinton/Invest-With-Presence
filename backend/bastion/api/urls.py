"""
API URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from .views import HealthCheckView  # Keep the original health check
from .views.auth import (
    LoginView,
    LogoutView,
    RegisterView,
    CurrentUserView,
    ChangePasswordView,
    PasswordResetView,
    PasswordResetConfirmView,
)

# Router for viewsets
router = DefaultRouter()
# router.register('clients', ClientViewSet, basename='client')
# router.register('households', HouseholdViewSet, basename='household')
# router.register('documents', DocumentViewSet, basename='document')
# router.register('briefings', BriefingViewSet, basename='briefing')

urlpatterns = [
    # Health check (unauthenticated)
    path('health/', HealthCheckView.as_view(), name='health-check'),

    # Authentication
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),

    # Password management
    path('auth/password/change/', ChangePasswordView.as_view(), name='auth-password-change'),
    path('auth/password/reset/', PasswordResetView.as_view(), name='auth-password-reset'),
    path('auth/password/reset/confirm/', PasswordResetConfirmView.as_view(), name='auth-password-reset-confirm'),

    # JWT token endpoints
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token-verify'),

    # API routes
    path('', include(router.urls)),
]
