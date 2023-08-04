class RiskRadarApp {
	constructor() {
		this.riskFactors = {
			security: { rating: 0, threshold: 0.5 },
			dependency: { rating: 0, threshold: 0.1 },
			relevance: { rating: 0, threshold: 0.2 },
			importance: { rating: 0, threshold: 0.3 },
			rework: { rating: 0, threshold: 0.5 },
		};
		this.riskLevel = 0;
		this.chart = null;
		this.riskIndex = [
			"security",
			"dependency",
			"relevance",
			"importance",
			"rework",
		];
	}

	calculateRiskLevel() {
		this.riskLevel = Object.values(this.riskFactors).reduce(
			(total, factor) => {
				return total + factor.rating * factor.threshold;
			},
			0
		);
	}

	displayRiskLevel() {
		const riskLevelBox = document.getElementById("riskLevelBox");
		riskLevelBox.textContent = this.formatRiskLevel();
		this.colorCodeRiskLevel(riskLevelBox);
	}

	formatRiskLevel() {
		return this.riskLevel.toFixed(1);
	}

	colorCodeRiskLevel(riskLevelBox) {
		if (this.riskLevel >= 4.5) {
			riskLevelBox.classList.add("alert-danger");
		} else if (this.riskLevel >= 3.5) {
			riskLevelBox.classList.add("alert-warning");
		} else if (this.riskLevel >= 2.5) {
			riskLevelBox.classList.add("alert-info");
		} else {
			riskLevelBox.classList.add("alert-success");
		}
	}

	initChart() {
		const radarChart = document
			.getElementById("radarChart")
			.getContext("2d");
		this.chart = ChartHelper.createRadarChart(radarChart);
	}

	processChartData() {
		const draggablePoints = app.chart.data.datasets[0].data;
		console.log(draggablePoints);
		draggablePoints.forEach((point, index) => {
			this.riskFactors[this.riskIndex[index]].rating = point;
			this.calculateRiskLevel();
			this.displayRiskLevel();
		});
	}
}

class ChartHelper {
	static createRadarChart(canvas) {
		return new Chart(canvas, {
			type: "radar",
			data: {
				labels: [
					"Security",
					"Dependency",
					"Relevance",
					"Importance",
					"Rework",
				],
				datasets: [
					{
						label: "Risk Factors",
						data: [1, 3, 3, 3, 5],
						pointHitRadius: 5,
						backgroundColor: "rgba(75, 192, 192, 0.2)",
						borderColor: "rgba(75, 192, 192, 1)",
						pointBackgroundColor: "rgba(75, 192, 192, 1)",
						pointBorderColor: "#fff",
						pointHoverBackgroundColor: "#fff",
						pointHoverBorderColor: "rgba(75, 192, 192, 1)",
					},
				],
			},
			options: {
				responsive: false,
				maintainAspectRatio: true,
				onHover: function (e) {
					const point = e.chart.getElementsAtEventForMode(
						e,
						"nearest",
						{ intersect: true },
						false
					);
					if (point.length) e.native.target.style.cursor = "grab";
					else e.native.target.style.cursor = "default";
				},
				plugins: {
					dragData: {
						round: 0,
						showTooltip: true,
						onDragEnd: function (e, datasetIndex, index, value) {
							// e.target.style.cursor = "default";
							// console.log(app.chart.data.datasets);
							// console.log("data: ", datasetIndex, index, value);
							app.processChartData();
						},
					},
				},
				scales: {
					r: {
						min: 1,
						max: 5,
						beginAtZero: true,
						angleLines: {
							display: true,
						},
						grid: {
							circular: true,
						},
						ticks: {
							stepSize: 1,
						},
					},
				},
			},
		});
	}
}

const app = new RiskRadarApp();
app.initChart();
