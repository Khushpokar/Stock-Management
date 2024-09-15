// StockGraph.jsx
import React ,{useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Spline from './splineGraph.jsx';
import { bootstrapload } from '../loadstyles.jsx';

const StockGraph = () => {
    const { ticker } = useParams();
    const status = '1mo'; // You can dynamically set this based on your app's logic
    useEffect(() => {
        const styles = bootstrapload()

        return () => {
          styles();
        };
    }, []);
    return (
        <div>
            <h1>Stock Graph for {ticker}</h1>
            <Spline ticker={ticker} status={status} />
        </div>
    );
};

export default StockGraph;
