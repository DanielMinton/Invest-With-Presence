from .auth import (
    LoginView,
    LogoutView,
    RegisterView,
    CurrentUserView,
    ChangePasswordView,
    PasswordResetView,
    PasswordResetConfirmView,
    HealthCheckView,
)

from .core import (
    HouseholdViewSet,
    ClientViewSet,
    AccountViewSet,
    RiskSnapshotViewSet,
)

from .documents import (
    DocumentCategoryViewSet,
    DocumentViewSet,
)

from .briefings import (
    BriefingTemplateViewSet,
    BriefingViewSet,
    NotificationViewSet,
)

from .dashboard import (
    DashboardView,
    RecentActivityView,
    UserManagementViewSet,
    AuditLogViewSet,
    SettingsView,
)

__all__ = [
    # Auth
    'LoginView',
    'LogoutView',
    'RegisterView',
    'CurrentUserView',
    'ChangePasswordView',
    'PasswordResetView',
    'PasswordResetConfirmView',
    'HealthCheckView',
    # Core
    'HouseholdViewSet',
    'ClientViewSet',
    'AccountViewSet',
    'RiskSnapshotViewSet',
    # Documents
    'DocumentCategoryViewSet',
    'DocumentViewSet',
    # Briefings
    'BriefingTemplateViewSet',
    'BriefingViewSet',
    'NotificationViewSet',
    # Dashboard
    'DashboardView',
    'RecentActivityView',
    'UserManagementViewSet',
    'AuditLogViewSet',
    'SettingsView',
]
