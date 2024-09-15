import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { bootstrapload } from '../loadstyles.jsx';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {
    fetchAllDataOfGraph,
    fetchAllTickerOfGraph,
    addItemOfGraph,
    deleteItemsByTickerOfGraph,
} from '../Fetch/FetchData.jsx';
import { useNavigate } from 'react-router-dom';

// Your styled components here (unchanged)
const WatchlistContainer = styled(Container)`
  padding: 20px;
`;

const UserWatchlistButtonContainer = styled(Row)`
  margin-bottom: 20px;
  align-items: center;
`;

const UserWatchlistButton = styled(Button)`
  background-color: #dcd0ff; /* Light purple color */
  color: #4a3f7f; /* Darker text color for contrast */
  border: none;
  border-radius: 25px; /* Rounded button */
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #c3baff; /* Slightly darker on hover */
  }
`;

const AddStockButton = styled(Button)`
  background-color: #dcd0ff; /* Light purple color */
  color: #4a3f7f; /* Darker text color for contrast */
  border: none;
  border-radius: 25px; /* Rounded button */
  padding: 10px;
  display: flex;
  margin-left : 95%;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #c3baff; /* Slightly darker on hover */
  }
`;

const SearchContainer = styled(Row)`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 25px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const StockListContainer = styled.div`
  border-top: 1px solid #ddd;
`;

const StockBox = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: background-color 0.3s;
  margin-bottom: 10px;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const StockInfoContainer = styled.div`
  padding: 20px 0;
`;

const StockColumn = styled(Col)`
  text-align: center;
  color : ${props => props.theme.columnTextColor}
`;

const StockPrice = styled.div`
  font-weight: regular;
  color: #000
`;

const StockChange = styled.div`
  font-weight: regular;
  color: #000
`;

const StockName = styled.div`
  font-weight: bold;
  color: #000
`;

const StockPriceChange = styled.div`
  color: ${props => (props.isUp ? 'green' : 'red')};
`;

const DeleteButton = styled(Button)`
  background-color: #e57373; /* Light red color */
  color: #fff;
  border: none;
  border-radius: 50%; /* Make the button rounded */
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0;
  opacity: 0;
  transition: opacity 0.3s;
  
  ${props => props.stockBoxHover && `
    ${props.stockBoxHover}:hover & {
      opacity: 1;
    }
  `}
`;

const Watchlist = () => {
    const [stocks, setStocks] = useState([]);
    const [ticker, setTicker] = useState('');
    const [status, setStatus] = useState('1mo');
    const navigate = useNavigate(); // Hook for navigation

    const fetchData = async () => {
        const data = await fetchAllTickerOfGraph();
        const data2 =[]
        for (const item of data) {
          const final = await fetchAllDataOfGraph(item); // Await the async operation
          data2.push(final); // Push the resolved data into data2 array
      }

      setStocks(data2);
    };

    useEffect(() => {
        fetchData();
        const styles = bootstrapload()

        return () => {
          styles();
        };
    }, []);

    const handleAddStock = async () => {
        await addItemOfGraph(ticker, status);
        setTicker('');
        setStocks([]);
        fetchData();
    };

    const handleDelete = async (ticker) => {
        await deleteItemsByTickerOfGraph(ticker);
        setStocks(prevStocks => prevStocks.filter(stock => stock.ticker !== ticker));
        setStocks([]);
        fetchData();
    };

    // Function to handle clicking on a stock
    const handleStockClick = (ticker) => {
        navigate(`/graph/${ticker}`); // Navigate to the graph page with the selected ticker
    };

    return (
        <div>
            <WatchlistContainer>
                <UserWatchlistButtonContainer>
                    <Col>
                        <UserWatchlistButton>
                            <FaEdit style={{ color: '#6a0dad' }} /> {/* Light purple color for icon */}
                            User's Watchlist
                        </UserWatchlistButton>
                    </Col>
                    <Col className="text-end">
                        <AddStockButton onClick={handleAddStock}>
                            <FaPlus style={{ color: '#6a0dad' }} /> {/* Light purple color for icon */}
                        </AddStockButton>
                    </Col>
                </UserWatchlistButtonContainer>

                <SearchContainer>
                    <Col>
                        <SearchInput value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Search stocks..." />
                    </Col>
                </SearchContainer>
                <StockInfoContainer>
                    <Row>
                        <StockColumn><strong>Company</strong></StockColumn>
                        <StockColumn><strong>Price</strong></StockColumn>
                        <StockColumn><strong>Price to Book</strong></StockColumn>
                    </Row>
                    <StockListContainer>
                        {Array.isArray(stocks) && stocks.map((stock, index) => (
                            <StockBox key={index}>
                                <StockColumn><StockName onClick={() => handleStockClick(stock.ticker)}>{stock.longName}</StockName></StockColumn>
                                <StockColumn><StockPrice>{stock.closePrice}</StockPrice></StockColumn>
                                <StockColumn><StockChange>{stock.priceToBook}</StockChange></StockColumn>
                                <DeleteButton
                                    stockBoxHover={StockBox}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the click on the StockBox
                                        handleDelete(stock.ticker);
                                    }}
                                >
                                    ×
                                </DeleteButton>
                            </StockBox>
                        ))}
                    </StockListContainer>
                </StockInfoContainer>
            </WatchlistContainer>
        </div>
    );
};

export default Watchlist;
