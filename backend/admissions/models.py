from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class Admission(models.Model):

    # MongoDB internal ID
    admission_id = ObjectIdAutoField(primary_key=True)

    # Human-readable Admission ID
    # Example: ADM1001, ADM1002, ADM1003
    admission_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True
    )

    patient = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    doctor = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    admission_date = models.DateField()

    discharge_date = models.DateField(
        null=True,
        blank=True
    )

    room_number = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )

    bed_number = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )

    admission_type = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )

    status = models.CharField(
        max_length=50,
        default="Admitted"
    )

    reason = models.TextField(
        blank=True,
        null=True
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    def save(self, *args, **kwargs):

        # Generate Admission ID only when creating a new admission
        if not self.admission_number:

            last_admission = (
                Admission.objects
                .filter(
                    admission_number__startswith="ADM"
                )
                .order_by("-admission_number")
                .first()
            )

            if last_admission and last_admission.admission_number:

                try:
                    last_number = int(
                        last_admission.admission_number[3:]
                    )

                    next_number = last_number + 1

                except (ValueError, TypeError):

                    next_number = 1001

            else:

                next_number = 1001

            self.admission_number = (
                f"ADM{next_number}"
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return (
            f"{self.admission_number} - "
            f"{self.patient}"
        )