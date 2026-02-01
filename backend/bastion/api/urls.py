"""
API URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from .views import (
    # Auth
    HealthCheckView,
    LoginView,
    LogoutView,
    RegisterView,
    CurrentUserView,
    ChangePasswordView,
    PasswordResetView,
    PasswordResetConfirmView,
    # Core
    HouseholdViewSet,
    ClientViewSet,
    AccountViewSet,
    RiskSnapshotViewSet,
    # Documents
    DocumentCategoryViewSet,
    DocumentViewSet,
    # Briefings
    BriefingTemplateViewSet,
    BriefingViewSet,
    NotificationViewSet,
    # Dashboard & Admin
    DashboardView,
    RecentActivityView,
    UserManagementViewSet,
    AuditLogViewSet,
    SettingsView,
)

# Router for viewsets
router = DefaultRouter()
router.register('clients', ClientViewSet, basename='client')
router.register('households', HouseholdViewSet, basename='household')
router.register('accounts', AccountViewSet, basename='account')
router.register('risk-snapshots', RiskSnapshotViewSet, basename='risk-snapshot')
router.register('documents', DocumentViewSet, basename='document')
router.register('document-categories', DocumentCategoryViewSet, basename='document-category')
router.register('briefings', BriefingViewSet, basename='briefing')
router.register('briefing-templates', BriefingTemplateViewSet, basename='briefing-template')
router.register('notifications', NotificationViewSet, basename='notification')
router.register('users', UserManagementViewSet, basename='user')
router.register('audit-logs', AuditLogViewSet, basename='audit-log')

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

    # Dashboard
    path('dashboard/stats/', DashboardView.as_view(), name='dashboard-stats'),
    path('dashboard/activity/', RecentActivityView.as_view(), name='dashboard-activity'),

    # Settings
    path('settings/', SettingsView.as_view(), name='settings'),

    # API routes (viewsets)
    path('', include(router.urls)),
]
