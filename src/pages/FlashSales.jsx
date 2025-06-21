import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiFilter,
  FiExternalLink,
  FiTruck,
  FiCopy,
  FiGrid,
  FiLayers,
} from "react-icons/fi";
import { IoMdRefresh } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import Countdown from "react-countdown";
import { Switch } from "@headlessui/react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Modal styles
Modal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "12px",
    padding: "0",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    maxWidth: "90%",
    width: "800px",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

const flashSaleStatusColors = {
  active: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "text-green-500",
  },
  upcoming: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "text-blue-500",
  },
  ended: { bg: "bg-gray-50", text: "text-gray-600", icon: "text-gray-500" },
  paused: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: "text-yellow-500",
  },
};

const FlashSales = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    active: 0,
    upcoming: 0,
    ended: 0,
    totalRevenue: 0,
    itemsSold: 0,
  });

  // Simulate fetching flash sale data
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      setTimeout(() => {
        // Mock product data
        const mockProducts = [
          {
            id: "prod-1",
            name: "Premium Running Shoes",
            price: 129.99,
            stock: 150,
            image: "https://example.com/shoes.jpg",
          },
          {
            id: "prod-2",
            name: "Wireless Headphones",
            price: 89.99,
            stock: 200,
            image: "https://example.com/headphones.jpg",
          },
          {
            id: "prod-3",
            name: "Smart Watch",
            price: 199.99,
            stock: 75,
            image: "https://example.com/watch.jpg",
          },
          {
            id: "prod-4",
            name: "Fitness Tracker",
            price: 59.99,
            stock: 120,
            image: "https://example.com/tracker.jpg",
          },
        ];

        // Mock flash sales data
        const mockFlashSales = [
          {
            id: "FS-2023-1",
            title: "Summer Blowout Sale",
            description: "Massive discounts on summer essentials",
            discountType: "percentage",
            discountValue: 30,
            startDate: "2023-06-15T10:00:00",
            endDate: "2023-06-17T23:59:59",
            status: "active",
            products: ["prod-1", "prod-2"],
            featured: true,
            bannerImage: "https://example.com/summer-banner.jpg",
            totalRevenue: 5842.35,
            itemsSold: 87,
            maxDiscount: 50,
            createdBy: "Admin",
            createdAt: "2023-06-01",
            purchaseLimit: 2,
          },
          {
            id: "FS-2023-2",
            title: "Tech Week Special",
            description: "Huge discounts on electronics",
            discountType: "fixed",
            discountValue: 50,
            startDate: "2023-06-20T00:00:00",
            endDate: "2023-06-26T23:59:59",
            status: "upcoming",
            products: ["prod-2", "prod-3"],
            featured: false,
            bannerImage: "https://example.com/tech-banner.jpg",
            totalRevenue: 0,
            itemsSold: 0,
            maxDiscount: 100,
            createdBy: "Marketing",
            createdAt: "2023-05-25",
            purchaseLimit: 1,
          },
          {
            id: "FS-2023-3",
            title: "Back to School",
            description: "Everything students need for the new year",
            discountType: "percentage",
            discountValue: 25,
            startDate: "2023-05-01T00:00:00",
            endDate: "2023-05-31T23:59:59",
            status: "ended",
            products: ["prod-1", "prod-4"],
            featured: true,
            bannerImage: "https://example.com/school-banner.jpg",
            totalRevenue: 12453.78,
            itemsSold: 215,
            maxDiscount: 40,
            createdBy: "Admin",
            createdAt: "2023-04-15",
            purchaseLimit: 3,
          },
          {
            id: "FS-2023-4",
            title: "Midnight Madness",
            description: "Limited time overnight deals",
            discountType: "percentage",
            discountValue: 40,
            startDate: "2023-06-10T00:00:00",
            endDate: "2023-06-11T03:00:00",
            status: "paused",
            products: ["prod-3", "prod-4"],
            featured: false,
            bannerImage: "https://example.com/midnight-banner.jpg",
            totalRevenue: 3210.45,
            itemsSold: 42,
            maxDiscount: 60,
            createdBy: "Marketing",
            createdAt: "2023-06-05",
            purchaseLimit: 2,
          },
        ];

        setProducts(mockProducts);
        setFlashSales(mockFlashSales);

        // Calculate stats
        setStats({
          totalSales: mockFlashSales.length,
          active: mockFlashSales.filter((s) => s.status === "active").length,
          upcoming: mockFlashSales.filter((s) => s.status === "upcoming")
            .length,
          ended: mockFlashSales.filter((s) => s.status === "ended").length,
          totalRevenue: mockFlashSales.reduce(
            (sum, sale) => sum + sale.totalRevenue,
            0
          ),
          itemsSold: mockFlashSales.reduce(
            (sum, sale) => sum + sale.itemsSold,
            0
          ),
        });

        setIsLoading(false);
        setLastUpdated(new Date());
      }, 1000);
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const openCreateModal = () => {
    setCurrentSale(null);
    setSelectedProducts([]);
    setIsModalOpen(true);
  };

  const openEditModal = (sale) => {
    setCurrentSale(sale);
    setSelectedProducts(sale.products);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSale(null);
    setSelectedProducts([]);
  };

  const refreshData = () => {
    setIsLoading(true);
    setLastUpdated(new Date());
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDelete = (saleId) => {
    setFlashSales(flashSales.filter((s) => s.id !== saleId));
  };

  const handleStatusChange = (saleId, newStatus) => {
    setFlashSales(
      flashSales.map((s) => (s.id === saleId ? { ...s, status: newStatus } : s))
    );
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredFlashSales = flashSales.filter((sale) => {
    const matchesSearch =
      sale.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || sale.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Chart data for analytics
  const revenueData = {
    labels: flashSales.map((s) => s.title),
    datasets: [
      {
        label: "Revenue Generated ($)",
        data: flashSales.map((s) => s.totalRevenue),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(139, 92, 246, 0.7)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const itemsSoldData = {
    labels: ["Active", "Ended", "Upcoming"],
    datasets: [
      {
        data: [
          flashSales
            .filter((s) => s.status === "active")
            .reduce((sum, s) => sum + s.itemsSold, 0),
          flashSales
            .filter((s) => s.status === "ended")
            .reduce((sum, s) => sum + s.itemsSold, 0),
          flashSales
            .filter((s) => s.status === "upcoming")
            .reduce((sum, s) => sum + s.itemsSold, 0),
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(156, 163, 175, 0.7)",
          "rgba(59, 130, 246, 0.7)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(156, 163, 175, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Countdown renderer
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Sale Ended</span>;
    } else {
      return (
        <span className="font-mono">
          {days > 0 && `${days}d `}
          {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with stats */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Flash Sales Management
          </h2>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={refreshData}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
              data-tooltip-id="refresh-tooltip"
              data-tooltip-content="Refresh data"
            >
              <IoMdRefresh
                className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </button>
            <Tooltip id="refresh-tooltip" />
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard
            title="Total Sales"
            value={stats.totalSales}
            icon={<FiClock className="text-gray-500" />}
            trend="up"
            trendValue="12%"
          />
          <StatCard
            title="Active Now"
            value={stats.active}
            icon={<FiClock className="text-green-500" />}
            trend="up"
            trendValue="8%"
          />
          <StatCard
            title="Items Sold"
            value={stats.itemsSold}
            icon={<FiLayers className="text-purple-500" />}
            trend="up"
            trendValue="23%"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<FiDollarSign className="text-blue-500" />}
            trend="up"
            trendValue="18%"
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Revenue by Flash Sale
            </h3>
            <div className="h-48">
              <Bar
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return "$" + value.toLocaleString();
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Items Sold by Status
            </h3>
            <div className="h-48">
              <Pie
                data={itemsSoldData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search flash sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.targetValue)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="ended">Ended</option>
              <option value="paused">Paused</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-1" /> Create Flash Sale
          </button>
        </div>
      </div>

      {/* Flash sales list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto">
        <AnimatePresence>
          {isLoading ? (
            <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">
                Loading flash sales...
              </p>
            </div>
          ) : filteredFlashSales.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 min-h-[200px] flex items-center justify-center">
              <div>
                <FiClock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No flash sales found</p>
                <button
                  onClick={openCreateModal}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create your first flash sale
                </button>
              </div>
            </div>
          ) : (
            filteredFlashSales.map((sale) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="px-4 sm:px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Section - Sale Info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Status Icon */}
                    <div
                      className={`mt-1 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        flashSaleStatusColors[sale.status].bg
                      }`}
                    >
                      <FiClock
                        className={`h-4 w-4 ${
                          flashSaleStatusColors[sale.status].icon
                        }`}
                      />
                    </div>

                    {/* Sale Details */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {sale.title}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            flashSaleStatusColors[sale.status].bg
                          } ${flashSaleStatusColors[sale.status].text}`}
                        >
                          {sale.status.charAt(0).toUpperCase() +
                            sale.status.slice(1)}
                        </span>
                        {sale.featured && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-50 text-purple-600">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {sale.description}
                      </p>

                      {/* Countdown Timer */}
                      <div className="mt-1 flex items-center text-xs">
                        <span className="text-gray-500 dark:text-gray-400 mr-2">
                          {sale.status === "upcoming"
                            ? "Starts in"
                            : sale.status === "active"
                            ? "Ends in"
                            : sale.status === "ended"
                            ? "Ended"
                            : "Paused"}
                        </span>
                        {["active", "upcoming"].includes(sale.status) && (
                          <span className="font-medium text-gray-900 dark:text-white">
                            <Countdown
                              date={
                                new Date(
                                  sale.status === "active"
                                    ? sale.endDate
                                    : sale.startDate
                                )
                              }
                              renderer={countdownRenderer}
                            />
                          </span>
                        )}
                      </div>

                      {/* Mobile-only discount value */}
                      <div className="sm:hidden mt-1">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {sale.discountType === "percentage"
                            ? `${sale.discountValue}% OFF`
                            : `$${sale.discountValue} OFF`}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {sale.itemsSold} sold
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <FiCalendar className="mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(sale.startDate).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(sale.endDate).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                        <span className="flex items-center">
                          <FiGrid className="mr-1 flex-shrink-0" />
                          {sale.products.length} products
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    {/* Desktop discount value */}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {sale.discountType === "percentage"
                          ? `${sale.discountValue}% OFF`
                          : `$${sale.discountValue} OFF`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {sale.itemsSold} sold • ${sale.totalRevenue.toFixed(2)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(sale)}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        aria-label="Edit flash sale"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete flash sale"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Showing {Math.min(filteredFlashSales.length, 5)} of{" "}
          {filteredFlashSales.length} flash sales
        </span>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          View all flash sales <FiExternalLink className="ml-1" />
        </button>
      </div>

      {/* Create/Edit Flash Sale Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          ...customStyles,
          content: {
            ...customStyles.content,
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            padding: "0",
            overflow: "hidden",
          },
        }}
        contentLabel="Flash Sale Modal"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
        shouldCloseOnOverlayClick={true}
      >
        <div className="dark:bg-gray-800 dark:text-white overflow-auto flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {currentSale ? "Edit Flash Sale" : "Create New Flash Sale"}
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl font-light focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="sale-title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Sale Title
                </label>
                <input
                  id="sale-title"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Summer Blowout Sale"
                  defaultValue={currentSale?.title || ""}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="sale-description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="sale-description"
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your flash sale to customers"
                  defaultValue={currentSale?.description || ""}
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`flex flex-col items-center justify-center p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        (currentSale?.discountType || "percentage") ===
                        "percentage"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <FiPercent className="text-gray-700 dark:text-gray-300" />
                      <span className="text-xs mt-1">Percentage</span>
                    </button>
                    <button
                      className={`flex flex-col items-center justify-center p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        (currentSale?.discountType || "percentage") === "fixed"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <FiDollarSign className="text-gray-700 dark:text-gray-300" />
                      <span className="text-xs mt-1">Fixed Amount</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="discount-value"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Discount Value
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {currentSale?.discountType === "percentage" ? (
                        <FiPercent className="text-gray-400" />
                      ) : (
                        <FiDollarSign className="text-gray-400" />
                      )}
                    </div>
                    <input
                      id="discount-value"
                      type="number"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={
                        currentSale?.discountType === "percentage" ? "30" : "50"
                      }
                      defaultValue={currentSale?.discountValue || ""}
                    />
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Start Date & Time
                  </label>
                  <DatePicker
                    id="start-date"
                    selected={
                      currentSale ? new Date(currentSale.startDate) : new Date()
                    }
                    onChange={(date) => {}}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    End Date & Time
                  </label>
                  <DatePicker
                    id="end-date"
                    selected={
                      currentSale
                        ? new Date(currentSale.endDate)
                        : new Date(Date.now() + 24 * 60 * 60 * 1000)
                    }
                    onChange={(date) => {}}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={
                      currentSale ? new Date(currentSale.startDate) : new Date()
                    }
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Featured & Purchase Limit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Featured Sale
                  </label>
                  <Switch
                    checked={currentSale?.featured || false}
                    onChange={() => {}}
                    className={`${
                      currentSale?.featured
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-600"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Featured sale</span>
                    <span
                      className={`${
                        currentSale?.featured
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Featured sales are highlighted on the homepage
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="purchase-limit"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Purchase Limit per Customer
                  </label>
                  <input
                    id="purchase-limit"
                    type="number"
                    min="1"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Leave empty for no limit"
                    defaultValue={currentSale?.purchaseLimit || ""}
                  />
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Banner Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="banner-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="banner-upload"
                          name="banner-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {currentSale?.bannerImage && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Current banner:
                    </p>
                    <div className="relative h-24 w-full rounded-md overflow-hidden">
                      <img
                        src={currentSale.bannerImage}
                        alt="Current banner"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Products Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Products
                </label>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`relative p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedProducts.includes(product.id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => toggleProductSelection(product.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ${product.price} • {product.stock} in stock
                          </p>
                        </div>
                      </div>
                      {selectedProducts.includes(product.id) && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer with Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                // Handle save/update logic here
                closeModal();
              }}
            >
              {currentSale ? "Update Flash Sale" : "Create Flash Sale"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendValue }) => {
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
  const trendIcon = trend === "up" ? "↑" : "↓";

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="p-2 rounded-full bg-white dark:bg-gray-600 shadow-sm">
          {React.cloneElement(icon, { className: "h-4 w-4" })}
        </div>
      </div>
      <div className={`mt-2 text-xs ${trendColor}`}>
        {trendIcon} {trendValue} from last month
      </div>
    </div>
  );
};

export default FlashSales;
