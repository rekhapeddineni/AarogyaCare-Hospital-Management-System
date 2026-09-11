from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class Billing(models.Model):

    id = ObjectIdAutoField(primary_key=True)

    bill_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    patient_name = models.CharField(max_length=100)
    doctor_name = models.CharField(max_length=100)

    consultation_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    medicine_charges = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    lab_charges = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    room_charges = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    other_charges = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    payment_method = models.CharField(max_length=50)

    payment_status = models.CharField(max_length=20)

    bill_date = models.DateField()


    def save(self, *args, **kwargs):

        # Generate BILL ID
        if not self.bill_id:

            bills = Billing.objects.all()

            highest_number = 0

            for bill in bills:

                if bill.bill_id:

                    try:
                        if bill.bill_id.startswith("BILL"):
                            number = int(
                                bill.bill_id.replace("BILL", "")
                            )

                            if number > highest_number:
                                highest_number = number

                    except (ValueError, TypeError):
                        pass

            self.bill_id = f"BILL{highest_number + 1:03d}"


        # Calculate total automatically
        self.total_amount = (
            self.consultation_fee
            + self.medicine_charges
            + self.lab_charges
            + self.room_charges
            + self.other_charges
        )

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.bill_id} - {self.patient_name}"