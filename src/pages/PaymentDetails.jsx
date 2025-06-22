import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPrinter,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiCreditCard,
  FiPocket,
  FiDollarSign,
  FiShield,
  FiExternalLink,
  FiEdit,
  FiCopy,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { mockPayments } from "../utils/mockPayments";
import Timeline from "../components/Timeline";

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
  credit_card: <FiCreditCard className="h-5 w-5 text-blue-500" />,
  paypal: <FiPocket className="h-5 w-5 text-blue-400" />,
  bank_transfer: <FiDollarSign className="h-5 w-5 text-green-500" />,
  stripe: <FiCreditCard className="h-5 w-5 text-purple-500" />,
  razorpay: <FiDollarSign className="h-5 w-5 text-indigo-500" />,
  cash: <FiDollarSign className="h-5 w-5 text-emerald-500" />,
  crypto: <FiDollarSign className="h-5 w-5 text-orange-500" />,
  other: <FiDollarSign className="h-5 w-5 text-gray-500" />,
};

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundNotes, setRefundNotes] = useState("");

  // Fetch payment details
  const { data: payment, isLoading } = useQuery(
    ["payment", id],
    async () => {
      const foundPayment = mockPayments.find((p) => p.id === id);
      if (!foundPayment) {
        throw new Error("Payment not found");
      }
      return foundPayment;
    }
  );

  // Mutations for actions
  const refundMutation = useMutation(
    (refundData) => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["payment", paymentId]);
        toast.success("Refund processed successfully");
        setShowRefundModal(false);
      },
      onError: () => {
        toast.error("Failed to process refund");
      },
    }
  );

  const captureMutation = useMutation(
    () => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["payment", paymentId]);
        toast.success("Payment captured successfully");
        setShowCaptureModal(false);
      },
      onError: () => {
        toast.error("Failed to capture payment");
      },
    }
  );

  const voidMutation = useMutation(
    () => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["payment", paymentId]);
        toast.success("Payment voided successfully");
        setShowVoidModal(false);
      },
      onError: () => {
        toast.error("Failed to void payment");
      },
    }
  );

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleProcessRefund = () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }
    if (parseFloat(refundAmount) > payment.amount) {
      toast.error("Refund amount cannot exceed payment amount");
      return;
    }
    if (!refundReason) {
      toast.error("Please select a refund reason");
      return;
    }

    refundMutation.mutate({
      paymentId: payment.id,
      amount: parseFloat(refundAmount),
      reason: refundReason,
      notes: refundNotes,
    });
  };

  const handleCapturePayment = () => {
    captureMutation.mutate();
  };

  const handleVoidPayment = () => {
    voidMutation.mutate();
  };

  const handlePrintReceipt = () => {
    toast.info("Printing receipt...");
    // In a real app, this would open a print dialog with a formatted receipt
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt downloaded successfully");
    // In a real app, this would generate and download a PDF receipt
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Payment Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            The payment you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transaction ID: {payment.id}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Payment Summary
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[payment.status]
                  }`}
                >
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Customer
                  </h3>
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                      {payment.customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {payment.customer.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.customer.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Payment Method
                  </h3>
                  <div className="flex items-center">
                    {methodIcons[payment.method]}
                    <span className="font-medium">
                      {payment.method
                        .split("_")
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(" ")}
                    </span>
                  </div>
                  {payment.method === "credit_card" && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      **** **** **** {payment.last4}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    Amount
                  </span>
                  <span className="font-medium">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Fee</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {payment.fee.toFixed(2)} {payment.currency}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {payment.tax?.toFixed(2) || "0.00"} {payment.currency}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">
                    Net Amount
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {payment.netAmount.toFixed(2)} {payment.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={handlePrintReceipt}
                  className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FiPrinter className="mr-2 h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={handleDownloadReceipt}
                  className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FiDownload className="mr-2 h-4 w-4" />
                  Download
                </button>
              </div>
              <div className="flex space-x-3">
                {payment.status === PAYMENT_STATUS.PENDING && (
                  <>
                    <button
                      onClick={() => setShowCaptureModal(true)}
                      className="flex items-center px-3 py-2 border border-transparent rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={captureMutation.isLoading}
                    >
                      <FiCheckCircle className="mr-2 h-4 w-4" />
                      {captureMutation.isLoading ? "Processing..." : "Capture"}
                    </button>
                    <button
                      onClick={() => setShowVoidModal(true)}
                      className="flex items-center px-3 py-2 border border-transparent rounded-lg bg-red-600 hover:bg-red-700 text-white"
                      disabled={voidMutation.isLoading}
                    >
                      <FiXCircle className="mr-2 h-4 w-4" />
                      {voidMutation.isLoading ? "Processing..." : "Void"}
                    </button>
                  </>
                )}
                {(payment.status === PAYMENT_STATUS.COMPLETED ||
                  payment.status === PAYMENT_STATUS.PARTIALLY_REFUNDED) && (
                  <button
                    onClick={() => {
                      setShowRefundModal(true);
                      setRefundAmount(payment.amount.toString());
                    }}
                    className="flex items-center px-3 py-2 border border-transparent rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={refundMutation.isLoading}
                  >
                    <FiRefreshCw className="mr-2 h-4 w-4" />
                    {refundMutation.isLoading ? "Processing..." : "Refund"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payment Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Payment Timeline
              </h2>
              <Timeline events={payment.timeline} />
            </div>
          </div>
        </div>

        {/* Right Column - Additional Information */}
        <div className="space-y-6">
          {/* Payment Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Payment ID
                  </h3>
                  <div className="flex items-center">
                    <p className="font-mono text-gray-900 dark:text-white">
                      {payment.id}
                    </p>
                    <button
                      onClick={() => handleCopyToClipboard(payment.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      title="Copy to clipboard"
                    >
                      <FiCopy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {payment.invoiceId && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Invoice ID
                    </h3>
                    <div className="flex items-center">
                      <p className="font-mono text-gray-900 dark:text-white">
                        {payment.invoiceId}
                      </p>
                      <button
                        onClick={() => handleCopyToClipboard(payment.invoiceId)}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        title="Copy to clipboard"
                      >
                        <FiCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {payment.description || "No description provided"}
                  </p>
                </div>

                {payment.metadata &&
                  Object.keys(payment.metadata).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Metadata
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                        <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                          {JSON.stringify(payment.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Name
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {payment.customer.name}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {payment.customer.email}
                  </p>
                </div>

                {payment.customer.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Phone
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {payment.customer.phone}
                    </p>
                  </div>
                )}

                {payment.customer.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Address
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {payment.customer.address.line1}
                      <br />
                      {payment.customer.address.line2 && (
                        <>
                          {payment.customer.address.line2}
                          <br />
                        </>
                      )}
                      {payment.customer.address.city},{" "}
                      {payment.customer.address.state}{" "}
                      {payment.customer.address.postal_code}
                      <br />
                      {payment.customer.address.country}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          {payment.method === "credit_card" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Payment Method Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Card Type
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {payment.card.brand.charAt(0).toUpperCase() +
                        payment.card.brand.slice(1)}{" "}
                      ending in {payment.last4}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Expiration
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {payment.card.exp_month}/{payment.card.exp_year}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Cardholder Name
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {payment.card.name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Billing Address
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {payment.card.address_line1}
                      <br />
                      {payment.card.address_line2 && (
                        <>
                          {payment.card.address_line2}
                          <br />
                        </>
                      )}
                      {payment.card.address_city}, {payment.card.address_state}{" "}
                      {payment.card.address_zip}
                      <br />
                      {payment.card.address_country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
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

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Payment ID: {payment.id}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Customer: {payment.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
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
                      max={payment.amount}
                      step="0.01"
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="0.00"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                        {payment.currency}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum refundable amount: ${payment.amount.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason for Refund
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
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

                {refundReason === "other" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Please provide details about the refund reason"
                      value={refundNotes}
                      onChange={(e) => setRefundNotes(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessRefund}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={refundMutation.isLoading}
                >
                  {refundMutation.isLoading
                    ? "Processing..."
                    : "Process Refund"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Capture Modal */}
      {showCaptureModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Capture Payment
                </h3>
                <button
                  onClick={() => setShowCaptureModal(false)}
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

              <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      Payment ID: {payment.id}
                    </p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Customer: {payment.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to capture this payment? This action
                cannot be undone.
              </p>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCaptureModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCapturePayment}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  disabled={captureMutation.isLoading}
                >
                  {captureMutation.isLoading
                    ? "Processing..."
                    : "Capture Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Void Modal */}
      {showVoidModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Void Payment
                </h3>
                <button
                  onClick={() => setShowVoidModal(false)}
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

              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Payment ID: {payment.id}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Customer: {payment.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-800 dark:text-red-200">
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to void this payment? This action cannot
                be undone.
              </p>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVoidModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVoidPayment}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={voidMutation.isLoading}
                >
                  {voidMutation.isLoading ? "Processing..." : "Void Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetail;
