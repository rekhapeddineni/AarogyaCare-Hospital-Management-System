from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class Medicine(models.Model):

    # MongoDB internal ID
    id = ObjectIdAutoField(primary_key=True)

    # Visible medicine ID
    medicine_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True
    )

    medicine_name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=100)

    batch_number = models.CharField(max_length=50)

    manufacturing_date = models.DateField()
    expiry_date = models.DateField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock_quantity = models.PositiveIntegerField()

    # Stock status
    stock_status = models.CharField(
        max_length=20,
        choices=[
            ("Good Stock", "Good Stock"),
            ("Medium Stock", "Medium Stock"),
            ("Low Stock", "Low Stock"),
        ],
        default="Good Stock"
    )

    def save(self, *args, **kwargs):

        # Generate MED001, MED002, MED003...
        if not self.medicine_id:

            last_medicine = Medicine.objects.order_by("-medicine_id").first()

            if last_medicine and last_medicine.medicine_id:

                try:
                    last_number = int(
                        last_medicine.medicine_id.replace("MED", "")
                    )

                    next_number = last_number + 1

                except ValueError:
                    next_number = 1

            else:
                next_number = 1

            self.medicine_id = f"MED{next_number:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.medicine_id} - {self.medicine_name}"