import React from "react";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

const OrderTable = ({ orders }) => {
  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "Paid":
        // Green for Paid
        return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
      case "Unpaid":
        // Yellow for Unpaid
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100";
      default:
        // Default gray
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "Shipping":
        // Purple for Shipping
        return "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100";
      case "Completed":
        // Blue for Completed
        return "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100";
      case "Cancelled":
        // Red for Cancelled
        return "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100";
      default:
        // Default gray
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  // Placeholder for sorting functionality
  const handleSort = (column) => {
    console.log(`Sorting by ${column}`);
    // In a real app, you'd update state to trigger a sort on `orders`
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm">
      {" "}
      {/* Added rounded-lg and shadow-sm for modern look */}
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-500 dark:checked:border-blue-500" // Dark mode for checkbox
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <div className="flex items-center">
                Orders
                {/* Sort Icons - Placeholder */}
                <div className="ml-1 flex flex-col text-gray-400 dark:text-gray-500">
                  {" "}
                  {/* Dark mode for sort icons */}
                  <FiChevronUp
                    className="h-3 w-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" // Hover effects
                    onClick={() => handleSort("id")}
                  />
                  <FiChevronDown
                    className="h-3 w-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" // Hover effects
                    onClick={() => handleSort("id")}
                  />
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <div className="flex items-center">
                Customer
                <div className="ml-1 flex flex-col text-gray-400 dark:text-gray-500">
                  <FiChevronUp
                    className="h-3 w-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => handleSort("customer")}
                  />
                  <FiChevronDown
                    className="h-3 w-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => handleSort("customer")}
                  />
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <div className="flex items-center">
                Price
                <div className="ml-1 flex flex-col text-gray-400 dark:text-gray-500">
                  <FiChevronUp
                    className="h-3 w-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => handleSort("price")}
                  />
                  <FiChevronDown
                    className="h-3 w-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => handleSort("price")}
                  />
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <div className="flex items-center">
                Date
                <div className="ml-1 flex flex-col text-gray-400 dark:text-gray-500">
                  <FiChevronUp
                    className="h-3 w-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => handleSort("date")}
                  />
                  <FiChevronDown
                    className="h-3 w-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => handleSort("date")}
                  />
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {" "}
                {/* Hover effect for rows */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-500 dark:checked:border-blue-500" // Dark mode for checkbox
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" // Added border to image
                        src={order.image}
                        alt={order.productName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/40x40/cccccc/000000?text=IMG";
                        }} // Placeholder on error
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.productName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {" "}
                  {/* Changed to text-gray-900 for better contrast */}
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-semibold">
                  {" "}
                  {/* Changed to text-gray-900 and added font-semibold */}
                  {order.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {" "}
                  {/* Changed to text-gray-900 */}
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClass(
                      order.payment
                    )}`}
                  >
                    {order.payment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
