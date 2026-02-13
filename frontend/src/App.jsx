import { useState, useEffect } from 'react'
import './App.css'
import TradingViewWidget from './TradingViewWidget'

function App() {
  // 1. STATE MANAGEMENT
  const [stockData, setStockData] = useState(null)
  const [ticker, setTicker] = useState("") // Captures user keystrokes
  const [error, setError] = useState(null) // Captures error messages
  const [history, setHistory] = useState([]) // Captures search history

  // 2. THE SEARCH FUNCTION
  // This only runs when the user submits the form
  const fetchStock = (e) => {
    e.preventDefault() // STOP the page from reloading!

    // Reset errors and show loading state (optional logic)
    setError(null)
    setStockData(null)

    console.log(`Fetching data for: ${ticker}`)

    // Dynamic URL based on the 'ticker' state
    fetch(`http://127.0.0.1:5000/api/stock/${ticker}`)
      .then(response => {
        if (!response.ok) {
            // If the server returns 400 or 500, throw an error
            throw new Error("Stock not found or API limit reached")
        }
        return response.json()
      })
      .then(data => {
        console.log("Data received:", data)
        setStockData(data) // Save the DTO
        fetchHistory()
      })
      .catch(err => {
        console.error(err)
        setError(err.message) // Save the error text to display it
      })
  }

  const fetchHistory = () => {
    fetch('http://127.0.0.1:5000/api/history')
    .then(response => response.json())
    .then(data => setHistory(data))
    .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchHistory()
  }, [])
  
  // 3. THE RENDER
// ... imports and logic remain the same ...

return (
  <div className="App">
    <h1>MarketTrace</h1>
    
    {/* 1. THE BIG CONTAINER */}
    <div className="dashboard-container">

      {/* 2. LEFT COLUMN: Main Work Area */}
      <div className="main-content">
        <form onSubmit={fetchStock}>
          <input
            type="text"
            placeholder="Enter Stock Symbol (e.g. AAPL)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {error && <p style={{color: 'red'}}>{error}</p>}
        {!stockData && !error && <p>Enter a symbol to see the price.</p>}

        {stockData && (
          <div className="card">
            {/* TradingView chart driven by the current search result */}
            <TradingViewWidget symbol={stockData.symbol} />
          </div>
        )}
      </div>

      {/* 3. RIGHT COLUMN: The Sidebar */}
      <div className="sidebar">
        <h3>Recent Searches</h3>
        {/* If history is empty, show a message */}
        {history.length === 0 && <p>No recent searches</p>}
        
        <div className="watchlist-grid">
          {history.map(item => (
            <div key={item.id} className="watchlist-item">
              <span className="symbol">{item.symbol}</span>
              <span className="price">${item.price}</span>
            </div>
          ))}
        </div>
      </div>

    </div> {/* End dashboard-container */}
  </div>
)
}

export default App