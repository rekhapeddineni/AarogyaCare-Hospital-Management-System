from rest_framework import serializers

from .models import Admission

from patients.models import Patient


class AdmissionSerializer(
    serializers.ModelSerializer
):

    admission_id = serializers.CharField(
        read_only=True
    )

    admission_number = serializers.CharField(
        read_only=True
    )

    patient_details = serializers.SerializerMethodField()

    class Meta:

        model = Admission

        fields = [
            "admission_id",
            "admission_number",
            "patient",
            "patient_details",
            "doctor",
            "admission_date",
            "discharge_date",
            "room_number",
            "bed_number",
            "admission_type",
            "status",
            "reason",
            "notes",
        ]

    def get_patient_details(self, obj):

        if not obj.patient:

            return None

        patient_value = str(
            obj.patient
        )

        # =========================================
        # CHECK PATIENT ID
        # Example: PAT001
        # =========================================

        try:

            patient = Patient.objects.get(
                patient_id=patient_value
            )

            return {
                "patient_id":
                    patient.patient_id,

                "first_name":
                    patient.first_name,

                "last_name":
                    patient.last_name,
            }

        except Patient.DoesNotExist:

            pass


        # =========================================
        # CHECK MONGODB OBJECT ID
        # =========================================

        try:

            patient = Patient.objects.get(
                pk=patient_value
            )

            return {
                "patient_id":
                    patient.patient_id,

                "first_name":
                    patient.first_name,

                "last_name":
                    patient.last_name,
            }

        except Patient.DoesNotExist:

            return None