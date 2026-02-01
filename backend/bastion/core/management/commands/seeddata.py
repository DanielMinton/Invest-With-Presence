"""
Management command to seed the database with realistic test data
"""

import random
from decimal import Decimal
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from bastion.core.models import User, Client, Household, Account, RiskSnapshot
from bastion.documents.models import Document, DocumentCategory
from bastion.briefings.models import BriefingTemplate, Briefing, Notification


class Command(BaseCommand):
    help = 'Seeds the database with realistic test data for development'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding'
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            self._clear_data()

        self.stdout.write('Seeding database...')

        # Create document categories
        categories = self._create_document_categories()
        self.stdout.write(f'  Created {len(categories)} document categories')

        # Create briefing templates
        templates = self._create_briefing_templates()
        self.stdout.write(f'  Created {len(templates)} briefing templates')

        # Create households and clients
        households = self._create_households_and_clients()
        self.stdout.write(f'  Created {len(households)} households with clients')

        # Create accounts
        accounts = self._create_accounts(households)
        self.stdout.write(f'  Created {len(accounts)} accounts')

        # Create risk snapshots
        snapshots = self._create_risk_snapshots(households)
        self.stdout.write(f'  Created {len(snapshots)} risk snapshots')

        # Create sample briefings
        briefings = self._create_briefings(households, templates)
        self.stdout.write(f'  Created {len(briefings)} briefings')

        # Create notifications for admin user
        notifications = self._create_notifications()
        self.stdout.write(f'  Created {len(notifications)} notifications')

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))

    def _clear_data(self):
        """Clear all seeded data"""
        Notification.objects.all().delete()
        Briefing.objects.all().delete()
        BriefingTemplate.objects.all().delete()
        Document.objects.all().delete()
        DocumentCategory.objects.all().delete()
        RiskSnapshot.objects.all().delete()
        Account.objects.all().delete()
        Client.objects.all().delete()
        Household.objects.all().delete()

    def _create_document_categories(self):
        categories_data = [
            {'name': 'Statements', 'slug': 'statements', 'icon': 'file-text', 'color': 'brand', 'order': 1},
            {'name': 'Tax Documents', 'slug': 'tax', 'icon': 'calculator', 'color': 'warning', 'order': 2},
            {'name': 'Legal', 'slug': 'legal', 'icon': 'scale', 'color': 'danger', 'order': 3},
            {'name': 'Agreements', 'slug': 'agreements', 'icon': 'file-signature', 'color': 'accent', 'order': 4},
            {'name': 'Reports', 'slug': 'reports', 'icon': 'bar-chart', 'color': 'success', 'order': 5},
            {'name': 'Correspondence', 'slug': 'correspondence', 'icon': 'mail', 'color': 'brand', 'order': 6},
        ]

        categories = []
        for data in categories_data:
            cat, _ = DocumentCategory.objects.get_or_create(
                slug=data['slug'],
                defaults=data
            )
            categories.append(cat)
        return categories

    def _create_briefing_templates(self):
        templates_data = [
            {
                'name': 'Weekly Market Update',
                'template_type': 'weekly_update',
                'description': 'Weekly summary of market conditions and portfolio performance',
                'subject_template': 'Weekly Update - {{period}}',
                'body_template': '''# Weekly Market Update

Dear {{client_name}},

Here is your weekly portfolio summary for {{period}}.

## Portfolio Overview
- **Total Value**: {{portfolio_value}}
- **Weekly Change**: {{weekly_change}}

## Market Commentary
{{market_commentary}}

## Next Steps
{{next_steps}}

Best regards,
Your Bastion Team
''',
                'available_variables': ['client_name', 'period', 'portfolio_value', 'weekly_change', 'market_commentary', 'next_steps'],
                'requires_approval': False,
            },
            {
                'name': 'Quarterly Review',
                'template_type': 'quarterly_review',
                'description': 'Comprehensive quarterly portfolio review',
                'subject_template': 'Q{{quarter}} {{year}} Portfolio Review',
                'body_template': '''# Quarterly Portfolio Review

Dear {{client_name}},

Please find enclosed your Q{{quarter}} {{year}} portfolio review.

## Performance Summary
| Metric | Value |
|--------|-------|
| Beginning Value | {{beginning_value}} |
| Ending Value | {{ending_value}} |
| Net Change | {{net_change}} |
| Return | {{return_pct}} |

## Asset Allocation
{{allocation_table}}

## Recommendations
{{recommendations}}

We look forward to discussing this review with you.

Best regards,
Your Bastion Team
''',
                'available_variables': ['client_name', 'quarter', 'year', 'beginning_value', 'ending_value', 'net_change', 'return_pct', 'allocation_table', 'recommendations'],
                'requires_approval': True,
            },
            {
                'name': 'Market Alert',
                'template_type': 'market_alert',
                'description': 'Urgent market condition notification',
                'subject_template': 'Market Alert: {{alert_title}}',
                'body_template': '''# Market Alert

Dear {{client_name}},

We wanted to bring an important market development to your attention.

## Alert: {{alert_title}}

{{alert_description}}

## Impact on Your Portfolio
{{portfolio_impact}}

## Our Response
{{our_response}}

Please don't hesitate to reach out if you have any questions.

Best regards,
Your Bastion Team
''',
                'available_variables': ['client_name', 'alert_title', 'alert_description', 'portfolio_impact', 'our_response'],
                'requires_approval': True,
            },
        ]

        templates = []
        admin = User.objects.filter(is_superuser=True).first()
        for data in templates_data:
            tmpl, _ = BriefingTemplate.objects.get_or_create(
                name=data['name'],
                defaults={**data, 'created_by': admin}
            )
            templates.append(tmpl)
        return templates

    def _create_households_and_clients(self):
        households_data = [
            {
                'name': 'Johnson Family Trust',
                'clients': [
                    {'first_name': 'Robert', 'last_name': 'Johnson', 'email': 'robert.johnson@example.com', 'client_type': 'individual', 'risk_tolerance': 'Moderate', 'time_horizon': '10+ years'},
                    {'first_name': 'Sarah', 'last_name': 'Johnson', 'email': 'sarah.johnson@example.com', 'client_type': 'individual', 'risk_tolerance': 'Moderate', 'time_horizon': '10+ years'},
                ]
            },
            {
                'name': 'Smith Holdings LLC',
                'clients': [
                    {'first_name': 'Michael', 'last_name': 'Smith', 'email': 'michael.smith@example.com', 'client_type': 'entity', 'risk_tolerance': 'Aggressive', 'time_horizon': '15+ years'},
                ]
            },
            {
                'name': 'Anderson Capital',
                'clients': [
                    {'first_name': 'Jennifer', 'last_name': 'Anderson', 'email': 'jennifer.anderson@example.com', 'client_type': 'individual', 'risk_tolerance': 'Conservative', 'time_horizon': '5-10 years'},
                    {'first_name': 'David', 'last_name': 'Anderson', 'email': 'david.anderson@example.com', 'client_type': 'individual', 'risk_tolerance': 'Moderate', 'time_horizon': '10+ years'},
                ]
            },
            {
                'name': 'Williams Revocable Trust',
                'clients': [
                    {'first_name': 'Patricia', 'last_name': 'Williams', 'email': 'patricia.williams@example.com', 'client_type': 'trust', 'risk_tolerance': 'Conservative', 'time_horizon': '3-5 years'},
                ]
            },
            {
                'name': 'Chen Family Office',
                'clients': [
                    {'first_name': 'Wei', 'last_name': 'Chen', 'email': 'wei.chen@example.com', 'client_type': 'individual', 'risk_tolerance': 'Aggressive', 'time_horizon': '20+ years'},
                    {'first_name': 'Lin', 'last_name': 'Chen', 'email': 'lin.chen@example.com', 'client_type': 'individual', 'risk_tolerance': 'Moderate', 'time_horizon': '15+ years'},
                    {'first_name': 'Amy', 'last_name': 'Chen', 'email': 'amy.chen@example.com', 'client_type': 'individual', 'risk_tolerance': 'Moderate', 'time_horizon': '10+ years'},
                ]
            },
        ]

        admin = User.objects.filter(is_superuser=True).first()
        households = []

        for hh_data in households_data:
            household, _ = Household.objects.get_or_create(
                name=hh_data['name'],
                defaults={'created_by': admin}
            )
            households.append(household)

            for client_data in hh_data['clients']:
                client, _ = Client.objects.get_or_create(
                    email=client_data['email'],
                    defaults={
                        **client_data,
                        'household': household,
                        'is_active': True,
                        'portal_enabled': True,
                        'onboarded_at': timezone.now() - timedelta(days=random.randint(30, 365)),
                    }
                )
                if not household.primary_contact:
                    household.primary_contact = client
                    household.save()

        return households

    def _create_accounts(self, households):
        account_types = ['individual', 'joint', 'ira_traditional', 'ira_roth', 'trust']
        accounts = []

        for household in households:
            clients = list(household.clients.all())
            if not clients:
                continue

            num_accounts = random.randint(2, 5)
            for i in range(num_accounts):
                client = random.choice(clients)
                account_type = random.choice(account_types)

                account, created = Account.objects.get_or_create(
                    account_number=f'ACC-{household.id.hex[:4].upper()}-{i+1:03d}',
                    defaults={
                        'name': f'{client.last_name} {account_type.replace("_", " ").title()}',
                        'account_type': account_type,
                        'client': client,
                        'household': household,
                        'custodian': random.choice(['Fidelity', 'Schwab', 'Pershing']),
                        'is_active': True,
                        'opened_date': date.today() - timedelta(days=random.randint(90, 1000)),
                    }
                )
                if created:
                    accounts.append(account)

        return accounts

    def _create_risk_snapshots(self, households):
        snapshots = []
        today = date.today()

        for household in households:
            # Create snapshots for last 3 months
            for months_ago in range(3):
                snapshot_date = today - timedelta(days=30 * months_ago)

                total_value = Decimal(random.randint(500000, 15000000))
                equity = Decimal(random.randint(40, 70))
                fixed = Decimal(random.randint(15, 35))
                cash = Decimal(random.randint(3, 15))
                alt = Decimal(100) - equity - fixed - cash

                snapshot, created = RiskSnapshot.objects.get_or_create(
                    household=household,
                    as_of_date=snapshot_date,
                    defaults={
                        'total_value': total_value,
                        'equity_exposure': equity,
                        'fixed_income_exposure': fixed,
                        'cash_exposure': cash,
                        'alternative_exposure': max(alt, Decimal(0)),
                        'risk_score': random.choice(['Conservative', 'Moderate', 'Aggressive']),
                        'max_drawdown_ytd': Decimal(random.randint(-15, -2)),
                        'data_source': 'Seed Data',
                        'source_timestamp': timezone.now(),
                    }
                )
                if created:
                    snapshots.append(snapshot)

        return snapshots

    def _create_briefings(self, households, templates):
        briefings = []
        admin = User.objects.filter(is_superuser=True).first()
        weekly_template = templates[0] if templates else None

        statuses = ['draft', 'pending_review', 'approved', 'sent']

        for household in households[:3]:  # Create briefings for first 3 households
            for i in range(2):
                status = random.choice(statuses)
                briefing, created = Briefing.objects.get_or_create(
                    title=f'Weekly Update - {household.name}',
                    household=household,
                    defaults={
                        'subject': f'Your Weekly Portfolio Update',
                        'template': weekly_template,
                        'body_markdown': f'''# Weekly Update for {household.name}

Your portfolio is performing well this week.

## Summary
- Total Value: $2,450,000
- Weekly Change: +1.2%

Contact us if you have any questions.
''',
                        'body_html': '<h1>Weekly Update</h1><p>Your portfolio is performing well.</p>',
                        'status': status,
                        'delivery_method': 'portal',
                        'created_by': admin,
                        'sent_at': timezone.now() if status == 'sent' else None,
                    }
                )
                if created:
                    briefings.append(briefing)

        return briefings

    def _create_notifications(self):
        admin = User.objects.filter(is_superuser=True).first()
        if not admin:
            return []

        notifications_data = [
            {'title': 'New Client Onboarded', 'message': 'Chen Family Office has completed onboarding.', 'notification_type': 'success', 'link': '/hub/clients'},
            {'title': 'Risk Alert', 'message': 'VIX has exceeded threshold. Review portfolio exposures.', 'notification_type': 'warning', 'link': '/hub/risk'},
            {'title': 'Briefing Ready for Review', 'message': 'Q4 briefing for Johnson Family Trust is ready.', 'notification_type': 'task', 'link': '/hub/briefings'},
            {'title': 'Document Uploaded', 'message': 'Tax documents uploaded for Smith Holdings.', 'notification_type': 'info', 'link': '/hub/documents'},
            {'title': 'Quarterly Review Due', 'message': 'Anderson Capital review meeting in 3 days.', 'notification_type': 'task', 'link': '/hub/tasks'},
        ]

        notifications = []
        for data in notifications_data:
            notif, created = Notification.objects.get_or_create(
                user=admin,
                title=data['title'],
                defaults={
                    **data,
                    'is_read': random.choice([True, False]),
                }
            )
            if created:
                notifications.append(notif)

        return notifications
