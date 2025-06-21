import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiPlus,
  FiFilter,
  FiX,
  FiMail,
  FiPhone,
  FiStar,
  FiTag,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiRefreshCw,
  FiCreditCard,
  FiShoppingCart,
  FiLayers,
} from "react-icons/fi";
import { FaChartLine, FaRegChartBar, FaRegUserCircle } from "react-icons/fa";
import { BsThreeDotsVertical, BsCheckCircleFill } from "react-icons/bs";
import { RiCoupon3Line } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "react-tooltip";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const CustomerCRM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    customerType: "",
    valueSegment: "",
    lastPurchaseDate: null,
    tags: [],
    hasUnreadMessages: false,
  });
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [availableTags, setAvailableTags] = useState([
    "VIP",
    "Wholesale",
    "Frequent Buyer",
    "New Customer",
    "At Risk",
    "Loyal",
  ]);
  const customersPerPage = 10;

  // Mock customer data with enhanced fields
  const customers = [
    {
      id: "ID12451",
      name: "Leslie Alexander",
      email: "leslie.alexander@example.com",
      phone: "+62 819 1314 1435",
      purchases: 2178.5,
      orderQty: 30,
      avgOrderValue: 72.62,
      lastPurchaseDate: "2023-06-15",
      customerSince: "2021-03-12",
      address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
      status: "active",
      customerType: "retail",
      valueSegment: "high",
      tags: ["VIP", "Frequent Buyer"],
      notes: "Prefers email communication. Interested in new arrivals.",
      unreadMessages: 2,
      lifetimeValue: 12500,
      preferredPayment: "credit_card",
      lastContactDate: "2023-06-10",
    },
    {
      id: "ID12452",
      name: "Eleanor Pena",
      email: "eleanor.pena@example.com",
      phone: "+62 812 3456 7890",
      purchases: 1500.0,
      orderQty: 15,
      avgOrderValue: 100.0,
      lastPurchaseDate: "2023-05-22",
      customerSince: "2022-01-05",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
      status: "inactive",
      customerType: "wholesale",
      valueSegment: "medium",
      tags: ["Wholesale"],
      notes: "Business customer. Bulk orders every quarter.",
      unreadMessages: 0,
      lifetimeValue: 8500,
      preferredPayment: "bank_transfer",
      lastContactDate: "2023-04-18",
    },
    // Additional customers with similar enhanced fields...
    // (Would include all your existing customers with these additional fields)
  ];

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.status || customer.status === filters.status) &&
      (!filters.customerType ||
        customer.customerType === filters.customerType) &&
      (!filters.valueSegment ||
        customer.valueSegment === filters.valueSegment) &&
      (!filters.lastPurchaseDate ||
        new Date(customer.lastPurchaseDate) >= filters.lastPurchaseDate) &&
      (filters.tags.length === 0 ||
        filters.tags.some((tag) => customer.tags.includes(tag))) &&
      (!filters.hasUnreadMessages || customer.unreadMessages > 0);

    return matchesSearch && matchesFilters;
  });

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Status badge with tooltip
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-800 dark:text-green-100",
        icon: <BsCheckCircleFill className="mr-1" />,
      },
      inactive: {
        bg: "bg-red-100 dark:bg-red-900",
        text: "text-red-800 dark:text-red-100",
        icon: <FiX className="mr-1" />,
      },
      lead: {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-800 dark:text-yellow-100",
        icon: <FaRegUserCircle className="mr-1" />,
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-100",
      icon: null,
    };

    return (
      <span
        className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Customer value segment indicator
  const getValueSegmentIndicator = (segment) => {
    const segments = {
      high: {
        color: "bg-purple-500",
        tooltip: "High Value Customer",
      },
      medium: {
        color: "bg-blue-500",
        tooltip: "Medium Value Customer",
      },
      low: {
        color: "bg-gray-400",
        tooltip: "Low Value Customer",
      },
    };

    return (
      <>
        <div
          data-tooltip-id="segment-tooltip"
          data-tooltip-content={segments[segment]?.tooltip || "Unknown"}
          className={`w-3 h-3 rounded-full ${
            segments[segment]?.color || "bg-gray-400"
          }`}
        ></div>
        <Tooltip id="segment-tooltip" />
      </>
    );
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCustomers.map((c) => ({
        "Customer ID": c.id,
        Name: c.name,
        Email: c.email,
        Phone: c.phone,
        "Total Purchases": `$${c.purchases.toFixed(2)}`,
        "Order Quantity": c.orderQty,
        "Avg. Order Value": `$${c.avgOrderValue.toFixed(2)}`,
        "Last Purchase": c.lastPurchaseDate,
        Status: c.status,
        "Customer Type": c.customerType,
        "Value Segment": c.valueSegment,
        Tags: c.tags.join(", "),
        "Lifetime Value": `$${c.lifetimeValue.toFixed(2)}`,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(
      workbook,
      `customer_report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("Customer CRM Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 22, {
      align: "center",
    });
    doc.text(
      `Filters: ${searchTerm ? `Search: "${searchTerm}"` : "None"}`,
      105,
      28,
      { align: "center" }
    );

    doc.autoTable({
      startY: 35,
      head: [
        [
          "ID",
          "Name",
          "Email",
          "Phone",
          "Purchases",
          "Orders",
          "Status",
          "Value Segment",
        ],
      ],
      body: filteredCustomers.map((c) => [
        c.id,
        c.name,
        c.email,
        c.phone,
        `$${c.purchases.toFixed(2)}`,
        c.orderQty,
        c.status,
        c.valueSegment,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [229, 231, 235],
        textColor: 0,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save(`customer_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Customer details modal
  const CustomerDetailsModal = ({ customer, onClose }) => {
    if (!customer) return null;

    // Chart data for customer activity
    const activityData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Purchases ($)",
          data: [120, 190, 300, 250, 180, 400],
          backgroundColor: "rgba(79, 70, 229, 0.7)",
        },
      ],
    };

    const purchaseTypesData = {
      labels: ["Clothing", "Accessories", "Footwear", "Electronics"],
      datasets: [
        {
          data: [35, 25, 20, 20],
          backgroundColor: [
            "rgba(79, 70, 229, 0.7)",
            "rgba(99, 102, 241, 0.7)",
            "rgba(129, 140, 248, 0.7)",
            "rgba(165, 180, 252, 0.7)",
          ],
        },
      ],
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
          <div className="p-3">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customer.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Customer since{" "}
                  {new Date(customer.customerSince).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
              >
                <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Customer Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg lg:col-span-1">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      ID: {customer.id}
                    </div>
                    <div className="mt-1">
                      {getStatusBadge(customer.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiMail className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {customer.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {customer.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiCreditCard className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {customer.preferredPayment.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiShoppingCart className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {customer.orderQty} total orders
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      ${customer.lifetimeValue.toFixed(2)} lifetime value
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Activity */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Total Spent
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      ${customer.purchases.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ${customer.avgOrderValue.toFixed(2)} avg. order
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Last Purchase
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {new Date(customer.lastPurchaseDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {Math.floor(
                        (new Date() - new Date(customer.lastPurchaseDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days ago
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Customer Value
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 capitalize">
                      {customer.valueSegment}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {customer.customerType === "wholesale"
                        ? "Wholesale"
                        : "Retail"}{" "}
                      customer
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Purchase Activity
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={activityData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Purchase Types
                    </h3>
                    <div className="h-48">
                      <Pie
                        data={purchaseTypesData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Customer Notes
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {customer.notes || "No notes available."}
                    </p>
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition duration-150">
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                Send Email
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition duration-150">
                Create Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bulk actions handler
  const handleBulkAction = () => {
    if (!bulkAction || selectedCustomers.length === 0) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert(
        `${bulkAction} action performed on ${selectedCustomers.length} customers`
      );
      setSelectedCustomers([]);
      setBulkAction("");
      setIsLoading(false);
    }, 1000);
  };

  // Toggle customer selection
  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedCustomers.length === currentCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(currentCustomers.map((c) => c.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
        {/* Header with Actions */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Customer Relationship Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your customer interactions and relationships
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm transition duration-150 ease-in-out"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
            <div className="relative group">
              <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm transition duration-150 ease-in-out">
                <FiDownload className="mr-2" />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 ease-in-out transform scale-95 group-hover:scale-100">
                <button
                  onClick={exportToExcel}
                  className="block px-4 py-2 text-sm w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="block px-4 py-2 text-sm w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as PDF
                </button>
              </div>
            </div>
            <Link to="/dashboard/add-customer">
              <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition duration-150 ease-in-out">
                <FiPlus className="mr-2" />
                Add Customer
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Bulk Actions */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {selectedCustomers.length > 0 && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              >
                <option value="">Bulk Actions</option>
                <option value="email">Send Email</option>
                <option value="tag">Add Tag</option>
                <option value="segment">Change Segment</option>
                <option value="export">Export Selected</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isLoading ? "Processing..." : "Apply"}
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lead">Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Customer Type
                </label>
                <select
                  value={filters.customerType}
                  onChange={(e) =>
                    setFilters({ ...filters, customerType: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Value Segment
                </label>
                <select
                  value={filters.valueSegment}
                  onChange={(e) =>
                    setFilters({ ...filters, valueSegment: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                  <option value="">All Segments</option>
                  <option value="high">High Value</option>
                  <option value="medium">Medium Value</option>
                  <option value="low">Low Value</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Last Purchase After
                </label>
                <DatePicker
                  selected={filters.lastPurchaseDate}
                  onChange={(date) =>
                    setFilters({ ...filters, lastPurchaseDate: date })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                  placeholderText="Select date"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          tags: filters.tags.includes(tag)
                            ? filters.tags.filter((t) => t !== tag)
                            : [...filters.tags, tag],
                        })
                      }
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.tags.includes(tag)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasUnreadMessages}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        hasUnreadMessages: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    Has Unread Messages
                  </span>
                </label>
              </div>

              <div className="flex items-end justify-end md:col-span-3">
                <button
                  onClick={() =>
                    setFilters({
                      status: "",
                      customerType: "",
                      valueSegment: "",
                      lastPurchaseDate: null,
                      tags: [],
                      hasUnreadMessages: false,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition duration-150 ease-in-out"
                >
                  <FiX className="mr-1 inline" />
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="relative w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomers.length > 0 &&
                      selectedCustomers.length === currentCustomers.length
                    }
                    onChange={toggleSelectAll}
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Last Purchase
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleCustomerSelection(customer.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {customer.name}
                            {customer.tags.includes("VIP") && (
                              <FiStar className="ml-1 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {customer.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {customer.email}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getValueSegmentIndicator(customer.valueSegment)}
                        <div className="ml-2">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${customer.purchases.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {customer.orderQty} orders
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(
                          customer.lastPurchaseDate
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(
                          (new Date() - new Date(customer.lastPurchaseDate)) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days ago
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setShowCustomerDetails(customer)}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Details"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 rounded-full text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="Edit Customer"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="Delete Customer"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="More Actions"
                        >
                          <BsThreeDotsVertical className="h-5 w-5" />
                        </button>
                        <Tooltip id="action-tooltip" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            Showing{" "}
            <span className="font-semibold">{indexOfFirstCustomer + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastCustomer, filteredCustomers.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredCustomers.length}</span>{" "}
            customers
          </div>
          <nav
            className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <span className="sr-only">Previous</span>
              <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = currentPage === pageNum;

              if (
                totalPages <= 7 ||
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-150 ease-in-out ${
                      isCurrentPage
                        ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === currentPage - 3 && currentPage > 3) ||
                (pageNum === currentPage + 3 && currentPage < totalPages - 2)
              ) {
                return (
                  <span
                    key={pageNum}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && (
        <CustomerDetailsModal
          customer={showCustomerDetails}
          onClose={() => setShowCustomerDetails(null)}
        />
      )}
    </div>
  );
};

export default CustomerCRM;
