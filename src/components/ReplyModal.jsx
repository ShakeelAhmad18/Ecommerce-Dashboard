import React, { useState } from "react";
import { FiX, FiSend } from "react-icons/fi";

export const ReplyModal = ({ isOpen, onClose, onSubmit, ticket }) => {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              Reply to Ticket
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Subject: {ticket?.subject}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {ticket?.message}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="reply"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Your Reply
              </label>
              <textarea
                id="reply"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
              >
                <FiSend className="mr-2" />
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

