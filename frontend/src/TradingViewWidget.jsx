import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol }) {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !widgetRef.current) return;

    /* Only clear the widget div so TradingView can inject the iframe there; don't wipe the whole container */
    widgetRef.current.innerHTML = '';

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

    widgetRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        ref={widgetRef}
        className="tradingview-widget-container__widget"
        style={{ flex: 1, minHeight: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default memo(TradingViewWidget);