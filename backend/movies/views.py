from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Showtime
from rest_framework.response import Response
from .models import Movie
from .serializers import MovieSerializer
from .serializers import ShowtimeSerializer


class AllMovies(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return JsonResponse({
            'status': 'success',
            'movies': serializer.data
        }, status=200)

class ShowDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        movie_id = request.query_params.get('movieId')  # Retrieve movieId from query params

        if not movie_id:
            return Response({"error": "movieId is required"}, status=400)

        # Fetch showtimes for the specified movieId
        showtimes = Showtime.objects.filter(movie_id=movie_id)

        if not showtimes.exists():
            return Response({"error": "No showtimes found for this movie"}, status=404)

        # Serialize and return the showtimes
        serializer = ShowtimeSerializer(showtimes, many=True)
        return Response(serializer.data, status=200)
    

class MovieDetail(APIView):

        permisssion_classes=[IsAuthenticated]

        def get(self,request):
            movie_id = request.query_params.get('movieId') 

            if not movie_id:
                return Response({"error": "movieId is required"}, status=400)
            
            movie= Movie.objects.get(pk=movie_id)
            
            serializer = MovieSerializer(movie)
            return Response(serializer.data , status = 200)