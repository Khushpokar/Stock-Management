import React from 'react'
import { Search, User } from 'lucide-react'
import { Button } from "../utils/Button"
import { Input } from "../utils/Input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../utils/Card"
import '../tailwind.css'
const marketIndices = [
  {
    "longName": "Dow Jones Industrial Average",
    "closePrice": "41394.00",
    "raise": "50.00"
  },
  {
    "longName": "S&P 500",
    "closePrice": "4510.32",
    "raise": "15.20"
  },
  {
    "longName": "NASDAQ Composite",
    "closePrice": "14035.65",
    "raise": "28.50"
  },
  {
    "longName": "Russell 2000",
    "closePrice": "1875.23",
    "raise": "10.75"
  },
  {
    "longName": "NYSE Composite",
    "closePrice": "16235.45",
    "raise": "45.30"
  },
  {
    "longName": "FTSE 100",
    "closePrice": "7450.20",
    "raise": "22.15"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b" style={{ backgroundColor: 'antiquewhite' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold">stock.com</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className="text-primary hover:text-primary/80">Explore</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Investments</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Watchlists</a></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="What are you looking for today?" className="pl-8 w-64" />
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Market Indices</h2>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4">
                {marketIndices.map((index, i) => (
                  <Card key={i} className="w-[250px] flex-shrink-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{index.longName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{index.closePrice}</div>
                      <div className="text-sm text-green-500">+{index.raise} (0.12%)</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Investments</h2>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground">Total Returns</div>
                  <div className="text-3xl font-bold text-green-500">+₹5,464</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Value</div>
                  <div className="text-3xl font-bold">₹44,519</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Most Traded Stocks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Apple Inc.', 'Microsoft Corp.', 'Amazon.com Inc.', 'Alphabet Inc.'].map((stock, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{stock}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹1,096.05</div>
                  <div className="text-sm text-green-500">+91.25 (9.08%)</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
