import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useTable, useSortBy, usePagination } from "react-table";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { debounce } from "lodash";
import ProductPDF from "../components/ProductPDF";

// Mock Product Data
const sneakersData = [
  {
    id: "021231",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Beigi Coffe (Navy)",
    price: 20.0,
    size: 40,
    qty: 234,
    date: "04/17/23 at 8:25 PM",
    status: "Available",
  },
  {
    id: "021232",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Beigi Coffe (Navy)",
    price: 20.0,
    size: 40,
    qty: 234,
    date: "04/17/23 at 8:25 PM",
    status: "Out of Stock",
  },
  {
    id: "021233",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Story Honzo (Cream)",
    price: 20.0,
    size: 40,
    qty: 234,
    date: "04/17/23 at 8:25 PM",
    status: "Available",
  },
  {
    id: "021234",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Kanky Kitadakate (Green)",
    price: 20.0,
    size: 40,
    qty: 234,
    date: "04/17/23 at 8:25 PM",
    status: "Out of Stock",
  },
  {
    id: "021235",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Story Honzo (Black)",
    price: 20.0,
    size: 40,
    qty: 234,
    date: "04/17/23 at 8:25 PM",
    status: "Available",
  },
  {
    id: "021236",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Story Honzo (Cream)",
    price: 20.0,
    size: 40,
    qty: 234,
    date: "04/17/23 at 8:25 PM",
    status: "Out of Stock",
  },
  {
    id: "021237",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Beigi Coffe (Navy)",
    price: 20.0,
    size: 40,
    qty: 234,
    date: "04/17/23 at 8:25 PM",
    status: "Out of Stock",
  },
  {
    id: "021238",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Kanky Kitadakate (Green)",
    price: 20.0,
    size: 40,
    qty: 234,
    date: "04/17/23 at 8:25 PM",
    status: "Available",
  },
  {
    id: "021239",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Extra Sneaker 1",
    price: 20.0,
    size: 41,
    qty: 100,
    date: "04/18/23 at 9:00 AM",
    status: "Available",
  },
  {
    id: "021240",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Extra Sneaker 2",
    price: 20.0,
    size: 42,
    qty: 50,
    date: "04/18/23 at 9:30 AM",
    status: "Out of Stock",
  },
  {
    id: "021241",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Extra Sneaker 3",
    price: 20.0,
    size: 39,
    qty: 150,
    date: "04/18/23 at 10:00 AM",
    status: "Available",
  },
  {
    id: "021242",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Extra Sneaker 4",
    price: 20.0,
    size: 40,
    qty: 200,
    date: "04/18/23 at 10:30 AM",
    status: "Available",
  },
  {
    id: "021243",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Extra Sneaker 5",
    price: 20.0,
    size: 41,
    qty: 75,
    date: "04/18/23 at 11:00 AM",
    status: "Out of Stock",
  },
];

