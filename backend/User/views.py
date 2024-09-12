import hashlib
import json
from django.http import JsonResponse
from django.shortcuts import render ,HttpResponse
import jwt
from .models import User, OTP
from django.conf import settings
import random
from django.core.mail import send_mail
from datetime import datetime, timedelta
import  pytz




def Home(request):
    return HttpResponse("Home Page")

def generate_otp():
    return str(random.randint(1000, 9999))


def generate_jwt(user):
    utc_now = datetime.now(pytz.utc) 
    payload = {
        'id': user.id,
        'username': user.username,
        'exp': utc_now + timedelta(hours=24),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        # password_confirmation = data.get('c_password')
        # if password != password_confirmation:    
        #     return JsonResponse({"error": "Passwords do not match."},status=400)
        
        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Email or username is already registered."}, status=409)

        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()  # to encode the password 
        
        user = User(
            username=username,
            email=email,
            password=hashed_password,
            firstname=data.get('firstname'),
            lastname=data.get('lastname'),
        )
        user.save()
                # Generate and send OTP
        otp_code = generate_otp()

        # Save OTP in the database
        otp_expiry = datetime.now() + timedelta(minutes=5)  # OTP valid for 5 minutes
        OTP.objects.create(user=user, otp_code=otp_code, expiry=otp_expiry)

        # Send OTP to the user's email
        subject = 'Welcome to My App'
        message = f'Thank you for signing up for our app! Your Verification code is {otp_code} '

        from_email = settings.EMAIL_HOST_USER
        

        try:
            send_mail(subject, message, from_email, [email])
        except Exception as e:
            return JsonResponse({"error": "Failed to send OTP. Please try again later."}, status=500)
        
        return JsonResponse({"message": "User created successfully","userid":user.id}, status=201)

    return JsonResponse({'message':"Can't Register!"},status=405)

def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('emailOrUsername')
        password = data.get('passwords')
        if not username :
            return JsonResponse({"error": "Username or email is required."}, status=400)

        if not password:
            return JsonResponse({"error": "Password is required."}, status=400)

        # Hash the provided password
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

        # Check if user exists with either username or email
        user = None
        if username:
            user = User.objects.filter(username=username, password=hashed_password).first()
        elif  not user:
            user = User.objects.filter(email=username, password=hashed_password).first()

        if user:
            if not user.is_verified:
                otp_code = generate_otp()

        # Save OTP in the database
                otp_expiry = datetime.now() + timedelta(minutes=5)  # OTP valid for 5 minutes
                OTP.objects.create(user=user, otp_code=otp_code, expiry=otp_expiry)

                # Send OTP to the user's email
                subject = 'Welcome to My App'
                message = f'Thank you for signing up for our app! Your Verification code is {otp_code} '

                from_email = settings.EMAIL_HOST_USER
        

                try:
                    send_mail(subject, message, from_email, [user.email])
                except Exception as e:
                    return JsonResponse({"error": "Failed to send OTP. Please try again later."}, status=500)
                return JsonResponse({"message": "User is not verified","userid":user.id}, status=201)
            token=generate_jwt(user)
            return JsonResponse({"message": "User authenticated successfully.","token":token,"userid":user.id}, status=200)
        else:
            return JsonResponse({"error": "Invalid username/email or password."}, status=401)
    return JsonResponse({"error": "Invalid request method."}, status=405)

def verify_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_otp = data.get("otp")
        user_id = data.get("user_id")
        if not user_otp:
            return JsonResponse({"error":"Otp is required."}, status=400)
        
        dataOpt = OTP.objects.get(user=user_id)
        if dataOpt.otp_code == user_otp:
            userdata = User.objects.get(id=user_id)
            userdata.is_verified = True
            token=generate_jwt(userdata)
            userdata.save()
            dataOpt.delete()                
            return JsonResponse({"message": "User authenticated successfully.","token":token}, status=200)
        return JsonResponse({"error":"Invaild Otp."}, status=401)
    
    