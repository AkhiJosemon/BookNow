from django.db import models
from accounts.models import CustomUser
from movies.models import Movie
# Create your models here.

class Booking(models.Model):
    BOOKING_STATUS_CHOICES = [
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="bookings")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="bookings")
    theater_name = models.CharField(max_length=100)  # Instead of linking to a Theater model
    show_date = models.DateField()
    show_time = models.TimeField()
    selected_seats = models.JSONField()  # Store seat numbers as a list of integers
    booking_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    booking_status = models.CharField(
        max_length=10,
        choices=BOOKING_STATUS_CHOICES,
        default='SUCCESS'
    )

    def __str__(self):
        return f"Booking by {self.user.username} for {self.movie.title} on {self.show_date} at {self.show_time}"
    



class Payment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    order_id = models.CharField(max_length=255, unique=True)
    movie_title = models.CharField(max_length=255)
    selected_date = models.DateField()
    selected_time = models.TimeField()
    selected_theater = models.CharField(max_length=255)
    selected_seats = models.TextField()  # Use JSON or comma-separated string
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=50, default='Completed')  # Optional: Pending, Completed, Failed
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_id} - {self.movie_title}"