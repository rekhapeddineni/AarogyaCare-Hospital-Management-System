from rest_framework import serializers
from .models import Staff
from departments.models import Department


class StaffSerializer(serializers.ModelSerializer):

    department_name = serializers.SerializerMethodField()

    class Meta:
        model = Staff

        fields = [
            "staff_id",
            "first_name",
            "last_name",
            "role",
            "department",
            "department_name",
            "phone",
            "email",
            "salary",
            "joining_date",
        ]

        read_only_fields = [
            "staff_id",
            "department_name",
        ]

    def get_department_name(self, obj):

        if not obj.department:
            return ""

        department_value = str(obj.department)

        # First try department_id
        try:
            department = Department.objects.get(
                department_id=department_value
            )
            return department.department_name
        except Department.DoesNotExist:
            pass

        # If department is already the department name
        try:
            department = Department.objects.get(
                department_name__iexact=department_value
            )
            return department.department_name
        except Department.DoesNotExist:
            pass

        # Otherwise just display the stored value
        return department_value