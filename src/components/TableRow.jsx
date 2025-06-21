import React from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

function TableRow({ product }) {
  const statusClass =
    product.status === "Available"
      ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
      : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
              src={product.image}
              alt={product.name}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {product.id}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {product.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        ${product.price.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {product.size}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {product.qty}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {product.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass} transition-colors duration-300`}
        >
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-3">
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            title="View Details"
          >
            <FiEye className="h-5 w-5" />
          </button>
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            title="Edit Product"
          >
            <FiEdit className="h-5 w-5" />
          </button>
          <button
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors duration-200"
            title="Delete Product"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TableRow;
