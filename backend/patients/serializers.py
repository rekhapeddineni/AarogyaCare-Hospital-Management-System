
from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            "id",
            "patient_id",
            "first_name",
            "last_name",
            "age",
            "gender",
            "phone",
            "email",
            "blood_group",
            "address",
            "disease",
            "doctor_name",
            "admission_date",
        ]

    def get_id(self, obj):
        return str(obj.id)

