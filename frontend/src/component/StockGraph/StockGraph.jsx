// StockGraph.jsx
import React ,{useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Spline from './splineGraph.jsx';
import { bootstrapload } from '../loadstyles.jsx';
import { useNavigate } from 'react-router-dom';

const StockGraph = () => {
    const navigate = useNavigate();
    const { ticker } = useParams();
    const status = '1mo'; // You can dynamically set this based on your app's logic
    useEffect(() => {
        const userName = localStorage.getItem("userName");
    if (!userName){
      navigate("/");
    }
    }, []);
    return (
        
            <Spline ticker={ticker} status={status} />
        
    );
};

export default StockGraph;
