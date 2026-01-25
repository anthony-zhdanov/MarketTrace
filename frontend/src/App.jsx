import { useState } from 'react'
import './App.css'

function App() {
  // 1. STATE MANAGEMENT
  const [stockData, setStockData] = useState(null)
  const [ticker, setTicker] = useState("") // Captures user keystrokes
  const [error, setError] = useState(null) // Captures error messages

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
      })
      .catch(err => {
        console.error(err)
        setError(err.message) // Save the error text to display it
      })
  }

  // 3. THE RENDER
  return (
    <div className="App">
      <h1>Financial Dashboard</h1>

      {/* THE SEARCH BAR */}
      <form onSubmit={fetchStock}>
        <input
          type="text"
          placeholder="Enter Stock Symbol (e.g. AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)} // Update state on every keystroke
        />
        <button type="submit">Search</button>
      </form>

      {/* ERROR MESSAGE */}
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* LOADING STATE */}
      {!stockData && !error && <p>Enter a symbol to see the price.</p>}

      {/* SUCCESS STATE (The Card) */}
      {stockData && (
        <div className="card">
          <h2>{stockData.symbol}</h2>
          <p>Price: ${stockData.price}</p>
          <p>Change: {stockData.change_percent}</p>
        </div>
      )}
    </div>
  )
}

export default App