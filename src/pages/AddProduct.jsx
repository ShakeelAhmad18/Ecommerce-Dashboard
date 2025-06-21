import React, { useState } from "react";
import { FiUpload, FiTrash2, FiChevronDown } from "react-icons/fi";

const AddProduct = () => {
  // Form state
  const [formData, setFormData] = useState({
    sku: "",
    productName: "",
    price: "",
    color: "",
    category: "",
    quantity: "",
    status: "",
  });

  // Image upload state
  const [images, setImages] = useState(Array(4).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(4).fill(null));

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload an image in SVG, PNG, or JPG format");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Maximum file size is 4MB");
      return;
    }

    // Update images state
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = reader.result;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data and images to your backend
    console.log("Form submitted:", { ...formData, images });
    alert("Product saved successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span className="font-medium">Datthoard</span> ▶{" "}
        <span className="font-medium">Product</span> ▶ <span>Add Product</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form Fields */}
          <div className="lg:w-1/2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md dark:shadow-gray-900 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Product Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Lorem ipsum dolor sit amet consectetur. Non ac nulla aliquam
                aenean in velit mattis.
              </p>

              {/* SKU */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Input no SKU"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              {/* Product Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Input product name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Input price"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              {/* Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Color"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Product Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                    required
                  >
                    <option value="">Select product category</option>
                    <option value="sneakers">Sneakers</option>
                    <option value="jacket">Jacket</option>
                    <option value="t-shirt">T-Shirt</option>
                    <option value="bag">Bag</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Input stock"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              {/* Status Product */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status Product
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                    required
                  >
                    <option value="">Select status product</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="lg:w-1/2 mb-3">
            <div className="bg-[#EEF7FF] dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md dark:shadow-gray-900 p-3 h-[350px] flex flex-col">
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Image Product
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <strong>Note:</strong> Format photos SVG, PNG, or JPG (Max
                  size 4mb)
                </p>

                <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="relative aspect-square">
                      <label
                        className={`flex flex-col items-center justify-center h-full w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden bg-white dark:bg-gray-700 ${
                          imagePreviews[index]
                            ? "border-transparent"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      >
                        {imagePreviews[index] ? (
                          <>
                            <img
                              src={imagePreviews[index]}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <FiUpload className="text-gray-400 dark:text-gray-500 text-2xl mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Photo {index + 1}
                            </p>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/svg+xml, image/png, image/jpeg"
                          className="hidden"
                          onChange={(e) => handleImageUpload(index, e)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
