
from django.urls import path

from .views import signup, login_user


urlpatterns = [

    path("signup/", signup, name="signup"),

    path("login/", login_user, name="login"),

]

