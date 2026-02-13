import React, { useEffect, useRef, memo } from 'react';

/**
 * TradingViewWidget
 *
 * A thin React wrapper around TradingView's Advanced Chart widget.
 * The chart automatically reloads whenever the `symbol` prop changes,
 * making it easy to plug into the search flow.
 */
function TradingViewWidget({ symbol }) {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing widget content so we can render a fresh chart
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol || 'NASDAQ:AAPL'}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }
    `;

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: '100%', width: '100%' }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}

export default memo(TradingViewWidget);