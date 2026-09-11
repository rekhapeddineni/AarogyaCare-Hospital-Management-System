from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class Appointment(models.Model):

    id = ObjectIdAutoField(primary_key=True)

    appointment_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    patient_name = models.CharField(max_length=100)
    doctor_name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.CharField(max_length=200)
    status = models.CharField(max_length=20)

    def save(self, *args, **kwargs):

        if not self.appointment_number:

            last_appointment = (
                Appointment.objects
                .exclude(appointment_number__isnull=True)
                .exclude(appointment_number="")
                .order_by("-appointment_number")
                .first()
            )

            if last_appointment:
                try:
                    last_number = int(
                        last_appointment.appointment_number.replace(
                            "APT", ""
                        )
                    )
                    next_number = last_number + 1
                except (ValueError, AttributeError):
                    next_number = 1
            else:
                next_number = 1

            self.appointment_number = f"APT{next_number:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.appointment_number} - {self.patient_name}"