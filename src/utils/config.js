import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Pastikan plugin di-register
Chart.register(ChartDataLabels);

export const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const dataset = tooltipItem.dataset;
          const total = dataset.data.reduce((acc, value) => acc + value, 0);
          const currentValue = dataset.data[tooltipItem.dataIndex];
          const percentage = ((currentValue / total) * 100).toFixed(2);
          return `${dataset.label || ""}: ${currentValue} (${percentage}%)`;
        },
      },
    },
    datalabels: {
      color: '#ffffff', // Warna teks label
      font: {
        weight: 'bold',
        size: 16,
      },
      formatter: (value, context) => {
        const dataset = context.chart.data.datasets[context.datasetIndex];
        const total = dataset.data.reduce((acc, value) => acc + value, 0);
        const percentage = ((value / total) * 100).toFixed(2);
        return `${percentage}%`; // Menampilkan persentase
      },
      anchor: 'center', // Menempatkan label pada ujung
      align: 'center', // Menyelaraskan label di tengah potongan pie
    },
  },
};
