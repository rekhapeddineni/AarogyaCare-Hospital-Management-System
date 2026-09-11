from rest_framework import serializers
from .models import Inventory


class InventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Inventory

        fields = [
            "inventory_id",
            "item_name",
            "category",
            "supplier",
            "quantity",
            "unit_price",
            "purchase_date",
            "expiry_date",
        ]

        read_only_fields = ["inventory_id"]