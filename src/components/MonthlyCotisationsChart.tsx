'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Cotisation } from '@/types/cotisation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  cotisations: Cotisation[];
}

const MonthlyCotisationsChart: React.FC<Props> = ({ cotisations }) => {
  const monthlyTotals = new Array(12).fill(0);

  cotisations.forEach((c) => {
    const month = new Date(c.date).getMonth();
    monthlyTotals[month] += c.amount;
  });

  // Convert values to thousands
  const valuesInThousands = monthlyTotals.map((amount) => amount / 1000);

  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Cotisations (en milliers MAD)',
        data: valuesInThousands,
        backgroundColor: '#0d6efd',
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw as number;
            return `${value.toFixed(1)}K MAD`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
            return `${value}K MAD`;
          },
        },
      },
    },
  };

  return (
    <div className="card shadow-sm border-0 rounded p-4">
      <h5 className="text-secondary mb-3">Monthly Cotisations (en milliers MAD)</h5>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyCotisationsChart;