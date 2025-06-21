import React from "react";
import { FiBell, FiCheck, FiX, FiSettings } from "react-icons/fi";


const NotificationSection = () => {
  // Sample notification data
  const notifications = [
    {
      id: 1,
      title: "New message from Sarah",
      description: "Hey! Just wanted to check in about our project deadline...",
      time: "10 min ago",
      read: false,
      type: "message",
    },
    {
      id: 2,
      title: "Payment received",
      description: "Your invoice #12345 has been paid",
      time: "2 hours ago",
      read: true,
      type: "payment",
    },
    {
      id: 3,
      title: "System update available",
      description: "Version 2.3.1 is ready to install",
      time: "1 day ago",
      read: true,
      type: "system",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <FiBell className="mr-2" /> Notifications
        </h2>
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <FiSettings className="text-lg" />
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg transition-colors duration-200 ${
              notification.read
                ? "bg-gray-50 dark:bg-gray-700"
                : "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <img
                  src="https://i.pravatar.cc/300"
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    notification.read
                      ? "text-gray-800 dark:text-gray-200"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {notification.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-2">
                <button className="text-green-500 hover:text-green-700 dark:hover:text-green-400">
                  <FiCheck className="h-5 w-5" />
                </button>
                <button className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Mark all as read
        </button>
        <button className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationSection;
