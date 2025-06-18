let mySingleChart

// eslint-disable-next-line no-unused-vars
function drawTopSalesItemChart(drawDashboardChart, targetChartId) {
    const barchartLabels = []
    const barchartValues = []

    drawDashboardChart.forEach((data) => {
        barchartLabels.push(data.name)
        barchartValues.push(data.total_quantity)
    })

    mySingleChart = new Chart(document.getElementById(targetChartId), {
        type: 'bar',
        data: {
            labels: barchartLabels,
            datasets: [
                {
                    label: 'Total Qty',
                    data: barchartValues,
                    borderWidth: '0',
                    borderColor: 'rgba(0, 100, 255, 1)',
                    backgroundColor: 'rgba(0, 100, 255, 0.5)',
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    })
}
