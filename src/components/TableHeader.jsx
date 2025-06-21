import React from "react";
import { BiSortAlt2 } from "react-icons/bi";

function TableHeader() {
  const headers = [
    { name: "Product", sortable: true, key: "name" },
    { name: "Price", sortable: true, key: "price" },
    { name: "Size", sortable: true, key: "size" },
    { name: "QTY", sortable: true, key: "qty" },
    { name: "Date", sortable: true, key: "date" },
    { name: "Status", sortable: true, key: "status" },
    { name: "Action", sortable: false, key: "action" },
  ];

  return (
    <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          <input
            type="checkbox"
            className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
          />
        </th>
        {headers.map((header) => (
          <th
            key={header.name}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            <div className="flex items-center whitespace-nowrap">
              {" "}
              {/* Ensure no wrapping */}
              {header.name}
              {header.sortable && (
                <button className="ml-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none">
                  <BiSortAlt2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
