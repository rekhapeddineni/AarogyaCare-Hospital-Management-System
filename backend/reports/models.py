
from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class Report(models.Model):

    id = ObjectIdAutoField(primary_key=True)

    report_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    report_name = models.CharField(
        max_length=100
    )

    report_type = models.CharField(
        max_length=100
    )

    generated_by = models.CharField(
        max_length=100
    )

    generated_date = models.DateField()

    description = models.TextField(
        blank=True,
        default=""
    )

    def save(self, *args, **kwargs):

        if not self.report_id:

            reports = Report.objects.all()

            highest_number = 0

            for report in reports:

                if report.report_id:

                    try:

                        if report.report_id.startswith("REP"):

                            number = int(
                                report.report_id.replace(
                                    "REP",
                                    ""
                                )
                            )

                            if number > highest_number:
                                highest_number = number

                    except (ValueError, TypeError):
                        pass

            self.report_id = (
                f"REP{highest_number + 1:03d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return f"{self.report_id} - {self.report_name}"

