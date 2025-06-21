import React, { useState, useEffect } from "react";
// Assuming these components are in the specified paths
import Header from "../components/TransactionHeader";
import OrderTabs from "../components/OrderTabs";
import OrderTable from "../components/OrderTable";
import TransactionPagination from "../components/TransactionPagination";

// Import XLSX for Excel export
import * as XLSX from "xlsx";

// Import jsPDF from its UMD build for broader compatibility
import jsPDF from "jspdf/dist/jspdf.umd.min.js";
import "jspdf-autotable"; // Crucial for extending jsPDF with the autoTable method

const Transaction = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Mock data - In a real application, this would come from an API
  const allOrders = [
    {
      id: "021231",
      productName: "Kanky Kitadakate (Green)",
      customer: "Leslie Alexander",
      price: 21.78,
      date: "04/17/23",
      payment: "Paid",
      status: "Shipping",
      image:
        "https://media.istockphoto.com/id/1830111752/photo/black-t-shirt-short-sleeve-mockup.jpg?s=1024x1024&w=is&k=20&c=XsmPOD73lHWEsXDf-blvm5oHiPzuen-SJRsLw4hsHi8=",
    },
    {
      id: "021232",
      productName: "Kanky Kitadakate (Green)",
      customer: "John Doe",
      price: 21.78,
      date: "04/18/23",
      payment: "Unpaid",
      status: "Cancelled",
      image:
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "021233",
      productName: "Beige Coffe (Navy)",
      customer: "Jane Smith",
      price: 25.99,
      date: "04/19/23",
      payment: "Paid",
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    // Add more mock data as needed to test pagination and filtering
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `02123${i + 4}`,
      productName: `Product ${i + 1}`,
      customer: `Customer ${i + 1}`,
      price: parseFloat((20 + Math.random() * 30).toFixed(2)), // Ensure price is a number
      date: new Date(2023, 3, i + 1).toLocaleDateString("en-US"), // Formatted date
      payment: i % 2 === 0 ? "Paid" : "Unpaid",
      status:
        i % 3 === 0 ? "Shipping" : i % 3 === 1 ? "Completed" : "Cancelled",
      image: `https://picsum.photos/200/300?random=${i}`, // Placeholder images
    })),
  ];

  useEffect(() => {
    // In a real application, you would fetch data from an API here
    setOrders(allOrders);
  }, []);

  useEffect(() => {
    let currentOrders = orders;

    // Filter by tab
    if (activeTab === "Shipping") {
      currentOrders = currentOrders.filter(
        (order) => order.status === "Shipping"
      );
    } else if (activeTab === "Completed") {
      currentOrders = currentOrders.filter(
        (order) => order.status === "Completed"
      );
    } else if (activeTab === "Cancel") {
      currentOrders = currentOrders.filter(
        (order) => order.status === "Cancelled"
      );
    }

    // Filter by search term
    if (searchTerm) {
      currentOrders = currentOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(currentOrders);
    setCurrentPage(1); // Reset to first page on tab or search change
  }, [orders, activeTab, searchTerm]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrdersPaginated = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExport = (format) => {
    if (format === "excel") {
      exportToExcel(filteredOrders);
    } else if (format === "pdf") {
      exportToPdf(filteredOrders);
    }
  };

  const exportToExcel = (data) => {
    try {
      // Format data for Excel
      const excelData = data.map((order) => ({
        "Order ID": order.id,
        Product: order.productName,
        Customer: order.customer,
        Price: `$${Number(order.price).toFixed(2)}`,
        Date: order.date,
        "Payment Method": order.payment,
        Status: order.status,
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add column widths for better display in Excel
      const wscols = [
        { wch: 12 }, // Order ID
        { wch: 25 }, // Product
        { wch: 20 }, // Customer
        { wch: 10 }, // Price
        { wch: 12 }, // Date
        { wch: 15 }, // Payment Method
        { wch: 12 }, // Status
      ];
      ws["!cols"] = wscols;

      // Add to workbook and export
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(
        wb,
        `orders_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      console.log("Excel export successful!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert(`Error exporting to Excel: ${error.message}`); // Provide specific error to user
    }
  };

  const exportToPdf = (data) => {
    try {
      // Validate data first
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("No valid data available for PDF export");
      }

      // Create PDF document using the UMD import
      const doc = new jsPDF({
        orientation: "landscape", // Set orientation to landscape
        unit: "mm", // Use millimeters for units
      });

      // Add header (using text method with font options directly)
      doc.setFontSize(16);
      doc.setTextColor(40); // Hardcoded color, consider making this dynamic if dark mode PDF is desired
      doc.text("Order Report", doc.internal.pageSize.width / 2, 15, {
        align: "center",
      });

      // Add metadata (using text method with font options directly)
      doc.setFontSize(10);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        doc.internal.pageSize.width / 2,
        22,
        {
          align: "center",
        }
      );
      doc.text(
        `Filters: ${activeTab}${searchTerm ? `, Search: "${searchTerm}"` : ""}`,
        doc.internal.pageSize.width / 2,
        28,
        { align: "center" }
      );

      // Prepare table data with strict validation
      const tableData = data.map((order) => {
        // Ensure all fields exist and are properly formatted
        return [
          order.id?.toString() || "N/A",
          order.productName?.toString() || "N/A",
          order.customer?.toString() || "N/A",
          order.price ? `$${parseFloat(order.price).toFixed(2)}` : "$0.00",
          order.date?.toString() || "N/A",
          order.payment?.toString() || "N/A",
          order.status?.toString() || "N/A",
        ];
      });

      // Generate table using autoTable
      doc.autoTable({
        startY: 35, // Start table after header and metadata
        head: [
          [
            "Order ID",
            "Product",
            "Customer",
            "Price",
            "Date",
            "Payment",
            "Status",
          ],
        ],
        body: tableData,
        theme: "grid", // Apply grid theme for borders
        headStyles: {
          fillColor: [41, 128, 185], // Blue header (hardcoded, consider dynamic)
          textColor: 255, // White text (hardcoded, consider dynamic)
          fontStyle: "bold",
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 2,
          overflow: "linebreak", // Allow text to wrap
          textColor: 40, // Hardcoded, consider dynamic
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], // Light grey for alternate rows (hardcoded, consider dynamic)
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 15 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 15 },
        },
        margin: { top: 35 },
        didDrawPage: (data) => {
          // Footer for page numbers
          doc.setFontSize(8);
          doc.setTextColor(100); // Hardcoded, consider dynamic
          doc.text(
            `Page ${data.pageNumber} of ${doc.internal.pages.length - 1}`, // Adjust for potential extra blank page
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });

      // Save PDF
      doc.save(`orders_${new Date().toISOString().slice(0, 10)}.pdf`);
      console.log("PDF export successful!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert(`PDF Export Failed: ${error.message}`); // Provide specific error to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      {" "}
      {/* Added dark mode bg and padding */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
        {" "}
        {/* Dark mode bg, higher shadow, more padding */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onExport={handleExport}
        />
        <OrderTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabCounts={{
            "All Orders": allOrders.length,
            Shipping: allOrders.filter((order) => order.status === "Shipping")
              .length,
            Completed: allOrders.filter((order) => order.status === "Completed")
              .length,
            Cancel: allOrders.filter((order) => order.status === "Cancelled")
              .length,
          }}
        />
        {/* Added margin top to separate tabs from table */}
        <div className="mt-6">
          <OrderTable orders={currentOrdersPaginated} />
        </div>
        {/* Added margin top to separate table from pagination */}
        <div className="mt-6">
          <TransactionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Transaction;
