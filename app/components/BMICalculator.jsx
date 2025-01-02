"use client";
import React, { useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);
    }
  };

  const getColor = () => {
    if (bmi < 18.5) return "error"; // Underweight (red)
    if (bmi >= 18.5 && bmi < 24.9) return "success"; // Healthy weight (green)
    return "warning"; // Overweight (yellow)
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold">BMI Calculator</h2>
      <input
        type="number"
        placeholder="Weight (kg)"
        className="mt-4 p-2 border rounded"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="Height (cm)"
        className="mt-2 p-2 border rounded"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <button
        onClick={calculateBMI}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Calculate BMI
      </button>

      {bmi !== null && (
        <div className="mt-4">
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={(bmi / 40) * 100} // Scale BMI to fit in 0-100
              color={getColor()}
              size={100}
              thickness={4}
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{ transform: "translate(-50%, -50%)" }}
            >
              <Typography variant="h6" component="div" color="text.primary">
                {bmi.toFixed(1)}
              </Typography>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
