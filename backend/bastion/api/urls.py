"""
API URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import (
    HealthCheckView,
    CurrentUserView,
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
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Current user
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),

    # API routes
    path('', include(router.urls)),
]
