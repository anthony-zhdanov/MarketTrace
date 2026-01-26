import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// We must register the elements we want to use in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ info }) => {
  // Extracting dates for X-axis and prices for Y-axis
  const labels = info.history.map(item => item.date);
  const prices = info.history.map(item => item.price);

  const data = {
    labels,
    datasets: [
      {
        label: `${info.symbol} Price`,
        data: prices,
        borderColor: '#4db8ff', // A clean blue for MarketTrace
        backgroundColor: 'rgba(77, 184, 255, 0.5)',
        tension: 0.3, // Adds a slight curve to the line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '30-Day Historical Trend',
      },
    },
  };

  return (
    <div style={{ marginTop: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;