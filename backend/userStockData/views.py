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

@api_view(['POST'])
def get_user_investments(request):
    user_id = request.data.get('user_id')
    
    # Fetch the user
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    # Fetch the user's stock investments
    user_stocks = UserStock.objects.filter(user=user)

    investments = {}

    # Iterate over each stock investment
    for stock in user_stocks:
        # Fetch stock data from the Graph model
        try:
            stock_data = Graph.objects.get(ticker=stock.ticker)
        except Graph.DoesNotExist:
            continue  # Skip if stock ticker not found in Graph

        long_name = stock_data.longName
        ticker = stock.ticker
        current_price = stock_data.closePrice

        # Calculate values
        quantity = stock.shares
        avg_cost = stock.purchase_price
        current_value = current_price * quantity
        p_and_l = (current_price - avg_cost) * quantity
        net_returns = ((current_value - avg_cost * quantity) / (avg_cost * quantity)) * 100

        # Check if the longName already exists in the investments
        if long_name in investments:
            # Update the existing investment
            old_quantity = investments[long_name]["quantity"]
            old_avg_cost = investments[long_name]["avgCost"]
            new_quantity = old_quantity + quantity
            new_avg_cost = (old_avg_cost * old_quantity + avg_cost * quantity) / new_quantity
            new_current_value = current_price * new_quantity
            new_p_and_l = (current_price - new_avg_cost) * new_quantity
            new_net_returns = ((new_current_value - new_avg_cost * new_quantity) / (new_avg_cost * new_quantity)) * 100

            # Update the dictionary with new values
            investments[long_name] = {
                "longName": long_name,
                "ticker": ticker,
                "quantity": new_quantity,
                "avgCost": new_avg_cost,
                "currentPrice": new_current_value,
                "P_L": new_p_and_l,
                "netReturns": new_net_returns
            }
        else:
            # Create a new investment entry
            investments[long_name] = {
                "longName": long_name,
                "ticker": ticker,
                "quantity": quantity,
                "avgCost": avg_cost,
                "currentPrice": current_value,
                "P_L": p_and_l,
                "netReturns": net_returns
            }

    # Return the final response
    return Response({"Investments": list(investments.values())}, status=status.HTTP_200_OK)
