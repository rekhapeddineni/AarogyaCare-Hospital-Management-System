
from rest_framework import serializers
from .models import Department


class DepartmentSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            "id",
            "department_id",
            "department_name",
            "head_of_department",
            "phone",
            "location",
            "description",
        ]

    def get_id(self, obj):
        return str(obj.id)

