"""
Authentication views for the Bastion API
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from bastion.api.serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
)
from bastion.audit.services import audit_log


class LoginView(APIView):
    """
    User login endpoint
    POST /api/v1/auth/login/
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        # Audit log
        audit_log(
            event_type='auth.login',
            user=serializer.validated_data['user'],
            request=request,
            details={'method': 'password'}
        )

        return Response(result, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    User logout endpoint - blacklists refresh token
    POST /api/v1/auth/logout/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            # Audit log
            audit_log(
                event_type='auth.logout',
                user=request.user,
                request=request,
            )

            return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """
    User registration endpoint
    POST /api/v1/auth/register/
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        # Audit log
        audit_log(
            event_type='admin.user_create',
            user=None,
            request=request,
            details={'email': request.data.get('email', '').lower(), 'method': 'self_registration'}
        )

        return Response(result, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    """
    Get current authenticated user
    GET /api/v1/auth/me/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Audit log
        audit_log(
            event_type='admin.user_update',
            user=request.user,
            request=request,
            details={'fields': list(request.data.keys())}
        )

        return Response(serializer.data)


class ChangePasswordView(APIView):
    """
    Change password for authenticated user
    POST /api/v1/auth/password/change/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Audit log
        audit_log(
            event_type='auth.password_change',
            user=request.user,
            request=request,
        )

        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)


class PasswordResetView(APIView):
    """
    Request password reset email
    POST /api/v1/auth/password/reset/
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Always return success to prevent email enumeration
        return Response(
            {'detail': 'If an account exists with this email, a reset link has been sent.'},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    """
    Confirm password reset with token
    POST /api/v1/auth/password/reset/confirm/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'detail': 'Password has been reset.'}, status=status.HTTP_200_OK)
