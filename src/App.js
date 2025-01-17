import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [skill, setSkill] = useState(0);
  const [sweetSpot, setSweetSpot] = useState(23); // Initial sweet spot value
  const [darkMode, setDarkMode] = useState(true); // Theme state
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sweet Spot of Your Skill Level",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointHoverBackgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  });

  // Function to update graph based on the skill level
  const updateGraph = (skillInput) => {
    const skillValue = parseFloat(skillInput);

    // Generate x-values (whole numbers) from 0 up to the skill level
    const xValues = [];
    for (let i = 0; i <= Math.floor(skillValue); i++) {
      xValues.push(i);
    }

    // Generate y-values based on the exact formula, for whole number x-values
    const yValues = xValues.map((x) => x * 0.77 + 23); // Formula applied directly

    // Add the final point with the exact skill level (floating-point value)
    xValues.push(skillValue);
    yValues.push(skillValue * 0.77 + 23); // xact precision for the final point

    setData({
      labels: xValues,
      datasets: [
        {
          ...data.datasets[0],
          data: yValues,
        },
      ],
    });

    // Calculate and update the exact sweet spot value
    const sweetSpotValue = skillValue * 0.77 + 23;
    setSweetSpot(sweetSpotValue);
  };

  // Handle input changes
// Handle input changes
const handleInputChange = (event) => {
  const value = event.target.value;

  // If the input is empty, just set skill to an empty string
  if (value === '') {
    setSkill('');
    setSweetSpot(23); // Reset sweet spot to the initial value when input is empty
    return;
  }

  // Ensure the input only has up to 5 decimal places
  const regex = /^\d*\.?\d{0,5}$/;
  if (!regex.test(value)) return; // Ignore input that doesn't match the regex (more than 5 decimal places)

  const skillValue = parseFloat(value);
  if (isNaN(skillValue)) return; // Ignore invalid input
  if (skillValue > 100) return; // Prevent skill value from exceeding 100

  setSkill(value);
  updateGraph(skillValue);
};


  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const theme = darkMode
    ? {
        background: "bg-gray-900",
        text: "text-white",
        button: "bg-gray-800 text-white",
        graphBorder: "rgba(255, 255, 255, 1)",
        graphBackground: "rgba(255, 255, 255, 0.2)",
      }
    : {
        background: "bg-gray-100",
        text: "text-black",
        button: "bg-blue-500 text-white",
        graphBorder: "rgba(75, 192, 192, 1)",
        graphBackground: "rgba(75, 192, 192, 0.2)",
      };

  return (
    <div className={`relative flex flex-col items-center justify-center h-screen ${theme.background}`}>
<h1 className={`text-3xl font-bold mt-4 mb-4 ${theme.text} sm:mt-12`}>
  Sweet Spot Calculator
</h1>

      
      {/* Night/Day Mode Toggle */}
      <div className="absolute top-4 right-4 flex items-center hidden sm:flex">
  <span className={`${theme.text} mr-2`}>🌞</span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={darkMode}
      onChange={toggleDarkMode}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
  <span className={`${theme.text} ml-2`}>🌙</span>
</div>

      <div className="mb-6 flex sm:w-full sm:justify-center">        <label htmlFor="skillInput" className={`text-lg font-medium ${theme.text}`}>
          Enter Your Skill Level:
        </label>
        <input
          id="skillInput"
          type="number"
          step="0.0001" // Allow decimal points up to 4 decimal places
          max="100" // Set maximum value
          value={skill}
          onChange={handleInputChange}
          className="ml-4 p-2 border rounded shadow"
        />
      </div>
      <div className="mb-6 text-lg">
        <p>
          <span className={`font-medium ${theme.text}`}>Exact Sweet Spot:</span>{" "}
          <span className="font-bold text-red-400">{sweetSpot.toFixed(4)}</span> {/* Display exact sweet spot with 4 decimal places */}
        </p>
      </div>

      <div className="w-full h-full lg:w-3/4">
        <Line
          data={{
            ...data,
            datasets: [
              {
                ...data.datasets[0],
                borderColor: theme.graphBorder,
                backgroundColor: theme.graphBackground,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Let the chart resize when the window resizes
            scales: {
              x: {
                grid: {
                  color: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)", // Grid line colors for night and day mode
                },
              },
              y: {
                grid: {
                  color: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)", // Grid line colors for night and day mode
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    // Calculate the exact sweet spot for the hovered value
                    const exactSweetSpot = tooltipItem.raw;
                    return `Exact Sweet Spot: ${exactSweetSpot.toFixed(4)}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
