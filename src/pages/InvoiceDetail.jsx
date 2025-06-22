import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiPrinter,
  FiDownload,
  FiMail,
  FiArrowLeft,
  FiEdit,
  FiCheckCircle,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiCreditCard,
  FiSend,
  FiCopy,
} from "react-icons/fi";
import * as XLSX from "xlsx";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [sendEmail, setSendEmail] = useState(true);
  const [emailMessage, setEmailMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [copied, setCopied] = useState(false);

  // Mock data - in a real app, this would come from an API
  const mockInvoices = [
    {
      id: "INV-001",
      client: {
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business Ave, Suite 200\nNew York, NY 10001",
        website: "www.acme.com",
        taxId: "TAX-123456789",
      },
      date: "2023-05-15",
      dueDate: "2023-06-15",
      issuedBy: "Your Company Name",
      issuedByAddress: "456 Corporate Blvd\nSan Francisco, CA 94107",
      issuedByEmail: "billing@yourcompany.com",
      issuedByPhone: "+1 (555) 987-6543",
      issuedByWebsite: "www.yourcompany.com",
      issuedByTaxId: "TAX-987654321",
      status: "paid",
      amount: 1250.75,
      taxRate: 10,
      discount: 50,
      subtotal: 1200.75,
      total: 1320.83,
      currency: "USD",
      items: [
        {
          id: 1,
          description: "Website Design & Development",
          quantity: 1,
          unitPrice: 1000,
          tax: 100,
          amount: 1100,
        },
        {
          id: 2,
          description: "Premium Hosting (3 months)",
          quantity: 3,
          unitPrice: 50,
          tax: 15,
          amount: 165,
        },
        {
          id: 3,
          description: "Domain Registration (1 year)",
          quantity: 1,
          unitPrice: 15.75,
          tax: 1.58,
          amount: 17.33,
        },
      ],
      notes: "Thank you for your business! Payment is due within 30 days.",
      paymentHistory: [
        {
          date: "2023-05-20",
          amount: 1320.83,
          method: "Credit Card",
          transactionId: "TRX-987654",
          status: "completed",
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchInvoice = () => {
      try {
        setTimeout(() => {
          const foundInvoice = mockInvoices.find((inv) => inv.id === id);
          if (!foundInvoice) {
            setError("Invoice not found");
          } else {
            setInvoice(foundInvoice);
            setEmailMessage(
              `Dear ${foundInvoice.client?.name || "Customer"},
              
Please find attached invoice ${foundInvoice.id} for your recent purchase. 
The total amount due is ${foundInvoice.currency} ${
                foundInvoice.total?.toFixed(2) || "0.00"
              }.

Payment is due by ${new Date(foundInvoice.dueDate).toLocaleDateString()}.

Thank you for your business!

Best regards,
${foundInvoice.issuedBy || "Your Company"}`
            );
          }
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load invoice");
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadExcel = () => {
    if (!invoice) return;

    try {
      const worksheet = XLSX.utils.json_to_sheet([
        {
          "Invoice ID": invoice.id,
          "Client Name": invoice.client?.name || "",
          Date: invoice.date,
          "Due Date": invoice.dueDate,
          Subtotal: invoice.subtotal || 0,
          Tax: invoice.taxRate || 0,
          Discount: invoice.discount || 0,
          Total: invoice.total || 0,
          Status: invoice.status,
        },
      ]);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
      XLSX.writeFile(workbook, `invoice_${id}.xlsx`);
    } catch (err) {
      console.error("Failed to generate Excel:", err);
      alert("Failed to generate Excel file. Please try again.");
    }
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!invoice) return;

    try {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid payment amount");
        return;
      }

      alert(`Payment of ${paymentAmount} processed via ${paymentMethod}`);

      setInvoice({
        ...invoice,
        status: "paid",
        paymentHistory: [
          ...(invoice.paymentHistory || []),
          {
            date: new Date().toISOString().split("T")[0],
            amount: amount,
            method:
              paymentMethod === "credit_card" ? "Credit Card" : "Bank Transfer",
            transactionId: `TRX-${Math.floor(Math.random() * 1000000)}`,
            status: "completed",
          },
        ],
      });
      setPaymentAmount("");
    } catch (err) {
      console.error("Payment processing error:", err);
      alert("Failed to process payment. Please try again.");
    }
  };

  const handleSendEmail = () => {
    if (!invoice || !invoice.client?.email) {
      alert("No email address found for this client");
      return;
    }
    alert(`Email sent to ${invoice.client.email}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  };

  const statusBadgeClass = () => {
    if (!invoice)
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    switch (invoice.status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {error}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Invoice Not Found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Invoice #{invoice.id}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Issued on {new Date(invoice.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiPrinter className="mr-2" />
              Print
            </button>
            <button
              onClick={handleDownloadExcel}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiDownload className="mr-2" />
              Download Excel
            </button>
            <Link
              to={`/dashboard/create-invoice`}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <FiEdit className="mr-2" />
              Edit Invoice
            </Link>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass()}`}
              >
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </span>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Due Date:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </p>
                {invoice.status === "overdue" && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                    This invoice is{" "}
                    {Math.floor(
                      (new Date() - new Date(invoice.dueDate)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days overdue
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Amount
              </p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {invoice.currency} {invoice.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Invoice Details
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "payment"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Payment
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Payment History
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {activeTab === "details" && (
            <div id="invoice-container" className="p-8">
              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                    INVOICE
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    #{invoice.id}
                  </p>
                </div>
                <div className="mt-6 md:mt-0 text-right">
                  <p className="text-lg font-semibold dark:text-white">
                    {invoice.issuedBy}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line">
                    {invoice.issuedByAddress}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {invoice.issuedByEmail}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {invoice.issuedByPhone}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tax ID: {invoice.issuedByTaxId}
                  </p>
                </div>
              </div>

              {/* Client and Invoice Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      BILL TO
                    </h3>
                    <p className="font-medium dark:text-white">
                      {invoice.client.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {invoice.client.address}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {invoice.client.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {invoice.client.phone}
                    </p>
                    {invoice.client.taxId && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Tax ID: {invoice.client.taxId}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Invoice Date
                      </p>
                      <p className="font-medium dark:text-white">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Due Date
                      </p>
                      <p className="font-medium dark:text-white">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Status
                      </p>
                      <p className="font-medium dark:text-white">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${statusBadgeClass()}`}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Currency
                      </p>
                      <p className="font-medium dark:text-white">
                        {invoice.currency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-12 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tax
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {invoice.currency} {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {invoice.currency} {item.tax.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-medium">
                          {invoice.currency} {item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    NOTES
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {invoice.notes}
                  </p>
                </div>
                <div className="md:w-1/3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Subtotal:
                      </span>
                      <span className="text-sm font-medium dark:text-white">
                        {invoice.currency} {invoice.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Discount:
                        </span>
                        <span className="text-sm font-medium dark:text-white">
                          -{invoice.currency} {invoice.discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Tax ({invoice.taxRate}%):
                      </span>
                      <span className="text-sm font-medium dark:text-white">
                        {invoice.currency}{" "}
                        {(
                          (invoice.subtotal - invoice.discount) *
                          (invoice.taxRate / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold dark:text-white">
                          Total:
                        </span>
                        <span className="text-base font-bold dark:text-white">
                          {invoice.currency} {invoice.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>
                  Thank you for your business. Please make payments to the
                  account details provided below.
                </p>
                <p className="mt-2">
                  Bank Name: Your Bank | Account Name: {invoice.issuedBy} |
                  Account Number: 123456789 | Routing Number: 987654321 | SWIFT:
                  YOURBANKXX
                </p>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                    Process Payment
                  </h2>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <form onSubmit={handleProcessPayment}>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Payment Amount
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                              {invoice.currency}
                            </span>
                          </div>
                          <input
                            type="number"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
                            placeholder="0.00"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            min="0"
                            max={invoice.total}
                            step="0.01"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                              / {invoice.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Payment Method
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("credit_card")}
                            className={`p-4 border rounded-lg flex items-center ${
                              paymentMethod === "credit_card"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <FiCreditCard className="h-5 w-5 mr-3 text-gray-700 dark:text-gray-300" />
                            <span className="text-sm font-medium dark:text-white">
                              Credit Card
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("bank_transfer")}
                            className={`p-4 border rounded-lg flex items-center ${
                              paymentMethod === "bank_transfer"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <FiDollarSign className="h-5 w-5 mr-3 text-gray-700 dark:text-gray-300" />
                            <span className="text-sm font-medium dark:text-white">
                              Bank Transfer
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="send-email"
                              name="send-email"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                              checked={sendEmail}
                              onChange={(e) => setSendEmail(e.target.checked)}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="send-email"
                              className="font-medium text-gray-700 dark:text-gray-300"
                            >
                              Send payment confirmation to client
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">
                              An email will be sent to {invoice.client.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                          Process Payment
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Send Invoice via Email
                    </h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        rows="5"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSendEmail}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiSend className="mr-2 h-4 w-4" />
                        Send Email
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Invoice Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Invoice ID:
                        </span>
                        <span className="text-sm font-medium dark:text-white">
                          {invoice.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Client:
                        </span>
                        <span className="text-sm font-medium dark:text-white">
                          {invoice.client.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Issued:
                        </span>
                        <span className="text-sm font-medium dark:text-white">
                          {new Date(invoice.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Due:
                        </span>
                        <span className="text-sm font-medium dark:text-white">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-base font-semibold dark:text-white">
                            Total Due:
                          </span>
                          <span className="text-base font-bold dark:text-white">
                            {invoice.currency} {invoice.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Payment Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Bank Transfer
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                          <p className="text-sm font-medium dark:text-white">
                            Your Company Name
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Bank: Your Bank
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Account: 123456789
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            SWIFT: YOURBANKXX
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                "Your Company Name\nBank: Your Bank\nAccount: 123456789\nSWIFT: YOURBANKXX"
                              )
                            }
                            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                          >
                            <FiCopy className="mr-1" />
                            {copied ? "Copied!" : "Copy Details"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Credit Card
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            We accept Visa, MasterCard, and American Express
                          </p>
                          <button className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                            Process Credit Card Payment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
                  Payment History
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      const paymentData = invoice.paymentHistory.map(
                        (payment) => ({
                          Date: payment.date,
                          Amount: `${invoice.currency} ${payment.amount.toFixed(
                            2
                          )}`,
                          Method: payment.method,
                          "Transaction ID": payment.transactionId,
                          Status: payment.status,
                          "Processed At": new Date()
                            .toISOString()
                            .split("T")[0],
                        })
                      );

                      const worksheet = XLSX.utils.json_to_sheet(paymentData);
                      const workbook = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(
                        workbook,
                        worksheet,
                        "Payments"
                      );
                      XLSX.writeFile(
                        workbook,
                        `payment_history_${invoice.id}.xlsx`
                      );
                    }}
                    className="flex items-center px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <FiDownload className="mr-2" />
                    Export
                  </button>
                </div>
              </div>

              {invoice.paymentHistory.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {invoice.paymentHistory.map((payment, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(payment.date).toLocaleDateString()}
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(payment.date).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {invoice.currency} {payment.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              <div className="flex items-center">
                                {payment.method === "Credit Card" ? (
                                  <FiCreditCard className="mr-2 text-gray-700 dark:text-gray-300" />
                                ) : (
                                  <FiDollarSign className="mr-2 text-gray-700 dark:text-gray-300" />
                                )}
                                {payment.method}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              <div className="flex items-center">
                                <span className="font-mono">
                                  {payment.transactionId}
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(payment.transactionId)
                                  }
                                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                  title="Copy Transaction ID"
                                >
                                  <FiCopy className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  payment.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}
                              >
                                {payment.status.charAt(0).toUpperCase() +
                                  payment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => {
                                  // In a real app, this would generate a receipt PDF
                                  alert(
                                    `Generating receipt for ${payment.transactionId}`
                                  );
                                }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                              >
                                Receipt
                              </button>
                              <button
                                onClick={() => {
                                  // In a real app, this would resend the payment confirmation
                                  alert(
                                    `Resending confirmation for ${payment.transactionId}`
                                  );
                                }}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                Resend
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-3 text-xs text-gray-500 dark:text-gray-400"
                          >
                            Showing {invoice.paymentHistory.length} payment
                            {invoice.paymentHistory.length !== 1 ? "s" : ""}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Total Paid:{" "}
                          <span className="font-semibold">
                            {invoice.currency}{" "}
                            {invoice.paymentHistory
                              .reduce((sum, payment) => sum + payment.amount, 0)
                              .toFixed(2)}
                          </span>
                        </p>
                        {invoice.status === "paid" && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            <FiCheckCircle className="inline mr-1" />
                            This invoice has been fully paid
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            const paymentLink = `https://yourpaymentportal.com/pay/${invoice.id}`;
                            copyToClipboard(paymentLink);
                            alert(
                              `Payment link copied to clipboard: ${paymentLink}`
                            );
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <FiSend className="mr-1" />
                          Share Payment Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <FiDollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    No payment history
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This invoice hasn't received any payments yet.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab("payment")}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FiCreditCard className="mr-2" />
                      Process Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
