from django.core.management.base import BaseCommand
from medications.models import Medication

class Command(BaseCommand):
    help = 'Seeds the database with initial medications'

    def handle(self, *args, **kwargs):
        medications = [
            {
                'name': 'Aspirin',
                'description': 'Pain reliever and fever reducer',
                'dosage': '325mg'
            },
            {
                'name': 'Lisinopril',
                'description': 'ACE inhibitor for blood pressure',
                'dosage': '10mg'
            },
            {
                'name': 'Metformin',
                'description': 'Diabetes medication',
                'dosage': '500mg'
            },
            {
                'name': 'Amoxicillin',
                'description': 'Antibiotic',
                'dosage': '500mg'
            },
        ]

        for med_data in medications:
            Medication.objects.get_or_create(**med_data)

        self.stdout.write(self.style.SUCCESS('Successfully seeded medications')) 