from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# Create your models here.

class Medication(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    dosage = models.CharField(max_length=100)
    available = models.BooleanField(default=True)
    quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def get_last_approved_refill(self):
        return self.refillrequest_set.filter(
            status='APPROVED'
        ).order_by('-updated_at').first()

    @property
    def is_available(self):
        return self.available and self.quantity > 0

class RefillRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('DENIED', 'Denied'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    medication = models.ForeignKey('Medication', on_delete=models.CASCADE)
    amount = models.IntegerField(default=1)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, help_text="Admin notes about this refill request")

    def save(self, *args, **kwargs):
        if self.status == 'APPROVED' and self.pk is None:
            # Only reduce quantity on initial approval
            self.medication.quantity -= self.amount
            self.medication.save()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Refill Request'
        verbose_name_plural = 'Refill Requests'

    def __str__(self):
        return f"{self.user.username} - {self.medication.name} ({self.status})"

    def update_status(self, new_status, notes=None):
        self.status = new_status
        if notes:
            self.notes = notes
        self.updated_at = timezone.now()
        self.save()

    @classmethod
    def has_recent_request(cls, user, medication, days=7):
        """Check if user has requested refill for this medication in the last X days"""
        recent_date = timezone.now() - timedelta(days=days)
        return cls.objects.filter(
            user=user,
            medication=medication,
            created_at__gte=recent_date
        ).exists()

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
