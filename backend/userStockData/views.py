from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from stockData.models import Graph
from .models import UserStock, Wishlist, User
from .serializers import WishlistSerializer , UserStockSerializer ,UserStockSerializer2

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
    ticker = request.data.get('ticker')
    
    # Fetch the user
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    # Fetch the stock data from Graph model using ticker
    try:
        stock = Graph.objects.get(ticker=ticker)
    except Graph.DoesNotExist:
        return Response({"error": "Stock with ticker not found."}, status=status.HTTP_404_NOT_FOUND)

   
    data = {
        'user': user.id,
        'ticker': ticker,
        'purchase_price': stock.closePrice,
        'shares': request.data.get('shares')
    }
    serializer = UserStockSerializer2(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User stock added successfully."}, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
        return Response({"error":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
