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

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  borderRadius: 12,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      grid: {
        drawBorder: false,
        display: true,
        drawOnChartArea: true,
        drawTicks: false,
        borderDash: [5, 5],
      },
      border: {
        display: false, // Menghilangkan garis sumbu Y
      },
      ticks: {
        padding: 10,
        color: "#9ca2b7",
        font: {
          size: 11,
          style: "normal",
          lineHeight: 2,
        },
      },
      beginAtZero: true,
    },
    x: {
      grid: {
        drawBorder: false,
        display: false,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        // display: true,
        color: "#9ca2b7",
        padding: 10,
        font: {
          size: 12,
          style: "normal",
          lineHeight: 2,
        },
      },
    },
  },
};

chartOptions.plugins = {
  ...chartOptions.plugins,
  datalabels: {
    color: "#000",
    anchor: "end",
    align: "top",
    offset: 4,
    font: {
      weight: "bold",
      size: 16,
    },
    formatter: (value) => value.toLocaleString(), // Format numbers with commas
  },
};