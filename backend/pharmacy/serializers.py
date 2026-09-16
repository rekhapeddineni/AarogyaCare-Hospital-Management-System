from rest_framework import serializers
from .models import Medicine


class MedicineSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()

    class Meta:
        model = Medicine

        fields = [
            "id",
            "medicine_id",
            "medicine_name",
            "category",
            "manufacturer",
            "batch_number",
            "manufacturing_date",
            "expiry_date",
            "price",
            "stock_quantity",
            "stock_status",
        ]

        read_only_fields = [
            "id",
            "medicine_id",
        ]

    def get_id(self, obj):
        return str(obj.id)
    