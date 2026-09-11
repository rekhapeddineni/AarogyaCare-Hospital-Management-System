
from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()

    class Meta:
        model = Appointment

        fields = [
            "id",
            "appointment_number",
            "patient_name",
            "doctor_name",
            "department",
            "appointment_date",
            "appointment_time",
            "reason",
            "status",
        ]

        read_only_fields = [
            "id",
            "appointment_number",
        ]

    def get_id(self, obj):
        return str(obj.id)

