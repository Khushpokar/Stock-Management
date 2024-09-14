// StockGraph.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Spline from './splineGraph.jsx';

const StockGraph = () => {
    const { ticker } = useParams();
    const status = '1mo'; // You can dynamically set this based on your app's logic
    console.log("hiii");

    return (
        <div>
            <h1>Stock Graph for {ticker}</h1>
            <Spline ticker={ticker} status={status} />
        </div>
    );
};

export default StockGraph;
