from rest_framework import viewsets

from .models import Admission
from .serializers import AdmissionSerializer


class AdmissionViewSet(
    viewsets.ModelViewSet
):

    queryset = (
        Admission.objects
        .all()
        .order_by("-admission_date")
    )

    serializer_class = AdmissionSerializer

    lookup_field = "admission_id"