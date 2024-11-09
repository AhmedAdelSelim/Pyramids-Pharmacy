from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count
from .models import Medication, RefillRequest, Notification
from .serializers import MedicationSerializer, RefillRequestSerializer, UserSerializer
from django.contrib.auth.models import User
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['GET', 'PATCH'])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]

class RefillRequestViewSet(viewsets.ModelViewSet):
    serializer_class = RefillRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RefillRequest.objects.filter(user=self.request.user)

    @action(detail=False, methods=['GET'])
    def statistics(self, request):
        stats = RefillRequest.objects.values('medication__name').annotate(
            total_requests=Count('id')
        )
        return Response(stats)

    def create(self, request, *args, **kwargs):
        try:
            # Check if medication_id is provided
            medication_id = request.data.get('medication')
            if not medication_id:
                return Response(
                    {'error': 'Medication ID is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check for recent refill requests
            if RefillRequest.has_recent_request(request.user, medication_id):
                return Response(
                    {'error': 'You have already requested a refill for this medication recently'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['GET'])
    def history(self, request):
        """Get refill request history for the current user"""
        refills = self.get_queryset().select_related('medication')
        serializer = self.get_serializer(refills, many=True)
        return Response(serializer.data)
