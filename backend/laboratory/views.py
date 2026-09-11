from rest_framework import viewsets
from .models import LabTest
from .serializers import LabTestSerializer


class LabTestViewSet(viewsets.ModelViewSet):

    queryset = LabTest.objects.all().order_by("-test_id")

    serializer_class = LabTestSerializer

    lookup_field = "test_id"