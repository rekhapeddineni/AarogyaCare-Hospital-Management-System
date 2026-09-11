
from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):

    class Meta:

        model = Report

        fields = [
            "report_id",
            "report_name",
            "report_type",
            "generated_by",
            "generated_date",
            "description",
        ]

        read_only_fields = [
            "report_id"
        ]
