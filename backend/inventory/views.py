from rest_framework import viewsets

from .models import Inventory
from .serializers import InventorySerializer


class InventoryViewSet(viewsets.ModelViewSet):

    queryset = Inventory.objects.all().order_by("-purchase_date")

    serializer_class = InventorySerializer

    lookup_field = "inventory_id"