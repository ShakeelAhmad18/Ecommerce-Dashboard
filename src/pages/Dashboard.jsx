import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi"; // Import for hamburger icon
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardContent from "../components/DashboardContent";
import { Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location=useLocation();

  // Close sidebar on larger screens if it was open on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]); 

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - Conditional rendering for mobile, always present for desktop */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed inset-y-0 left-0 transform md:relative md:flex flex-shrink-0 z-50 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-800">
          { location.pathname === '/dashboard' ? <div className="max-w-7xl mx-auto">
            {/* The actual Dashboard content goes here */}
            <DashboardContent />
          </div> : <Outlet/>}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
