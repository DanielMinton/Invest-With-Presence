"""
Core serializers for Client, Household, Account models
"""

from rest_framework import serializers
from bastion.core.models import User, Client, Household, Account, RiskSnapshot


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user info for nested serialization"""
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name']


class HouseholdSerializer(serializers.ModelSerializer):
    """Serializer for Household model"""
    client_count = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = Household
        fields = [
            'id', 'name', 'notes',
            'client_count', 'total_value',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_client_count(self, obj):
        return obj.clients.filter(is_active=True).count()

    def get_total_value(self, obj):
        # Would calculate from accounts/snapshots
        return None


class HouseholdListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing households"""
    client_count = serializers.SerializerMethodField()

    class Meta:
        model = Household
        fields = ['id', 'name', 'client_count', 'created_at']

    def get_client_count(self, obj):
        return obj.clients.filter(is_active=True).count()


class ClientSerializer(serializers.ModelSerializer):
    """Full serializer for Client model"""
    full_name = serializers.CharField(read_only=True)
    household_name = serializers.CharField(source='household.name', read_only=True)
    account_count = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'client_type', 'household', 'household_name',
            'portal_enabled', 'risk_tolerance', 'time_horizon',
            'is_active', 'onboarded_at',
            'account_count', 'total_value',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'full_name', 'created_at', 'updated_at']

    def get_account_count(self, obj):
        return obj.accounts.filter(is_active=True).count()

    def get_total_value(self, obj):
        # Would calculate from latest risk snapshot
        return None


class ClientListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing clients"""
    full_name = serializers.CharField(read_only=True)
    household_name = serializers.CharField(source='household.name', read_only=True)

    class Meta:
        model = Client
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email',
            'client_type', 'household_name', 'is_active', 'created_at'
        ]


class ClientCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating clients"""

    class Meta:
        model = Client
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'client_type', 'household',
            'risk_tolerance', 'time_horizon', 'notes'
        ]

    def validate_email(self, value):
        if Client.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError('A client with this email already exists.')
        return value.lower()


class AccountSerializer(serializers.ModelSerializer):
    """Full serializer for Account model"""
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    household_name = serializers.CharField(source='household.name', read_only=True)

    class Meta:
        model = Account
        fields = [
            'id', 'account_number', 'name', 'account_type',
            'client', 'client_name', 'household', 'household_name',
            'custodian', 'custodian_account_id',
            'is_active', 'opened_date', 'closed_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AccountListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing accounts"""
    client_name = serializers.CharField(source='client.full_name', read_only=True)

    class Meta:
        model = Account
        fields = [
            'id', 'account_number', 'name', 'account_type',
            'client_name', 'custodian', 'is_active'
        ]


class RiskSnapshotSerializer(serializers.ModelSerializer):
    """Serializer for RiskSnapshot model"""

    class Meta:
        model = RiskSnapshot
        fields = [
            'id', 'client', 'household', 'as_of_date',
            'total_value', 'equity_exposure', 'fixed_income_exposure',
            'cash_exposure', 'alternative_exposure',
            'risk_score', 'max_drawdown_ytd',
            'data_source', 'source_timestamp',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_aum = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_clients = serializers.IntegerField()
    total_households = serializers.IntegerField()
    total_accounts = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    pending_briefings = serializers.IntegerField()
