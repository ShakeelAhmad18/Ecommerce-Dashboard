import React, { useState } from "react";
import { FiUpload, FiX, FiPlus, FiMinus } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const AddOrder = () => {
  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    items: [
      {
        productId: "",
        productName: "",
        quantity: 1,
        price: 0,
        image: null,
        imagePreview: "",
      },
    ],
    paymentMethod: "credit_card",
    specialInstructions: "",
    status: "processing",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle item changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  // Handle image upload
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedItems = [...formData.items];
        updatedItems[index] = {
          ...updatedItems[index],
          image: file,
          imagePreview: reader.result,
        };
        setFormData((prev) => ({ ...prev, items: updatedItems }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new item row
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: "",
          productName: "",
          quantity: 1,
          price: 0,
          image: null,
          imagePreview: "",
        },
      ],
    }));
  };

  // Remove item row
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  // Calculate total
  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Order submitted:", formData);
      setSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      // You might want to show an error message to the user here
      alert(`Submission failed: ${error.message}`); // Using alert as a placeholder
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
          <FaCheckCircle className="h-14 w-14 text-green-500 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Order Created Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your new order has been added to the system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                setSuccess(false);
                // Optionally reset form data here to clear fields for a new order
                setFormData({
                  customerName: "",
                  customerEmail: "",
                  customerPhone: "",
                  shippingAddress: "",
                  items: [
                    {
                      productId: "",
                      productName: "",
                      quantity: 1,
                      price: 0,
                      image: null,
                      imagePreview: "",
                    },
                  ],
                  paymentMethod: "credit_card",
                  specialInstructions: "",
                  status: "processing",
                });
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              Add Another Order
            </button>
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200">
              View Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      {/* Removed max-w-4xl to allow full width */}
      <div className="mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Order
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Fill in the details below to add a new order
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="divide-y divide-gray-200 dark:divide-gray-800"
          >
            {/* Customer Information */}
            <div className="px-6 py-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="customerEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="customerPhone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="shippingAddress"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order Items
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Item
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-5 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item #{index + 1}
                    </h4>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-12">
                    {/* Product Image Upload */}
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product Image
                      </label>
                      <div className="mt-1 flex items-center">
                        <label
                          htmlFor={`item-image-${index}`}
                          className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          {item.imagePreview ? (
                            <img
                              src={item.imagePreview}
                              alt="Product Preview"
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                              <FiUpload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Upload Image
                              </p>
                            </div>
                          )}
                          <input
                            id={`item-image-${index}`}
                            name={`item-image-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="sm:col-span-9">
                      <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-9">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor={`productName-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Product Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id={`productName-${index}`}
                            name="productName"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                            className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor={`quantity-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <div className="flex rounded-md shadow-sm">
                            <button
                              type="button"
                              onClick={() =>
                                handleItemChange(index, {
                                  target: {
                                    name: "quantity",
                                    value: Math.max(1, item.quantity - 1),
                                  },
                                })
                              }
                              className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              <FiMinus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              id={`quantity-${index}`}
                              name="quantity"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, e)}
                              className="block w-full text-center border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleItemChange(index, {
                                  target: {
                                    name: "quantity",
                                    value: item.quantity + 1,
                                  },
                                })
                              }
                              className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              <FiPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor={`price-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Unit Price <span className="text-red-500">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input
                              type="number"
                              id={`price-${index}`}
                              name="price"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, e)}
                              required
                              className="block w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-end">
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Subtotal:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Shipping:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        $0.00
                      </span>{" "}
                      {/* Hardcoded for now */}
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        Total:
                      </span>
                      <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment and Additional Info */}
            <div className="px-6 py-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                Payment & Additional Information
              </h3>
              <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash_on_delivery">Cash on Delivery</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Order Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                  >
                    <option value="processing">Processing</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="specialInstructions"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Special Instructions
                  </label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    rows={2}
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition-colors duration-200"
                    placeholder="Any special notes or instructions for this order..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-5 bg-gray-50 dark:bg-gray-900 text-right flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex justify-center py-2.5 px-5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1A71F6] dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? "Creating Order..." : "Create Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
