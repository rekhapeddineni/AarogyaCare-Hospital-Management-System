from django.db import models

class Department(models.Model):
    department_id = models.CharField(max_length=20, unique=True)
    department_name = models.CharField(max_length=100)
    head_of_department = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    location = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return f"{self.department_id} - {self.department_name}"