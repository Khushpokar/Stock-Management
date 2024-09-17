from django.contrib import admin
from .models import UserStock,Wishlist ,Transaction

admin.site.register(UserStock)
admin.site.register(Wishlist)
admin.site.register(Transaction)

# Register your models here.
