import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiChevronRight,
  FiExternalLink,
} from "react-icons/fi";
import { IoMdRefresh } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Modal from "react-modal";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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
    width: "500px",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

const statusColors = {
  processing: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: "text-yellow-500",
  },
  shipped: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500" },
  delivered: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "text-green-500",
  },
  failed: { bg: "bg-red-50", text: "text-red-600", icon: "text-red-500" },
  returned: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: "text-purple-500",
  },
};

const statusIcons = {
  processing: <FiClock />,
  shipped: <FiTruck />,
  delivered: <FiCheckCircle />,
  failed: <FiAlertCircle />,
  returned: <FiPackage />,
};

const statusProgress = {
  processing: 30,
  shipped: 70,
  delivered: 100,
  failed: 100,
  returned: 100,
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    failed: 0,
  });

  // Simulate real-time data fetching with more realistic data
  useEffect(() => {
    const fetchOrders = () => {
      setIsLoading(true);
      // Mock API call with more realistic data
      setTimeout(() => {
        const mockOrders = [
          {
            id: "ORD-78945",
            customer: "John Smith",
            status: "shipped",
            items: [
              {
                id: "ITM-001",
                name: "Wireless Headphones",
                quantity: 1,
                price: 99.99,
              },
              { id: "ITM-002", name: "Phone Case", quantity: 2, price: 25.0 },
            ],
            amount: 149.99,
            time: "2 mins ago",
            shipping: {
              carrier: "FedEx",
              tracking: "FX123456789",
              estimatedDelivery: "2023-06-25",
            },
            payment: "VISA •••• 4242",
          },
          {
            id: "ORD-78944",
            customer: "Sarah Johnson",
            status: "processing",
            items: [
              {
                id: "ITM-003",
                name: "Smart Watch",
                quantity: 1,
                price: 199.99,
              },
              {
                id: "ITM-004",
                name: "Screen Protector",
                quantity: 2,
                price: 12.25,
              },
            ],
            amount: 224.5,
            time: "5 mins ago",
            shipping: {
              carrier: "UPS",
              tracking: "1Z123456789",
              estimatedDelivery: "2023-06-27",
            },
            payment: "MasterCard •••• 5555",
          },
          {
            id: "ORD-78943",
            customer: "Michael Brown",
            status: "delivered",
            items: [
              {
                id: "ITM-005",
                name: "Bluetooth Speaker",
                quantity: 2,
                price: 44.99,
              },
            ],
            amount: 89.99,
            time: "1 hour ago",
            shipping: {
              carrier: "USPS",
              tracking: "9400100000000000000000",
              estimatedDelivery: "2023-06-20",
              deliveredAt: "2023-06-19 14:30",
            },
            payment: "PayPal",
          },
          {
            id: "ORD-78942",
            customer: "Emily Davis",
            status: "failed",
            items: [
              { id: "ITM-006", name: "USB-C Cable", quantity: 1, price: 15.0 },
              { id: "ITM-007", name: "Power Bank", quantity: 1, price: 30.0 },
            ],
            amount: 45.0,
            time: "30 mins ago",
            shipping: null,
            payment: "AMEX •••• 1005",
            failureReason: "Payment declined",
          },
          {
            id: "ORD-78941",
            customer: "David Wilson",
            status: "returned",
            items: [
              {
                id: "ITM-008",
                name: "Wireless Earbuds",
                quantity: 1,
                price: 79.99,
              },
            ],
            amount: 79.99,
            time: "2 days ago",
            shipping: {
              carrier: "DHL",
              tracking: "1234567890",
              estimatedDelivery: "2023-06-15",
              returnedAt: "2023-06-18 10:15",
              returnReason: "Product not as described",
            },
            payment: "VISA •••• 1881",
          },
        ];

        setOrders(mockOrders);

        // Calculate stats
        setStats({
          totalOrders: mockOrders.length,
          processing: mockOrders.filter((o) => o.status === "processing")
            .length,
          shipped: mockOrders.filter((o) => o.status === "shipped").length,
          delivered: mockOrders.filter((o) => o.status === "delivered").length,
          failed: mockOrders.filter((o) => o.status === "failed").length,
          returned: mockOrders.filter((o) => o.status === "returned").length,
        });

        setIsLoading(false);
        setLastUpdated(new Date());
      }, 800);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 250000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const refreshData = () => {
    setIsLoading(true);
    setLastUpdated(new Date());
    // In a real app, this would trigger a re-fetch
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getStatusColor = (status) => {
    return statusColors[status] || statusColors.processing;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with stats */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Order Management
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            title="Total"
            value={stats.totalOrders}
            icon={<FiPackage className="text-gray-500" />}
            trend="up"
            trendValue="12%"
          />
          <StatCard
            title="Processing"
            value={stats.processing}
            icon={<FiClock className="text-yellow-500" />}
            trend="up"
            trendValue="3%"
          />
          <StatCard
            title="Shipped"
            value={stats.shipped}
            icon={<FiTruck className="text-blue-500" />}
            trend="down"
            trendValue="5%"
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            icon={<FiCheckCircle className="text-green-500" />}
            trend="up"
            trendValue="8%"
          />
          <StatCard
            title="Issues"
            value={stats.failed + (stats.returned || 0)}
            icon={<FiAlertCircle className="text-red-500" />}
            trend="down"
            trendValue="2%"
          />
        </div>
      </div>

      {/* Orders list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {isLoading ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 cursor-pointer"
                onClick={() => openOrderDetails(order)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="mr-4 flex-shrink-0">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          getStatusColor(order.status).bg
                        }`}
                      >
                        {React.cloneElement(statusIcons[order.status], {
                          className: `h-5 w-5 ${
                            getStatusColor(order.status).icon
                          }`,
                        })}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {order.id} • {order.customer}
                        </p>
                        {order.status === "failed" && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            Issue
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {order.items.length} items • ${order.amount.toFixed(2)}{" "}
                        • {order.payment}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <div className="w-8 h-8 mr-4">
                      <CircularProgressbar
                        value={statusProgress[order.status]}
                        styles={buildStyles({
                          pathColor:
                            order.status === "failed"
                              ? "#ef4444"
                              : order.status === "processing"
                              ? "#f59e0b"
                              : order.status === "shipped"
                              ? "#3b82f6"
                              : "#10b981",
                          trailColor: "#e5e7eb",
                          strokeWidth: 8,
                        })}
                      />
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-medium ${
                          getStatusColor(order.status).text
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {order.time}
                      </p>
                    </div>
                    <FiChevronRight className="ml-2 text-gray-400" />
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
          Showing {Math.min(orders.length, 5)} of {stats.totalOrders} orders
        </span>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          View all orders <FiExternalLink className="ml-1" />
        </button>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Order Details"
      >
        {selectedOrder && (
          <div className="dark:bg-gray-800">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Order #{selectedOrder.id}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Customer
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Placed {selectedOrder.time}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white">
                  {selectedOrder.customer}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Payment: {selectedOrder.payment}
                </p>
                {selectedOrder.failureReason && (
                  <p className="text-sm text-red-500 mt-1">
                    Reason: {selectedOrder.failureReason}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${selectedOrder.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedOrder.shipping && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Shipping
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Carrier
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {selectedOrder.shipping.carrier}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tracking
                      </p>
                      <p className="text-blue-600 dark:text-blue-400">
                        {selectedOrder.shipping.tracking}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Est. Delivery
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(
                          selectedOrder.shipping.estimatedDelivery
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedOrder.shipping.deliveredAt && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Delivered
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(
                            selectedOrder.shipping.deliveredAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedOrder.shipping.returnedAt && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Returned
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(
                            selectedOrder.shipping.returnedAt
                          ).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Reason: {selectedOrder.shipping.returnReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                Print
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                {selectedOrder.status === "failed"
                  ? "Retry Payment"
                  : "Update Status"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// StatCard component for the header stats
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
        {trendIcon} {trendValue} from yesterday
      </div>
    </div>
  );
};

export default Orders;
