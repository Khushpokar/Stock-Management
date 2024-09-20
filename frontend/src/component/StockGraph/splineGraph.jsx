import React, { Component } from "react";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import axios from "axios";
import { Search, User } from "lucide-react";

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class Spline extends Component {
    constructor(props) {
        super(props);
        this.ticker = props.ticker;
        this.status = props.status;
        this.state = {
            dataPoints: [],
            datak: null,  // Store datak in state
        };
        this.fetchAllData = this.fetchAllData.bind(this);
    }
    
    async fetchAllData(ticker) {
        try {
            const response = await axios.get(`http://localhost:8000/stockGraph/view/${ticker}/`);
            const fetchedData = response.data.datetime;
            const datak = fetchedData[fetchedData.length - 1].datetimedata[0];
            datak.fiftyTwoWeekHigh = response.data.fiftyTwoWeekHigh;
            datak.fiftyTwoWeekLow = response.data.fiftyTwoWeekLow;
            datak.prev_close = fetchedData[fetchedData.length - 2].datetimedata[0].close;
            console.log(datak);
            this.setState({ datak });  // Store datak in state

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

            this.setState({ dataPoints: filteredDataPoints });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    componentDidMount() {
        this.fetchAllData(this.ticker);
    }

    
    render() {
        const { datak } = this.state;  // Destructure datak from state
        const containerProps = {
            width: "100%",
            height: "450px",
            margin: "auto",
        };

        const options = {
            theme: "light2",
            charts: [
                {
                    axisX: {
                        lineThickness: 5,
                        tickLength: 0,
                        labelFormatter: function (e) {
                            return "";
                        },
                        crosshair: {
                            enabled: true,
                            snapToDataPoint: true,
                            labelFormatter: function (e) {
                                return "";
                            },
                        },
                    },
                    axisY: {
                        title: "Price",
                        prefix: "$",
                        tickLength: 0,
                    },
                    toolTip: {
                        shared: true,
                    },
                    data: [
                        {
                            name: "Price (in USD)",
                            yValueFormatString: "$#,###.##",
                            type: "splineArea",
                            color: "rgba(33,150,243,0.3)",
                            dataPoints: this.state.dataPoints,
                        },
                    ],
                },
            ],
            navigator: {
                slider: {
                    minimum: new Date("2024-08-18"),
                    maximum: new Date("2024-09-15"),
                },
            },
            rangeSelector: {
                inputFields: {
                    startValue: new Date("2024-08-18"),
                    endValue: new Date("2024-09-15"),
                    valueFormatString: "MMM DD YYYY",
                },
                buttonStyle: {
                    backgroundColor: "#f8f9fa",
                    borderColor: "#e9ecef",
                    color: "#495057",
                },
                buttons: [
                    {
                        label: "1mo",
                        range: 1,
                        rangeType: "month",
                    },
                ],
            },
        };

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
                <h2 className="text-3xl font-bold mb-6">Stock Price Chart</h2>
                <div className="bg-card rounded-lg shadow-lg p-4 mb-8">
                  <CanvasJSStockChart containerProps={containerProps} options={options} />
                </div>
                <div className="bg-card rounded-lg shadow-lg p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 font-medium">Open</td>
                        <td className="py-2 px-4">{datak ? datak.open : 'Loading...'}</td>
                        <td className="py-2 px-4 font-medium">Low</td>
                        <td className="py-2 px-4">{datak ? datak.low : 'Loading...'}</td>
                        <td className="py-2 px-4 font-medium">52-wk high</td>
                        <td className="py-2 px-4">{datak ? datak.fiftyTwoWeekHigh : 'Loading...'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium">High</td>
                        <td className="py-2 px-4">{datak ? datak.high : 'Loading...'}</td>
                        <td className="py-2 px-4 font-medium">Prev close</td>
                        <td className="py-2 px-4">{datak ? datak.prev_close : 'Loading...'}</td>
                        <td className="py-2 px-4 font-medium">52-wk low</td>
                        <td className="py-2 px-4">{datak ? datak.fiftyTwoWeekLow : 'Loading...'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </main>
            </div>
          );
    }
}

export default Spline;
