import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiSettings,
  FiHelpCircle,
  FiMoon,
  FiSun,
  FiPackage,
} from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMountain } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { MdOutlineImportContacts } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { FiShoppingCart } from "react-icons/fi";
import { RiCoupon3Fill } from "react-icons/ri";
import { IoIosPerson } from "react-icons/io";
import { IoIosFlash } from "react-icons/io";


const Sidebar = ({ closeSidebar }) => {
  // Accept closeSidebar prop
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const location=useLocation();
  const [expandedItems, setExpandedItems] = useState({
    product: true,
  });
  const [activeItem, setActiveItem] = useState("dashboard"); // Set initial active item

  // Toggle dark mode and apply to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleExpand = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleNavigation = (path, itemName) => {
    setActiveItem(itemName);
    navigate(path);
    if (window.innerWidth < 768) {
      // Close sidebar on mobile after navigation
      closeSidebar();
    }
  };

  return (
    <motion.div
      // Removed initial and animate props for x as it's handled by parent's Tailwind classes
      // transition={{ type: "spring", stiffness: 300, damping: 30 }} // Keep if you want other animations
      className={`flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-64 border-r border-gray-200 dark:border-gray-700`} // Removed fixed z-50 here, handled by parent
    >
      {/* Logo Section */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <FaMountain className="text-2xl text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Culters
            </h1>
          </div>
          <div className="mt-3 flex items-center border border-gray-300 py-2 px-2 rounded-lg space-x-3">
            <div className="relative">
              <img
                src="https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Company logo"
                className="w-10 h-10 rounded-lg border-2 border-indigo-500 dark:border-indigo-400 object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Company
              </div>
              <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                Kanky Store
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* GENERAL Section */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
            GENERAL
          </h2>

          <NavItem
            icon={<FiHome />}
            active={activeItem === "dashboard"}
            text="Dashboard"
            onClick={() => handleNavigation("/dashboard", "dashboard")}
          />
          <NavItem
            icon={<IoIosPerson />}
            active={location.pathname === "/dashboard/staff" ? activeItem : ""}
            text="Staff"
            onClick={() => handleNavigation("/dashboard/staff", "staff")}
          />
          <div>
            <div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
              onClick={() => toggleExpand("product")}
            >
              <div className="flex items-center">
                <FiShoppingBag className="mr-3 text-gray-600 dark:text-gray-300" />
                <span className="font-medium">Product (119)</span>
              </div>
              {expandedItems.product ? (
                <FaChevronDown className="text-gray-400 dark:text-gray-500 text-xs" />
              ) : (
                <FaChevronRight className="text-gray-400 dark:text-gray-500 text-xs" />
              )}
            </div>

            <AnimatePresence>
              {expandedItems.product && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-8 mt-1 space-y-1 overflow-hidden"
                >
                  <NavSubItem
                    text="Sneakers"
                    active={
                      location.pathname === "/dashboard/products/sneakers"
                        ? activeItem
                        : ""
                    }
                    onClick={() =>
                      handleNavigation("products/sneakers", "sneakers")
                    }
                  />
                  <NavSubItem
                    text="Jacket"
                    active={
                      location.pathname === "/dashboard/products/jacket"
                        ? activeItem
                        : ""
                    }
                    onClick={() =>
                      handleNavigation("products/jacket", "jacket")
                    }
                  />
                  <NavSubItem
                    text="T-Shirt"
                    active={
                      location.pathname === "/dashboard/products/t-shirts"
                        ? activeItem
                        : ""
                    }
                    onClick={() =>
                      handleNavigation("products/t-shirts", "tshirt")
                    }
                  />
                  <NavSubItem
                    text="Bag"
                    active={
                      location.pathname === "/dashboard/products/bags"
                        ? activeItem
                        : ""
                    }
                    onClick={() => handleNavigation("products/bags", "bag")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavItem
            icon={<FiDollarSign />}
            active={activeItem === "transaction"}
            text="Transaction (441)"
            onClick={() => handleNavigation("transactions", "transaction")}
          />
          <NavItem
            icon={<FiUsers />}
            active={activeItem === "customers"}
            text="Customers"
            onClick={() =>
              handleNavigation("/dashboard/customers", "customers")
            }
          />
          <NavItem
            icon={<FiFileText />}
            active={
              location.pathname === "/dashboard/sales-reports" ? activeItem : ""
            }
            text="Sales Report"
            onClick={() =>
              handleNavigation("/dashboard/sales-reports", "sales")
            }
          />
          <NavItem
            icon={<FaFileInvoiceDollar />}
            active={
              location.pathname === "/dashboard/invoices" ? activeItem : ""
            }
            text="Invoices"
            onClick={() => handleNavigation("/dashboard/invoices", "invoices")}
          />
          <NavItem
            icon={<MdOutlineImportContacts />}
            active={
              location.pathname === "/dashboard/inventory-management"
                ? activeItem
                : ""
            }
            text="Inventory Mang"
            onClick={() =>
              handleNavigation(
                "/dashboard/inventory-management",
                "Inventory Management"
              )
            }
          />
          <NavItem
            icon={<FcSalesPerformance />}
            active={
              location.pathname === "/dashboard/sales-dashboard"
                ? activeItem
                : ""
            }
            text="Sales Dashboard"
            onClick={() =>
              handleNavigation("/dashboard/sales-dashboard", "Sales Dasgboard")
            }
          />
          <NavItem
            icon={<IoIosFlash />}
            active={location.pathname === "/dashboard/flash-sales" ? activeItem : ""}
            text="Flash Sales"
            onClick={() => handleNavigation("/dashboard/flash-sales", "flash sales")}
          />
          <NavItem
            icon={<FiShoppingCart />}
            active={location.pathname === "/dashboard/orders" ? activeItem : ""}
            text="Orders"
            onClick={() => handleNavigation("/dashboard/orders", "orders")}
          />
          <NavItem
            icon={<FiPackage />}
            active={
              location.pathname === "/dashboard/orders-tracking"
                ? activeItem
                : ""
            }
            text="Orders Tracking"
            onClick={() =>
              handleNavigation("/dashboard/orders-tracking", "orders tracking")
            }
          />
          <NavItem
            icon={<RiCoupon3Fill />}
            active={
              location.pathname === "/dashboard/coupons" ? activeItem : ""
            }
            text="Coupons"
            onClick={() => handleNavigation("/dashboard/coupons", "coupons")}
          />
        </div>
        {/* TOOLS Section */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
            TOOLS
          </h2>
          <NavItem
            icon={<FiSettings />}
            active={
              location.pathname === "/dashboard/settings" ? activeItem : ""
            }
            text="Account & Settings"
            onClick={() =>
              handleNavigation(
                "/dashboard/settings?activeTab=Account",
                "settings"
              )
            }
          />
          <NavItem
            icon={<FiHelpCircle />}
            active={location.pathname === "/dashboard/help" ? activeItem : ""}
            text="Help"
            onClick={() => handleNavigation("/dashboard/help", "help")}
          />

          {/* Professional Dark Mode Toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <div className="flex items-center">
              {darkMode ? (
                <FiSun className="mr-3 text-yellow-400" />
              ) : (
                <FiMoon className="mr-3 text-gray-600 dark:text-gray-300" />
              )}
              <span className="font-medium">Dark Mode</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                darkMode ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 dark:border-indigo-400"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div className="ml-3">
            <p className="font-medium">Guy Hawkins</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// NavItem and NavSubItem components remain the same
const NavItem = ({ icon, active, text, onClick }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center p-2 rounded-lg mb-1 cursor-pointer transition-colors duration-200 ${
        active
          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <span
        className={`mr-3 ${
          active
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {icon}
      </span>
      <span className="font-medium">{text}</span>
      {active && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="ml-auto w-1 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full"
        />
      )}
    </motion.div>
  );
};

const NavSubItem = ({ text, active, onClick }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center p-2 rounded-lg text-sm cursor-pointer transition-colors duration-200 ${
        active
          ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
          : "hover:bg-gray-500 dark:hover:bg-800"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-3 ${
          active
            ? "bg-indigo-600 dark:bg-indigo-400"
            : "bg-gray-400 dark:bg-gray-500"
        }`}
      ></span>
      <span>{text}</span>
    </motion.div>
  );
};

export default Sidebar;
