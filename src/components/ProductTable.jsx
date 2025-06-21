import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 mb-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
          {products?.length > 0 ? (
            products?.map((product, index) => (
              <TableRow key={product.id + index} product={product} />
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
