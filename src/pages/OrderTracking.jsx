import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiPackage,
  FiEdit,
  FiMapPin,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import "react-circular-progressbar/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock API function
const fetchTrackingDetails = async (trackingId) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockData = {
    trackingId,
    orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customer: "John Smith",
    status: "shipped", // Can be: processing, shipped, delivered, returned, failed
    carrier: "FedEx",
    estimatedDelivery: "2023-07-15",
    items: [
      { id: "ITM-001", name: "Wireless Headphones", quantity: 1, price: 99.99 },
      { id: "ITM-002", name: "Phone Case", quantity: 2, price: 25.0 },
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    history: [
      {
        status: "processing",
        date: "2023-07-05T10:30:00",
        location: "Warehouse A",
        description: "Order received and being processed",
      },
      {
        status: "shipped",
        date: "2023-07-07T14:15:00",
        location: "Distribution Center",
        description: "Package left our facility",
      },
    ],
    currentLocation: {
      city: "Chicago",
      state: "IL",
      country: "United States",
      lastUpdated: "2023-07-10T09:45:00",
    },
  };

  return mockData;
};

const updateOrderStatus = async (trackingId, newStatus) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, newStatus };
};

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchTrackingDetails(trackingId);
      setOrderData(data);
      setSelectedStatus(data.status);
      toast.success("Order details loaded successfully");
    } catch (error) {
      toast.error("Failed to fetch order details");
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === orderData.status) return;

    setIsUpdating(true);
    try {
      const result = await updateOrderStatus(trackingId, selectedStatus);
      if (result.success) {
        setOrderData((prev) => ({
          ...prev,
          status: result.newStatus,
          history: [
            ...prev.history,
            {
              status: result.newStatus,
              date: new Date().toISOString(),
              location: "Admin Update",
              description: `Status manually updated to ${result.newStatus}`,
            },
          ],
        }));
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      case "processing":
        return <FiClock className="text-yellow-500" />;
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "failed":
        return <FiAlertCircle className="text-red-500" />;
      case "returned":
        return <FiPackage className="text-purple-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const statusSteps = [
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "In Transit", value: "transit" },
    { label: "Delivered", value: "delivered" },
  ];

  const activeStep =
    statusSteps.findIndex((step) => step.value === orderData?.status) || 0;

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Track Order
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Enter tracking ID to view order details and update status
          </p>
        </div>

        {/* Search Form */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
          <form onSubmit={handleTrackOrder} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Enter tracking ID (e.g. FX123456789)"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <FiSearch />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {orderData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Order Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Order Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Order ID
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {orderData.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Customer
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {orderData.customer}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tracking ID
                    </p>
                    <p className="text-blue-600 dark:text-blue-400">
                      {orderData.trackingId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Shipping Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Carrier
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {orderData.carrier}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Est. Delivery
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(
                        orderData.estimatedDelivery
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Current Location
                    </p>
                    <p className="text-gray-900 dark:text-white flex items-center gap-1">
                      <FiMapPin className="text-red-500" />
                      {orderData.currentLocation.city},{" "}
                      {orderData.currentLocation.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Update Status
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="returned">Returned</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || selectedStatus === orderData.status}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <FiRefreshCw className="animate-spin" />
                    ) : (
                      <FiEdit />
                    )}
                    Update
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-600 rounded-md">
                  <div
                    className={`p-2 rounded-full ${
                      getStatusColor(orderData.status).bg
                    }`}
                  >
                    {getStatusIcon(orderData.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {orderData.status}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated:{" "}
                      {new Date(
                        orderData.history[orderData.history.length - 1].date
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="mb-8">
              <Stepper activeStep={activeStep} alternativeLabel>
                {statusSteps.map((step) => (
                  <Step key={step.value}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>

            {/* Items List */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Order Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Product
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Quantity
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item) => (
                      <tr
                        key={item.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Order History
              </h3>
              <div className="space-y-4">
                {orderData.history.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-2 rounded-full ${
                          getStatusColor(event.status).bg
                        }`}
                      >
                        {getStatusIcon(event.status)}
                      </div>
                      {index !== orderData.history.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-600"></div>
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {event.status}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {event.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Helper function
const getStatusColor = (status) => {
  return (
    {
      processing: { bg: "bg-yellow-50", text: "text-yellow-600" },
      shipped: { bg: "bg-blue-50", text: "text-blue-600" },
      delivered: { bg: "bg-green-50", text: "text-green-600" },
      failed: { bg: "bg-red-50", text: "text-red-600" },
      returned: { bg: "bg-purple-50", text: "text-purple-600" },
    }[status] || { bg: "bg-gray-50", text: "text-gray-600" }
  );
};

export default TrackOrder;
