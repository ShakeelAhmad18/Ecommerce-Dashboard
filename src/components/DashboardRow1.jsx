import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Users, Repeat, Package, Wallet, ChevronUp } from "lucide-react";
import IncreaseSalesCard from "./IncreaseSalesCard";
import YourSalesCard from "./YourSalesCard";
import MetricCard from "./MetricCard";
import SalesTargetCard from "./SalesTargetCard";

const DashboardRow1 = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-inter">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Sales Target */}
        <div className="lg:col-span-1">
          <SalesTargetCard inProgress={231032444} salesTarget={500000000} />
        </div>

        {/* Right Columns: Metric Cards (2x2 grid) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetricCard
            title="Total Revenue"
            value="$81.000"
            percentage="10.6"
            isPositive={true}
            icon={Wallet}
            isActive={true} // This will make it appear as the active card
          />
          <MetricCard
            title="Total Customer"
            value="5.000"
            percentage="1.5"
            isPositive={true}
            icon={Users}
            trend="up"
          />
          <MetricCard
            title="Total Transactions"
            value="12.000"
            percentage="3.6"
            isPositive={true}
            icon={Repeat}
            trend="up"
          />
          <MetricCard
            title="Total Product"
            value="5.000"
            percentage="1.5"
            isPositive={true}
            icon={Package}
            trend="up"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Your Sales This Year Chart */}
        <div className="lg:col-span-2">
          <YourSalesCard />
        </div>

        {/* Right Column: Increase Your Sales */}
        <div className="lg:col-span-1">
          <IncreaseSalesCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardRow1;
