from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Wishlist, User
from .serializers import WishlistSerializer , UserStockSerializer

@api_view(['POST'])
def add_to_wishlist(request):
    user_id = request.data.get('user_id')
    ticker = request.data.get('ticker')  # Get the ticker from the request

    # Check if user exists
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    # Add the stock to the wishlist using the ticker
    wishlist_item, created = Wishlist.objects.get_or_create(user=user, ticker=ticker)
    
    if not created:
        return Response({"message": "This stock is already in the wishlist."}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "This stock has been added to the wishlist."}, status=status.HTTP_201_CREATED)



@api_view(['DELETE'])
def delete_from_wishlist(request):

    user_id = request.data.get('user_id')
    ticker = request.data.get('ticker')
    
    # Check if user and stock exist
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    try:
        wishlist_item = Wishlist.objects.get(user=user, ticker=ticker)
        wishlist_item.delete()
        return Response({"message": "Stock removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
    except Wishlist.DoesNotExist:
        return Response({"error": "This stock is not in the user's wishlist."}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['POST'])
def add_userstock(request):
    user_id = request.data.get('user_id')
    ticker = request.data.get('ticker')  # Get the ticker instead of stock_id
    
    # Fetch the user (no need to fetch stock from Graph model)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    # Populate the UserStock data with user and ticker
    data = {
        'user': user.id,
        'ticker': ticker,
        'purchase_price': request.data.get('purchase_price'),
        'shares': request.data.get('shares'),
        'sell_price': request.data.get('sell_price'),
        'sell_date': request.data.get('sell_date'),
        'profit_booked': request.data.get('profit_booked'),
        'is_sell': request.data.get('is_sell')
    }

    serializer = UserStockSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User stock added successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

