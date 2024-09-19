import React from 'react'
import { Search, User, ArrowUp, ArrowDown } from 'lucide-react'

// Custom Button component
const Button = ({ children, variant, size, ...props }) => (
  <button
    className={`btn ${variant === 'ghost' ? 'bg-transparent' : 'bg-blue-500 text-white'} 
    ${size === 'icon' ? 'p-2' : 'px-4 py-2'}`}
    {...props}
  >
    {children}
  </button>
)

// Custom Input component
const Input = ({ className, ...props }) => (
  <input
    className={`border rounded-md px-4 py-2 ${className}`}
    {...props}
  />
)

// Custom Card components
const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>
)

const CardHeader = ({ children }) => <div className="mb-4">{children}</div>

const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>

const CardContent = ({ children }) => <div>{children}</div>

// Custom Table components
const Table = ({ children }) => <table className="w-full table-auto">{children}</table>

const TableHeader = ({ children }) => <thead>{children}</thead>

const TableBody = ({ children }) => <tbody>{children}</tbody>

const TableRow = ({ children }) => <tr>{children}</tr>

const TableHead = ({ children, className }) => (
  <th className={`px-4 py-2 ${className}`}>{children}</th>
)

const TableCell = ({ children, className }) => (
  <td className={`px-4 py-2 ${className}`}>{children}</td>
)

// Mock data
const mockStocks = [
  { name: 'Tata Steel', shares: 30, avgCost: 147.68, currentPrice: 152.82, returns: 3.48, value: 4584.60 },
  { name: 'Suzlon Energy', shares: 25, avgCost: 89.35, currentPrice: 82.00, returns: 108.39, value: 2050.00 },
  { name: 'Saksoft', shares: 10, avgCost: 336.73, currentPrice: 366.50, returns: 19.49, value: 3665.00 },
  { name: 'RBL Bank', shares: 15, avgCost: 218.66, currentPrice: 216.28, returns: 0.18, value: 3244.20 },
  { name: 'Power Grid Corp', shares: 20, avgCost: 225.50, currentPrice: 233.00, returns: 3.33, value: 4660.00 },
]

export default function InvestmentsPage() {
  const totalValue = mockStocks.reduce((sum, stock) => sum + stock.value, 0)
  const investedValue = mockStocks.reduce((sum, stock) => sum + (stock.avgCost * stock.shares), 0)
  const totalReturns = totalValue - investedValue
  const totalReturnsPercentage = (totalReturns / investedValue) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b" style={{ backgroundColor: 'antiquewhite' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold">stock.com</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className="text-primary hover:text-primary/80">Explore</a></li>
                <li><a href="#" className="text-primary font-semibold">Investments</a></li>
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Holdings (14)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h2 className="text-3xl font-bold">₹{totalValue.toFixed(2)}</h2>
                <p className="text-sm text-muted-foreground">Current Value</p>
              </div>
              <div>
                <p className="text-sm font-medium">Invested Value</p>
                <p className="text-lg">₹{investedValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Returns</p>
                <p className={`text-lg ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{totalReturns.toFixed(2)} ({totalReturnsPercentage.toFixed(2)}%)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">1D Returns</p>
                <p className="text-lg text-red-600">-₹214 (-0.47%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Qty.</TableHead>
                  <TableHead className="text-right">Avg. Cost</TableHead>
                  <TableHead className="text-right">LTP</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">Net Returns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStocks.map((stock) => {
                  const pl = stock.value - (stock.avgCost * stock.shares)
                  const plPercentage = (pl / (stock.avgCost * stock.shares)) * 100
                  return (
                    <TableRow key={stock.name}>
                      <TableCell className="font-medium">{stock.name}</TableCell>
                      <TableCell className="text-right">{stock.shares}</TableCell>
                      <TableCell className="text-right">₹{stock.avgCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{stock.currentPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{stock.value.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{pl.toFixed(2)}</TableCell>
                      <TableCell className={`text-right ${plPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {plPercentage >= 0 ? <ArrowUp className="inline w-4 h-4 mr-1" /> : <ArrowDown className="inline w-4 h-4 mr-1" />}
                        {plPercentage.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
