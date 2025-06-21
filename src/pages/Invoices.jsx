import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiDownload,
  FiPrinter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import * as XLSX from "xlsx";

// Import components and StyleSheet from @react-pdf/renderer
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { MyInvoicePDF } from "../components/MyInvoicePDF";

// Create styles for your PDF. @react-pdf/renderer uses its own styling system,
// similar to CSS-in-JS, which is separate from Tailwind CSS.
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica", // Default font, can be registered for custom fonts
    color: "#333333",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "extrabold",
    color: "#1D4ED8", // Hex equivalent of blue-700
    marginBottom: 5,
  },
  invoiceDetails: {
    fontSize: 10,
    color: "#4B5563", // Hex equivalent of gray-600
  },
  companyInfo: {
    textAlign: "right",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  clientInfoBlock: {
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB", // Hex equivalent of blue-600
    backgroundColor: "#EFF6FF", // Hex equivalent of blue-50
    marginBottom: 30,
  },
  billToTitle: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#1E40AF", // Hex equivalent of blue-800
    marginBottom: 5,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "medium",
    color: "#1F2937", // Hex equivalent of gray-800
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#E5E7EB", // Hex equivalent of gray-200
    borderWidth: 1,
    borderBottomWidth: 0,
    borderRadius: 8, // For rounded corners
    overflow: "hidden", // Ensures rounded corners apply
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderBottomColor: "#E5E7EB",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#4299E1", // Hex equivalent of blue-500
    color: "#FFFFFF",
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    fontSize: 10,
    color: "#333333",
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB", // Hex equivalent of gray-50
  },
  tableCellRight: {
    textAlign: "right",
  },
  totalsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "semibold",
    color: "#374151", // Hex equivalent of gray-700
    marginBottom: 5,
  },
  statusPaid: {
    color: "#059669", // Hex equivalent of green-600
  },
  statusUnpaid: {
    color: "#D97706", // Hex equivalent of yellow-600
  },
  statusOverdue: {
    color: "#DC2626", // Hex equivalent of red-600
  },
  noteText: {
    fontSize: 10,
    color: "#6B7280", // Hex equivalent of gray-500
    marginTop: 10,
    width: "65%", // Limit width for notes section
  },
  totalsTable: {
    width: "35%",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    marginBottom: 2,
  },
  totalLine: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#D1D5DB", // Hex equivalent of gray-300
  },
  footer: {
    fontSize: 9,
    textAlign: "center",
    marginTop: "auto", // Pushes footer to the bottom
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB", // Hex equivalent of gray-200
    color: "#6B7280", // Hex equivalent of gray-500
  },
});

