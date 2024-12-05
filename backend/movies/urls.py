from django.contrib import admin
from django.urls import path
from . views import  AllMovies ,ShowDetails ,MovieDetail


urlpatterns=[
path('all_movies_details/',AllMovies.as_view(), name='all_movie_details'),
path('get_show_details/',ShowDetails.as_view(), name='all_movie_details'),
path('movie_details/',MovieDetail.as_view(), name='all_movie_details'),




]
