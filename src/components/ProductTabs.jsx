import React from "react";
import { useNavigate } from "react-router-dom";

function ProductTabs({ activeTab }) {
  const navigate = useNavigate();

  const tabs = [
    { name: "Sneakers", count: 50, slug: "sneakers" },
    { name: "Jacket", count: 26, slug: "jacket" },
    { name: "T-Shirt", count: 121, slug: "t-shirts" },
    { name: "Bag", count: 21, slug: "bags" },
  ];

  const handleTabClick = (slug) => {
    navigate(`/dashboard/products/${slug}`);
  };

  // Convert current URL slug back to tab name for active state
  const currentTabSlug = window.location.pathname.split("/").pop();
  const activeTabName =
    tabs.find((tab) => tab.slug === currentTabSlug)?.name || activeTab;

  return (
    <>
      {/* Desktop Version - Horizontal Tabs */}
      <div className="hidden sm:flex justify-between border-b border-gray-200 pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={`desktop-${tab.slug}`}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 relative
              ${
                activeTabName === tab.name
                  ? "text-[#1A71F6]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => handleTabClick(tab.slug)}
          >
            {tab.name} ({tab.count})
            {activeTabName === tab.name && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A71F6]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Mobile Version - Compact Tabs */}
      <div className="sm:hidden flex overflow-x-auto pb-2 mb-6 gap-1 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={`mobile-${tab.slug}`}
            className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-200
              ${
                activeTabName === tab.name
                  ? "bg-[#D9EDFF] text-[#1A71F6]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => handleTabClick(tab.slug)}
          >
            <span>{tab.name}</span>
            <span className="ml-1 text-xs opacity-80">({tab.count})</span>
          </button>
        ))}
      </div>
    </>
  );
}

export default ProductTabs;
