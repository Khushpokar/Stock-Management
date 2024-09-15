from django.urls import path
from . import views

urlpatterns = [
    path('wishlist/add/', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/delete/', views.delete_from_wishlist, name='delete_from_wishlist'),
    path('userStock/add/', views.add_userstock, name='add_to_userStock'),
]
