document.addEventListener('DOMContentLoaded', () => {
  // Select the canvas element by ID
  const ctx = document.getElementById('tradesChart').getContext('2d');

  // Create the chart
  const tradesChart = new Chart(ctx, {
    type: 'line', // Chart type
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Sep', 'Oct'], // X-axis labels
      datasets: [{
        label: 'Your Trades',
        data: [560, 620, 580, 680, 560, 620, 580, 680, 560, 620], // Data points for trades
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue background color
        borderColor: 'rgba(54, 162, 235, 1)', // Line color
        borderWidth: 2,
        fill: true, // Fill below the line
        tension: 0.1 // Curve tension
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false // Disable the legend
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          display: false
        },
        y: {
          beginAtZero: true,
          display: false
        }
      }
    }
  });
});