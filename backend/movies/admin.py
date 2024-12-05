from django.contrib import admin
from .models import Movie , Theater,Showtime,ShowTimeOption

# Register your model
admin.site.register(Movie)
admin.site.register(Theater)
@admin.register(ShowTimeOption)
class ShowTimeOptionAdmin(admin.ModelAdmin):
    list_display = ('time',)

@admin.register(Showtime)
class ShowtimeAdmin(admin.ModelAdmin):
    list_display = ('movie', 'list_theaters', 'show_date_start', 'show_date_end')
    filter_horizontal = ('theaters', 'show_times')  # Enables multi-selection for Many-to-Many fields

    def list_theaters(self, obj):
        """
        Returns a comma-separated list of associated theaters.
        """
        return ", ".join([theater.name for theater in obj.theaters.all()])

    list_theaters.short_description = 'Theaters'  # Optional: Customize column header in admin