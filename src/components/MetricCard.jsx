import React from "react";
import { ChevronUp } from "lucide-react";

const MetricCard = ({
  title,
  value,
  percentage,
  isPositive,
  icon: IconComponent,
  isActive = false,
}) => (
  <div
    className={`relative rounded-xl shadow-sm border p-6 overflow-hidden
              min-h-[151px] w-full h-full flex flex-col justify-between transition-all hover:shadow-md
              ${
                isActive
                  ? "bg-[#1A71F6] text-white border-[#1A71F6]"
                  : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
              }`}
  >
    <div className="flex justify-between items-start mb-4">
      <h3
        className={`text-lg font-medium ${
          isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {title}
      </h3>
      <div
        className={`p-1 rounded-md ${
          isActive
            ? "bg-white/20"
            : isPositive
            ? "bg-green-100 dark:bg-green-900/30"
            : "bg-red-100 dark:bg-red-900/30"
        }`}
      >
        <ChevronUp
          className={`w-4 h-4 transform rotate-45 ${
            isActive
              ? "text-white"
              : isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        />
      </div>
    </div>

    <div className="flex items-baseline mb-2">
      <p
        className={`text-2xl font-bold ${
          isActive ? "text-white" : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
      <span
        className={`ml-2 text-sm font-medium px-1.5 py-0.5 rounded ${
          isActive
            ? "bg-white/20 text-white"
            : isPositive
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}
      >
        {percentage}%
      </span>
    </div>

    <p
      className={`text-sm flex items-center ${
        isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
      }`}
    >
      <span className="mr-1">From last week</span>
      {IconComponent && <IconComponent className="w-3 h-3" />}
    </p>
  </div>
);

export default MetricCard;
