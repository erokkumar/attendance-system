import React, { useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        employeeName,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/logout", {
        employeeName,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Attendance</h1>
        
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 text-lg font-semibold">Select Employee</label>
          <select
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="border-2 border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select an Employee --</option>
            {[
              "Rohit Shaw", "Rohit Kumar", "Amit Rawat", "Akash Maurya", "Deepak Chaudhary",
              "Jyoti Sharma", "Mukesh Sharma", "Neha Yadav", "Rahul Sharma", "Sanjana Rawat",
              "Tanya Sharma", "Shivam Chaudhary"
            ].map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleLogin}
            className="bg-green-500 text-white px-5 py-2 rounded-lg w-full font-semibold hover:bg-green-600 transition duration-300">
            Login
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg w-full font-semibold hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>

        {message && (
          <p className="mt-4 text-lg font-medium text-blue-700 bg-blue-100 p-3 rounded-lg shadow-md">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Attendance;