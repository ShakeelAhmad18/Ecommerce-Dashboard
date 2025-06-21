import React, { useEffect, useState } from "react";

const SalesTargetCard = ({
  inProgress = 231032,
  salesTarget = 50000,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const progressPercentage = Math.min(100, (inProgress / salesTarget) * 100);

  useEffect(() => {
    // Animation effect
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full flex flex-col justify-between transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Sales Target
        </h3>
        <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
          In Progress
        </span>
      </div>

      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(inProgress)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Target: {formatCurrency(salesTarget)}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-2">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedProgress}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>{Math.round(progressPercentage)}%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Avg. Year Value
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            $339,091
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Avg. Item Value
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            $211,411
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesTargetCard;
