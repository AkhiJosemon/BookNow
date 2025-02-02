# Generated by Django 5.1.3 on 2024-12-01 11:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('movies', '0006_remove_showtime_theater_showtime_theaters'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('theater_name', models.CharField(max_length=100)),
                ('show_date', models.DateField()),
                ('show_time', models.TimeField()),
                ('selected_seats', models.JSONField()),
                ('booking_date', models.DateTimeField(auto_now_add=True)),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('booking_status', models.CharField(choices=[('SUCCESS', 'Success'), ('FAILED', 'Failed')], default='SUCCESS', max_length=10)),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='movies.movie')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
