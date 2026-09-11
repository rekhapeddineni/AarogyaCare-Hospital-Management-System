from rest_framework import viewsets

from .models import Medicine
from .serializers import MedicineSerializer


class MedicineViewSet(viewsets.ModelViewSet):

    queryset = Medicine.objects.all().order_by("-medicine_id")
    serializer_class = MedicineSerializer
    lookup_field = "medicine_id"