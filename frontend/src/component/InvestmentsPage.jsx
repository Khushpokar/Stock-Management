import React, { useEffect, useState } from 'react';
import { Search, User, ArrowUp, ArrowDown } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Custom Button component
const Button = ({ children, variant, size, ...props }) => (
  <button
    className={`btn ${variant === 'ghost' ? 'bg-transparent' : 'bg-blue-500 text-white'} 
    ${size === 'icon' ? 'p-2' : 'px-4 py-2'}`}
    {...props}
  >
    {children}
  </button>
);

const logout = ()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('userName')
}

// Custom Input component
const Input = ({ className, ...props }) => (
  <input
    className={`border rounded-md px-4 py-2 ${className}`}
    {...props}
  />
);

// Custom Card components
const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;

const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;

const CardContent = ({ children }) => <div>{children}</div>;

// Custom Table components
const Table = ({ children }) => <table className="w-full table-auto">{children}</table>;

const TableHeader = ({ children }) => <thead>{children}</thead>;

const TableBody = ({ children }) => <tbody>{children}</tbody>;

const TableRow = ({ children }) => <tr>{children}</tr>;

const TableHead = ({ children, className }) => (
  <th className={`px-4 py-2 ${className}`}>{children}</th>
);

const TableCell = ({ children, className }) => (
  <td className={`px-4 py-2 ${className}`}>{children}</td>
);

const get_investments = async () => {
  const req = {
    user_id: localStorage.getItem("user_id"),
  };
  try {
    const response = await axios.post('http://127.0.0.1:8000/userStock/get_investments/', req);
    return response.data.Investments;
  } catch (error) {
    console.error('Error fetching investments data:', error);
    return [];
  }
};

const sellStock = async (ticker) => {
  try {
    console.log("heyy");
    const req={
      "user_id": localStorage.getItem("user_id"),
      "ticker": ticker
    }
    console.log(req);
    const response = await axios.post('http://127.0.0.1:8000/userStock/sellStock/sell/',req);
    console.log(response.data); // Adjust the return to match your API structure
    location.reload()
  } catch (error) {
    console.error('Error fetching homepage data:', error);
  }
};

export default function InvestmentsPage() {
  const navigate = useNavigate();
  const [mockStocks, setMockStocks] = useState([]);
  const [userName,setUserName] = useState();

  const totalValue = mockStocks.reduce((sum, stock) => sum + stock.currentPrice, 0);
  const investedValue = mockStocks.reduce((sum, stock) => sum + (stock.avgCost * stock.quantity), 0);
  const totalReturns = totalValue - investedValue;
  const totalReturnsPercentage = (totalReturns / investedValue) * 100;

  const handleLogoutClick = () => {
    logout()
    navigate(`/`); // Navigate to the graph page with the selected ticker
  };

  const handleStockClick = (ticker) => {
    navigate(`/graph/${ticker}`);
  };

  const handleSellClick = (ticker) => {
    sellStock(ticker)
  };

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setUserName(userName);
    const fetchInvestmentsData = async () => {
      const data = await get_investments();
      setMockStocks(data);
    };
    fetchInvestmentsData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b" style={{ backgroundColor: 'antiquewhite' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a href='/home'>
              <h1 className="text-2xl font-bold">stock.com</h1>
            </a>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/allstock" className="text-gray-600 hover:text-primary/80">Explore</a></li>
                <li><a href="/investment" className="text-black-600 hover:text-primary">Investments</a></li>
                <li><a href="/wishlist" className="text-gray-600 hover:text-primary">Watchlists</a></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {userName}
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
            <button className='px-4 py-2 bg-red-500 text-white rounded-md' onClick={handleLogoutClick}>logOut</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Holdings ({mockStocks.length})</CardTitle>
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
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead className="text-right">Net Returns</TableHead>
                  <TableHead className="text-right">Actions</TableHead> {/* Replaced P&L with Actions */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStocks.map((stock) => (
                  <TableRow key={stock.longName}>
                    <TableCell className="font-medium">
                      <button onClick={() => handleStockClick(stock.ticker)}>
                        {stock.longName}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">{stock.quantity}</TableCell>
                    <TableCell className="text-right">₹{stock.avgCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{stock.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${stock.netReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.netReturns >= 0 ? <ArrowUp className="inline w-4 h-4 mr-1" /> : <ArrowDown className="inline w-4 h-4 mr-1" />}
                      {stock.netReturns.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {/* <Button variant="ghost" size="small" onClick={() => handleSellClick(stock.ticker)}>
                        Sell
                      </Button> */}
                      <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => handleSellClick(stock.ticker)}>Sell</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
