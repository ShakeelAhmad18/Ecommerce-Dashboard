import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import ProductTabs from "../components/ProductTabs";
import ProductTable from "../components/ProductTable";
import Pagination from "../components/Pagination";

// Import xlsx and file-saver
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Mock Product Data (keeping your original Unsplash URLs for consistency)
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

const Tshirts = () => {
  const [activeTab, setActiveTab] = useState("Sneakers");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [products, setProducts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchData = setTimeout(() => {
      setProducts(sneakersData);
    }, 300);
    return () => clearTimeout(fetchData);
  }, [activeTab]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- New function to handle Excel export ---
  const handleExport = () => {
    // Prepare the data for the Excel sheet
    // We'll exclude the 'image' property as it's a URL
    const dataToExport = sneakersData.map(({ image, ...rest }) => rest);

    // Define the headers you want in the Excel file
    const headers = [
      "ID",
      "Product Name",
      "Price",
      "Size",
      "Quantity",
      "Date",
      "Status",
    ];

    // Map your data to match the header order
    const excelData = [
      headers, // First row is headers
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

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products"); // Sheet name

    // Generate a file buffer
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    // Save the file
    saveAs(
      blob,
      `Jacket_Products_${new Date().toLocaleDateString("en-CA")}.xlsx`
    );
  };
  // --- End of new function ---
  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 p-1 font-sans`}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4 text-sm">
        <span>Dashboard</span>
        <span>&gt;</span>
        <span>Product</span>
        <span>&gt;</span>
        <span className="font-semibold text-gray-900 dark:text-gray-200">
          T-Shirts
        </span>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-full mx-auto transition-colors duration-300">
        <TopBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onExport={handleExport} // Pass the export function to TopBar
        />
        <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ProductTable products={currentProducts} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default Tshirts;
