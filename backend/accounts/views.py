from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . models import *
from .serializers import UserRegistrationSerializer,CustomUserSerializer,UserUpdateSerializer
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib.auth import authenticate  # Ensure this import is included
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND

from rest_framework import status

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        print(request.data)  # Debugging request payload
        if serializer.is_valid():
            user = serializer.save()
            print("User created:", user)  # Debugging created user
            return Response({'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)
        print("Errors:", serializer.errors)  # Debugging errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginUserView(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        # Extract email and password from the request
        email = request.data.get('email')
        password = request.data.get('password')   
        print(email,password)
        user=CustomUser.objects.get(email=email)


        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user
        user = authenticate(request, email=user.email ,password=password)
        print(user)
        if user is not None:
            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "Login successful",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED
            )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_token(request):
    # Correct header name: 'Authorization'
    auth_header = request.headers.get('Authorization', None)

    # Check if the Authorization header is present and starts with 'Bearer '
    if auth_header is None or not auth_header.startswith('Bearer '):
        return Response({'detail': 'Token not provided or invalid format'}, status=status.HTTP_401_UNAUTHORIZED)

    # Split the token correctly
    token = auth_header.split(' ')[1]

    try:
        # Verify the token using AccessToken
        AccessToken(token)
        return Response({'detail': 'Token is valid'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Return any exception message as a response
        return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    

class UserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user =request.user
        
        if user.is_authenticated:
            try:
                # Get user details
                user_details = CustomUser.objects.get(id=user.id)  # Adjust field if needed

                # Serialize user details
                serializer = CustomUserSerializer(user_details)

                # Return serialized data
                print("user details is :" ,serializer.data)

                return Response(serializer.data, status=HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({"error": "User details not found."}, status=HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "User not authenticated."}, status=HTTP_404_NOT_FOUND)
        


class UpdateUser(APIView):
    permission_classes=[IsAuthenticated]

    def put(self,request):
   
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User updated successfully!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)