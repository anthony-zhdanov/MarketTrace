import { useState, useEffect } from 'react'
import './App.css'
import TradingViewWidget from './TradingViewWidget'

function App() {
  const [stockData, setStockData] = useState(null)
  const [ticker, setTicker] = useState("")
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const fetchStock = (e) => {
    e.preventDefault()
    setError(null)
    setStockData(null)

    fetch(`http://127.0.0.1:5000/api/stock/${ticker}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Stock not found or API limit reached")
        }
        return response.json()
      })
      .then(data => {
        setStockData(data)
        fetchHistory()
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
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

  return (
  <div className="App">
    <h1>MarketTrace</h1>
    <div className="dashboard-container">
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
            <TradingViewWidget symbol={stockData.symbol} />
          </div>
        )}
      </div>
      <div className="sidebar">
        <h3>Recent Searches</h3>
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

    </div>
  </div>
)
}

export default App