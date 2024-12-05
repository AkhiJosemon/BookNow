from rest_framework import serializers
from . models import Movie,Showtime,Theater


class TheaterSerializer(serializers.ModelSerializer):
    capacity = serializers.IntegerField()

    class Meta:
        model = Theater
        fields = ['name', 'capacity']  # Include name and capacity of theater


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id' , 'title' , 'poster' , 'cast' , 'director', 'description' ,'category','language','created_at','updated_at')
        read_only_fields = ['created_at','updated_at']



class ShowtimeSerializer(serializers.ModelSerializer):
    theaters = TheaterSerializer(many=True) # Include theater names
    show_times = serializers.StringRelatedField(many=True)  # Include show times
    

    class Meta:
        model = Showtime
        fields = '__all__'

