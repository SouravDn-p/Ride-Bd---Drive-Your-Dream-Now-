import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const RentalPriceChart = () => {
  const [carData, setCarData] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetch("https://ride-bd-server-side.vercel.app/cars")
      .then((response) => response.json())
      .then((data) => setCarData(data))
      .catch((error) => console.error("Error fetching car data:", error));
  }, []);

  useEffect(() => {
    if (carData.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const labels = carData.map((car) => car.carModel);
      const data = carData.map((car) => car.rentalPrice);

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Daily Rental Price (in $)",
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [carData]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-6 text-primary pt-6">
        Car Daily Rental Price
      </h1>
      <div style={{ width: "100%", height: "400px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default RentalPriceChart;
