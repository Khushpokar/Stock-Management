from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Wishlist, User, Graph
from .serializers import WishlistSerializer , UserStockSerializer

@api_view(['POST'])
def add_to_wishlist(request):
  
    user_id = request.data.get('user_id')
    stock_id = request.data.get('stock_id')
    
    # Check if user and stock exist
    try:
        user = User.objects.get(id=user_id)
        stock = Graph.objects.get(id=stock_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Graph.DoesNotExist:
        return Response({"error": "Stock not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Add the stock to the wishlist
    wishlist_item, created = Wishlist.objects.get_or_create(user=user, stock=stock)
    
    if not created:
        return Response({"message": "This stock is already in the wishlist."}, status=status.HTTP_400_BAD_REQUEST)
    
    # serializer = WishlistSerializer(wishlist_item)
    return Response({"message": "This stock is added in the wishlist."}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def delete_from_wishlist(request):

    user_id = request.data.get('user_id')
    stock_id = request.data.get('stock_id')
    
    # Check if user and stock exist
    try:
        user = User.objects.get(id=user_id)
        stock = Graph.objects.get(id=stock_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Graph.DoesNotExist:
        return Response({"error": "Stock not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the wishlist entry exists
    try:
        wishlist_item = Wishlist.objects.get(user=user, stock=stock)
        wishlist_item.delete()
        return Response({"message": "Stock removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
    except Wishlist.DoesNotExist:
        return Response({"error": "This stock is not in the user's wishlist."}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['POST'])
def add_userstock(request):
    user_id = request.data.get('user_id')
    stock_id = request.data.get('stock_id')
    
    # Fetch the user and stock
    try:
        user = User.objects.get(id=user_id)
        stock = Graph.objects.get(id=stock_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Graph.DoesNotExist:
        return Response({"error": "Stock not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Populate the UserStock data
    serializer = UserStockSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User stock added successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)