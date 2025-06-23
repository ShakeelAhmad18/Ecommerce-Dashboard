import React, { useState, useRef } from "react";
import {
  FiUser,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiPrinter,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PDFDownloadLink } from "@react-pdf/renderer";

import InvoiceTemplate from "../components/InvoiceTemplate"; // Path to your new template

const CreateInvoice = () => {
  const invoiceTemplateRef = useRef(null); // Ref to the component we want to print

  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    title: "",
    notes:
      "Payment is due within 30 days. Late payments may incur additional fees. Thank you for your prompt payment!",
    paymentMethod: "Bank Transfer",
    status: "pending",
    from: {
      name: "Your Company LLC",
      address: "123 Business Rd, Suite 100, City, State, ZIP",
      email: "info@yourcompany.com",
      phone: "+1 (555) 123-4567",
    },
    to: {
      name: "Client Solutions Inc.",
      address: "456 Client St, Apt B, Town, State, ZIP",
      email: "contact@clientinc.com",
      phone: "+1 (555) 987-6543",
    },
    items: [
      {
        id: 1,
        description:
          "Website Design & Development - Homepage and 5 internal pages",
        quantity: 1,
        price: 2500,
        tax: 5,
      },
      {
        id: 2,
        description: "Monthly Hosting & Maintenance (Year 1)",
        quantity: 12,
        price: 50,
        tax: 0,
      },
      {
        id: 3,
        description: "SEO Optimization - Initial setup & keyword research",
        quantity: 1,
        price: 300,
        tax: 10,
      },
    ],
    taxRate: 7, // Overall tax rate if not item specific
    discount: 5, // Overall discount rate
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleFromChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      from: { ...prev.from, [name]: value },
    }));
  };

  const handleToChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      to: { ...prev.to, [name]: value },
    }));
  };

  const handleItemChange = (id, e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: prev.items.length + 1,
          description: "",
          quantity: 1,
          price: 0,
          tax: 0,
        },
      ],
    }));
  };

  const removeItem = (id) => {
    if (invoice.items.length > 1) {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * invoice.taxRate) / 100;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * invoice.discount) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    return subtotal + tax - discount;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!invoice.from.name) newErrors.fromName = "Required";
    if (!invoice.from.address) newErrors.fromAddress = "Required";
    if (!invoice.to.name) newErrors.toName = "Required";
    if (!invoice.to.address) newErrors.toAddress = "Required";
    if (!invoice.title) newErrors.title = "Required";
    invoice.items.forEach((item, index) => {
      if (!item.description) newErrors[`itemDesc${index}`] = "Required";
      if (item.quantity <= 0) newErrors[`itemQty${index}`] = "Must be > 0";
      if (item.price < 0) newErrors[`itemPrice${index}`] = "Must be ≥ 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Invoice submitted:", invoice);
      alert("Invoice created successfully!");
      // In a real app, you'd send this data to your backend
    }
  };


  const printInvoice = () => {
    // Open in new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body { margin: 0; padding: 0; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${URL.createObjectURL(
            new Blob([<InvoiceTemplate invoice={invoice} />], {
              type: "application/pdf",
            })
          )}"></iframe>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-white">Create New Invoice</h1>
          <p className="text-indigo-100">
            Fill in the details below to create a professional invoice
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700"
        >
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiFileText className="mr-2 text-indigo-600" />
                Invoice Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Invoice Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={invoice.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.title
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="e.g. Web Design Services"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <FiCalendar className="mr-2 text-gray-400" />
                      Invoice Date
                    </label>
                    <DatePicker
                      selected={invoice.date}
                      onChange={(date) => setInvoice({ ...invoice, date })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <FiCalendar className="mr-2 text-gray-400" />
                      Due Date
                    </label>
                    <DatePicker
                      selected={invoice.dueDate}
                      onChange={(date) =>
                        setInvoice({ ...invoice, dueDate: date })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiDollarSign className="mr-2 text-indigo-600" />
                Payment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={invoice.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={invoice.taxRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={invoice.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* From and To Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiUser className="mr-2 text-indigo-600" />
                From (Your Details)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={invoice.from.name}
                    onChange={handleFromChange}
                    className={`w-full px-3 py-2 border ${
                      errors.fromName
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Your Company Name"
                  />
                  {errors.fromName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fromName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={invoice.from.address}
                    onChange={handleFromChange}
                    className={`w-full px-3 py-2 border ${
                      errors.fromAddress
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Street, City, Country"
                  />
                  {errors.fromAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fromAddress}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={invoice.from.email}
                      onChange={handleFromChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={invoice.from.phone}
                      onChange={handleFromChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiUser className="mr-2 text-indigo-600" />
                To (Client Details)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={invoice.to.name}
                    onChange={handleToChange}
                    className={`w-full px-3 py-2 border ${
                      errors.toName
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Client Name"
                  />
                  {errors.toName && (
                    <p className="mt-1 text-sm text-red-600">{errors.toName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={invoice.to.address}
                    onChange={handleToChange}
                    className={`w-full px-3 py-2 border ${
                      errors.toAddress
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Street, City, Country"
                  />
                  {errors.toAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.toAddress}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={invoice.to.email}
                      onChange={handleToChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="client@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={invoice.to.phone}
                      onChange={handleToChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FiFileText className="mr-2 text-indigo-600" />
              Items
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tax (%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {invoice.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="description"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, e)}
                          className={`w-full px-2 py-1 border ${
                            errors[`itemDesc${index}`]
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-700"
                          } rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                          placeholder="Item description"
                        />
                        {errors[`itemDesc${index}`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`itemDesc${index}`]}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, e)}
                          min="1"
                          className={`w-full px-2 py-1 border ${
                            errors[`itemQty${index}`]
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-700"
                          } rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                        />
                        {errors[`itemQty${index}`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`itemQty${index}`]}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="price"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, e)}
                          min="0"
                          step="0.01"
                          className={`w-full px-2 py-1 border ${
                            errors[`itemPrice${index}`]
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-700"
                          } rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                        />
                        {errors[`itemPrice${index}`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`itemPrice${index}`]}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="tax"
                          value={item.tax}
                          onChange={(e) => handleItemChange(item.id, e)}
                          min="0"
                          max="100"
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        $
                        {(
                          item.quantity *
                          item.price *
                          (1 + item.tax / 100)
                        ).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-4 flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-800 dark:hover:bg-indigo-700"
            >
              <FiPlus className="mr-2" />
              Add Item
            </button>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FiFileText className="mr-2 text-indigo-600" />
              Notes
            </h2>
            <textarea
              name="notes"
              value={invoice.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Additional notes or terms..."
            ></textarea>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Subtotal
                </h3>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  ${calculateSubtotal().toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Tax ({invoice.taxRate}%)
                </h3>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  ${calculateTax().toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Discount ({invoice.discount}%)
                </h3>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  -${calculateDiscount().toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  Total Amount
                </h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  ${calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
        </form>
        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <PDFDownloadLink
            document={<InvoiceTemplate invoice={invoice} />}
            fileName={`invoice_${invoice.invoiceNumber}.pdf`}
          >
            {({ loading }) => (
              <button
                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                <FiDownload className="mr-2" />
                {loading ? "Preparing..." : "Download Invoice"}
              </button>
            )}
          </PDFDownloadLink>
          <button
            onClick={printInvoice}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPrinter className="mr-2" />
            Print Invoice
          </button>
          <button
            type="submit"
            className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
