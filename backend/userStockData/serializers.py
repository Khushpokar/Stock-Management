from rest_framework import serializers
from .models import Wishlist ,UserStock

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['user', 'stock', 'added_at']
        read_only_fields = ['added_at']  # Prevent users from manually setting this field

class UserStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStock
        fields = ['user', 'stock', 'purchase_price', 'shares', 'sell_price', 'sell_date', 'profit_booked', 'is_sell']