"use client";
import { useState } from "react";

const plates = [
  { weight: 25, color: "bg-red-500" }, // 25kg
  { weight: 20, color: "bg-blue-500" }, // 20kg
  { weight: 15, color: "bg-yellow-500" }, // 15kg
  { weight: 10, color: "bg-green-500" }, // 10kg
  { weight: 5, color: "bg-gray-100 text-black" }, // 5kg
  { weight: 2.5, color: "bg-gray-800 text-white" }, // 2.5kg
  { weight: 1.25, color: "bg-gray-400 text-black" }, // 1.25kg
];

const kgToLbs = 2.20462;

export default function Home() {
  const [barWeight, setBarWeight] = useState(20); // Default barbell weight (kg or lbs)
  const [totalWeight, setTotalWeight] = useState(""); // Manually entered total weight (kg or lbs)
  const [selectedPlates, setSelectedPlates] = useState([]); // Plates selected by the user
  const [unit, setUnit] = useState("metric"); // "metric" or "imperial"
  const [mode, setMode] = useState("enterWeight"); // Mode to toggle between "enterWeight" and "selectPlates"

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    setBarWeight(20); // Set default barbell weight based on unit (kg or lbs)
  };

  const handlePlateSelection = (plate) => {
    // Add the plate to the selected plates array, allowing multiple selections of the same plate
    setSelectedPlates((prevPlates) => [...prevPlates, plate]);
  };

  const calculateTotalWeight = () => {
    if (totalWeight !== "") {
      // If a total weight is entered, use it directly
      return totalWeight;
    }

    // Otherwise, calculate the total weight based on selected plates
    const platesWeight = selectedPlates.reduce(
      (sum, plate) =>
        sum + (unit === "metric" ? plate.weight : plate.weight * kgToLbs),
      0
    ); // Plates are on both sides, so multiply by 2
    const barWeightInUnit = unit === "metric" ? barWeight : barWeight * kgToLbs;
    const totalWeightInUnit = barWeightInUnit + 2 * platesWeight; // Plates are on both sides, so multiply by 2

    // Round the weight in lbs to the next whole number if unit is imperial
    return unit === "imperial"
      ? Math.ceil(totalWeightInUnit)
      : totalWeightInUnit;
  };

  const handleWeightInputChange = (e) => {
    let value = e.target.value;

    // Prevent leading zeros: If the input value starts with "0" and is more than 1 character, remove the leading zero
    if (value.startsWith("0") && value.length > 1) {
      value = value.substring(1); // Remove the leading zero
    }

    setTotalWeight(value); // Set the manually entered weight
  };

  const resetTotalWeight = () => {
    setTotalWeight("");
    setSelectedPlates([]);
  };

  const resetPlates = () => {
    setSelectedPlates([]);
  };

  // Plates to display (convert to correct unit if necessary)
  const displayPlates = plates.map((plate) => ({
    ...plate,
    // Convert weight and round it if in imperial (lbs)
    displayWeight:
      unit === "metric" ? plate.weight : Math.ceil(plate.weight * kgToLbs),
  }));

  // Convert plate weight to the selected unit (kg or lbs)
  const convertPlateWeight = (plateWeight) => {
    return unit === "metric"
      ? plateWeight // in kg
      : Math.ceil(plateWeight * kgToLbs); // in lbs, round up
  };

  const calculateRequiredPlates = () => {
    if (!totalWeight) return []; // If no total weight is entered, return empty

    const weightToReach =
      unit === "metric" ? totalWeight : totalWeight / kgToLbs;

    let remainingWeight = weightToReach - barWeight; // Subtract the bar weight
    let plateCount = [];

    // Loop over the plates starting from the largest plate
    for (let plate of plates) {
      // Remove the reverse() here
      if (remainingWeight <= 0) break;

      const plateWeight =
        unit === "metric" ? plate.weight : plate.weight * kgToLbs;
      const maxPlates = Math.floor(remainingWeight / (2 * plateWeight)); // Plates are on both sides

      if (maxPlates > 0) {
        // Add each plate individually
        for (let i = 0; i < maxPlates; i++) {
          plateCount.push(plate);
        }
        remainingWeight -= maxPlates * 2 * plateWeight; // Subtract the weight of the plates added
      }
    }

    return plateCount; // Return an array of plates to achieve the target weight
  };

  const requiredPlates = calculateRequiredPlates();

  return (
    <div className="min-h-screen flex justify-center p-6 bg-white rounded-lg max-w-lg w-full">
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Barbell Calculator</h1>

        {/* Unit Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Choose Unit:</label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            value={unit}
            onChange={handleUnitChange}
          >
            <option value="metric">Metric (kg)</option>
            <option value="imperial">Imperial (lb)</option>
          </select>
        </div>

        {/* Mode Toggle */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Choose Mode:</label>
          <div className="flex items-center space-x-4">
            <button
              className={`w-1/2 py-2 text-sm rounded-md ${
                mode === "enterWeight"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => {
                setMode("enterWeight");
                setTotalWeight("");
              }}
            >
              Enter Total Weight
            </button>
            <button
              className={`w-1/2 py-2 text-sm rounded-md ${
                mode === "selectPlates"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setMode("selectPlates")}
            >
              Select Plates
            </button>
          </div>
        </div>

        {/* Input for Total Weight when in "enterWeight" Mode */}
        {mode === "enterWeight" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Total Weight ({unit === "metric" ? "kg" : "lb"}):
            </label>
            <input
              type="number"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
              value={totalWeight}
              onChange={handleWeightInputChange}
            />
          </div>
        )}

        {/* Plate Selection Mode */}
        {mode === "selectPlates" && (
          <>
            <h2 className="text-xl font-bold mb-4">Select Plates:</h2>
            <div className="flex flex-wrap mb-4">
              {displayPlates.map((plate, index) => (
                <div
                  key={index}
                  className={`h-16 w-16 rounded-full flex items-center justify-center font-bold shadow-md ${plate.color} cursor-pointer`}
                  onClick={() => handlePlateSelection(plate)}
                >
                  {plate.displayWeight} {unit === "metric" ? "kg" : "lb"}
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="text-xl font-bold mb-4">
          Total Weight: {calculateTotalWeight()}{" "}
          {unit === "metric" ? "kg" : "lb"}
        </h2>

        <h2 className="text-xl font-bold mb-4">Barbell and Plates Setup:</h2>
        <div className="flex flex-row items-center mb-4">
          {/* plates */}
          <div className="flex flex-row items-center space-x-2 flex-wrap justify-center">
            {(mode === "selectPlates" ? selectedPlates : requiredPlates).map(
              (plate, index) => (
                <div
                  key={index}
                  className={`h-16 w-16 rounded-full flex items-center justify-center font-bold shadow-md ${plate.color}`}
                >
                  {convertPlateWeight(plate.weight)}{" "}
                  {unit === "metric" ? "kg" : "lb"}
                </div>
              )
            )}
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white"
            onClick={resetTotalWeight}
          >
            Reset All
          </button>
          {mode === "selectPlates" && (
            <button
              className="px-4 py-2 text-sm rounded-md bg-red-500 text-white"
              onClick={resetPlates}
            >
              Reset Plates
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
