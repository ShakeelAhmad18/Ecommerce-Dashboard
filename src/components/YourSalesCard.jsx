import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChevronUp } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">{entry.name}:</span> $
                {entry.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const salesData = [
  { name: "Jan", "Average Sale Value": 200, "Average Item Per Sale": 150 },
  { name: "Feb", "Average Sale Value": 220, "Average Item Per Sale": 160 },
  { name: "Mar", "Average Sale Value": 240, "Average Item Per Sale": 170 },
  { name: "Apr", "Average Sale Value": 230, "Average Item Per Sale": 165 },
  { name: "May", "Average Sale Value": 250, "Average Item Per Sale": 180 },
  { name: "Jun", "Average Sale Value": 270, "Average Item Per Sale": 190 },
  { name: "Jul", "Average Sale Value": 300, "Average Item Per Sale": 210 },
  { name: "Aug", "Average Sale Value": 290, "Average Item Per Sale": 205 },
  { name: "Sep", "Average Sale Value": 310, "Average Item Per Sale": 220 },
  { name: "Oct", "Average Sale Value": 330, "Average Item Per Sale": 230 },
  { name: "Nov", "Average Sale Value": 350, "Average Item Per Sale": 240 },
  { name: "Dec", "Average Sale Value": 360, "Average Item Per Sale": 250 },
];

const YourSalesCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full flex flex-col transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Your Sales this year
        </h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Show All <ChevronUp className="ml-1 w-4 h-4 transform rotate-45" />
        </button>
      </div>

      {/* Mobile: fixed height, Desktop: auto height */}
      <div className="flex-grow min-h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData}
            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
              interval={0} // Show all labels on desktop
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="Average Sale Value"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="Average Item Per Sale"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
            />
            <ReferenceLine
              x="Jul"
              stroke="#9CA3AF"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex space-x-4 mt-4 flex-wrap gap-y-2">
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Average Sale Value
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Average Item per sale
          </span>
        </div>
      </div>
    </div>
  );
};

export default YourSalesCard;
