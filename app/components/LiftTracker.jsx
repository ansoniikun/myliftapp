"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
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
    <div className="p-4">
      <Typography variant="h4" gutterBottom className="text-center">
        Lift Tracker
      </Typography>

      {/* Input for New Lift Type */}
      <Box sx={{ maxWidth: 400 }} className="mb-4 mx-auto">
        <TextField
          label="New Lift Type"
          variant="outlined"
          fullWidth
          value={newLiftName}
          onChange={(e) => setNewLiftName(e.target.value)}
          className="mb-2"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddLiftType}
          fullWidth
        >
          Add New Lift Type
        </Button>
      </Box>

      {/* Form to Add Lift Data for an Existing Lift Type */}
      <Box sx={{ maxWidth: 400 }} className="mb-4 mx-auto">
        {/* Dropdown for selecting lift */}
        <TextField
          select
          label="Select Lift"
          variant="outlined"
          fullWidth
          value={liftName}
          onChange={(e) => setLiftName(e.target.value)}
          className="mb-2"
        >
          {/* Dynamically populate the dropdown with lift names */}
          {Object.keys(lifts).map((lift) => (
            <MenuItem key={lift} value={lift}>
              {lift}
            </MenuItem>
          ))}
        </TextField>

        {/* Weight and Reps Input */}
        <TextField
          label="Weight (kg)"
          variant="outlined"
          type="number"
          fullWidth
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mb-2"
        />
        <TextField
          label="Reps"
          variant="outlined"
          type="number"
          fullWidth
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="mb-4"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddLift}
          fullWidth
        >
          Add Lift
        </Button>
      </Box>

      {/* Display lifts with progress charts */}
      <Grid container spacing={3}>
        {Object.keys(lifts).map((liftName) => (
          <Grid item xs={12} sm={12} md={12} lg={12} key={liftName}>
            <Card>
              <CardContent>
                <Typography variant="h6">{liftName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Latest Data: {lifts[liftName][0]?.date || "No Data"}
                </Typography>

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
                  <Button
                    onClick={() => setExpandedWeek(0)}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    View Daily Progress
                  </Button>
                )}
                {expandedWeek !== null && (
                  <Button
                    onClick={() => setExpandedWeek(null)}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Collapse to Weekly Progress
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FitnessTracker;
