"use client";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2"; // Using chart.js for the bar chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components (required for Chart.js 3+)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FitnessTracker = () => {
  const [lifts, setLifts] = useState({});
  const [newLiftName, setNewLiftName] = useState("");
  const [liftName, setLiftName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [expandedWeek, setExpandedWeek] = useState(null);

  // Function to add a new lift type dynamically
  const handleAddLiftType = () => {
    if (newLiftName && !lifts[newLiftName]) {
      setLifts((prevLifts) => ({
        ...prevLifts,
        [newLiftName]: [], // Initialize an empty array for the new lift type
      }));
      setNewLiftName("");
    } else {
      alert("Lift name already exists or is empty.");
    }
  };

  // Function to handle adding a new entry for a specific lift
  const handleAddLift = () => {
    if (liftName && weight && reps) {
      const newLift = {
        date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        weight: parseFloat(weight),
        reps: parseInt(reps),
      };

      // Update the state with the new lift entry for the selected lift name
      setLifts((prevLifts) => ({
        ...prevLifts,
        [liftName]: [
          ...(prevLifts[liftName] || []), // Add new lift to the end of the array
          newLift,
        ], // New lift will now be pushed to the end of the list
      }));

      // Reset input fields
      setLiftName("");
      setWeight("");
      setReps("");
    } else {
      alert("Please fill out all fields!");
    }
  };

  // Group data by week and calculate the average weight lifted per week
  const groupLiftsByWeek = (liftData) => {
    const weeks = [];
    let currentWeek = [];
    let currentWeekDate = null;

    liftData.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    liftData.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const startOfWeek = entryDate.getDate() - entryDate.getDay(); // Get the start of the week (Sunday)
      entryDate.setDate(startOfWeek);

      if (
        currentWeekDate === null ||
        entryDate.getTime() === currentWeekDate.getTime()
      ) {
        currentWeek.push(entry);
      } else {
        weeks.push(currentWeek);
        currentWeek = [entry]; // Start a new week
      }
      currentWeekDate = entryDate.getTime();
    });
    if (currentWeek.length) weeks.push(currentWeek); // Push remaining week

    return weeks.map((week) => {
      const averageWeight =
        week.reduce((sum, lift) => sum + lift.weight, 0) / week.length;
      return { week, averageWeight };
    });
  };

  // Get chart data for the selected lift
  const chartData = (liftName) => {
    const liftData = lifts[liftName] || [];

    const weeklyData = groupLiftsByWeek(liftData);

    return {
      labels:
        expandedWeek === null
          ? weeklyData.map((_, index) => `Week ${index + 1}`)
          : weeklyData[expandedWeek].week.map((lift) => lift.date), // If expanded, show daily data
      datasets: [
        {
          label:
            expandedWeek === null
              ? "Weekly Average Weight (kg)"
              : "Daily Weight (kg)",
          data:
            expandedWeek === null
              ? weeklyData.map((week) => week.averageWeight)
              : weeklyData[expandedWeek].week.map((lift) => lift.weight), // Show weekly or daily data
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-bold text-center mb-4">Lift Tracker</h2>

      {/* Input for New Lift Type */}
      <div className="max-w-md mb-4 mx-auto w-full">
        <label
          className="block text-lg font-semibold mb-2"
          htmlFor="newLiftName"
        >
          New Lift Type
        </label>
        <input
          type="text"
          id="newLiftName"
          value={newLiftName}
          onChange={(e) => setNewLiftName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Enter new lift type"
        />
        <button
          onClick={handleAddLiftType}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded mt-2"
        >
          Add New Lift Type
        </button>
      </div>

      {/* Form to Add Lift Data for an Existing Lift Type */}
      <div className="max-w-md mb-4 mx-auto w-full">
        {/* Dropdown for selecting lift */}
        <label className="block text-lg font-semibold mb-2" htmlFor="liftName">
          Select Lift
        </label>
        <select
          id="liftName"
          value={liftName}
          onChange={(e) => setLiftName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="">Select a Lift</option>
          {Object.keys(lifts).map((lift) => (
            <option key={lift} value={lift}>
              {lift}
            </option>
          ))}
        </select>

        {/* Weight and Reps Input */}
        <label className="block text-lg font-semibold mb-2" htmlFor="weight">
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Enter weight lifted"
        />
        <label className="block text-lg font-semibold mb-2" htmlFor="reps">
          Reps
        </label>
        <input
          type="number"
          id="reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter number of reps"
        />

        <button
          onClick={handleAddLift}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Lift
        </button>
      </div>

      {/* Display lifts with progress charts */}
      <div className="w-full grid grid-cols-1 gap-6">
        {Object.keys(lifts).map((liftName) => (
          <div
            key={liftName}
            className="bg-white p-4 rounded-lg shadow-md w-full"
          >
            <h3 className="text-xl font-semibold">{liftName}</h3>
            <p className="text-sm text-gray-500">
              Latest Data: {lifts[liftName][0]?.date || "No Data"}
            </p>

            {/* Chart for each lift */}
            <div
              style={{
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Bar
                data={chartData(liftName)}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "x", // Bars will be drawn from left to right
                  plugins: {
                    title: {
                      display: true,
                      text: `${liftName} Progress`,
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: expandedWeek === null ? "Week" : "Date",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Weight (kg)",
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
            {expandedWeek === null && (
              <button
                onClick={() => setExpandedWeek(0)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded mt-2"
              >
                View Daily Progress
              </button>
            )}
            {expandedWeek !== null && (
              <button
                onClick={() => setExpandedWeek(null)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded mt-2"
              >
                Collapse to Weekly Progress
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FitnessTracker;
