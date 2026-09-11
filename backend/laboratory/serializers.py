from rest_framework import serializers

from .models import LabTest
from patients.models import Patient


class LabTestSerializer(serializers.ModelSerializer):

    patient_id = serializers.SlugRelatedField(
        source="patient",
        slug_field="patient_id",
        queryset=Patient.objects.all()
    )

    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = LabTest

        fields = [
            "test_id",
            "patient_id",
            "patient_name",
            "test_name",
            "doctor",
            "department",
            "test_date",
            "result",
            "amount",
            "technician",
            "status",
        ]

        read_only_fields = [
            "test_id",
            "patient_name",
        ]

    def get_patient_name(self, obj):

        if not obj.patient:
            return ""

        first_name = (
            obj.patient.first_name or ""
        ).strip()

        last_name = (
            obj.patient.last_name or ""
        ).strip()

        return f"{first_name} {last_name}".strip()