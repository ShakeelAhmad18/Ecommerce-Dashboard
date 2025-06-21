import React, { useState, useEffect, useMemo } from "react";
import {
  FiPackage,
  FiAlertCircle,
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
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
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
  Line,
  AreaChart,
  Area,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, subDays, subMonths, subYears, parseISO } from "date-fns";
import { CSVLink } from "react-csv";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useWindowSize } from "../hooks/useWindowSize";
import { debounce } from "lodash";

const InventoryManagement = () => {
  // State management
  const [dateRange, setDateRange] = useState([
    subMonths(new Date(), 1),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("weekly");
  const [inventoryData, setInventoryData] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stockThreshold, setStockThreshold] = useState(10);

  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768;

  // Chart colors
  const COLORS = [
    "#3B82F6", // blue-500
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
  ];

  // Filter inventory items based on current filters
  const filterInventoryItems = () => {
    let filtered = [...inventoryItems];

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Debounced search
  const debouncedFilter = useMemo(
    () => debounce(filterInventoryItems, 300),
    []
  );

  // Generate mock data - in a real app, these would be API calls
  const fetchData = async () => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Generate all data
      const generatedInventoryData = generateInventoryData(daysDiff);
      const generatedStockAlerts = generateStockAlerts();
      const generatedCategoryDistribution = generateCategoryDistribution();
      const generatedItems = generateInventoryItems();

      // Set all state
      setInventoryData(generatedInventoryData);
      setStockAlerts(generatedStockAlerts);
      setCategoryDistribution(generatedCategoryDistribution);
      setInventoryItems(generatedItems);
      setSummaryData(
        generateSummaryData(generatedInventoryData, generatedStockAlerts)
      );

      // Show success notification
      showNotification("Data loaded successfully", "success");
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Failed to load data", "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
    return () => debouncedFilter.cancel();
  }, [startDate, endDate, timeRange]);

  // Filter items when filters change
  useEffect(() => {
    debouncedFilter();
  }, [inventoryItems, categoryFilter, statusFilter, searchQuery]);

  // Notification handler
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle refresh with loading state
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Handle time range change with appropriate date adjustments
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);

    switch (range) {
      case "daily":
        setDateRange([subDays(new Date(), 7), new Date()]);
        break;
      case "weekly":
        setDateRange([subDays(new Date(), 30), new Date()]);
        break;
      case "monthly":
        setDateRange([subMonths(new Date(), 12), new Date()]);
        break;
      default:
        setDateRange([subDays(new Date(), 30), new Date()]);
    }
  };

  // Pagination logic
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Data generation functions (mocked)
  const generateInventoryData = (days) => {
    const data = [];
    const dateFormat = timeRange === "daily" ? "MMM dd" : "MMM yyyy";

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      data.push({
        date,
        name: format(date, dateFormat),
        received: Math.floor(Math.random() * 500) + 100,
        sold: Math.floor(Math.random() * 400) + 50,
        returned: Math.floor(Math.random() * 50) + 5,
        damaged: Math.floor(Math.random() * 20) + 1,
      });
    }

    return data;
  };

  const generateStockAlerts = () => {
    const alerts = [
      {
        id: 1,
        product: "Nike Air Max 270",
        sku: "NK-AM-270-001",
        currentStock: 3,
        minStock: 10,
        status: "critical",
        category: "Sneakers",
        lastUpdated: subDays(new Date(), 2),
      },
      {
        id: 2,
        product: "Adidas Ultraboost 21",
        sku: "AD-UB-21-205",
        currentStock: 5,
        minStock: 15,
        status: "critical",
        category: "Sneakers",
        lastUpdated: subDays(new Date(), 5),
      },
      {
        id: 3,
        product: "Puma RS-X3 Puzzle",
        sku: "PM-RSX3-42",
        currentStock: 8,
        minStock: 20,
        status: "warning",
        category: "Sneakers",
        lastUpdated: subDays(new Date(), 7),
      },
      {
        id: 4,
        product: "New Balance 574 Core",
        sku: "NB-574-11",
        currentStock: 12,
        minStock: 25,
        status: "warning",
        category: "Sneakers",
        lastUpdated: subDays(new Date(), 10),
      },
      {
        id: 5,
        product: "Reebok Classic Leather",
        sku: "RB-CL-099",
        currentStock: 15,
        minStock: 30,
        status: "ok",
        category: "Sneakers",
        lastUpdated: subDays(new Date(), 15),
      },
    ];

    return alerts.filter((alert) => alert.currentStock < stockThreshold);
  };

  const generateCategoryDistribution = () => {
    const categories = [
      "Sneakers",
      "Apparel",
      "Accessories",
      "Equipment",
      "Footwear",
      "Other",
    ];
    return categories.map((category) => ({
      name: category,
      value: Math.floor(Math.random() * 1000) + 200,
    }));
  };

  const generateSummaryData = (inventoryData, stockAlerts) => {
    const totalReceived = inventoryData.reduce(
      (sum, item) => sum + item.received,
      0
    );
    const totalSold = inventoryData.reduce((sum, item) => sum + item.sold, 0);
    const totalReturned = inventoryData.reduce(
      (sum, item) => sum + item.returned,
      0
    );
    const turnoverRate = ((totalSold / totalReceived) * 100).toFixed(1);
    const criticalAlerts = stockAlerts.filter(
      (a) => a.status === "critical"
    ).length;

    return [
      {
        title: "Total Inventory",
        value: (totalReceived - totalSold + totalReturned).toLocaleString(),
        change: `${(Math.random() * 15 - 5).toFixed(1)}%`,
        icon: <FiPackage className="text-blue-500" size={20} />,
        trend: Math.random() > 0.5 ? "up" : "down",
      },
      {
        title: "Stock Alerts",
        value: criticalAlerts,
        change:
          criticalAlerts > 0 ? `${(Math.random() * 10 + 2).toFixed(1)}%` : "0%",
        icon: <FiAlertCircle className="text-red-500" size={20} />,
        trend: criticalAlerts > 0 ? "up" : "none",
      },
      {
        title: "Turnover Rate",
        value: `${turnoverRate}%`,
        change: `${(Math.random() * 8 + 1).toFixed(1)}%`,
        icon: <FiTrendingUp className="text-green-500" size={20} />,
        trend: turnoverRate > 50 ? "up" : "down",
      },
      {
        title: "Inventory Value",
        value: `$${(totalReceived * 50).toLocaleString()}`,
        change: `${(Math.random() * 12 + 3).toFixed(1)}%`,
        icon: <FiDollarSign className="text-purple-500" size={20} />,
        trend: Math.random() > 0.5 ? "up" : "down",
      },
    ];
  };

  const generateInventoryItems = () => {
    const categories = [
      "Sneakers",
      "Apparel",
      "Accessories",
      "Equipment",
      "Footwear",
    ];
    const statuses = ["In Stock", "Low Stock", "Out of Stock", "Discontinued"];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `INV-${10000 + i}`,
      name: `Product ${i + 1}`,
      sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      currentStock: Math.floor(Math.random() * 100),
      price: (Math.random() * 200 + 20).toFixed(2),
      cost: (Math.random() * 100 + 10).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: format(
        subDays(new Date(), Math.floor(Math.random() * 30)),
        "MMM dd, yyyy"
      ),
      image: `https://picsum.photos/200/200?random=${i}`,
    }));
  };

  // Prepare data for CSV export
  const csvData = [
    [
      "ID",
      "Name",
      "SKU",
      "Category",
      "Current Stock",
      "Price",
      "Cost",
      "Status",
      "Last Updated",
    ],
    ...filteredItems.map((item) => [
      item.id,
      item.name,
      item.sku,
      item.category,
      item.currentStock,
      `$${item.price}`,
      `$${item.cost}`,
      item.status,
      item.lastUpdated,
    ]),
  ];

  // Open item details modal
  const openItemModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <FiCheckCircle className="mr-2" />
          ) : (
            <FiXCircle className="mr-2" />
          )}
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-4">
            <FiXCircle />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Inventory Management Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {startDate && endDate
                ? `Inventory analytics from ${format(
                    startDate,
                    "MMM dd, yyyy"
                  )} to ${format(endDate, "MMM dd, yyyy")}`
                : "Track and manage your inventory levels in real-time"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <FiCalendar className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                placeholderText="Select date range"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white w-full"
                maxDate={new Date()}
                dateFormat="MMM d, yyyy"
              />
            </div>

            <button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() =>
                document.getElementById("filters-modal").showModal()
              }
            >
              <FiFilter className="mr-2" />
              Filters
            </button>

            <CSVLink
              data={csvData}
              filename={`inventory-report-${format(
                new Date(),
                "yyyy-MM-dd"
              )}.csv`}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FiDownload className="mr-2" />
              Export
            </CSVLink>

            <button
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
            >
              <FiRefreshCw
                className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading
            ? Array(4)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <Skeleton height={100} />
                  </div>
                ))
            : summaryData.map((item, index) => (
                <div
                  key={index}
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
                          item.trend === "up"
                            ? "text-green-500"
                            : item.trend === "down"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {item.trend === "up" ? (
                          <FiTrendingUp className="mr-1" />
                        ) : item.trend === "down" ? (
                          <FiTrendingDown className="mr-1" />
                        ) : (
                          <FiInfo className="mr-1" />
                        )}
                        {item.change}{" "}
                        {item.trend === "up"
                          ? "increase"
                          : item.trend === "down"
                          ? "decrease"
                          : ""}{" "}
                        from last period
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
          {/* Inventory Movement Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Inventory Movement Analytics
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
            <div className="h-80">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton height={300} width="100%" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={inventoryData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorReceived"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorSold"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10B981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10B981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#6B7280"
                      strokeWidth={0.5}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#6B7280"
                      strokeWidth={0.5}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        fontSize: "14px",
                      }}
                      formatter={(value, name) => {
                        return [
                          value,
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ];
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="received"
                      name="Received"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorReceived)"
                    />
                    <Area
                      type="monotone"
                      dataKey="sold"
                      name="Sold"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorSold)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Inventory Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Inventory by Category
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                View Details
              </button>
            </div>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton circle height={200} width={200} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={isMobile ? 60 : 80}
                      innerRadius={isMobile ? 30 : 40}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        windowSize.width > 640
                          ? `${name}: ${(percent * 100).toFixed(0)}%`
                          : `${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryDistribution.map((entry, index) => (
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
                      }}
                      formatter={(value, name, props) => [
                        value,
                        props.payload.name,
                      ]}
                    />
                    <Legend
                      layout={isMobile ? "horizontal" : "vertical"}
                      verticalAlign={isMobile ? "bottom" : "middle"}
                      align={isMobile ? "center" : "right"}
                      wrapperStyle={{
                        paddingTop: isMobile ? "10px" : "0",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Stock Alerts and Inventory Table */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Stock Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Stock Alerts
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-300 mr-2">
                  Threshold:
                </span>
                <input
                  type="number"
                  value={stockThreshold}
                  onChange={(e) => setStockThreshold(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleRefresh}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <FiRefreshCw size={16} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4">
                        <Skeleton count={5} />
                      </td>
                    </tr>
                  ) : stockAlerts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <FiCheckCircle size={32} className="mb-2" />
                          <p>No critical stock alerts found</p>
                          <p className="text-sm mt-1">
                            Inventory levels are healthy
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    stockAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => openItemModal(alert)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <FiPackage className="text-gray-500 dark:text-gray-300" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {alert.product}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-300">
                                {alert.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {alert.currentStock} / {alert.minStock}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                alert.status === "critical"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  (alert.currentStock / alert.minStock) * 100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              alert.status === "critical"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {alert.status === "critical"
                              ? "Critical"
                              : "Warning"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {format(alert.lastUpdated, "MMM dd, yyyy")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Items Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Inventory Items
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-grow sm:w-64">
                  <FiSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  <FiPlus className="mr-2" />
                  Add Item
                </button>
              </div>
            </div>
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <option value="all">All Categories</option>
                <option value="Sneakers">Sneakers</option>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
                <option value="Equipment">Equipment</option>
                <option value="Footwear">Footwear</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <option value="all">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
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
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
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
                      <td colSpan="6" className="px-6 py-4">
                        <Skeleton count={5} />
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <FiPackage size={32} className="mb-2" />
                          <p>No inventory items found</p>
                          <p className="text-sm mt-1">
                            Try adjusting your filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-300">
                                {item.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {item.currentStock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${item.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === "In Stock"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : item.status === "Low Stock"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : item.status === "Out of Stock"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openItemModal(item)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              <FiEye size={16} />
                            </button>
                            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                              <FiEdit2 size={16} />
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredItems.length)}
                </span>{" "}
                of <span className="font-medium">{filteredItems.length}</span>{" "}
                results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <FiChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Modal */}
        <dialog id="filters-modal" className="modal backdrop-blur-sm">
          <div className="modal-box max-w-2xl dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Advanced Filters
              </h3>
              <button
                onClick={() => document.getElementById("filters-modal").close()}
                className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="select select-bordered p-1 rounded-md border border-gray-500 w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Sneakers">Sneakers</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Footwear">Footwear</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select select-bordered p-1 rounded-md border border-gray-500 w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
              </div>

              {/* Stock Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stock Range
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    className="input input-bordered p-1 rounded-md border border-gray-500 w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    className="input input-bordered p-1 rounded-md border border-gray-500 w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Range
                </label>
                <div className="flex gap-3">
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      step="0.01"
                      className="input input-bordered p-1 rounded-md border border-gray-500 w-full pl-8 bg-white dark:bg-gray-70 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      min="0"
                      step="0.01"
                      className="input input-bordered p-1 rounded-md border border-gray-500  w-full pl-8 bg-white dark:bg-gray-70 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="modal-action flex justify-end space-x-3">
              <button
                onClick={() => document.getElementById("filters-modal").close()}
                className="btn btn-outline py-1 px-2 rounded-md border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button className="btn py-1 rounded-md px-3 btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white">
                Apply Filters
              </button>
            </div>
          </div>
        </dialog>
        {/* Item Detail Modal */}
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"
                onClick={() => setIsModalOpen(false)}
              ></div>

              {/* Modal container */}
              <div className="relative z-10 inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-2xl">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {selectedItem.product || selectedItem.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    {selectedItem.sku}
                  </p>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src={
                          selectedItem.image ||
                          "https://placehold.co/600x400/png"
                        }
                        alt={selectedItem.product || selectedItem.name}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Category
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {selectedItem.category}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Current Stock
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {selectedItem.currentStock}
                            {selectedItem.minStock && (
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                (Min: {selectedItem.minStock})
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </label>
                          <p className="mt-1">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                selectedItem.status === "In Stock" ||
                                selectedItem.status === "ok"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : selectedItem.status === "Low Stock" ||
                                    selectedItem.status === "warning"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {selectedItem.status}
                            </span>
                          </p>
                        </div>
                        {selectedItem.price && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                              Price
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              ${selectedItem.price}
                            </p>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Last Updated
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {format(
                              selectedItem.lastUpdated || new Date(),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
