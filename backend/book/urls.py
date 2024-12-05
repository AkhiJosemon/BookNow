from django.urls import path
from .views import save_payment_details, get_ticket_details,get_user_tickets

urlpatterns = [
    path('save-payment-details/', save_payment_details, name='save-payment-details'),
    path('get-ticket-details/<str:order_id>/', get_ticket_details, name='get-ticket-details'),
     path('user/tickets/', get_user_tickets, name='user-tickets'),
]
