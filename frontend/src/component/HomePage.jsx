import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, User } from 'lucide-react';
import { Button } from "../utils/Button";
import { Input } from "../utils/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../utils/Card";
import '../tailwind.css';
import { useNavigate } from 'react-router-dom';

// Function to fetch data
const HomePagedata = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/stockGraph/home/');
    return response.data.tickers; // Adjust the return to match your API structure
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return []; // Return an empty array on error
  }
};

const get_investments_home = async () => {
  const user_id = Number(localStorage.getItem('user_id'))
  try {
    const response = await axios.get(`http://127.0.0.1:8000/userStock/get_investments_home/${user_id}/`);
    return response.data; // Adjust the return to match your API structure
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null; // Return an empty array on error
  }
};

const HomePagedata2 = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/stockGraph/home/most_traded_stock/');
    return response.data.tickers; // Adjust the return to match your API structure
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return []; // Return an empty array on error
  }
};

const logout = ()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('userName')
}

const Update_Data = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/stockGraph/update/');
      return response.data.status; // Adjust the return to match your API structure
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return []; // Return an empty array on error
    }
  };

export default function HomePage() {
  // State to hold market indices
  const [marketIndices, setMarketIndices] = useState([]);
  const [mostTradedStock, setMostTradedStock] = useState([]);
  const [userName,setUserName] = useState();
  const [current,setCurrent] = useState();
  const [profit,setProfit] = useState();

  const navigate = useNavigate();

const handleStockClick = (ticker) => {
  navigate(`/graph/${ticker}`); // Navigate to the graph page with the selected ticker
};

const handleLogoutClick = () => {
  logout()
  navigate(`/`); // Navigate to the graph page with the selected ticker
};
  // Fetch data on component mount
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setUserName(userName);
    const token = localStorage.getItem("token");
    if  (!token) {
      navigate("/");
    }


    const get_investments = async () => {
      const data = await get_investments_home();
      setCurrent(data.current)
      setProfit(data.profit)
       // Update state with the fetched data
  };

    const fetchMarketData = async () => {
        const data = await HomePagedata();
        setMarketIndices(data); // Update state with the fetched data
    };

    const fetchMarketData2 = async () => {
      const data2 = await HomePagedata2();
      setMostTradedStock(data2); // Update state with the fetched data
    };

    const update = async ()=>{
        const data = await Update_Data();
    }
    get_investments()
    // update();
    fetchMarketData();
    fetchMarketData2();

    // const interval = setInterval(() => {
    //     update();
    //     fetchMarketData();
    //     fetchMarketData2();
    // }, 15000);

    // return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only on component mount

  return (
    <div className="min-h-screen bg-background">
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
                <li><a href="/wishlist" className="text-gray-600 hover:text-primary">Watchlists</a></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {userName}
              {/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="What are you looking for today?" className="pl-8 w-64" /> */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Market Indices</h2>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4">
                {marketIndices.map((index, i) => (
                  <Card key={i} className="w-[250px] flex-shrink-0">
                    <CardHeader className="pb-2">
                    <button onClick={() => handleStockClick(index.ticker)}>
                      <CardTitle className="text-sm font-medium">{index.longName}</CardTitle>
                    </button>
                      
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{index.closePrice}</div>
                      <div className={`text-lg ${index.raise_value < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {index.raise_value} ({Math.abs(index.raise_value / index.closePrice * 100).toFixed(2)}%)
                      </div>
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
                  <div className="text-3xl font-bold text-green-500">+₹{profit}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Value</div>
                  <div className="text-3xl font-bold">₹{current}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Most Traded Stocks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mostTradedStock.map((stock, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                <button onClick={() => handleStockClick(stock.ticker)}>
                  <CardTitle className="text-sm font-medium">{stock.longName}</CardTitle>
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stock.closePrice}</div>
                  <div className={`text-lg ${stock.raise_value < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {stock.raise_value} ({Math.abs(stock.raise_value / stock.closePrice * 100).toFixed(2)}%)
                      </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
