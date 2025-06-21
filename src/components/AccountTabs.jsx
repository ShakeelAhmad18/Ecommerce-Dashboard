import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const AccountTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Account");

  // Get tab from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("activeTab");
    if (tab && ["Account", "Security", "Notification"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tab) => {
    // Update URL with the new tab
    navigate(`/dashboard/settings?activeTab=${tab}`, { replace: true });
  };

  return (
    <div className="w-full">
      {/* Tab Menu - Desktop */}
      <div className="hidden md:flex justify-between">
        {["Account", "Security", "Notification"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-4 font-medium text-sm transition-colors duration-200 relative ${
              activeTab === tab
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
            )}
          </button>
        ))}
      </div>
      {/* Tab Menu - Mobile */}
      <div className="md:hidden flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700">
        {["Account", "Security", "Notification"].map((tab) => (
          <button
            key={`mobile-${tab}`}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === tab
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountTabs;
