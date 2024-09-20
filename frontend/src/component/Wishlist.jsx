import { Search, User, Heart } from "lucide-react";
import React ,{ useState,useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const allStockData = async () => {
    const data={
        "user_id":localStorage.getItem('user_id')
    }
    // console.log(data);
    try {
      const response = await axios.post('http://127.0.0.1:8000/stockGraph/wishlist/user_wishlist/',data);
      return response.data.tickers; // Adjust the return to match your API structure
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return []; // Return an empty array on error
    }
  };

export default function Wishlist() {
const navigate = useNavigate();
const handleStockClick = (ticker) => {
    navigate(`/graph/${ticker}`); // Navigate to the graph page with the selected ticker
  };
  const [stocks, setstocks] = useState([]);

  useEffect(() => {

    const fetchMarketData = async () => {
        const data = await allStockData();
        setstocks(data); // Update state with the fetched data
    };

    

    // const update = async ()=>{
    //     const data = await Update_Data();
    // }
    // update();
    fetchMarketData();
    

    // const interval = setInterval(() => {
    //     update();
    //     fetchMarketData();
    //     fetchMarketData2();
    // }, 15000);

    // return () => clearInterval(interval);
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
              <li><a href="/allstock" className="text-gray-600 hover:text-primary/80">Explore</a></li>
                <li><a href="/investment" className="text-gray-600 hover:text-primary">Investments</a></li>
                <li><a href="/wishlist" className="text-black-600 hover:text-primary">Watchlists</a></li>
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
        <h2 className="text-3xl font-bold mb-6">WatchList</h2>
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
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md">Buy</button>
                      {/* <button className="px-3 py-1 border border-gray-300 text-gray-600 rounded-md flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>Watchlist</span>
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
