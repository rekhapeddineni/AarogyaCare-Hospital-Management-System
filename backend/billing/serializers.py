from rest_framework import serializers
from .models import Billing


class BillingSerializer(serializers.ModelSerializer):

    class Meta:

        model = Billing

        fields = [
            "bill_id",
            "patient_name",
            "doctor_name",
            "consultation_fee",
            "medicine_charges",
            "lab_charges",
            "room_charges",
            "other_charges",
            "total_amount",
            "payment_method",
            "payment_status",
            "bill_date",
        ]

        read_only_fields = [
            "bill_id",
            "total_amount",
        ]