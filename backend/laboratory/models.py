from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField

from patients.models import Patient


class LabTest(models.Model):

    id = ObjectIdAutoField(primary_key=True)

    test_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE
    )

    test_name = models.CharField(
        max_length=100
    )

    doctor = models.CharField(
        max_length=100,
        default=""
    )

    department = models.CharField(
        max_length=100,
        default=""
    )

    test_date = models.DateField()

    result = models.TextField(
        blank=True,
        default=""
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    technician = models.CharField(
        max_length=100,
        default=""
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Completed", "Completed"),
        ],
        default="Pending"
    )

    def save(self, *args, **kwargs):

        if not self.test_id:

            existing_tests = LabTest.objects.all()

            highest_number = 0

            for test in existing_tests:

                if test.test_id and test.test_id.startswith("LAB"):

                    try:
                        number = int(
                            test.test_id.replace("LAB", "")
                        )

                        if number > highest_number:
                            highest_number = number

                    except ValueError:
                        pass

            self.test_id = f"LAB{highest_number + 1:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.test_id} - {self.test_name}"