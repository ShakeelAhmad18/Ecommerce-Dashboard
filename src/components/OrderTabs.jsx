import React from "react";

const OrderTabs = ({ activeTab, setActiveTab, tabCounts }) => {
  const tabs = [
    { name: "All Orders", count: tabCounts["All Orders"] || 0 },
    { name: "Shipping", count: tabCounts["Shipping"] || 0 },
    { name: "Completed", count: tabCounts["Completed"] || 0 },
    { name: "Cancel", count: tabCounts["Cancel"] || 0 },
  ];

  return (
    <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="inline-flex border-b border-gray-200 dark:border-gray-700 w-full max-w-6xl mx-auto">
        <nav className="flex space-x-8 w-full" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" // Dark mode active tab styles
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" // Dark mode inactive tab styles
              } py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out min-w-max`}
            >
              <span className="flex items-center justify-center">
                {tab.name}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-200">
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default OrderTabs;
