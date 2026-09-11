from rest_framework import viewsets

from .models import Staff
from .serializers import StaffSerializer


class StaffViewSet(viewsets.ModelViewSet):

    queryset = Staff.objects.all().order_by("-joining_date")

    serializer_class = StaffSerializer

    lookup_field = "staff_id"