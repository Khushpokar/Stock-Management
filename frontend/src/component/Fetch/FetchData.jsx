import axios from "axios";

export const fetchAllTickerOfGraph = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/stockGraph/view_all_ticker/`);
        return response.data.tickers;
    } catch (error) {
        console.error('Error viewing item(fetchAllTickerOfGraph):', error);
    }
};

// For Graph i think this is not use...
export const fetchAllDataOfGraph = async (ticker) => {
    try {
        const response = await axios.get(`http://localhost:8000/stockGraph/view/${ticker}/`);
        return response.data;
    } catch (error) {
        console.error('Error viewing item(fetchAllDataOfGraph):', error);
    }
};




export const addItemOfGraph = async (ticker, status) => {
    try {
        const response = await axios.post('http://localhost:8000/stockGraph/add/', { "ticker": ticker, "status": status });
        console.log('Item added successfully(addItemOfGraph)');
    } catch (error) {
        console.error('Error adding item(addItemOfGraph):', error);
    }
};

// For Graph i think this is not use... bcs it is not working checking is pendding
export const updateItemOfGraph = async (ticker) => {
    try {
        const response = await axios.post('http://localhost:8000/stockGraph/update/', { ticker });
        console.log('Item updated successfully(updateItemOfGraph)');
    } catch (error) {
        console.error('Error updating item(updateItemOfGraph):', error);
    }
};

// i think it needs modify...
export const deleteItemsByTickerOfGraph = async (ticker) => {
    try {
        await axios.post('http://localhost:8000/stockGraph/deleteTicker/',  {ticker});
        console.log('Items deleted successfully(deleteItemsByDateOfGraph)');
    } catch (error) {
        console.error('Error deleting items(deleteItemsByDateOfGraph):', error);
    }
};