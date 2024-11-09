from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Medication, RefillRequest

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'dosage', 'quantity', 'available', 'created_at', 'last_approved_refill')
    list_filter = ('available', 'created_at')
    list_editable = ('quantity', 'available')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)

    def last_approved_refill(self, obj):
        last_refill = obj.get_last_approved_refill()
        if last_refill:
            return last_refill.updated_at.strftime("%Y-%m-%d %H:%M")
        return '-'
    last_approved_refill.short_description = 'Last Approved Refill'

@admin.register(RefillRequest)
class RefillRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'medication', 'amount', 'status_badge', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'medication__name')
    readonly_fields = ('created_at', 'updated_at')
    
    actions = ['approve_requests', 'deny_requests']
    
    def status_badge(self, obj):
        colors = {
            'PENDING': '#FFA500',  # Orange
            'APPROVED': '#28A745',  # Green
            'DENIED': '#DC3545'    # Red
        }
        return format_html(
            '<span style="color: {}; font-weight: bold; padding: 5px; border-radius: 3px;">{}</span>',
            colors[obj.status],
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def get_patient_email(self, obj):
        return obj.user.email
    get_patient_email.short_description = 'Patient Email'

    def approve_requests(self, request, queryset):
        for refill_request in queryset:
            refill_request.update_status('APPROVED', notes=f'Approved by admin on {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}')
        self.message_user(request, f'{queryset.count()} refill requests were approved.')
    approve_requests.short_description = 'Approve selected refill requests'

    def deny_requests(self, request, queryset):
        for refill_request in queryset:
            refill_request.update_status('DENIED', notes=f'Denied by admin on {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}')
        self.message_user(request, f'{queryset.count()} refill requests were denied.')
    deny_requests.short_description = 'Deny selected refill requests'

    def save_model(self, request, obj, form, change):
        if change and 'status' in form.changed_data:
            obj.update_status(
                obj.status, 
                notes=f'Status changed to {obj.get_status_display()} by admin on {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}'
            )
        else:
            super().save_model(request, obj, form, change)

    fieldsets = (
        ('Request Information', {
            'fields': (
                'user', 
                'medication', 
                'status', 
                ('created_at', 'updated_at')
            )
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('created_at', 'updated_at')
        return self.readonly_fields
