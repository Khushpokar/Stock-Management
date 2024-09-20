import { Search, User, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const allStockData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/stockGraph/home/all_stock/');
      return response.data.tickers; // Adjust the return to match your API structure
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return []; // Return an empty array on error
    }
};

const buyStock = async (ticker,quantity) => {
  try {
    const req={
      "user_id": user_id,
      "ticker": ticker,
      "shares":quantity
    }
    console.log(req);
    const response = await axios.post('http://127.0.0.1:8000/userStock/BuyStock/add/',req);
    console.log(response.data); // Adjust the return to match your API structure
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return []; // Return an empty array on error
  }
};

const user_id = localStorage.getItem('user_id');

const addwatchlist = async (ticker) => {
  try {
    const req = {
      "user_id": user_id,
      "ticker": ticker
    };
    const response = await axios.post('http://127.0.0.1:8000/userStock/wishlist/add/', req);
    response.data.message;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
  }
};

export default function AllStocksPage() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control the popup
  const [selectedStock, setSelectedStock] = useState(null); // State for the stock selected for buying
  const [quantity, setQuantity] = useState(1);

  const handleStockClick = (ticker) => {
    navigate(`/graph/${ticker}`);
  };
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value); // Update quantity when input changes
  };

  const handleBuyClick = (stock) => {
    setSelectedStock(stock); // Set the selected stock for buying
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
    setSelectedStock(null); // Reset selected stock
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      const data = await allStockData();
      setStocks(data);
    };
    fetchMarketData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b" style={{ backgroundColor: 'antiquewhite' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a href='/home'>
              <h1 className="text-2xl font-bold">stock.com</h1>
            </a>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/allstock" className="text-black-600 hover:text-primary/80">Explore</a></li>
                <li><a href="/investment" className="text-gray-600 hover:text-primary">Investments</a></li>
                <li><a href="/wishlist" className="text-gray-600 hover:text-primary">Watchlists</a></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                placeholder="What are you looking for today?"
                className="pl-8 w-64 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">All Stocks</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Last Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Change</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stocks.map((stock) => (
                <tr key={stock.ticker}>
                  <button onClick={() => handleStockClick(stock.ticker)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.ticker}</td>
                  </button>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.longName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{stock.closePrice}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${stock.raise_value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.raise_value >= 0 ? '+' : ''}{stock.raise_value.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${stock.raise_value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.raise_value >= 0 ? '+' : ''}({Math.abs(stock.raise_value / stock.closePrice * 100).toFixed(2)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md" onClick={() => handleBuyClick(stock)}>Buy</button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-600 rounded-md flex items-center space-x-1" onClick={() => addwatchlist(stock.ticker)}>
                        <span>Watchlist</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Popup modal for Buy */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Buy {selectedStock?.longName}</h2>
            <label className="block text-sm font-medium text-gray-700">Enter Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="mt-4 text-end">
              <button className="px-4 py-2 bg-green-500 text-white rounded-md mr-2" onClick={()=>{buyStock(selectedStock?.ticker,quantity)}}>Confirm</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={handleClosePopup}>Close</button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
