from datetime import datetime
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True, blank=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    dob = models.DateField(blank=True, null=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)

    def _str_(self):
        return f"User ID: {self.id} (username: {self.username})"

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=4)
    expiry = models.DateTimeField()

    def is_expired(self):
        return datetime.now() > self.expiry

