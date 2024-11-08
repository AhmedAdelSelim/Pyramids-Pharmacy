from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from medications.models import Medication, RefillRequest
from django.db import transaction

class Command(BaseCommand):
    help = 'Seeds the database with test data'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Create test users
        test_users = [
            {
                'username': 'testuser1',
                'email': 'test1@example.com',
                'password': 'testpass123',
                'is_staff': True
            },
            {
                'username': 'testuser2',
                'email': 'test2@example.com',
                'password': 'testpass123'
            },
            {
                'username': 'patient1',
                'email': 'patient1@example.com',
                'password': 'patient123'
            }
        ]

        created_users = []
        for user_data in test_users:
            is_staff = user_data.pop('is_staff', False)
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                email=user_data['email'],
                defaults={'is_staff': is_staff}
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                created_users.append(user)
                self.stdout.write(f'Created user: {user.username}')

        # Create medications
        medications_data = [
            {
                'name': 'Aspirin',
                'description': 'Pain reliever and fever reducer',
                'dosage': '325mg'
            },
            {
                'name': 'Lisinopril',
                'description': 'ACE inhibitor for blood pressure management',
                'dosage': '10mg'
            },
            {
                'name': 'Metformin',
                'description': 'Oral diabetes medicine',
                'dosage': '500mg'
            },
            {
                'name': 'Amoxicillin',
                'description': 'Antibiotic for bacterial infections',
                'dosage': '500mg'
            },
            {
                'name': 'Omeprazole',
                'description': 'Proton pump inhibitor for acid reflux',
                'dosage': '20mg'
            }
        ]

        created_medications = []
        for med_data in medications_data:
            medication, created = Medication.objects.get_or_create(
                name=med_data['name'],
                defaults={
                    'description': med_data['description'],
                    'dosage': med_data['dosage']
                }
            )
            if created:
                created_medications.append(medication)
                self.stdout.write(f'Created medication: {medication.name}')

        # Create refill requests
        if created_users and created_medications:
            statuses = ['PENDING', 'APPROVED', 'DENIED']
            for user in created_users:
                for medication in created_medications[:2]:  # Create 2 requests per user
                    RefillRequest.objects.get_or_create(
                        user=user,
                        medication=medication,
                        defaults={'status': 'PENDING'}
                    )
                    self.stdout.write(f'Created refill request for {user.username} - {medication.name}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded database')) 