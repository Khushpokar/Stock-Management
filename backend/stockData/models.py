from django.db import models 
  
# Create your models here. 

class Graph(models.Model): 
    ticker = models.CharField(max_length=30) 
    longName = models.CharField(max_length=500)
    status = models.CharField(max_length=10, default='')
    shortName = models.CharField(max_length=500)
    closePrice = models.DecimalField(max_digits=10, decimal_places=2)
    priceToBook = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    fiftyTwoWeekLow = models.DecimalField(max_digits=10, decimal_places=2)
    fiftyTwoWeekHigh = models.DecimalField(max_digits=10, decimal_places=2)
    pct_change = models.DecimalField(max_digits=10, decimal_places=4)
    rs_change = models.DecimalField(max_digits=10, decimal_places=2)
    
    def _str_(self):
        return self.ticker

class GraphDate(models.Model):
    graph = models.ForeignKey(Graph, related_name='datetime', on_delete=models.CASCADE)
    date = models.DateField()

    def _str_(self):
        return f"{self.graph.ticker} - {self.date}"

class GraphDateData(models.Model):
    datedata = models.ForeignKey(GraphDate, related_name='datetimedata', on_delete=models.CASCADE)
    open = models.DecimalField(max_digits=10, decimal_places=2)
    high = models.DecimalField(max_digits=10, decimal_places=2)
    low = models.DecimalField(max_digits=10, decimal_places=2)
    close = models.DecimalField(max_digits=10, decimal_places=2)
    adj_close = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.BigIntegerField()
    

    def _str_(self):
        return f"Data on {self.datedata.date} - Open: {self.open}, Close: {self.close}"