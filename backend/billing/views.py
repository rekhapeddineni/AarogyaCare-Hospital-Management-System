from rest_framework import viewsets

from .models import Billing
from .serializers import BillingSerializer


class BillingViewSet(viewsets.ModelViewSet):

    queryset = Billing.objects.all().order_by("-bill_date")

    serializer_class = BillingSerializer

    lookup_field = "bill_id"