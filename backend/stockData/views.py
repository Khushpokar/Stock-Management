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
                graph = Graph.objects.get(ticker=ticker)
                graph.longName = longName
                graph.status = data_status
                graph.pct_change = pct_change
                graph.rs_change = rs_change
                graph.save()
            except Graph.DoesNotExist:
                return Response({'error': 'Graph does not exist'}, status=status.HTTP_404_NOT_FOUND)

            for col, row in liveData.iterrows():
                date_str = col.strftime('%Y-%m-%d')
                time_str = col.strftime('%H:%M:%S')
                date_time_str = f"{date_str} {time_str}"
                date_time_obj = parse_datetime(date_time_str)
                date = date_time_obj.date()
                graph_date, _ = GraphDate.objects.get_or_create(graph=graph, date=date)
                
                graph_date_data_entries = GraphDateData.objects.filter(datedata=graph_date)
                
                if not graph_date_data_entries.exists():
                    GraphDateData.objects.create(
                        datedata=graph_date,
                        open=row['Open'],
                        high=row['High'],
                        low=row['Low'],
                        close=row['Close'],
                        adj_close=row['Adj Close'],
                        volume=row['Volume']
                    )
                else:
                    # Check this or write pass here...
                    for graph_date_data in graph_date_data_entries:
                        graph_date_data.open = row['Open']
                        graph_date_data.high = row['High']
                        graph_date_data.low = row['Low']
                        graph_date_data.close = row['Close']
                        graph_date_data.adj_close = row['Adj Close']
                        graph_date_data.volume = row['Volume']
                        graph_date_data.save()

            return Response({'status': 'Data updated successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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