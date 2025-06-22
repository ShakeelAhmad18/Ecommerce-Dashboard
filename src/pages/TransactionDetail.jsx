import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiPrinter,
  FiDownload,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiCreditCard,
  FiDollarSign,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiPackage,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import Timeline from "../components/Timeline";
import { mockPayments } from "../utils/mockPayments";

const TransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [printMode, setPrintMode] = useState(false);

  // Status icons and colors
  const statusConfig = {
    completed: {
      icon: <FiCheckCircle className="text-emerald-500" />,
      color: "bg-emerald-100 text-emerald-800",
      label: "Completed",
    },
    shipping: {
      icon: <FiTruck className="text-blue-500" />,
      color: "bg-blue-100 text-blue-800",
      label: "Shipping",
    },
    cancelled: {
      icon: <FiXCircle className="text-red-500" />,
      color: "bg-red-100 text-red-800",
      label: "Cancelled",
    },
    pending: {
      icon: <FiClock className="text-amber-500" />,
      color: "bg-amber-100 text-amber-800",
      label: "Pending",
    },
    refunded: {
      icon: <FiRefreshCw className="text-indigo-500" />,
      color: "bg-indigo-100 text-indigo-800",
      label: "Refunded",
    },
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        // Simulate API call with mock data
        setTimeout(() => {
          const foundTransaction = mockPayments.find(
            (txn) => txn.id === `PAY-${id}`
          );

          if (foundTransaction) {
            setTransaction({
              ...foundTransaction,
              // Add additional fields for the detail view
              trackingNumber: `TRK${Math.floor(
                10000000 + Math.random() * 90000000
              )}`,
              estimatedDelivery: new Date(
                new Date(foundTransaction.date).getTime() +
                  Math.floor(Math.random() * 7 + 3) * 24 * 60 * 60 * 1000
              ).toISOString(),
              shippingAddress: {
                name: foundTransaction.customer.name,
                street: `${Math.floor(Math.random() * 1000) + 1} Main St`,
                city: [
                  "New York",
                  "Los Angeles",
                  "Chicago",
                  "Houston",
                  "Phoenix",
                ][Math.floor(Math.random() * 5)],
                state: ["NY", "CA", "IL", "TX", "AZ"][
                  Math.floor(Math.random() * 5)
                ],
                zip: Math.floor(10000 + Math.random() * 90000),
                country: "United States",
              },
              items: [
                {
                  id: "ITEM-001",
                  name: "Premium Widget",
                  quantity: 2,
                  price: 49.99,
                  image:
                    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                },
                {
                  id: "ITEM-002",
                  name: "Deluxe Accessory Kit",
                  quantity: 1,
                  price: 29.99,
                  image:
                    "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                },
              ],
            });
          } else {
            setError("Transaction not found");
          }
          setLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 500);
  };

  const handleExport = (format) => {
    if (format === "pdf") {
      // Implement PDF export
      alert("PDF export functionality would be implemented here");
    }
  };

  const handleSendReceipt = () => {
    // Implement email receipt functionality
    alert("Receipt would be emailed to the customer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-medium text-gray-900">
            Transaction Not Found
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link
            to="/dashboard/transactions"
            href="/transactions"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return null;
  }

  // Prepare timeline events
  const timelineEvents = [
    {
      id: "1",
      status: "created",
      description: "Order created",
      timestamp: transaction.date,
    },
    {
      id: "2",
      status: "payment_method_added",
      description: "Payment method added",
      timestamp: new Date(
        new Date(transaction.date).getTime() + 5 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "3",
      status: "authorized",
      description: "Payment authorized",
      amount: transaction.amount,
      currency: transaction.currency,
      timestamp: new Date(
        new Date(transaction.date).getTime() + 10 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "4",
      status: "captured",
      description: "Payment captured",
      amount: transaction.amount,
      currency: transaction.currency,
      timestamp: new Date(
        new Date(transaction.date).getTime() + 15 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "5",
      status: "succeeded",
      description: "Order processed",
      timestamp: new Date(
        new Date(transaction.date).getTime() + 30 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "6",
      status: "shipping",
      description: "Order shipped",
      timestamp: new Date(
        new Date(transaction.date).getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];

  // Calculate totals
  const subtotal = transaction.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // Example tax calculation
  const shipping = 5.99; // Example shipping cost
  const total = subtotal + tax + shipping;

  return (
    <div
      className={`min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 ${
        printMode ? "print-mode" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with back button and actions */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <Link
              to="/dashboard/transactions"
              className="mr-4 p-2 rounded-md hover:bg-gray-100"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Transaction #{transaction.id}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPrinter className="mr-2 h-4 w-4" />
              Print
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={handleSendReceipt}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiMail className="mr-2 h-4 w-4" />
              Send Receipt
            </button>
          </div>
        </div>

        {/* Status banner */}
        <div className="mb-6">
          <div
            className={`p-4 rounded-lg ${
              statusConfig[transaction.status.toLowerCase()]?.color ||
              "bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3">
                {statusConfig[transaction.status.toLowerCase()]?.icon || (
                  <FiClock className="h-5 w-5" />
                )}
              </span>
              <div>
                <h3 className="text-lg font-medium">
                  {statusConfig[transaction.status.toLowerCase()]?.label ||
                    transaction.status}
                </h3>
                {transaction.status.toLowerCase() === "shipping" && (
                  <p className="text-sm mt-1">
                    Estimated delivery:{" "}
                    {new Date(
                      transaction.estimatedDelivery
                    ).toLocaleDateString()}
                    {transaction.trackingNumber && (
                      <> • Tracking #: {transaction.trackingNumber}</>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "timeline"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "items"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Items ({transaction.items.length})
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "payment"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payment
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "shipping"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Shipping
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {activeTab === "overview" && (
            <div className="px-4 py-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {transaction.items.map((item, itemIdx) => (
                        <li key={item.id} className="mb-6">
                          <div className="relative pb-8">
                            {itemIdx !== transaction.items.length - 1 ? (
                              <span
                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-gray-800 font-medium">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item.quantity} • $
                                    {item.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        ${shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 text-base font-medium border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        {transaction.customer.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {transaction.customer.email}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Customer since{" "}
                        {new Date(
                          new Date(transaction.date).getTime() -
                            Math.floor(Math.random() * 365) *
                              24 *
                              60 *
                              60 *
                              1000
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Shipping Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FiMapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        {transaction.shippingAddress.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {transaction.shippingAddress.street}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.shippingAddress.city},{" "}
                        {transaction.shippingAddress.state}{" "}
                        {transaction.shippingAddress.zip}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Order Timeline
              </h3>
              <Timeline events={timelineEvents} />
            </div>
          )}

          {activeTab === "items" && (
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Ordered Items ({transaction.items.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transaction.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                SKU: {item.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Payment Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium border-t border-gray-200 pt-2 mt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Payment Method
                    </h4>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FiCreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.method === "credit_card"
                            ? "Visa ending in 4242"
                            : transaction.method.charAt(0).toUpperCase() +
                              transaction.method.slice(1)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.payment === "Paid"
                            ? "Paid on " +
                              new Date(transaction.date).toLocaleDateString()
                            : "Payment pending"}
                        </p>
                        {transaction.gatewayId && (
                          <p className="text-xs text-gray-400 mt-1">
                            Transaction ID: {transaction.gatewayId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Billing Information
                    </h4>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.customer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.customer.email}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Same as shipping address
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Shipping Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Shipping Address
                    </h4>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FiMapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.shippingAddress.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.shippingAddress.street}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.shippingAddress.city},{" "}
                          {transaction.shippingAddress.state}{" "}
                          {transaction.shippingAddress.zip}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Shipping Method
                    </h4>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FiTruck className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Standard Shipping
                        </p>
                        <p className="text-sm text-gray-500">
                          Estimated delivery:{" "}
                          {new Date(
                            transaction.estimatedDelivery
                          ).toLocaleDateString()}
                        </p>
                        {transaction.trackingNumber && (
                          <p className="text-sm text-gray-500 mt-1">
                            Tracking #: {transaction.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Package Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <FiPackage className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            Package 1 of 1
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.items.length} items
                          </p>
                          <p className="text-sm text-gray-500">
                            Weight: 2.5 lbs
                          </p>
                          <p className="text-sm text-gray-500">
                            Dimensions: 12 × 8 × 4 in
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Shipping History
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <FiCheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-800">
                                Package shipped
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  new Date(transaction.date).getTime() +
                                    24 * 60 * 60 * 1000
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <FiClock className="h-4 w-4 text-amber-500" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-800">
                                In transit to destination
                              </p>
                              <p className="text-xs text-gray-500">
                                Expected{" "}
                                {new Date(
                                  transaction.estimatedDelivery
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print styles (hidden on screen) */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-mode,
          .print-mode * {
            visibility: visible;
          }
          .print-mode {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionDetail;