const Sneakers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPrice, setFilterPrice] = useState([0, 100]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page on search
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return sneakersData.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.includes(searchTerm);
      const matchesStatus =
        filterStatus === "all" || product.status === filterStatus;
      const matchesPrice =
        product.price >= filterPrice[0] && product.price <= filterPrice[1];
      return matchesSearch && matchesStatus && matchesPrice;
    });
  }, [searchTerm, filterStatus, filterPrice]);

  // React Table configuration
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ value }) => <span className="font-mono">#{value}</span>,
      },
      {
        Header: "Product",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="flex items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-10 h-10 rounded-md object-cover mr-3"
            />
            <span>{row.original.name}</span>
          </div>
        ),
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `$${value.toFixed(2)}`,
      },
      {
        Header: "Size",
        accessor: "size",
      },
      {
        Header: "Stock",
        accessor: "qty",
      },
      {
        Header: "Date Added",
        accessor: "date",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === "Available"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/products/edit/${row.original.id}`)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="Edit"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => console.log("Delete", row.original.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
            <button
              onClick={() => navigate(`/products/view/${row.original.id}`)}
              className="p-1 text-gray-600 hover:bg-gray-50 rounded"
              title="View"
            >
              <FiEye size={16} />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredProducts,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  // Bulk actions
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const selectAllRows = () => {
    if (selectedRows.length === page.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(page.map((row) => row.original.id));
    }
  };

  const handleBulkDelete = () => {
    console.log("Deleting selected rows:", selectedRows);
    // Implement actual deletion logic
    setSelectedRows([]);
    setIsBulkActionOpen(false);
  };

  // Export functions
  const handleExport = (format) => {
    setExportFormat(format);

    const dataToExport = filteredProducts.map(({ image, ...rest }) => rest);

    if (format === "excel") {
      const headers = [
        "ID",
        "Name",
        "Price",
        "Size",
        "Stock",
        "Date",
        "Status",
      ];
      const excelData = [
        headers,
        ...dataToExport.map((product) => [
          product.id,
          product.name,
          product.price,
          product.size,
          product.qty,
          product.date,
          product.status,
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `Products_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } else if (format === "csv") {
      const csvData = dataToExport
        .map(
          (product) =>
            `${product.id},"${product.name}",${product.price},${product.size},${product.qty},"${product.date}","${product.status}"`
        )
        .join("\n");

      saveAs(
        new Blob([`ID,Name,Price,Size,Stock,Date,Status\n${csvData}`], {
          type: "text/csv;charset=utf-8",
        }),
        `Products_${new Date().toISOString().slice(0, 10)}.csv`
      );
    }

    setExportFormat(null);
  };

  return (
    <div
      className="min-h-screen 
         dark:bg-gray-900 bg-gray-50 dark:text-white
       transition-colors duration-200"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/dashboard"
                className={`ml-1 text-sm font-medium 
                  dark:text-gray-400 dark:hover:text-white
                  text-gray-700 hover:text-gray-900
               md:ml-2`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <Link
                  to="/dashboard/products/sneakers"
                  className={`ml-1 text-sm font-medium 
                      dark:text-gray-400 dark:hover:text-white
                      text-gray-700 hover:text-gray-900
                   md:ml-2`}
                >
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-blue-600 md:ml-2">
                  Sneakers
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sneakers
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your sneakers inventory ({filteredProducts.length}{" "}
              products)
            </p>
          </div>
          <Link
            to="/dashboard/products/add-product"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
          >
            <FiPlus className="mr-2" />
            Add New Product
          </Link>
        </div>

        {/* Product Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px space-x-8">
            {[
              { name: "All Products", count: sneakersData.length, slug: "all" },
              {
                name: "Available",
                count: sneakersData.filter((p) => p.status === "Available")
                  .length,
                slug: "available",
              },
              {
                name: "Out of Stock",
                count: sneakersData.filter((p) => p.status === "Out of Stock")
                  .length,
                slug: "out-of-stock",
              },
            ].map((tab) => (
              <button
                key={tab.slug}
                onClick={() =>
                  setFilterStatus(
                    tab.slug === "all"
                      ? "all"
                      : tab.slug === "available"
                      ? "Available"
                      : "Out of Stock"
                  )
                }
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  (filterStatus === "all" && tab.slug === "all") ||
                  (filterStatus === "Available" && tab.slug === "available") ||
                  (filterStatus === "Out of Stock" &&
                    tab.slug === "out-of-stock")
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleSearchChange}
                placeholder="Search products..."
                className={`block w-full pl-10 pr-3 py-2 border
                    dark:border-gray-700 dark:bg-gray-700 dark:text-white
                     border-gray-300 bg-white text-gray-900
                 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Bulk Actions */}
              {selectedRows.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsBulkActionOpen(!isBulkActionOpen)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Bulk Actions ({selectedRows.length})
                    <FiChevronDown className="ml-2 h-4 w-4" />
                  </button>
                  {isBulkActionOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <button
                          onClick={handleBulkDelete}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-600"
                          role="menuitem"
                        >
                          Delete Selected
                        </button>
                        <button
                          onClick={() => console.log("Export selected")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                          role="menuitem"
                        >
                          Export Selected
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setExportFormat(exportFormat ? null : "dropdown")
                  }
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiDownload className="mr-2 h-4 w-4" />
                  Export
                </button>
                {exportFormat === "dropdown" && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        onClick={() => handleExport("excel")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                        role="menuitem"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExport("csv")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                        role="menuitem"
                      >
                        Export as CSV
                      </button>
                      <PDFDownloadLink
                        document={<ProductPDF products={filteredProducts} />}
                        fileName={`Products_${new Date()
                          .toISOString()
                          .slice(0, 10)}.pdf`}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        {({ loading }) =>
                          loading ? "Preparing PDF..." : "Export as PDF"
                        }
                      </PDFDownloadLink>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Button */}
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FiFilter className="mr-2 h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Price Range Filter (example of additional filters) */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range: ${filterPrice[0]} - ${filterPrice[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={filterPrice[0]}
                onChange={(e) =>
                  setFilterPrice([parseInt(e.target.value), filterPrice[1]])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={filterPrice[1]}
                onChange={(e) =>
                  setFilterPrice([filterPrice[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead className={`dark:bg-gray-700 bg-gray-50`}>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length === page.length && page.length > 0
                        }
                        onChange={selectAllRows}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          {column.render("Header")}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FiChevronDown className="ml-1 h-4 w-4" />
                            ) : (
                              <FiChevronUp className="ml-1 h-4 w-4" />
                            )
                          ) : (
                            <span className="ml-1 h-4 w-4 opacity-0">
                              <FiChevronDown />
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className={`divide-y divide-gray-200 dark:divide-gray-700  dark:bg-gray-800 bg-white
                }`}
              >
                {page.length > 0 ? (
                  page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className={`${
                          selectedRows.includes(row.original.id)
                            ? "bg-blue-50 dark:bg-gray-700"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.original.id)}
                            onChange={() => toggleRowSelection(row.original.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No products found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className={`px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6
             dark:bg-gray-800 bg-white
            `}
          >
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className={`relative inline-flex items-center px-4 py-2 border dark:border-gray-600 border-gray-300
                 text-sm font-medium rounded-md
                    dark:text-gray-300 dark:bg-gray-700
                    text-gray-700 bg-white
                 ${
                  !canPreviousPage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border dark:border-gray-600 border-gray-300
                 text-sm font-medium rounded-md
                    dark:text-gray-300 dark:bg-gray-700
                    text-gray-700 bg-white
                 ${
                  !canNextPage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-medium">
                    {pageIndex * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      (pageIndex + 1) * pageSize,
                      filteredProducts.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
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
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border dark:border-gray-600 border-gray-300
                    dark:bg-gray-700 dark:text-gray-300
                    } text-sm font-medium ${
                      !canPreviousPage
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <FiChevronLeft className="h-5 w-5" />
                    <FiChevronLeft className="h-5 w-5 -ml-2" />
                  </button>
                  <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className={`relative inline-flex items-center px-2 py-2 border dark:border-gray-600 border-gray-300
                    dark:bg-gray-700 dark:text-gray-300
                    } text-sm font-medium ${
                      !canPreviousPage
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    let pageNumber;
                    if (pageCount <= 5) {
                      pageNumber = i;
                    } else if (pageIndex < 2) {
                      pageNumber = i;
                    } else if (pageIndex > pageCount - 3) {
                      pageNumber = pageCount - 5 + i;
                    } else {
                      pageNumber = pageIndex - 2 + i;
                    }
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => gotoPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border dark:border-gray-600 border-gray-300
                        } text-sm font-medium ${
                          pageIndex === pageNumber
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                            : `dark:bg-gray-700 dark:text-gray-300
                                  bg-white text-gray-500
                              hover:bg-gray-50 dark:hover:bg-gray-600`
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  })}
                  {pageCount > 5 && (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className={`relative inline-flex items-center px-2 py-2 border dark:border-gray-600 border-gray-300
                    dark:bg-gray-700 dark:text-gray-300
                        bg-white text-gray-500
                    } text-sm font-medium ${
                      !canNextPage
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border dark:border-gray-600 border-gray-300
                     dark:bg-gray-700 dark:text-gray-300
                        bg-white text-gray-500
                    } text-sm font-medium ${
                      !canNextPage
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <FiChevronRight className="h-5 w-5" />
                    <FiChevronRight className="h-5 w-5 -ml-2" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sneakers;
