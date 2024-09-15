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


class GraphSerializer2(serializers.ModelSerializer):
    # Fields we need from the Graph model
    ticker = serializers.CharField()
    longName = serializers.CharField()
    closePrice = serializers.DecimalField(max_digits=10, decimal_places=2)
    raise_value = serializers.SerializerMethodField()

    class Meta:
        model = Graph
        fields = ['id', 'ticker', 'longName', 'closePrice', 'raise_value']  # Added 'id' field

    # Custom method to calculate the raise
    def get_raise_value(self, obj):
        # Fetch the latest two records for the Graph object
        graph_dates = obj.datetime.order_by('-date')[:2]
        
        if len(graph_dates) >= 2:
            # Get the latest and previous dates
            latest_data = graph_dates[0].datetimedata.first()
            previous_data = graph_dates[1].datetimedata.first()
            
            if latest_data and previous_data:
                # Calculate raise (difference between latest close and previous close)
                raise_value = latest_data.close - previous_data.close
                return raise_value
        return 0.00  # Default raise value if no data available