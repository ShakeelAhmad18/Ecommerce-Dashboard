import React from "react";
import { FiSearch, FiFilter, FiDownload, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

// Add onExport prop
function TopBar({ searchTerm, setSearchTerm, onExport }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
      {/* Search Input */}
      <div className="relative w-full sm:w-auto flex-grow">
        <input
          type="text"
          placeholder="Search for id, name product"
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     dark:border-gray-600 transition-colors duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end items-center gap-3 md:gap-4">
        <button
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-200
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
                           text-sm shadow-sm dark:border-gray-600"
        >
          <FiFilter className="mr-2" />
          Filter
        </button>
        {/* Call onExport function when this button is clicked */}
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-200
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
                           text-sm shadow-sm dark:border-gray-600"
        >
          <FiDownload className="mr-2" />
          Export
        </button>
        {
          <Link to="/dashboard/products/add-product">
          
            <button
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg
                           hover:bg-blue-700 transition-colors duration-200
                           text-sm shadow-md hover:shadow-lg"
            >
              <FiPlus className="mr-2" />
              New Product
            </button>
          </Link>
        }
      </div>
    </div>
  );
}

export default TopBar;
