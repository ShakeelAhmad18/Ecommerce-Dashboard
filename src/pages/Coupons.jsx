import React, { useState, useEffect } from "react";
import {
  FiTag,
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
    width: "600px",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

const discountTypes = [
  { value: "percentage", label: "Percentage", icon: <FiPercent /> },
  { value: "fixed", label: "Fixed Amount", icon: <FiDollarSign /> },
  { value: "free_shipping", label: "Free Shipping", icon: <FiTruck /> },
];

const couponStatusColors = {
  active: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "text-green-500",
  },
  scheduled: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "text-blue-500",
  },
  expired: { bg: "bg-gray-50", text: "text-gray-600", icon: "text-gray-500" },
  used: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: "text-purple-500",
  },
  disabled: { bg: "bg-red-50", text: "text-red-600", icon: "text-red-500" },
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    totalCoupons: 0,
    active: 0,
    scheduled: 0,
    expired: 0,
    used: 0,
    totalSavings: 0,
  });

  // Simulate fetching coupon data
  useEffect(() => {
    const fetchCoupons = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockCoupons = [
          {
            id: "DISC-2023-20",
            code: "SUMMER20",
            description: "Summer Sale 2023",
            discountType: "percentage",
            discountValue: 20,
            minOrder: 50,
            startDate: "2023-06-01",
            endDate: "2023-08-31",
            status: "active",
            usageLimit: 1000,
            usedCount: 342,
            createdBy: "Admin",
            createdAt: "2023-05-15",
            customers: ["all"],
            products: ["all"],
            totalSavings: 2845.67,
          },
          {
            id: "DISC-2023-15",
            code: "WELCOME15",
            description: "New Customer Discount",
            discountType: "percentage",
            discountValue: 15,
            minOrder: 30,
            startDate: "2023-01-01",
            endDate: "2023-12-31",
            status: "active",
            usageLimit: null,
            usedCount: 128,
            createdBy: "Admin",
            createdAt: "2023-01-01",
            customers: ["new"],
            products: ["all"],
            totalSavings: 987.32,
          },
          {
            id: "DISC-2023-10",
            code: "FLASH10",
            description: "Flash Sale - Limited Time",
            discountType: "percentage",
            discountValue: 10,
            minOrder: 0,
            startDate: "2023-07-10",
            endDate: "2023-07-12",
            status: "scheduled",
            usageLimit: 500,
            usedCount: 0,
            createdBy: "Marketing",
            createdAt: "2023-07-01",
            customers: ["all"],
            products: ["category:electronics"],
            totalSavings: 0,
          },
          {
            id: "DISC-2023-5",
            code: "SHIPFREE",
            description: "Free Shipping Offer",
            discountType: "free_shipping",
            discountValue: 0,
            minOrder: 100,
            startDate: "2023-05-01",
            endDate: "2023-05-31",
            status: "expired",
            usageLimit: null,
            usedCount: 89,
            createdBy: "Admin",
            createdAt: "2023-04-20",
            customers: ["all"],
            products: ["all"],
            totalSavings: 645.5,
          },
          {
            id: "DISC-2023-25",
            code: "VIP25",
            description: "VIP Customer Discount",
            discountType: "fixed",
            discountValue: 25,
            minOrder: 100,
            startDate: "2023-04-01",
            endDate: "2023-06-30",
            status: "used",
            usageLimit: 200,
            usedCount: 200,
            createdBy: "Admin",
            createdAt: "2023-03-15",
            customers: ["vip"],
            products: ["all"],
            totalSavings: 3250.0,
          },
        ];

        setCoupons(mockCoupons);

        // Calculate stats
        setStats({
          totalCoupons: mockCoupons.length,
          active: mockCoupons.filter((c) => c.status === "active").length,
          scheduled: mockCoupons.filter((c) => c.status === "scheduled").length,
          expired: mockCoupons.filter((c) => c.status === "expired").length,
          used: mockCoupons.filter((c) => c.status === "used").length,
          totalSavings: mockCoupons.reduce(
            (sum, coupon) => sum + coupon.totalSavings,
            0
          ),
        });

        setIsLoading(false);
        setLastUpdated(new Date());
      }, 800);
    };

    fetchCoupons();
    const interval = setInterval(fetchCoupons, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const openCreateModal = () => {
    setCurrentCoupon(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setCurrentCoupon(coupon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCoupon(null);
  };

  const refreshData = () => {
    setIsLoading(true);
    setLastUpdated(new Date());
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDelete = (couponId) => {
    // In a real app, this would call an API
    setCoupons(coupons.filter((c) => c.id !== couponId));
  };

  const handleStatusChange = (couponId, newStatus) => {
    // In a real app, this would call an API
    setCoupons(
      coupons.map((c) => (c.id === couponId ? { ...c, status: newStatus } : c))
    );
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || coupon.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Chart data for analytics
  const usageData = {
    labels: coupons.map((c) => c.code),
    datasets: [
      {
        label: "Usage Count",
        data: coupons.map((c) => c.usedCount),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const savingsData = {
    labels: ["Active", "Used", "Expired"],
    datasets: [
      {
        data: [
          coupons
            .filter((c) => c.status === "active")
            .reduce((sum, c) => sum + c.totalSavings, 0),
          coupons
            .filter((c) => c.status === "used")
            .reduce((sum, c) => sum + c.totalSavings, 0),
          coupons
            .filter((c) => c.status === "expired")
            .reduce((sum, c) => sum + c.totalSavings, 0),
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(156, 163, 175, 0.7)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(156, 163, 175, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with stats */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Coupons & Discounts
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
            title="Total Coupons"
            value={stats.totalCoupons}
            icon={<FiTag className="text-gray-500" />}
            trend="up"
            trendValue="5%"
          />
          <StatCard
            title="Active Now"
            value={stats.active}
            icon={<FiPercent className="text-green-500" />}
            trend="up"
            trendValue="12%"
          />
          <StatCard
            title="Total Used"
            value={stats.used}
            icon={<FiUsers className="text-purple-500" />}
            trend="up"
            trendValue="8%"
          />
          <StatCard
            title="Total Savings"
            value={`$${stats.totalSavings.toFixed(2)}`}
            icon={<FiDollarSign className="text-blue-500" />}
            trend="up"
            trendValue="15%"
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Coupon Usage
            </h3>
            <div className="h-48">
              <Bar
                data={usageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Savings Distribution
            </h3>
            <div className="h-48">
              <Pie
                data={savingsData}
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
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
              <option value="used">Used</option>
              <option value="disabled">Disabled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-1" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Coupons list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto">
        <AnimatePresence>
          {isLoading ? (
            <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">
                Loading coupons...
              </p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 min-h-[200px] flex items-center justify-center">
              <div>
                <FiTag className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No coupons found</p>
                <button
                  onClick={openCreateModal}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create your first coupon
                </button>
              </div>
            </div>
          ) : (
            filteredCoupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="px-4 sm:px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Section - Coupon Info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Status Icon */}
                    <div
                      className={`mt-1 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        couponStatusColors[coupon.status].bg
                      }`}
                    >
                      {coupon.discountType === "percentage" ? (
                        <FiPercent
                          className={`h-4 w-4 ${
                            couponStatusColors[coupon.status].icon
                          }`}
                        />
                      ) : coupon.discountType === "fixed" ? (
                        <FiDollarSign
                          className={`h-4 w-4 ${
                            couponStatusColors[coupon.status].icon
                          }`}
                        />
                      ) : (
                        <FiTruck
                          className={`h-4 w-4 ${
                            couponStatusColors[coupon.status].icon
                          }`}
                        />
                      )}
                    </div>

                    {/* Coupon Details */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {coupon.code}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            couponStatusColors[coupon.status].bg
                          } ${couponStatusColors[coupon.status].text}`}
                        >
                          {coupon.status.charAt(0).toUpperCase() +
                            coupon.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {coupon.description}
                      </p>

                      {/* Mobile-only discount value */}
                      <div className="sm:hidden mt-1">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : coupon.discountType === "fixed"
                            ? `$${coupon.discountValue} OFF`
                            : "FREE SHIPPING"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <FiCalendar className="mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(coupon.startDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}{" "}
                            -{" "}
                            {new Date(coupon.endDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </span>
                        <span className="flex items-center">
                          <FiUsers className="mr-1 flex-shrink-0" />
                          {coupon.usedCount}/{coupon.usageLimit || "∞"} uses
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    {/* Desktop discount value */}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% OFF`
                          : coupon.discountType === "fixed"
                          ? `$${coupon.discountValue} OFF`
                          : "FREE SHIPPING"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Min: ${coupon.minOrder || "0"}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        aria-label="Edit coupon"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete coupon"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(coupon.code)
                        }
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors sm:hidden"
                        aria-label="Copy coupon code"
                      >
                        <FiCopy className="h-4 w-4" />
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
          Showing {Math.min(filteredCoupons.length, 5)} of{" "}
          {filteredCoupons.length} coupons
        </span>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          View all coupons <FiExternalLink className="ml-1" />
        </button>
      </div>

      {/* Create/Edit Coupon Modal */}
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
            padding: "0", // Remove padding from modal content
            overflow: "hidden", // Ensures the modal's content area itself handles its height
          },
        }}
        contentLabel="Coupon Modal"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
        shouldCloseOnOverlayClick={true}
      >
        <div className="dark:bg-gray-800 dark:text-white overflow-auto flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {currentCoupon ? "Edit Coupon" : "Create New Coupon"}
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
          {/* This div already has `flex-1` and `overflow-y-auto`, which is correct. */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 gap-6">
              {/* ... (rest of your form content remains unchanged) ... */}
              <div>
                <label
                  htmlFor="coupon-code"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Coupon Code
                </label>
                <div className="relative">
                  <input
                    id="coupon-code"
                    type="text"
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="SUMMER20"
                    defaultValue={currentCoupon?.code || ""}
                  />
                  <button
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none"
                    onClick={() => {
                      const randomCode = Math.random()
                        .toString(36)
                        .substring(2, 8)
                        .toUpperCase();
                      document.getElementById("coupon-code").value = randomCode;
                    }}
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="coupon-description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <input
                  id="coupon-description"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Summer Sale 2023"
                  defaultValue={currentCoupon?.description || ""}
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {discountTypes.map((type) => (
                      <button
                        key={type.value}
                        className={`flex flex-col items-center justify-center p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          (currentCoupon?.discountType || "percentage") ===
                          type.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                            : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          // Handle discount type change
                        }}
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {type.icon}
                        </span>
                        <span className="text-xs mt-1">{type.label}</span>
                      </button>
                    ))}
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
                    {currentCoupon?.discountType === "percentage" ? (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPercent className="text-gray-400" />
                      </div>
                    ) : currentCoupon?.discountType === "fixed" ? (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-gray-400" />
                      </div>
                    ) : null}
                    <input
                      id="discount-value"
                      type="number"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={
                        currentCoupon?.discountType === "free_shipping"
                          ? "0"
                          : "20"
                      }
                      defaultValue={currentCoupon?.discountValue || ""}
                      disabled={currentCoupon?.discountType === "free_shipping"}
                    />
                  </div>
                </div>
              </div>

              {/* Minimum Order & Usage Limit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="min-order"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Minimum Order
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      id="min-order"
                      type="number"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="50"
                      defaultValue={currentCoupon?.minOrder || ""}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="usage-limit"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Usage Limit
                  </label>
                  <input
                    id="usage-limit"
                    type="number"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Leave empty for unlimited"
                    defaultValue={currentCoupon?.usageLimit || ""}
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Start Date
                  </label>
                  <DatePicker
                    id="start-date"
                    selected={
                      currentCoupon
                        ? new Date(currentCoupon.startDate)
                        : new Date()
                    }
                    onChange={(date) => {}}
                    selectsStart
                    startDate={
                      currentCoupon
                        ? new Date(currentCoupon.startDate)
                        : new Date()
                    }
                    endDate={
                      currentCoupon
                        ? new Date(currentCoupon.endDate)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    End Date
                  </label>
                  <DatePicker
                    id="end-date"
                    selected={
                      currentCoupon
                        ? new Date(currentCoupon.endDate)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                    onChange={(date) => {}}
                    selectsEnd
                    startDate={
                      currentCoupon
                        ? new Date(currentCoupon.startDate)
                        : new Date()
                    }
                    endDate={
                      currentCoupon
                        ? new Date(currentCoupon.endDate)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                    minDate={
                      currentCoupon
                        ? new Date(currentCoupon.startDate)
                        : new Date()
                    }
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Restrictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="customer-restrictions"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Customer Restrictions
                  </label>
                  <select
                    id="customer-restrictions"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    defaultValue={currentCoupon?.customers?.[0] || "all"}
                  >
                    <option value="all">All Customers</option>
                    <option value="new">New Customers Only</option>
                    <option value="returning">Returning Customers Only</option>
                    <option value="vip">VIP Customers Only</option>
                    <option value="specific">Specific Customers</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="product-restrictions"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Product Restrictions
                  </label>
                  <select
                    id="product-restrictions"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    defaultValue={currentCoupon?.products?.[0] || "all"}
                  >
                    <option value="all">All Products</option>
                    <option value="category">Specific Categories</option>
                    <option value="product">Specific Products</option>
                  </select>
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
              {currentCoupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Reuse the StatCard component from your Orders module
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

export default Coupons;
