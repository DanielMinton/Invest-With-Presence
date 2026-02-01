"""
Management command to create a test user for development
"""

from django.core.management.base import BaseCommand
from bastion.core.models import User


class Command(BaseCommand):
    help = 'Creates a test superuser for development'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            default='admin@bastion.local',
            help='Email for the test user'
        )
        parser.add_argument(
            '--password',
            default='BastionAdmin123!',
            help='Password for the test user'
        )

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'User {email} already exists')
            )
            return

        user = User.objects.create_superuser(
            email=email,
            password=password,
            first_name='Admin',
            last_name='User',
        )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created test user:')
        )
        self.stdout.write(f'  Email: {email}')
        self.stdout.write(f'  Password: {password}')
        self.stdout.write(f'  Role: Superuser')
