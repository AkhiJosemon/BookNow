from django.shortcuts import render
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import Payment
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
import json
from django.views.decorators.csrf import csrf_exempt


# Save Payment Details
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Allow any user to access the endpoint
def save_payment_details(request):
    try:
        data = json.loads(request.body)  # Parse the incoming JSON data
        user=request.user
        # Create a new Payment record
        payment = Payment.objects.create(
            user=user,
            order_id=data.get('orderID'),
            movie_title=data.get('movieTitle'),
            selected_date=data.get('selectedDate'),
            selected_time=data.get('selectedTime'),
            selected_theater=data.get('selectedTheater'),
            selected_seats=json.dumps(data.get('selectedSeats')),  # Store seats as a JSON string
            total_price=data.get('totalPrice'),
        )

        return Response({"message": "Payment details saved successfully", "order_id": payment.order_id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error saving payment details: {str(e)}")
        return Response({"error": "Unable to save payment details"}, status=status.HTTP_400_BAD_REQUEST)


# Get Ticket Details
@api_view(['GET'])
@permission_classes([AllowAny])  # This allows anyone to access this API endpoint
def get_ticket_details(request, order_id):
    try:
        payment = Payment.objects.get(order_id=order_id)
        ticket_data = {
            "movieTitle": payment.movie_title,
            "selectedDate": payment.selected_date,
            "selectedTime": payment.selected_time,
            "selectedTheater": payment.selected_theater,
            "selectedSeats": payment.selected_seats,  # JSON string or list
            "totalPrice": payment.total_price,
            "orderID": payment.order_id,
            "createdAt": payment.created_at,
        }
        return Response(ticket_data, status=status.HTTP_200_OK)
    except Payment.DoesNotExist:
        return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def get_user_tickets(request):
    try:
        # Fetch all tickets for the currently logged-in user
        user_tickets = Payment.objects.filter(user=request.user)

        # Prepare a list of ticket details to send as a response
        tickets = []
        for ticket in user_tickets:
            tickets.append({
                "movieTitle": ticket.movie_title,
                "selectedDate": ticket.selected_date,
                "selectedTime": ticket.selected_time,
                "selectedTheater": ticket.selected_theater,
                "selectedSeats": ticket.selected_seats,
                "totalPrice": ticket.total_price,
                "orderID": ticket.order_id,
                "createdAt": ticket.created_at,
            })
        print(tickets)
        # Return the tickets list
        return Response(tickets, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)