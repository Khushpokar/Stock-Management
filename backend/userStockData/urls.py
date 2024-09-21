from django.urls import path
from . import views

urlpatterns = [
    path('wishlist/add/', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/delete/', views.delete_from_wishlist, name='delete_from_wishlist'),
    path('BuyStock/add/', views.add_userstock, name='add_to_userStock'),
    path('sellStock/sell/', views.sell_userstock, name='sell_userstock'),
    path('get_investments/', views.get_user_investments, name='get_user_investments'),
    path('get_investments_home/<int:user_id>/', views.get_investments_home, name='get_investments_home'),
]
