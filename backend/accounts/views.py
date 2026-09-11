
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


# =========================================================
# CREATE ACCOUNT / SIGNUP
# =========================================================

@api_view(["POST"])
def signup(request):

    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    # Check required fields
    if not name or not email or not password:
        return Response(
            {
                "message": "Name, email and password are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if email already exists
    if User.objects.filter(username=email).exists():
        return Response(
            {
                "message": "Account with this email already exists"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create user
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name
    )

    return Response(
        {
            "message": "Account created successfully",
            "email": user.email
        },
        status=status.HTTP_201_CREATED
    )


# =========================================================
# LOGIN
# =========================================================

@api_view(["POST"])
def login_user(request):

    email = request.data.get("email")
    password = request.data.get("password")

    # Check required fields
    if not email or not password:
        return Response(
            {
                "message": "Email and password are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Authenticate user
    user = authenticate(
        username=email,
        password=password
    )

    # Invalid login
    if user is None:
        return Response(
            {
                "message": "Invalid email or password"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(
        {
            "message": "Login successful",
            "email": user.email,
            "name": user.first_name
        },
        status=status.HTTP_200_OK
    )

