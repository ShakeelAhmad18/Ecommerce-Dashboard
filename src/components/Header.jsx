import React, { useState, useEffect, useRef } from "react"; // Import useRef
import {
  FiSearch,
  FiBell,
  FiMail,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown container

  // Function to toggle the profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown exists and the click is outside of it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {" "}
        {/* Adjusted padding for smaller screens */}
        {/* Mobile menu button and Search bar */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {" "}
          {/* Adjusted space-x for smaller screens */}
          <button
            className="md:hidden p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-md" // Added rounded-md for consistency
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <FiMenu className="text-xl" />
          </button>
          {/* Left side - Search bar */}
          <div className="relative flex-grow">
            {" "}
            {/* Added flex-grow to search for better width distribution */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search product..."
              // Adjusted width classes for better responsiveness
              className="pl-10 pr-4 py-2 w-full max-w-xs sm:max-w-none sm:w-40 md:w-64 lg:w-80 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm" // Added text-sm for smaller font
            />
            <div className="absolute inset-y-0 right-0 pr-3 hidden sm:flex items-center pointer-events-none">
              {" "}
              {/* Hide ⌘Q on very small screens */}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ⌘Q
              </span>
            </div>
          </div>
        </div>
        {/* Right side - User controls */}
        <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
          {" "}
          {/* Adjusted space-x for smaller screens */}
          <button className="relative p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md">
            {" "}
            {/* Added rounded-md */}
            <Link to="/dashboard/settings?activeTab=Notification">
              {" "}
              <FiBell className="text-xl" />
            </Link>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Link to="/dashboard/help">
            <button className="relative p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md">
              {" "}
              {/* Added rounded-md */}
              <FiMail className="text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
          </Link>
          {/* Profile Section with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {" "}
            {/* Apply ref to the container */}
            <button
              className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" // Make the whole profile clickable
              onClick={toggleProfileDropdown}
              aria-expanded={isProfileDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                {" "}
                {/* flex-shrink-0 to prevent shrinking */}
                <FaRegUserCircle className="text-indigo-600 dark:text-indigo-400 text-xl" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                {" "}
                {/* Hide name/admin on very small screens */}
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                  {" "}
                  {/* whitespace-nowrap to prevent line breaks */}
                  Guy Hawkins
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Admin
                </span>
              </div>
              <FiChevronDown
                className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  isProfileDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />{" "}
              {/* Rotate icon */}
            </button>
            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md mx-1"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior for demonstration
                      console.log("Profile clicked");
                      setIsProfileDropdownOpen(false); // Close dropdown on click
                    }}
                  >
                    Profile
                  </a>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md mx-1"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior for demonstration
                      console.log("Sign Out clicked");
                      setIsProfileDropdownOpen(false); // Close dropdown on click
                    }}
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
