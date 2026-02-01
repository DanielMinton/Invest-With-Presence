"""
Authentication serializers for the Bastion API
"""

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from bastion.core.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile data"""

    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'mfa_enabled',
        ]
        read_only_fields = ['id', 'email', 'mfa_enabled']

    def get_role(self, obj):
        """Determine user role based on permissions"""
        if obj.is_superuser:
            return 'admin'
        if obj.is_staff:
            return 'advisor'
        return 'client'


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')

        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password.')

        # Check if account is locked
        if user.is_locked():
            raise serializers.ValidationError(
                'Account is temporarily locked. Please try again later.'
            )

        # Authenticate
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )

        if not user:
            # Increment failed login attempts
            try:
                failed_user = User.objects.get(email=email)
                failed_user.failed_login_attempts += 1

                # Lock account after 5 failed attempts
                if failed_user.failed_login_attempts >= 5:
                    failed_user.locked_until = timezone.now() + timezone.timedelta(minutes=30)

                failed_user.save(update_fields=['failed_login_attempts', 'locked_until'])
            except User.DoesNotExist:
                pass

            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')

        # Reset failed login attempts on successful login
        user.failed_login_attempts = 0
        user.locked_until = None
        user.save(update_fields=['failed_login_attempts', 'locked_until'])

        attrs['user'] = user
        return attrs

    def create(self, validated_data):
        user = validated_data['user']
        refresh = RefreshToken.for_user(user)

        return {
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""

    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate_email(self, value):
        """Normalize and validate email"""
        email = value.lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        refresh = RefreshToken.for_user(user)

        return {
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""

    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.last_password_change = timezone.now()
        user.save(update_fields=['password', 'last_password_change'])
        return user


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for requesting password reset"""

    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower()

    def save(self):
        email = self.validated_data['email']
        try:
            user = User.objects.get(email=email, is_active=True)
            # TODO: Generate token and send email
            # For now, just return success to prevent email enumeration
        except User.DoesNotExist:
            pass
        return True


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming password reset"""

    token = serializers.CharField()
    password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_token(self, value):
        # TODO: Validate token
        return value

    def save(self):
        # TODO: Reset password using token
        pass
