from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class Staff(models.Model):

    id = ObjectIdAutoField(primary_key=True)

    staff_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    ROLE_CHOICES = [
        ("Doctor", "Doctor"),
        ("Nurse", "Nurse"),
        ("Receptionist", "Receptionist"),
        ("Pharmacist", "Pharmacist"),
        ("Lab Technician", "Lab Technician"),
        ("Administrator", "Administrator"),
        ("Accountant", "Accountant"),
        ("Ward Assistant", "Ward Assistant"),
        ("Technician", "Technician"),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES)
    department = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    joining_date = models.DateField()

    def save(self, *args, **kwargs):

        if not self.staff_id:

            staff_members = Staff.objects.all()

            highest_number = 0

            for staff in staff_members:

                if staff.staff_id:

                    try:

                        if staff.staff_id.startswith("STF"):

                            number = int(
                                staff.staff_id.replace("STF", "")
                            )

                            if number > highest_number:
                                highest_number = number

                    except (ValueError, TypeError):
                        pass

            self.staff_id = f"STF{highest_number + 1:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.staff_id} - {self.first_name} {self.last_name}"