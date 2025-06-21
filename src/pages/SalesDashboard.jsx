import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiFilter,
  FiRefreshCw,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiDownload,
  FiPrinter,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, subDays, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { CSVLink } from 'react-csv';
import { useDebounce } from 'use-debounce';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';

// Set app element for accessibility
Modal.setAppElement('#root');

// Constants
const PAGE_SIZE = 5;
const DEBOUNCE_DELAY = 300;
const TRANSACTION_STATUSES = ['Completed', 'Processing', 'Cancelled', 'Returned'];
const PAYMENT_METHODS = ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'];

// Custom Tooltip Components
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="flex items-center" style={{ color: item.color }}>
            {item.name}: {item.name === 'revenue' ? `$${item.value.toLocaleString()}` : item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SalesDashboard = () => {
  // State management
  const [dateRange, setDateRange] = useState([
    subDays(new Date(), 30),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("weekly");
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customerSegments, setCustomerSegments] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [minAmountFilter, setMinAmountFilter] = useState("");
  const [maxAmountFilter, setMaxAmountFilter] = useState("");

  // Chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  // Memoized calculations
  const totalPages = useMemo(
    () => Math.ceil(filteredTransactions.length / PAGE_SIZE),
    [filteredTransactions]
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  // Fetch data - in a real app, this would be API calls
  useEffect(() => {
    fetchData();
  }, [startDate, endDate, timeRange]);

  // Filter transactions whenever filters change
  useEffect(() => {
    filterTransactions();
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    recentTransactions,
    statusFilter,
    paymentFilter,
    debouncedSearchQuery,
    minAmountFilter,
    maxAmountFilter,
  ]);

  const fetchData = useCallback(() => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Generate mock data based on date range
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Generate sales data
      const generatedSalesData = generateSalesData(daysDiff);
      setSalesData(generatedSalesData);

      // Generate top products
      const generatedTopProducts = generateTopProducts();
      setTopProducts(generatedTopProducts);

      // Generate customer segments
      const generatedCustomerSegments = generateCustomerSegments();
      setCustomerSegments(generatedCustomerSegments);

      // Generate summary data
      const generatedSummary = generateSummaryData(generatedSalesData);
      setSummaryData(generatedSummary);

      // Generate recent transactions
      const generatedTransactions = generateRecentTransactions();
      setRecentTransactions(generatedTransactions);

      setIsLoading(false);
    }, 800);
  }, [startDate, endDate, timeRange]);

  const generateSalesData = (days) => {
    const data = [];
    const dateFormat = timeRange === "daily" ? "MMM dd" : "MMM yyyy";

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const revenue = Math.floor(Math.random() * 10000) + 2000;
      const orders = Math.floor(Math.random() * 50) + 10;
      const avgOrder = (revenue / orders).toFixed(2);

      data.push({
        id: uuidv4(),
        date,
        name: format(date, dateFormat),
        revenue,
        orders,
        avgOrder,
        returns: Math.floor(Math.random() * 5) + 1,
      });
    }

    return data;
  };

  const generateTopProducts = () => {
    const products = [
      "Nike Air Max",
      "Adidas Ultraboost",
      "Apple AirPods Pro",
      "Samsung Galaxy S23",
      "Sony WH-1000XM5",
      "Lululemon Align Leggings",
      "Dyson Airwrap",
      "Yeti Rambler",
      "Patagonia Nano Puff",
      "Allbirds Wool Runners",
    ];

    return products
      .map((product, index) => ({
        id: uuidv4(),
        name: product,
        sales: Math.floor(Math.random() * 500) + 100,
        revenue: (Math.random() * 50000 + 10000).toFixed(2),
        category: ["Footwear", "Electronics", "Apparel"][
          Math.floor(Math.random() * 3)
        ],
        stock: Math.floor(Math.random() * 100) + 10,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const generateCustomerSegments = () => {
    const segments = [
      "New Customers",
      "Repeat Customers",
      "VIP Customers",
      "Inactive Customers",
    ];
    return segments.map((segment) => ({
      id: uuidv4(),
      name: segment,
      value: Math.floor(Math.random() * 1000) + 200,
    }));
  };

  const generateSummaryData = (salesData) => {
    const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
    const avgOrderValue = (totalRevenue / totalOrders).toFixed(2);
    const conversionRate = (Math.random() * 10 + 2).toFixed(1);

    return [
      {
        id: "revenue",
        title: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        change: `${(Math.random() * 15 + 5).toFixed(1)}%`,
        icon: <FiDollarSign className="text-blue-500" size={20} />,
        trend: Math.random() > 0.3 ? "up" : "down",
      },
      {
        id: "orders",
        title: "Total Orders",
        value: totalOrders.toLocaleString(),
        change: `${(Math.random() * 12 + 3).toFixed(1)}%`,
        icon: <FiShoppingCart className="text-green-500" size={20} />,
        trend: Math.random() > 0.4 ? "up" : "down",
      },
      {
        id: "aov",
        title: "Avg. Order Value",
        value: `$${avgOrderValue}`,
        change: `${(Math.random() * 8 + 1).toFixed(1)}%`,
        icon: <FiTrendingUp className="text-purple-500" size={20} />,
        trend: Math.random() > 0.5 ? "up" : "down",
      },
      {
        id: "conversion",
        title: "Conversion Rate",
        value: `${conversionRate}%`,
        change: `${(Math.random() * 5 + 0.5).toFixed(1)}%`,
        icon: <FiUsers className="text-orange-500" size={20} />,
        trend: Math.random() > 0.5 ? "up" : "down",
      },
    ];
  };

  const generateRecentTransactions = () => {
    return Array.from({ length: 50 }, (_, i) => {
      const itemCount = Math.floor(Math.random() * 3) + 1;

      return {
        id: `TXN-${10000 + i}`,
        customer: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        amount: (Math.random() * 500 + 20).toFixed(2),
        status:
          TRANSACTION_STATUSES[
            Math.floor(Math.random() * TRANSACTION_STATUSES.length)
          ],
        payment:
          PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
        date: format(
          subDays(new Date(), Math.floor(Math.random() * 30)),
          "MMM dd, yyyy"
        ),
        shippingAddress: {
          street: `${Math.floor(Math.random() * 1000) + 1} Main St`,
          city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
            Math.floor(Math.random() * 5)
          ],
          state: ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
          zip: `${Math.floor(Math.random() * 90000) + 10000}`,
          country: "United States",
        },
        items: Array.from({ length: itemCount }, (_, i) => ({
          id: `ITEM-${Math.floor(Math.random() * 10000)}`,
          name: [
            "Nike Air Max",
            "Apple AirPods Pro",
            "Samsung Galaxy S23",
            "Sony Headphones",
          ][Math.floor(Math.random() * 4)],
          price: (Math.random() * 300 + 50).toFixed(2),
          quantity: Math.floor(Math.random() * 2) + 1,
          image: "https://via.placeholder.com/60",
        })),
      };
    });
  };

  const filterTransactions = useCallback(() => {
    let filtered = [...recentTransactions];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((item) => item.payment === paymentFilter);
    }

    // Apply search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.customer.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query)
      );
    }

    // Apply amount filters
    if (minAmountFilter) {
      filtered = filtered.filter(
        (item) => parseFloat(item.amount) >= parseFloat(minAmountFilter)
      );
    }

    if (maxAmountFilter) {
      filtered = filtered.filter(
        (item) => parseFloat(item.amount) <= parseFloat(maxAmountFilter)
      );
    }

    setFilteredTransactions(filtered);
  }, [
    recentTransactions,
    statusFilter,
    paymentFilter,
    debouncedSearchQuery,
    minAmountFilter,
    maxAmountFilter,
  ]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);

    // Adjust date range based on selection
    if (range === "daily") {
      setDateRange([subDays(new Date(), 7), new Date()]);
    } else if (range === "weekly") {
      setDateRange([subDays(new Date(), 30), new Date()]);
    } else {
      setDateRange([subMonths(new Date(), 12), new Date()]);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const applyAdvancedFilters = () => {
    // In a real app, we would apply additional filters here
    setIsFilterModalOpen(false);
  };

  // Prepare data for CSV export
  const csvData = useMemo(
    () => [
      [
        "Transaction ID",
        "Customer",
        "Email",
        "Amount",
        "Items",
        "Status",
        "Payment Method",
        "Date",
      ],
      ...filteredTransactions.map((item) => [
        item.id,
        item.customer,
        item.email,
        `$${item.amount}`,
        item.items,
        item.status,
        item.payment,
        item.date,
      ]),
    ],
    [filteredTransactions]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Sales Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {startDate && endDate
                ? `Sales performance from ${format(
                    startDate,
                    "MMM dd, yyyy"
                  )} to ${format(endDate, "MMM dd, yyyy")}`
                : "Track and analyze your sales performance"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <div className="relative">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                placeholderText="Select date range"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                maxDate={new Date()}
                dateFormat="MMM d, yyyy"
                isClearable
              />
              <FiCalendar className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            </div>

            <button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <FiFilter className="mr-2" />
              Filters
            </button>

            <CSVLink
              data={csvData}
              filename={`sales-report-${format(new Date(), "yyyy-MM-dd")}.csv`}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FiDownload className="mr-2" />
              Export
            </CSVLink>

            <button
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <FiRefreshCw
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {summaryData.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                    {item.value}
                  </p>
                  <p
                    className={`text-sm mt-1 flex items-center ${
                      item.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.trend === "up" ? (
                      <FiTrendingUp className="mr-1" />
                    ) : (
                      <FiTrendingDown className="mr-1" />
                    )}
                    {item.change}{" "}
                    {item.trend === "up" ? "increase" : "decrease"} from last
                    period
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Sales
              </h2>
              <div className="flex space-x-2">
                {["daily", "weekly", "monthly"].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleTimeRangeChange(range)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      timeRange === range
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {/* Using an aspect ratio div for responsive height */}
            <div
              className="relative"
              style={{
                paddingBottom:
                  "60%" /* Adjust as needed for desired aspect ratio */,
              }}
            >
              <div className="absolute inset-0">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse text-gray-400">
                      Loading sales data...
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E5E7EB"
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#6B7280"
                        strokeWidth={0.5}
                        tick={{ fill: "#6B7280" }}
                      />
                      <YAxis
                        stroke="#6B7280"
                        strokeWidth={0.5}
                        tick={{ fill: "#6B7280" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
          {/* Customer Segments Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                Customer Segments
              </h2>
              <button className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                View Details
              </button>
            </div>

            {/* Responsive container that works on all screen sizes */}
            <div
              className="relative w-full"
              style={{ height: "clamp(250px, 40vw, 400px)" }}
            >
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-gray-400 text-sm sm:text-base">
                    Loading customer data...
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="70%"
                      innerRadius="40%"
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => {
                        // Only show labels if there's enough space
                        return window.innerWidth > 640
                          ? `${name}: ${(percent * 100).toFixed(0)}%`
                          : (percent * 100).toFixed(0) + "%";
                      }}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        fontSize: "clamp(12px, 1.5vw, 14px)",
                      }}
                      formatter={(value) => [value, "Customers"]}
                    />
                    <Legend
                      layout={
                        window.innerWidth > 768 ? "horizontal" : "vertical"
                      }
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{
                        paddingTop: "10px",
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Top Products and Recent Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Top Selling Products
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="animate-pulse text-gray-400">
                          Loading top products...
                        </div>
                      </td>
                    </tr>
                  ) : topProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No products found
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {product.sales.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${parseFloat(product.revenue).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                              <div
                                className={`h-2.5 rounded-full ${
                                  product.stock > 50
                                    ? "bg-green-500"
                                    : product.stock > 20
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${(product.stock / 100) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span>{product.stock}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Transactions
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-grow sm:w-64">
                  <FiSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  <FiPlus className="mr-2" />
                  New Order
                </button>
              </div>
            </div>
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <option value="all">All Statuses</option>
                {TRANSACTION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <option value="all">All Payments</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="animate-pulse text-gray-400">
                          Loading transactions...
                        </div>
                      </td>
                    </tr>
                  ) : paginatedTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === "Completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : transaction.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : transaction.status === "Cancelled"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => openTransactionDetails(transaction)}
                          >
                            <FiEye className="inline" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                            <FiEdit2 className="inline" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <FiTrash2 className="inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * PAGE_SIZE,
                    filteredTransactions.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredTransactions.length}
                </span>{" "}
                results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft className="text-gray-700 dark:text-gray-200" />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FiChevronRight className="text-gray-700 dark:text-gray-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Filters Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onRequestClose={() => setIsFilterModalOpen(false)}
        contentLabel="Advanced Filters"
        className="modal-content max-w-2xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl outline-none p-6"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Advanced Filters
          </h2>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              Transaction Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRANSACTION_STATUSES.map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={statusFilter === status}
                    onChange={() =>
                      setStatusFilter(statusFilter === status ? "all" : status)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={paymentFilter === method}
                    onChange={() =>
                      setPaymentFilter(
                        paymentFilter === method ? "all" : method
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {method}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={minAmountFilter}
                  onChange={(e) => setMinAmountFilter(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  placeholder="1000.00"
                  value={maxAmountFilter}
                  onChange={(e) => setMaxAmountFilter(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setStatusFilter("all");
                setPaymentFilter("all");
                setMinAmountFilter("");
                setMaxAmountFilter("");
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Reset Filters
            </button>
            <button
              onClick={applyAdvancedFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onRequestClose={() => setIsTransactionModalOpen(false)}
        contentLabel="Transaction Details"
        className="modal-content max-w-2xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl outline-none p-6"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4"
      >
        {selectedTransaction && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Transaction Details
              </h2>
              <button
                onClick={() => setIsTransactionModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Transaction ID
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedTransaction.id}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Date
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedTransaction.date}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Customer
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedTransaction.customer}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {selectedTransaction.email}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </h3>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedTransaction.status === "Completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : selectedTransaction.status === "Processing"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : selectedTransaction.status === "Cancelled"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                  }`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Payment Method
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedTransaction.payment}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Total Amount
                </h3>
                <p className="text-gray-900 dark:text-white text-xl font-semibold">
                  ${selectedTransaction.amount}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                Shipping Address
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-900 dark:text-white">
                  {selectedTransaction.shippingAddress.street}
                </p>
                <p className="text-gray-900 dark:text-white">
                  {selectedTransaction.shippingAddress.city},{" "}
                  {selectedTransaction.shippingAddress.state}{" "}
                  {selectedTransaction.shippingAddress.zip}
                </p>
                <p className="text-gray-900 dark:text-white">
                  {selectedTransaction.shippingAddress.country}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                Order Items
              </h3>
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedTransaction.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                #{item.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${item.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setIsTransactionModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle print functionality
                  window.print();
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium flex items-center"
              >
                <FiPrinter className="mr-2" />
                Print
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalesDashboard;


