import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FiSearch,
  FiDownload,
  FiPrinter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiRefreshCw,
  FiCreditCard,
  FiPocket,
  FiShield,
  FiBarChart2,
  FiArrowRight,
  FiArrowLeft,
  FiChevronDown,
  FiExternalLink,
} from "react-icons/fi";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { mockPayments } from "../utils/mockPayments";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Payment status constants
const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
  DISPUTED: "disputed",
  CANCELLED: "cancelled",
};

// Payment method constants
const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  PAYPAL: "paypal",
  BANK_TRANSFER: "bank_transfer",
  STRIPE: "stripe",
  RAZORPAY: "razorpay",
  CASH: "cash",
  CRYPTO: "crypto",
  OTHER: "other",
};

const statusColors = {
  [PAYMENT_STATUS.COMPLETED]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [PAYMENT_STATUS.PENDING]:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  [PAYMENT_STATUS.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [PAYMENT_STATUS.REFUNDED]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  [PAYMENT_STATUS.DISPUTED]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [PAYMENT_STATUS.CANCELLED]:
    "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300",
};

const methodIcons = {
  [PAYMENT_METHODS.CREDIT_CARD]: (
    <FiCreditCard className="h-4 w-4 mr-2 text-blue-500" />
  ),
  [PAYMENT_METHODS.PAYPAL]: <FiPocket className="h-4 w-4 mr-2 text-blue-400" />,
  [PAYMENT_METHODS.BANK_TRANSFER]: (
    <FiDollarSign className="h-4 w-4 mr-2 text-green-500" />
  ),
  [PAYMENT_METHODS.STRIPE]: (
    <FiCreditCard className="h-4 w-4 mr-2 text-purple-500" />
  ),
  [PAYMENT_METHODS.RAZORPAY]: (
    <FiDollarSign className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [PAYMENT_METHODS.CASH]: (
    <FiDollarSign className="h-4 w-4 mr-2 text-emerald-500" />
  ),
  [PAYMENT_METHODS.CRYPTO]: (
    <FiDollarSign className="h-4 w-4 mr-2 text-orange-500" />
  ),
  [PAYMENT_METHODS.OTHER]: (
    <FiDollarSign className="h-4 w-4 mr-2 text-gray-500" />
  ),
};

const Payments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for modals and UI
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Form states
  const [newPaymentRequest, setNewPaymentRequest] = useState({
    customerId: "",
    amount: "",
    currency: "USD",
    dueDate: new Date(),
    description: "",
  });

  const [refundData, setRefundData] = useState({
    amount: "",
    reason: "",
    notes: "",
  });

  const [filters, setFilters] = useState({
    status: "",
    method: "",
    dateRange: [null, null],
    minAmount: "",
    maxAmount: "",
  });

  // React Query for data fetching
  const { data: payments = [], isLoading } = useQuery("payments", async () => {
    return mockPayments;
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleCapturePayment = useCallback((paymentId) => {
    toast.success(`Payment ${paymentId} captured successfully`);
  }, []);

  const handleVoidPayment = useCallback((paymentId) => {
    toast.success(`Payment ${paymentId} voided successfully`);
  }, []);

  // Mutations for actions
  const refundMutation = useMutation(
    (refundData) => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("payments");
        toast.success("Refund processed successfully");
        setShowRefundModal(false);
      },
      onError: () => {
        toast.error("Failed to process refund");
      },
    }
  );

  const requestPaymentMutation = useMutation(
    (paymentData) => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("payments");
        toast.success("Payment request sent successfully");
        setShowRequestModal(false);
      },
      onError: () => {
        toast.error("Failed to send payment request");
      },
    }
  );

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const completed = payments.filter(
      (p) => p.status === PAYMENT_STATUS.COMPLETED
    ).length;
    const pending = payments.filter(
      (p) => p.status === PAYMENT_STATUS.PENDING
    ).length;
    const failed = payments.filter(
      (p) => p.status === PAYMENT_STATUS.FAILED
    ).length;
    const refunded = payments.filter(
      (p) =>
        p.status === PAYMENT_STATUS.REFUNDED ||
        p.status === PAYMENT_STATUS.PARTIALLY_REFUNDED
    ).length;
    const disputed = payments.filter(
      (p) => p.status === PAYMENT_STATUS.DISPUTED
    ).length;

    return {
      totalAmount,
      completed,
      pending,
      failed,
      refunded,
      disputed,
    };
  }, [payments]);

  // Filter payments based on active tab and filters
  const filteredPayments = useMemo(() => {
    let result = payments;

    // Apply tab filter
    if (activeTab !== "all") {
      result = result.filter((payment) => payment.status === activeTab);
    }

    // Apply other filters
    if (filters.status) {
      result = result.filter((payment) => payment.status === filters.status);
    }
    if (filters.method) {
      result = result.filter((payment) => payment.method === filters.method);
    }
    if (filters.dateRange[0] && filters.dateRange[1]) {
      result = result.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate >= filters.dateRange[0] &&
          paymentDate <= filters.dateRange[1]
        );
      });
    }
    if (filters.minAmount) {
      result = result.filter(
        (payment) => payment.amount >= parseFloat(filters.minAmount)
      );
    }
    if (filters.maxAmount) {
      result = result.filter(
        (payment) => payment.amount <= parseFloat(filters.maxAmount)
      );
    }

    return result;
  }, [
    payments,
    activeTab,
    filters.status,
    filters.method,
    filters.dateRange,
    filters.minAmount,
    filters.maxAmount,
  ]);

  // Memoized handlers for table actions
  const handleViewDetails = useCallback(
    (paymentId) => {
      navigate(`/dashboard/payment-details/${paymentId}`);
    },
    [navigate]
  );

  const handleProcessRefund = useCallback((payment) => {
    setSelectedPayment(payment);
    setRefundData({
      amount: payment.amount.toString(),
      reason: "",
      notes: "",
    });
    setShowRefundModal(true);
  }, []);

  // Memoize the data for the table
  const tableData = useMemo(() => filteredPayments, [filteredPayments]);

  // Memoize the columns configuration
  const tableColumns = useMemo(
    () => [
      {
        Header: "Payment ID",
        accessor: "id",
        Cell: ({ value, row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {value}
            </span>
            {row.original.invoiceId && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Invoice: {row.original.invoiceId}
              </span>
            )}
          </div>
        ),
      },
      {
        Header: "Customer",
        accessor: "customer",
        Cell: ({ value }) => (
          <div className="flex flex-col">
            <span className="font-medium">{value.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {value.email}
            </span>
          </div>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => (
          <div className="flex flex-col">
            <span>{new Date(value).toLocaleDateString()}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(value).toLocaleTimeString()}
            </span>
          </div>
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">
              {row.original.amount.toFixed(2)} {row.original.currency}
            </span>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Fee: {row.original.fee.toFixed(2)}
              </span>
              <span className="text-blue-600 dark:text-blue-400">
                Net: {row.original.netAmount.toFixed(2)}
              </span>
            </div>
          </div>
        ),
      },
      {
        Header: "Method",
        accessor: "method",
        Cell: ({ value }) => (
          <div className="flex items-center">
            {methodIcons[value]}
            <span>
              {value
                .split("_")
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(" ")}
            </span>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value]}`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewDetails(row.original.id)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="View Details"
            >
              <FiEye className="h-4 w-4" />
            </button>

            {row.original.status === PAYMENT_STATUS.PENDING && (
              <>
                <button
                  onClick={() => handleCapturePayment(row.original.id)}
                  className="p-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300"
                  title="Capture Payment"
                >
                  <FiCheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleVoidPayment(row.original.id)}
                  className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300"
                  title="Void Payment"
                >
                  <FiXCircle className="h-4 w-4" />
                </button>
              </>
            )}

            {(row.original.status === PAYMENT_STATUS.COMPLETED ||
              row.original.status === PAYMENT_STATUS.PARTIALLY_REFUNDED) && (
              <button
                onClick={() => handleProcessRefund(row.original)}
                className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
                title="Process Refund"
                disabled={refundMutation.isLoading}
              >
                <FiRefreshCw className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="Print Receipt"
            >
              <FiPrinter className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [
      handleViewDetails,
      handleProcessRefund,
      handleCapturePayment,
      handleVoidPayment,
      refundMutation.isLoading,
    ]
  );

  // Create a stable table instance
  const tableInstance = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: { 
        pageIndex: 0, 
        pageSize: 10,
        sortBy: [{ id: 'date', desc: true }] // Default sort
      },
      // Disable auto-reset behaviors to prevent infinite loops
      autoResetPage: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = tableInstance;

  // Chart data
  const paymentMethodsData = useMemo(() => ({
    labels: Object.values(PAYMENT_METHODS).map((method) =>
      method
        .split("_")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")
    ),
    datasets: [
      {
        data: Object.values(PAYMENT_METHODS).map(
          (method) => payments.filter((p) => p.method === method).length
        ),
        backgroundColor: [
          "#3B82F6", // blue
          "#10B981", // green
          "#F59E0B", // yellow
          "#6366F1", // indigo
          "#EC4899", // pink
          "#8B5CF6", // violet
          "#64748B", // slate
          "#F97316", // orange
        ],
        borderWidth: 0,
      },
    ],
  }), [payments]);

  const paymentStatusData = useMemo(() => ({
    labels: Object.values(PAYMENT_STATUS).map(
      (status) => status.charAt(0).toUpperCase() + status.slice(1)
    ),
    datasets: [
      {
        data: Object.values(PAYMENT_STATUS).map(
          (status) => payments.filter((p) => p.status === status).length
        ),
        backgroundColor: [
          "#10B981", // green (completed)
          "#F59E0B", // yellow (pending)
          "#EF4444", // red (failed)
          "#3B82F6", // blue (refunded)
          "#8B5CF6", // violet (partially_refunded)
          "#EC4899", // pink (disputed)
          "#64748B", // slate (cancelled)
        ],
        borderWidth: 0,
      },
    ],
  }), [payments]);

  const monthlyRevenueData = useMemo(() => ({
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          12000, 19000, 15000, 18000, 21000, 25000, 
          22000, 24000, 23000, 26000, 28000, 30000
        ],
        backgroundColor: "#3B82F6",
        borderRadius: 4,
      },
    ],
  }), []);

  // Handlers
  const handlePaymentRequestSubmit = useCallback((e) => {
    e.preventDefault();
    requestPaymentMutation.mutate(newPaymentRequest);
  }, [newPaymentRequest, requestPaymentMutation]);

  const handleRefundSubmit = useCallback((e) => {
    e.preventDefault();
    refundMutation.mutate({
      paymentId: selectedPayment.id,
      ...refundData,
    });
  }, [refundData, selectedPayment, refundMutation]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPayments.map((payment) => ({
        "Payment ID": payment.id,
        Customer: payment.customer.name,
        Date: new Date(payment.date).toLocaleDateString(),
        Amount: `${payment.amount.toFixed(2)} ${payment.currency}`,
        Fee: `${payment.fee.toFixed(2)} ${payment.currency}`,
        "Net Amount": `${payment.netAmount.toFixed(2)} ${payment.currency}`,
        Status:
          payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
        Method: payment.method
          .split("_")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" "),
        "Invoice ID": payment.invoiceId,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(
      workbook,
      `payments_export_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    toast.success("Payments exported to Excel");
  }, [filteredPayments]);

  // Memoize the table JSX to prevent unnecessary re-renders
  const tableElement = useMemo(() => (
    <table
      {...getTableProps()}
      className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
    >
      <thead className="bg-gray-50 dark:bg-gray-700">
        {headerGroups.map((headerGroup) => {
          const { key, ...restHeaderGroupProps } =
            headerGroup.getHeaderGroupProps();
          return (
            <tr key={key} {...restHeaderGroupProps}>
              {headerGroup.headers.map((column) => {
                const { key: headerKey, ...restHeaderProps } =
                  column.getHeaderProps(column.getSortByToggleProps());
                return (
                  <th
                    key={headerKey}
                    {...restHeaderProps}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FiChevronDown className="ml-1 h-4 w-4" />
                        ) : (
                          <FiChevronDown className="ml-1 h-4 w-4 transform rotate-180" />
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody
        {...getTableBodyProps()}
        className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        {isLoading ? (
          <tr>
            <td colSpan={tableColumns.length} className="px-6 py-4 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </td>
          </tr>
        ) : page.length > 0 ? (
          page.map((row) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr
                key={key}
                {...restRowProps}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {row.cells.map((cell) => {
                  const { key: cellKey, ...restCellProps } = cell.getCellProps();
                  return (
                    <td
                      key={cellKey}
                      {...restCellProps}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={tableColumns.length}
              className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
            >
              No payments found matching your criteria
            </td>
          </tr>
        )}
      </tbody>
    </table>
  ), [getTableProps, headerGroups, getTableBodyProps, isLoading, page, prepareRow, tableColumns]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all payment transactions
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiPlus className="mr-2" />
            Request Payment
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto pb-1 -mb-px space-x-4 scrollbar-hide">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            All Payments
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {payments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab(PAYMENT_STATUS.COMPLETED)}
            className={`flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === PAYMENT_STATUS.COMPLETED
                ? "text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <FiCheckCircle className="mr-1.5 h-4 w-4 flex-shrink-0" />
            Completed
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
              {stats.completed}
            </span>
          </button>
          <button
            onClick={() => setActiveTab(PAYMENT_STATUS.PENDING)}
            className={`flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap relative ${
              activeTab === PAYMENT_STATUS.PENDING
                ? "text-amber-600 border-b-2 border-amber-600 dark:text-amber-400 dark:border-amber-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0 animate-pulse" />
            Pending
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
              {stats.pending}
            </span>
          </button>
          <button
            onClick={() => setActiveTab(PAYMENT_STATUS.FAILED)}
            className={`flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === PAYMENT_STATUS.FAILED
                ? "text-red-600 border-b-2 border-red-600 dark:text-red-400 dark:border-red-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <FiAlertTriangle className="mr-1.5 h-4 w-4 flex-shrink-0" />
            Failed
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
              {stats.failed}
            </span>
          </button>
          <button
            onClick={() => setActiveTab(PAYMENT_STATUS.REFUNDED)}
            className={`flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === PAYMENT_STATUS.REFUNDED
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <FiRefreshCw className="mr-1.5 h-4 w-4 flex-shrink-0" />
            Refunded
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              {stats.refunded}
            </span>
          </button>
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mr-4">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Processed
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                $
                {stats.totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 mr-4">
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 mr-4">
              <FiClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 mr-4">
              <FiXCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Failed
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.failed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Monthly Revenue
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              Last 12 months
              <FiChevronDown className="ml-1 h-4 w-4" />
            </div>
          </div>
          <div className="h-64">
            <Bar
              data={monthlyRevenueData}
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
                    grid: {
                      color: "#E5E7EB",
                      borderDash: [5, 5],
                    },
                    ticks: {
                      callback: function (value) {
                        return "$" + value.toLocaleString();
                      },
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Payment Methods
          </h3>
          <div className="h-64">
            <Pie
              data={paymentMethodsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      color: "#6B7280",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            placeholder="Search payments..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FiFilter className="mr-2 h-4 w-4" />
            Filters
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">All Statuses</option>
                    {Object.entries(PAYMENT_STATUS).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Method
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                    value={filters.method}
                    onChange={(e) =>
                      setFilters({ ...filters, method: e.target.value })
                    }
                  >
                    <option value="">All Methods</option>
                    {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value
                          .split("_")
                          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                          .join(" ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Range
                  </label>
                  <DatePicker
                    selectsRange={true}
                    startDate={filters.dateRange[0]}
                    endDate={filters.dateRange[1]}
                    onChange={(update) => {
                      setFilters({ ...filters, dateRange: update });
                    }}
                    isClearable={true}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                    placeholderText="Select date range"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Min Amount
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      value={filters.minAmount}
                      onChange={(e) =>
                        setFilters({ ...filters, minAmount: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      value={filters.maxAmount}
                      onChange={(e) =>
                        setFilters({ ...filters, maxAmount: e.target.value })
                      }
                      placeholder="Any"
                    />
                  </div>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      status: "",
                      method: "",
                      dateRange: [null, null],
                      minAmount: "",
                      maxAmount: "",
                    })
                  }
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
        <div className="overflow-x-auto">
          {tableElement}
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">{pageIndex * pageSize + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    (pageIndex + 1) * pageSize,
                    filteredPayments.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredPayments.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">First</span>
                  <FiArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Last</span>
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Request Payment Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Request Payment
                </h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handlePaymentRequestSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    value={newPaymentRequest.customerId}
                    onChange={(e) =>
                      setNewPaymentRequest({
                        ...newPaymentRequest,
                        customerId: e.target.value,
                      })
                    }
                    required
                    placeholder="Customer ID or email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                        $
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="0.00"
                      value={newPaymentRequest.amount}
                      onChange={(e) =>
                        setNewPaymentRequest({
                          ...newPaymentRequest,
                          amount: e.target.value,
                        })
                      }
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <select
                        className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 dark:text-gray-400 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                        value={newPaymentRequest.currency}
                        onChange={(e) =>
                          setNewPaymentRequest({
                            ...newPaymentRequest,
                            currency: e.target.value,
                          })
                        }
                      >
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>JPY</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <DatePicker
                    selected={newPaymentRequest.dueDate}
                    onChange={(date) =>
                      setNewPaymentRequest({
                        ...newPaymentRequest,
                        dueDate: date,
                      })
                    }
                    minDate={new Date()}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    value={newPaymentRequest.description}
                    onChange={(e) =>
                      setNewPaymentRequest({
                        ...newPaymentRequest,
                        description: e.target.value,
                      })
                    }
                    placeholder="What is this payment for?"
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={requestPaymentMutation.isLoading}
                  >
                    {requestPaymentMutation.isLoading
                      ? "Sending..."
                      : "Send Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Refund Payment Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Process Refund
                </h3>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Payment ID: {selectedPayment.id}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Customer: {selectedPayment.customer.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                        ${selectedPayment.amount.toFixed(2)}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[selectedPayment.status]
                        }`}
                      >
                        {selectedPayment.status.charAt(0).toUpperCase() +
                          selectedPayment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleRefundSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Refund Amount
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                        $
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0.01"
                      max={selectedPayment.amount}
                      step="0.01"
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="0.00"
                      value={refundData.amount}
                      onChange={(e) =>
                        setRefundData({
                          ...refundData,
                          amount: e.target.value,
                        })
                      }
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                        {selectedPayment.currency}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum refundable amount: $
                    {selectedPayment.amount.toFixed(2)}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason for Refund
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    value={refundData.reason}
                    onChange={(e) =>
                      setRefundData({
                        ...refundData,
                        reason: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="duplicate">Duplicate payment</option>
                    <option value="fraudulent">Fraudulent payment</option>
                    <option value="requested_by_customer">
                      Requested by customer
                    </option>
                    <option value="product_not_received">
                      Product not received
                    </option>
                    <option value="product_unacceptable">
                      Product unacceptable
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {refundData.reason === "other" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Details
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Please provide details about the refund reason"
                      value={refundData.notes}
                      onChange={(e) =>
                        setRefundData({ ...refundData, notes: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRefundModal(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={refundMutation.isLoading}
                  >
                    {refundMutation.isLoading
                      ? "Processing..."
                      : "Process Refund"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;