from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class Patient(models.Model):

    id = ObjectIdAutoField(primary_key=True)

    patient_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    blood_group = models.CharField(max_length=5)
    address = models.TextField()
    disease = models.CharField(max_length=100)
    doctor_name = models.CharField(max_length=100)
    admission_date = models.DateField()

    def __str__(self):
        return f"{self.patient_id} - {self.first_name} {self.last_name}"