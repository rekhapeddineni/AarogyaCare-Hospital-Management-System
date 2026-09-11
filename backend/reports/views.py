
from rest_framework import viewsets

from .models import Report
from .serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):

    queryset = Report.objects.all().order_by(
        "-generated_date"
    )

    serializer_class = ReportSerializer

    lookup_field = "report_id"

