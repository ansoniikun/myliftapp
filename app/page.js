import Image from "next/image";
import BMICalculator from "./components/BMICalculator";
import CalorieTracker from "./components/CalorieTracker";
import LiftTracker from "./components/LiftTracker";
import BarbellCalculator from "./components/BarbellCalculator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">MyLiftApp</h1>
        </div>

        {/* Responsive Grid for Components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* BMICalculator Component */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <BMICalculator />
          </div>

          {/* CalorieTracker Component */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CalorieTracker />
          </div>

          {/* LiftTracker Component */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <LiftTracker />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <BarbellCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}
