from rest_framework import serializers 
from . models import *

class GraphDateDataSerializer(serializers.ModelSerializer):
	class Meta:
		model = GraphDateData
		fields =  ['open', 'high', 'low', 'close', 'adj_close', 'volume'] 

class GraphDateSerializer(serializers.ModelSerializer):
	datetimedata = GraphDateDataSerializer(many=True) 
	class Meta:
		model = GraphDate
		fields = ['date', 'datetimedata']

class GraphSerializer(serializers.ModelSerializer): 
	datetime = GraphDateSerializer(many=True) 

	class Meta: 
		model = Graph 
		fields = ['ticker', 'longName', 'status', 'shortName', 'closePrice', 'priceToBook', 'fiftyTwoWeekLow', 'fiftyTwoWeekHigh' , 'pct_change' , 'rs_change' ,'datetime']