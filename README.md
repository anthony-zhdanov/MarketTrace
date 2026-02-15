## MarketTrace

MarketTrace is a small project built to learn the basics of full‑stack development and data‑driven web apps.

---

## What this project does

- Lets you **search for a stock ticker** (e.g. `AAPL`).
- Calls a **Flask API** that fetches real‑time quote data from the **Alpha Vantage** API.
- Saves each successful search into a **SQLite database** using **SQLAlchemy**.
- Shows:
  - An embedded **TradingView** chart for the selected symbol.
  - A **“Recent Searches”** panel populated from the database.
  
---

## Tech stack

- **Backend**
  - Python
  - Flask (REST API)
  - Flask‑CORS
  - SQLAlchemy + SQLite
  - Requests (HTTP client)
  - python‑dotenv

- **Frontend**
  - React (Vite)
  - React hooks (`useState`, `useEffect`)
  - Fetch API (browser)
  - TradingView embeddable widget

---

## Core concepts I practiced

### Backend (Flask + data layer)

- **Creating a REST API with Flask**
  - Defining routes like `/api/stock/<ticker>` and returning JSON with `flask.jsonify`.
  - Handling HTTP response codes for success and error cases.

- **Calling an external API (Alpha Vantage)**
  - Building query URLs, sending GET requests with `requests`, and parsing JSON responses.
  - Handling common error cases such as empty data or invalid symbols.

- **Managing configuration and secrets**
  - Using `.env` files and `python‑dotenv` to load the API key (`ALPHA_VANTAGE_KEY`) from environment variables instead of hard‑coding it.

- **Using a relational database with SQLAlchemy**
  - Defining a model class (`SearchHistory`) with columns for id, symbol, price, and timestamp.
  - Creating the SQLite database and tables.
  - Inserting rows on each successful stock lookup and querying recent records with ordering and limits.
  - Converting ORM objects to dictionaries (`to_dict`) for JSON responses.

- **Understanding application context and initialization**
  - Using `app.app_context()` and `db.create_all()` to initialize tables before running the development server.

### Frontend (React app)

- **Building a simple SPA with React**
  - Structuring the app into components (`App`, `TradingViewWidget`).
  - Using Vite as the frontend build tool.

- **State and side‑effect management with hooks**
  - `useState` to track:
    - Current ticker input.
    - Current stock data.
    - Error messages.
    - Recent search history.
  - `useEffect` to fetch initial history data when the app first loads.

- **Calling the backend API from the browser**
  - Using `fetch` to:
    - Request current stock data from the Flask backend.
    - Request recent search history for the sidebar.
  - Handling loading and error states in the UI.

- **Embedding third‑party widgets**
  - Wrapping the **TradingView Advanced Chart** widget in a React component.
  - Dynamically updating the symbol when the user searches for a new ticker.
  - Managing DOM integration with `useRef` and `useEffect`.

### Full‑stack concepts

- **CORS and frontend–backend communication**
  - Enabling CORS in Flask so the React frontend (different port) can call the API.
  - Understanding why browsers block cross‑origin requests by default.

- **Request/response flow**
  - Frontend form submission → backend API call → external API call → DB write → JSON back to the browser → render UI.

- **Connecting UI components to persistent data**
  - Showing a “Recent Searches” panel driven by data from the SQLite database instead of hard‑coded values.

---
