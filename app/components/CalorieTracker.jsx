"use client";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const CalorieTracker = () => {
  const [calories, setCalories] = useState([]);
  const [calorieInput, setCalorieInput] = useState("");
  const [expandedWeek, setExpandedWeek] = useState(null);

  // Add calorie entry
  const addCalories = () => {
    setCalories((prev) => [...prev, parseInt(calorieInput)]);
    setCalorieInput("");
  };

  // Group entries into weeks and calculate the weekly average
  const getWeeklyData = () => {
    let weeks = [];
    for (let i = 0; i < calories.length; i += 7) {
      let week = calories.slice(i, i + 7);
      weeks.push(week);
    }

    // Calculate weekly averages
    const weeklyAverages = weeks.map((week) => {
      const sum = week.reduce((acc, val) => acc + val, 0);
      return sum / week.length; // Average for the week
    });

    return {
      weeklyLabels: weeklyAverages.map((_, index) => `Week ${index + 1}`),
      weeklyAverages,
      allWeeksData: weeks,
    };
  };

  // Get weekly data
  const { weeklyLabels, weeklyAverages, allWeeksData } = getWeeklyData();

  // Generate chart data
  const data =
    expandedWeek === null
      ? {
          labels: weeklyLabels,
          datasets: [
            {
              label: "Weekly Average Calories",
              data: weeklyAverages,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        }
      : {
          labels: allWeeksData[expandedWeek].map(
            (_, index) => `Day ${index + 1}`
          ),
          datasets: [
            {
              label: "Daily Calories",
              data: allWeeksData[expandedWeek],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Calorie Tracker</h2>

      {/* Input field for calories */}
      <input
        type="number"
        placeholder="Calories for today"
        value={calorieInput}
        onChange={(e) => setCalorieInput(e.target.value)}
        className="mt-4 p-2 border rounded"
      />
      <button
        onClick={addCalories}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Calories
      </button>

      {/* Render the chart if there are any calories */}
      {calories.length > 0 && (
        <div className="mt-4">
          <Bar data={data} />
        </div>
      )}

      {/* Display weeks with average calories and enable expand on click */}
      {expandedWeek === null && weeklyLabels.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Weekly Summary</h3>
          <ul>
            {weeklyLabels.map((week, index) => (
              <li
                key={index}
                onClick={() => setExpandedWeek(index)}
                className="cursor-pointer text-blue-500 hover:underline"
              >
                {week}: {Math.round(weeklyAverages[index])} kcal
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Button to collapse the week view */}
      {expandedWeek !== null && (
        <div className="mt-4">
          <button
            onClick={() => setExpandedWeek(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Collapse Week View
          </button>
        </div>
      )}
    </div>
  );
};

export default CalorieTracker;
