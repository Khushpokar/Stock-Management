from django.utils import timezone
from django.shortcuts import get_object_or_404
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
def sell_userstock(request):
    try:
        user_id = request.data.get('user_id')
        ticker = request.data.get('ticker')
        
        if not user_id or not ticker:
            return Response({"error": "user_id and ticker are required fields."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Fetch the UserStock object for the given user and ticker
        user_stock = get_object_or_404(UserStock, user_id=user_id, ticker=ticker, is_sell=False)
        
        # Step 2: Fetch the latest stock price from the Graph model for the given ticker
        graph = get_object_or_404(Graph, ticker=ticker)
        sell_price = graph.closePrice

        # Step 3: Calculate the profit/loss booked
        profit_booked = (sell_price - user_stock.purchase_price) * user_stock.shares

        # Step 4: Update the UserStock instance with sell details
        user_stock.sell_price = sell_price
        user_stock.sell_date = timezone.now().date()
        user_stock.profit_booked = profit_booked
        user_stock.is_sell = True

        # Step 5: Save the updated UserStock instance
        user_stock.save()

        # Step 6: Return a success response with updated details
        response_data = {
            "message": "Stock sold successfully.",
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as error:
        return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_user_investments(request):
    user_id = request.data.get('user_id')
    
    # Fetch the user
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    # Fetch the user's stock investments
    user_stocks = UserStock.objects.filter(user=user,is_sell=False)

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


@api_view(['GET'])
def get_investments_home(request, user_id):
    # Step 1: Fetch the unsold UserStock records for the user
    user_stocks = UserStock.objects.filter(user_id=user_id, is_sell=False)

    if not user_stocks.exists():
        return Response({"message": "No unsold stocks found for this user."}, status=status.HTTP_404_NOT_FOUND)

    total_current_value = 0
    total_profit = 0

    # Step 2: Loop through each unsold stock and calculate current value and profit
    for stock in user_stocks:
        # Fetch the latest stock price from the Graph model
        graph = get_object_or_404(Graph, ticker=stock.ticker)
        current_price = graph.closePrice
        
        # Calculate current value and profit
        current_value = current_price * stock.shares
        profit = (current_price - stock.purchase_price) * stock.shares

        # Accumulate the total current value and total profit
        total_current_value += current_value
        total_profit += profit

        # Add the stock's current value and profit to the response
        

    # Step 3: Return the JSON response with stock details, total current value, and total profit
    response_data = {
        "user_id": user_id,
        "current": total_current_value,
        "profit": total_profit
    }

    return Response(response_data, status=status.HTTP_200_OK)

