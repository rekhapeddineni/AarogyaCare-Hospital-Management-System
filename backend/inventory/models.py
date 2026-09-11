from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class Inventory(models.Model):
    id = ObjectIdAutoField(primary_key=True)

    inventory_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    item_name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    supplier = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):

        if not self.inventory_id:

            inventories = Inventory.objects.all()

            highest_number = 0

            for inventory in inventories:

                if inventory.inventory_id:

                    try:
                        if inventory.inventory_id.startswith("INV"):
                            number = int(
                                inventory.inventory_id.replace("INV", "")
                            )

                            if number > highest_number:
                                highest_number = number

                    except (ValueError, TypeError):
                        pass

            self.inventory_id = f"INV{highest_number + 1:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.inventory_id} - {self.item_name}"