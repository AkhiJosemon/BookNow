from django.db import models

# Movie model with category and language as choices fields
class Movie(models.Model):
    ACTION = 'AC'
    THRILLER = 'TH'
    DRAMA = 'DR'
    COMEDY = 'CO'
    ROMANCE = 'RO'

    CATEGORY_CHOICES = [
        (ACTION, 'Action'),
        (THRILLER, 'Thriller'),
        (DRAMA, 'Drama'),
        (COMEDY, 'Comedy'),
        (ROMANCE, 'Romance'),
    ]
    
    MALAYALAM = 'MALAYALAM'
    ENGLISH = 'ENGLISH'
    HINDI = 'HINDI'
    TAMIL = 'TAMIL'

    LANGUAGE_CHOICES = [
        (MALAYALAM, 'Malayalam'),
        (ENGLISH, 'English'),
        (HINDI, 'Hindi'),
        (TAMIL, 'Tamil'),
    ]

    title = models.CharField(max_length=255, unique=True)
    poster = models.ImageField(upload_to='posters/', null=True, blank=True)
    cast = models.TextField(help_text="Enter cast names separated by commas")
    director = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Category and language as CharFields with choices
    category = models.CharField(
        max_length=2,  # Length should be the same as the length of the choice code
        choices=CATEGORY_CHOICES,
        null=True,
        blank=True,
    )
    
    language = models.CharField(
        max_length=10,  # Length should be the same as the length of the choice code
        choices=LANGUAGE_CHOICES,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title



class Theater(models.Model):
    name = models.CharField(max_length=255)  # Theater name
    location = models.CharField(max_length=255, blank=True, null=True)  # Location of the theater
    capacity = models.PositiveIntegerField(blank=True, null=True)  # Seating capacity
    contact_number = models.CharField(max_length=15, blank=True, null=True)  # Contact number
    email = models.EmailField(blank=True, null=True)  # Email for communication
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set at creation
    updated_at = models.DateTimeField(auto_now=True)  # Automatically updated on modification

    def __str__(self):
        return self.name
    


SHOWTIME_CHOICES = [
    ('10:00 AM', '10:00 AM'),
    ('11:00 AM', '11:00 AM'),
    ('2:00 PM', '2:00 PM'),
    ('3:00 PM', '3:00 PM'),
    ('6:00 PM', '6:00 PM'),
    ('9:00 PM', '9:00 PM'),
]

class ShowTimeOption(models.Model):
    time = models.CharField(max_length=10, choices=SHOWTIME_CHOICES, unique=True)

    def __str__(self):
        return self.time



class Showtime(models.Model):
    movie = models.ForeignKey('Movie', on_delete=models.CASCADE)  # Link to the Movie model
    theaters = models.ManyToManyField('Theater')  # Many-to-Many relation with Theater
    show_times = models.ManyToManyField('ShowTimeOption')  # Many-to-Many relation with ShowTimeOption
    show_date_start = models.DateField()
    show_date_end = models.DateField()

    def __str__(self):
        theater_names = ", ".join([theater.name for theater in self.theaters.all()])
        return f"{self.movie.title} at {theater_names}" if theater_names else self.movie.title
