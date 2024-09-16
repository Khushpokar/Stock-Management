from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'graph', GraphView, basename='reactview')

urlpatterns = [ 
	path('overview/', GraphView.ApiOverview, name="something"), 
	path('add/', GraphView.add_items, name="Create"), 
	path('view/<str:ticker>/', GraphView.view_all_items, name="View"), 
	path('view_all_ticker/', GraphView.get_all_tickers, name="View_all_ticker"), 
	path('update/', GraphView.update_items, name="Update"), 
	path('deleteid/<int:pk>/', GraphView.delete_graph, name="DeleteID"),
	path('delete/', GraphView.delete_items, name="Delete"),
	path('deleteTicker/', GraphView.delete_items_by_ticker, name="DeleteTicker"),
	path('home/', GraphView.get_graph_data, name="home"), 
	path('home/most_traded_stock/', GraphView.most_traded_stock, name="homeMostTradedStock"), 
	path('home/all_stock/', GraphView.all_stock, name="homeAllStock"),
    path('wishlist/user_wishlist/', GraphView.user_wishlist, name='user_wishlist'), 
    path('', include(router.urls)),
]