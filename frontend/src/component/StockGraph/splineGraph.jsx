import React, { Component } from "react";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import axios from "axios";

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class Spline extends Component {
    constructor(props) {
        super(props);
        this.ticker = props.ticker;
        this.status = props.status;
        this.state = {
            dataPoints: [],
        };
        this.fetchAllData = this.fetchAllData.bind(this);
    }

    async fetchAllData(ticker) {
        try {
            // console.log(ticker)
            const response = await axios.get(`http://localhost:8000/stockGraph/view/${ticker}/`);
            const fetchedData = response.data.datetime;
            // console.log(response.data)
            const lastDataPointForDate = {};

            fetchedData.forEach(item => {
                const dateString = item.date.split('T')[0]; 
                const date = new Date(dateString);
                const price = parseFloat(item.datetimedata[0].adj_close); 
                lastDataPointForDate[dateString] = {
                    x: date,
                    y: price
                };
            });

            const filteredDataPoints = Object.values(lastDataPointForDate).sort((a, b) => a.x - b.x);

            this.setState({ dataPoints: filteredDataPoints }, () => {
                // console.log('Filtered Data Points:', this.state.dataPoints);
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    componentDidMount() {
        this.fetchAllData(this.ticker);
    }

    render() {
        const options = {
            title: {
                // text: ""
            },
            animationEnabled: true,
            charts: [{
                axisX: {
                    title: "Date",
                    valueFormatString: "YYYY-MM-DD",
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    }
                },
                axisY: {
                    title: "Price",
                    includeZero: false,
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    }
                },
                data: [{
                    type: "spline",
                    connectNullData: false,
                    dataPoints: this.state.dataPoints,
                }]
            }],
            rangeSelector: {
                inputFields: {
                    valueFormatString: "MMM YYYY"
                },
                buttons: [ 
                {
                    label: this.status,
                    rangeType: "all"
                }]
            }
        };

        const containerProps = {
            width: "70%",
            height: "30%",
            margin: "auto"
        };

        return (
            <div>
                <div>
                    <CanvasJSStockChart containerProps={containerProps} options={options} />
                </div>
            </div>
        );
    }
}

export default Spline;
