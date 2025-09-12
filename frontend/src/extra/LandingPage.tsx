// Import necessary modules
import React from "react";

const StartupUI: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6">
        <div className="text-xl font-bold">Wedge</div>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
          <a href="#blog" className="text-gray-600 hover:text-gray-900">Blog</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
        </nav>
        <div className="flex space-x-4">
          <a href="#login" className="text-gray-600 hover:text-gray-900">Log in</a>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">Get started</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
          Streamline your <span className="text-purple-600">growing startup</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Say goodbye to admin headaches and say hello to efficiency. Onboard your
          employees in minutes, track company projects, and manage team performance.
          We’ve got you covered.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg">Get started</button>
          <button className="bg-gray-100 text-purple-600 px-6 py-3 rounded-lg text-lg">
            Learn more
          </button>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-600">Employees</p>
            <h2 className="text-2xl font-bold">384</h2>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <p className="text-gray-600">Finance reporting</p>
              <p className="text-gray-600">84%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "84%" }}></div>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-600">Business proposal</p>
              <p className="text-gray-600">100%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-600">Update leadership</p>
              <p className="text-gray-600">26%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "26%" }}></div>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-600">Onboarding plan</p>
              <p className="text-gray-600">0%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-gray-600">Expense categories</h3>
            <div className="flex space-x-4 mt-4">
              <div className="bg-purple-600 h-4 w-16 rounded"></div>
              <div className="bg-purple-300 h-4 w-12 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartupUI;
