from django.shortcuts import render 
from . models import *
from rest_framework.response import Response 
from . serializer import *
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
import yfinance as yf
import datetime as datetime
from User.models import User
from userStockData.models import Wishlist
import time

class GraphView(viewsets.ModelViewSet):

    queryset = Graph.objects.all()
    serializer_class = GraphSerializer 

    @api_view(['GET'])
    def ApiOverview(request):
        api_urls = {
            'all_items': '/stockGraph/overview',
            'Add_items': '/stockGraph/add',
            'view_items':'/stockGraph/view',
            # 'update_items_by_ticker': '/stock/update',
            # 'delete_items_by_ticker': '/stock/delete',
        }
        return Response(api_urls)
    
    @api_view(['GET'])
    def view_all_items(request, ticker):
        try:
            graph = Graph.objects.get(ticker=ticker)
            serializer = GraphSerializer(graph) 
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Graph.DoesNotExist:
            return Response({'error': f'Graph with ticker {ticker} does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @api_view(['DELETE'])
    def delete_graph(request, pk):
        try:
            graph = Graph.objects.get(pk=pk)
            graph.delete()
            return Response({'status': 'Graph deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Graph.DoesNotExist:
            return Response({'error': 'Graph not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @api_view(['POST'])
    def add_items(request):
        try:
            ticker = request.data.get('ticker')
            if not ticker:
                return Response({'error': 'Ticker is required'}, status=status.HTTP_400_BAD_REQUEST)

            stock = yf.Ticker(ticker)
            info = stock.info
            ticker = info['symbol']
            longName = info.get('longName')
            liveData = None
            data_status = request.data.get('status')
            priceTobook = 0.00

            if data_status == '':
                return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)
            elif data_status == '1d':
                liveData = yf.download(ticker, period="1d", interval='5m')
            else:
                liveData = yf.download(ticker, period=data_status)

            if liveData.empty:
                return Response({'error': f'No data found for ticker: {ticker}'}, status=status.HTTP_400_BAD_REQUEST)
            
            data = liveData['Close']
            returnDay = data.pct_change().dropna()
            pct_change = returnDay.sum()
            rs_change = pct_change*data.iloc[0]

            try:
                priceTobook=round(info['priceToBook'],2)
            except :
                pass

            graph, created = Graph.objects.get_or_create(
                ticker=ticker,
                longName=longName,
                status=data_status,
                shortName = info["shortName"],
                closePrice = round(liveData['Close'].iloc[-1]),
                priceToBook = priceTobook,
                fiftyTwoWeekLow =round( info['fiftyTwoWeekLow']),
                fiftyTwoWeekHigh =round(info['fiftyTwoWeekHigh']),
                pct_change=pct_change,
                rs_change=rs_change
            )

            for col, row in liveData.iterrows():
                date_str = col.strftime('%Y-%m-%d')
                time_str = col.strftime('%H:%M:%S')
                date_time_str = f"{date_str} {time_str}"
                date_time_obj = parse_datetime(date_time_str)
                date = date_time_obj.date()
                graph_date, date_created = GraphDate.objects.get_or_create(
                    graph=graph,
                    date=date
                )

                GraphDateData.objects.create(
                    datedata=graph_date,
                    open=row['Open'],
                    high=row['High'],
                    low=row['Low'],
                    close=row['Close'],
                    adj_close=row['Adj Close'],
                    volume=row['Volume']
                )

            return Response({'status': 'Data added successfully'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @api_view(['POST'])
    def update_items(request):
        u=Update_data()
        if u.DataBase():
            return Response({'status': 'Data added successfully'}, status=status.HTTP_201_CREATED)
    
    @api_view(['POST'])
    def delete_items(request):
        try:
            ticker = request.data.get('ticker')
            date_str = request.data.get('date')
            if not ticker or not date_str:
                return Response({'error': 'Ticker and date are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
            stock = yf.Ticker(ticker)
            info = stock.info
            ticker = info['symbol']
            
            try:
                graph = Graph.objects.get(ticker=ticker)
                graph_date = GraphDate.objects.get(graph=graph, date=date)

                graph_date_data_entries = GraphDateData.objects.filter(datedata=graph_date)
                
                if graph_date_data_entries.exists():
                    graph_date_data_entries.delete()

                graph_date.delete()

                if not GraphDate.objects.filter(graph=graph).exists():
                    graph.delete()

                return Response({'status': 'Data deleted successfully'}, status=status.HTTP_200_OK)
            
            except Graph.DoesNotExist:
                return Response({'error': 'Graph does not exist'}, status=status.HTTP_404_NOT_FOUND)
            except GraphDate.DoesNotExist:
                return Response({'error': f'Date {date} does not exist for ticker: {ticker}'}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @api_view(['POST'])
    def delete_items_by_ticker(request):
        try:
            ticker = request.data.get('ticker')
            
            if not ticker:
                return Response({'error': 'Ticker is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate ticker using yfinance
            stock = yf.Ticker(ticker)
            info = stock.info
            ticker = info['symbol']
            
            try:
                # Find the Graph instance by ticker
                graph = Graph.objects.get(ticker=ticker)
                
                # Delete all related GraphDateData and GraphDate instances
                for graph_date in graph.datetime.all():
                    graph_date.datetimedata.all().delete()
                graph.datetime.all().delete()
                
                # Delete the Graph instance itself
                graph.delete()

                return Response({'status': 'Data deleted successfully'}, status=status.HTTP_200_OK)
            
            except Graph.DoesNotExist:
                return Response({'error': f'Graph with ticker {ticker} does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @api_view(['GET'])  
    def get_all_tickers(request):
        try:
            tickers = Graph.objects.values_list('ticker', flat=True).distinct()
            return Response({'tickers': list(tickers)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @api_view(['GET'])
    def get_graph_data(request):
        graphs = Graph.objects.all()[:6]
        serializer = GraphSerializer2(graphs, many=True)
        return Response({'tickers': serializer.data}, status=status.HTTP_200_OK)
    

    @api_view(['GET'])
    def most_traded_stock(request):
        graphs = Graph.objects.all()[6:10]
        serializer = GraphSerializer2(graphs, many=True)
        return Response({'tickers': serializer.data}, status=status.HTTP_200_OK)
    
    @api_view(['GET'])
    def all_stock(request):
        graphs = Graph.objects.all()
        serializer = GraphSerializer2(graphs, many=True)
        return Response({'tickers': serializer.data}, status=status.HTTP_200_OK)
    

    @api_view(['POST'])
    def user_wishlist(request):
        try:
            user_id = request.data.get('user_id')
            print(user_id)
            # Get the user object
            user = User.objects.get(id=user_id)

            # Filter Wishlist entries for the user
            wishlist = Wishlist.objects.filter(user=user)

            tickers = wishlist.values_list('ticker', flat=True)
            graphs = Graph.objects.filter(ticker__in=tickers)
            serializer = GraphSerializer2(graphs, many=True)
            return Response({'tickers': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'User not found'}, status=404)


    
class Update_data():
    def __init__(self) -> None:
        # self.DataBase()
        pass

    def fetch_all_tickers(self):
        try:
            return Graph.objects.values_list('ticker', flat=True).distinct()
        except Exception as e:
            raise Exception(f"Error fetching tickers: {str(e)}")

    def DataBase(self):
        tickers =list( self.fetch_all_tickers())  # Reference the method using 'self'
        for ticker in tickers:
            if self.Delete(ticker=ticker):
                self.add(ticker=ticker)
            else:
                pass
        return True    
    def Delete(self,ticker):
        stock = yf.Ticker(ticker)
        info = stock.info
        ticker = info['symbol']
        
        try:
            # Find the Graph instance by ticker
            graph = Graph.objects.get(ticker=ticker)
            
            # Delete all related GraphDateData and GraphDate instances
            for graph_date in graph.datetime.all():
                graph_date.datetimedata.all().delete()
            graph.datetime.all().delete()
            
            # Delete the Graph instance itself
            graph.delete()
            return True
        except:
            return False
    def add(self,ticker):
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            ticker = info['symbol']
            longName = info.get('longName')
            liveData = None
            data_status = "1mo"
            priceTobook = 0.00
            liveData = yf.download(ticker, period=data_status)

            if liveData.empty:
                return False
            
            data = liveData['Close']
            returnDay = data.pct_change().dropna()
            pct_change = returnDay.sum()
            rs_change = pct_change*data.iloc[0]

            try:
                priceTobook=round(info['priceToBook'],2)
            except :
                pass

            graph, created = Graph.objects.get_or_create(
                ticker=ticker,
                longName=longName,
                status=data_status,
                shortName = info["shortName"],
                closePrice = round(liveData['Close'].iloc[-1]),
                priceToBook = priceTobook,
                fiftyTwoWeekLow =round( info['fiftyTwoWeekLow']),
                fiftyTwoWeekHigh =round(info['fiftyTwoWeekHigh']),
                pct_change=pct_change,
                rs_change=rs_change
            )

            for col, row in liveData.iterrows():
                date_str = col.strftime('%Y-%m-%d')
                time_str = col.strftime('%H:%M:%S')
                date_time_str = f"{date_str} {time_str}"
                date_time_obj = parse_datetime(date_time_str)
                date = date_time_obj.date()
                graph_date, date_created = GraphDate.objects.get_or_create(
                    graph=graph,
                    date=date
                )

                GraphDateData.objects.create(
                    datedata=graph_date,
                    open=row['Open'],
                    high=row['High'],
                    low=row['Low'],
                    close=row['Close'],
                    adj_close=row['Adj Close'],
                    volume=row['Volume']
                )

            return True

        except Exception as e:
            return False          