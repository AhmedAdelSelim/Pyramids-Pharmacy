from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Medication, RefillRequest

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class MedicationSerializer(serializers.ModelSerializer):
    last_refill = serializers.SerializerMethodField()

    class Meta:
        model = Medication
        fields = ['id', 'name', 'description', 'dosage', 'available', 'quantity', 'created_at', 'last_refill']

    def get_last_refill(self, obj):
        last_refill = obj.get_last_approved_refill()
        if last_refill:
            return {
                'date': last_refill.updated_at,
                'status': last_refill.status,
                'amount': last_refill.amount
            }
        return None

class RefillRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefillRequest
        fields = ['id', 'medication', 'amount', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value

    def validate(self, data):
        medication = data.get('medication')
        amount = data.get('amount', 1)
        
        if medication and not medication.is_available:
            raise serializers.ValidationError("This medication is not available")
        
        if medication and amount > medication.quantity:
            raise serializers.ValidationError(f"Only {medication.quantity} units available")
        
        return data

    def create(self, validated_data):
        # Remove user from validated_data if it exists
        validated_data.pop('user', None)
        # Get the user from the context
        user = self.context['request'].user
        # Create the refill request
        return RefillRequest.objects.create(
            user=user,
            **validated_data
        ) 