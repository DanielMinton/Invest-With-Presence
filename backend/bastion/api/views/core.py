"""
Core ViewSets for Client, Household, Account management
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Sum

from bastion.core.models import Client, Household, Account, RiskSnapshot
from bastion.api.serializers import (
    ClientSerializer,
    ClientListSerializer,
    ClientCreateSerializer,
    HouseholdSerializer,
    HouseholdListSerializer,
    AccountSerializer,
    AccountListSerializer,
    RiskSnapshotSerializer,
    DashboardStatsSerializer,
)
from bastion.audit.services import audit_log


class HouseholdViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing households
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        return Household.objects.prefetch_related('clients', 'accounts')

    def get_serializer_class(self):
        if self.action == 'list':
            return HouseholdListSerializer
        return HouseholdSerializer

    def perform_create(self, serializer):
        household = serializer.save(created_by=self.request.user)
        audit_log(
            event_type='data.create',
            user=self.request.user,
            request=self.request,
            target=household,
            details={'model': 'Household'}
        )

    def perform_update(self, serializer):
        household = serializer.save()
        audit_log(
            event_type='data.update',
            user=self.request.user,
            request=self.request,
            target=household,
            details={'model': 'Household', 'fields': list(serializer.validated_data.keys())}
        )

    @action(detail=True, methods=['get'])
    def clients(self, request, pk=None):
        """Get all clients in this household"""
        household = self.get_object()
        clients = household.clients.filter(is_active=True)
        serializer = ClientListSerializer(clients, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def accounts(self, request, pk=None):
        """Get all accounts in this household"""
        household = self.get_object()
        accounts = household.accounts.filter(is_active=True)
        serializer = AccountListSerializer(accounts, many=True)
        return Response(serializer.data)


class ClientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing clients
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['client_type', 'household', 'is_active', 'portal_enabled']
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['last_name', 'first_name', 'created_at']
    ordering = ['last_name', 'first_name']

    def get_queryset(self):
        return Client.objects.select_related('household', 'user').prefetch_related('accounts')

    def get_serializer_class(self):
        if self.action == 'list':
            return ClientListSerializer
        if self.action == 'create':
            return ClientCreateSerializer
        return ClientSerializer

    def perform_create(self, serializer):
        client = serializer.save()
        audit_log(
            event_type='data.create',
            user=self.request.user,
            request=self.request,
            target=client,
            details={'model': 'Client'}
        )

    def perform_update(self, serializer):
        client = serializer.save()
        audit_log(
            event_type='data.update',
            user=self.request.user,
            request=self.request,
            target=client,
            details={'model': 'Client', 'fields': list(serializer.validated_data.keys())}
        )

    @action(detail=True, methods=['get'])
    def accounts(self, request, pk=None):
        """Get all accounts for this client"""
        client = self.get_object()
        accounts = client.accounts.filter(is_active=True)
        serializer = AccountListSerializer(accounts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def risk_history(self, request, pk=None):
        """Get risk snapshot history for this client"""
        client = self.get_object()
        snapshots = client.risk_snapshots.all()[:12]  # Last 12 snapshots
        serializer = RiskSnapshotSerializer(snapshots, many=True)
        return Response(serializer.data)


class AccountViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing accounts
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['account_type', 'client', 'household', 'custodian', 'is_active']
    search_fields = ['account_number', 'name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        return Account.objects.select_related('client', 'household')

    def get_serializer_class(self):
        if self.action == 'list':
            return AccountListSerializer
        return AccountSerializer

    def perform_create(self, serializer):
        account = serializer.save()
        audit_log(
            event_type='data.create',
            user=self.request.user,
            request=self.request,
            target=account,
            details={'model': 'Account'}
        )

    def perform_update(self, serializer):
        account = serializer.save()
        audit_log(
            event_type='data.update',
            user=self.request.user,
            request=self.request,
            target=account,
            details={'model': 'Account', 'fields': list(serializer.validated_data.keys())}
        )


class RiskSnapshotViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing risk snapshots (read-only)
    Snapshots are created by background sync jobs, not via API
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RiskSnapshotSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['client', 'household', 'as_of_date']
    ordering_fields = ['as_of_date']
    ordering = ['-as_of_date']

    def get_queryset(self):
        return RiskSnapshot.objects.select_related('client', 'household')
