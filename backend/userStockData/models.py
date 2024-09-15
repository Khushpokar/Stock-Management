from django.db import models
from User.models import User
from stockData.models import Graph

class UserStock(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Graph, on_delete=models.CASCADE)
    purchase_date = models.DateField(auto_now_add=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    shares = models.IntegerField()
    sell_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sell_date = models.DateField(null=True, blank=True)
    profit_booked = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_sell = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.stock.ticker} - Shares: {self.shares}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Reference to the user
    stock = models.ForeignKey(Graph, on_delete=models.CASCADE)  # Reference to the stock (Graph)

    added_at = models.DateTimeField(auto_now_add=True)  # When the stock was added to the wishlist

    def __str__(self):
        return f"{self.user.username} - {self.stock.ticker} (Wishlist)"