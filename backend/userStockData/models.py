from django.db import models
from User.models import User

class UserStock(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ticker = models.CharField(max_length=50,default="^NSC")  # Stock ticker instead of ForeignKey
    purchase_date = models.DateField(auto_now_add=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    shares = models.IntegerField(default=1)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sell_date = models.DateField(null=True, blank=True)
    profit_booked = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_sell = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.ticker} - Shares: {self.shares}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Reference to the user
    ticker = models.CharField(max_length=50,default="^NSC")  # Stock ticker instead of ForeignKey

    added_at = models.DateTimeField(auto_now_add=True)  # When the stock was added to the wishlist

    def __str__(self):
        return f"{self.user.username} - {self.ticker} (Wishlist)"