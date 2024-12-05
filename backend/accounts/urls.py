from django.contrib import admin
from django.urls import path,include
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
   
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserRegistrationView.as_view(),name="user-register"),
    path('login/',LoginUserView.as_view(),name="user-login"),
    #  path('api/validate-token/', validate_token, name='validate_token'),
    path('get_user_details/',UserDetails.as_view(),name="user-details"),
    path('update_user/',UpdateUser.as_view(), name='update_user'),

]