const Invoices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
    amountRange: "",
  });
  const invoicesPerPage = 10;

  // Mock data - in a real app, this would come from an API
  const mockInvoices = [
    {
      id: "INV-001",
      client: "Acme Corp",
      date: "2023-05-15",
      dueDate: "2023-06-15",
      amount: 1250.75,
      status: "paid",
      items: [
        { name: "Web Design", quantity: 1, price: 1000 },
        { name: "Hosting", quantity: 3, price: 50 },
        { name: "Domain", quantity: 1, price: 15.75 },
      ],
    },
    {
      id: "INV-002",
      client: "Globex Inc",
      date: "2023-05-18",
      dueDate: "2023-06-18",
      amount: 895.5,
      status: "unpaid",
      items: [
        { name: "Consulting", quantity: 5, price: 150 },
        { name: "Training", quantity: 2, price: 72.75 },
      ],
    },
    // Add more mock invoices...
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `INV-${100 + i}`,
      client: `Client ${i + 1}`,
      date: new Date(2023, 4, i + 1).toISOString().split("T")[0],
      dueDate: new Date(2023, 5, i + 1).toISOString().split("T")[0],
      amount: parseFloat((500 + Math.random() * 2000).toFixed(2)),
      status: i % 3 === 0 ? "paid" : i % 3 === 1 ? "unpaid" : "overdue",
      items: Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        (_, itemIdx) => ({
          name: `Service ${itemIdx + 1}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: parseFloat((20 + Math.random() * 200).toFixed(2)),
        })
      ),
    })),
  ];

  useEffect(() => {
    // In a real app, you would fetch invoices from an API here
    setInvoices(mockInvoices);
  }, []);

  useEffect(() => {
    let result = invoices;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (invoice) =>
          invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((invoice) => invoice.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      result = result.filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        if (filters.dateRange === "last30") {
          return invoiceDate >= thirtyDaysAgo;
        } else if (filters.dateRange === "last90") {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(today.getDate() - 90);
          return invoiceDate >= ninetyDaysAgo;
        } else if (filters.dateRange === "thisYear") {
          const yearStart = new Date(today.getFullYear(), 0, 1);
          return invoiceDate >= yearStart;
        }
        return true;
      });
    }

    // Apply amount range filter
    if (filters.amountRange) {
      result = result.filter((invoice) => {
        if (filters.amountRange === "low") {
          return invoice.amount < 500;
        } else if (filters.amountRange === "medium") {
          return invoice.amount >= 500 && invoice.amount < 2000;
        } else if (filters.amountRange === "high") {
          return invoice.amount >= 2000;
        }
        return true;
      });
    }

    setFilteredInvoices(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [invoices, searchTerm, filters]);

  // Pagination logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredInvoices.map((inv) => ({
        "Invoice ID": inv.id,
        Client: inv.client,
        Date: inv.date,
        "Due Date": inv.dueDate,
        Amount: `$${inv.amount.toFixed(2)}`,
        Status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(
      workbook,
      `invoices_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "paid":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "unpaid":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case "overdue":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="relative max-w-md mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
            <div className="relative group">
              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <FiDownload className="mr-2" />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 hidden group-hover:block">
                <button
                  onClick={exportToExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as Excel
                </button>
                {filteredInvoices.length > 0 && (
                  // Use PDFDownloadLink from @react-pdf/renderer
                  <PDFDownloadLink
                    document={<MyInvoicePDF invoice={filteredInvoices[0]} />}
                    fileName={`invoice_${filteredInvoices[0].id}.pdf`}
                  >
                    {({ blob, url, loading, error }) => (
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={loading} // Disable button while loading PDF
                      >
                        {loading ? "Generating PDF..." : "Export as PDF"}
                      </button>
                    )}
                  </PDFDownloadLink>
                )}
              </div>
            </div>
            <Link to="/dashboard/create-invoice">
              <button
                onClick={() => navigate("/invoices/new")}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <FiPlus className="mr-2" />
                New Invoice
              </button>
            </Link>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="mb-6">
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({ ...filters, dateRange: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">All Dates</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="thisYear">This Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount Range
                  </label>
                  <select
                    value={filters.amountRange}
                    onChange={(e) =>
                      setFilters({ ...filters, amountRange: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">All Amounts</option>
                    <option value="low">Low ($0-$500)</option>
                    <option value="medium">Medium ($500-$2000)</option>
                    <option value="high">High ($2000+)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() =>
                    setFilters({
                      status: "",
                      dateRange: "",
                      amountRange: "",
                    })
                  }
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                <FiFileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Invoices
                </p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {invoices.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                <FiCheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Paid
                </p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {invoices.filter((i) => i.status === "paid").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 mr-4">
                <FiXCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Overdue
                </p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {invoices.filter((i) => i.status === "overdue").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
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
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {invoice.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          {/* We don't need a separate export button here if PDFDownloadLink is used for direct download */}
                          <button
                            onClick={() =>
                              console.log("View/Print Invoice:", invoice.id)
                            }
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View/Print"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/invoices/edit/${invoice.id}`)
                            }
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Edit"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => console.log("Delete", invoice.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => console.log("Print", invoice.id)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Print"
                          >
                            <FiPrinter className="h-5 w-5" />
                          </button>
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
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {indexOfFirstInvoice + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {Math.min(indexOfLastInvoice, filteredInvoices.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {filteredInvoices.length}
            </span>{" "}
            invoices
          </div>
          <nav className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border ${
                currentPage === 1
                  ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border ${
                currentPage === totalPages
                  ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
