// Timeline.jsx
import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDollarSign,
  FiCreditCard,
  FiRefreshCw,
  FiAlertTriangle,
  FiShield,
} from "react-icons/fi";

const Timeline = ({ events }) => {
  // console.log(events); // This will now correctly log the events array

  const statusIcons = {
    created: <FiClock className="h-5 w-5 text-gray-400" />,
    pending: <FiClock className="h-5 w-5 text-amber-400" />,
    succeeded: <FiCheckCircle className="h-5 w-5 text-emerald-400" />,
    failed: <FiXCircle className="h-5 w-5 text-red-400" />,
    refunded: <FiRefreshCw className="h-5 w-5 text-blue-400" />,
    captured: <FiDollarSign className="h-5 w-5 text-green-400" />,
    voided: <FiXCircle className="h-5 w-5 text-red-400" />,
    disputed: <FiAlertTriangle className="h-5 w-5 text-purple-400" />,
    authorized: <FiShield className="h-5 w-5 text-blue-400" />,
    payment_method_added: <FiCreditCard className="h-5 w-5 text-indigo-400" />,
    partially_refunded: <FiRefreshCw className="h-5 w-5 text-indigo-400" />,
  };

  const statusColors = {
    created: "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300",
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    succeeded:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    refunded:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    captured:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    voided: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    disputed:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    authorized:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    payment_method_added:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    partially_refunded:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      created: "Created",
      pending: "Pending",
      succeeded: "Completed",
      failed: "Failed",
      refunded: "Refunded",
      captured: "Captured",
      voided: "Voided",
      disputed: "Disputed",
      authorized: "Authorized",
      payment_method_added: "Payment Method Added",
      partially_refunded: "Partially Refunded",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events?.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                      statusColors[event.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusIcons[event.status] || (
                      <FiClock className="h-5 w-5 text-gray-400" />
                    )}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {event.description}{" "}
                      {event.amount && (
                        <span className="font-medium">
                          {event.amount} {event.currency}
                        </span>
                      )}
                    </p>
                    {event.reason && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Reason: {event.reason}
                      </p>
                    )}
                    {event.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Notes: {event.notes}
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={event.timestamp}>
                      {new Date(event.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[event.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusDisplay(event.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
