import React from "react";

const InvoiceTemplate = React.forwardRef(({ invoice }, ref) => {
  // Calculation functions
  const calculateItemTotal = (item) => {
    return item.quantity * item.price * (1 + item.tax / 100);
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      ref={ref}
      className="bg-white p-10 max-w-4xl mx-auto font-sans text-gray-800"
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Watermark for draft status */}
      {invoice.status.toLowerCase() === "draft" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-300 text-6xl font-bold transform -rotate-45 opacity-30">
            DRAFT
          </span>
        </div>
      )}

      {/* Header with company logo */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoice.from.logo && (
            <img
              src={invoice.from.logo}
              alt="Company Logo"
              className="h-16 mb-4"
            />
          )}
          <div className="text-sm text-gray-500">
            <p>{invoice.from.addressLine1}</p>
            <p>{invoice.from.addressLine2}</p>
            <p>
              {invoice.from.city}, {invoice.from.state} {invoice.from.zip}
            </p>
            <p>{invoice.from.country}</p>
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">INVOICE</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Invoice #:</span>{" "}
              {invoice.invoiceNumber}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {formatDate(invoice.date)}
            </p>
            <p>
              <span className="font-medium">Due Date:</span>{" "}
              {formatDate(invoice.dueDate)}
            </p>
            {invoice.poNumber && (
              <p>
                <span className="font-medium">PO #:</span> {invoice.poNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Client and payment info */}
      <div className="flex justify-between mb-8">
        <div className="border border-gray-200 p-4 rounded-md w-1/2">
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Bill To
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-1">
            {invoice.to.name}
          </p>
          <div className="text-sm text-gray-600">
            {invoice.to.address && <p>{invoice.to.address}</p>}
            {invoice.to.city && invoice.to.state && (
              <p>
                {invoice.to.city}, {invoice.to.state} {invoice.to.zip}
              </p>
            )}
            {invoice.to.country && <p>{invoice.to.country}</p>}
            {invoice.to.email && <p>{invoice.to.email}</p>}
            {invoice.to.phone && <p>{invoice.to.phone}</p>}
            {invoice.to.vat && <p>VAT: {invoice.to.vat}</p>}
          </div>
        </div>

        <div className="border border-gray-200 p-4 rounded-md w-1/3">
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Payment Details
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  invoice.status.toLowerCase() === "paid"
                    ? "bg-green-100 text-green-800"
                    : invoice.status.toLowerCase() === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {invoice.status}
              </span>
            </p>
            <p>
              <span className="font-medium">Method:</span>{" "}
              {invoice.paymentMethod}
            </p>
            {invoice.paymentInstructions && (
              <p className="mt-2 text-xs">
                <span className="font-medium">Instructions:</span>{" "}
                {invoice.paymentInstructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 border-b border-gray-200 text-left w-4/12">
                Item
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-right w-1/12">
                Qty
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-right w-2/12">
                Unit Price
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-right w-2/12">
                Tax
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-right w-3/12">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr
                key={item.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } text-sm`}
              >
                <td className="py-3 px-4 border-b border-gray-100">
                  <div className="font-medium text-gray-800">
                    {item.description}
                  </div>
                  {item.details && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.details}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-right">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-right">
                  {invoice.currency || "$"}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-right">
                  {item.tax}%
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-right font-medium">
                  {invoice.currency || "$"}
                  {calculateItemTotal(item).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="border border-gray-200 rounded-md">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Summary
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {invoice.currency || "$"}
                  {calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                <span className="font-medium">
                  {invoice.currency || "$"}
                  {calculateTax().toFixed(2)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Discount ({invoice.discount}%):
                  </span>
                  <span className="font-medium text-red-600">
                    -{invoice.currency || "$"}
                    {calculateDiscount().toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex justify-between font-bold">
                  <span>Total Due:</span>
                  <span>
                    {invoice.currency || "$"}
                    {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              {invoice.amountPaid > 0 && (
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium text-green-600">
                    {invoice.currency || "$"}
                    {invoice.amountPaid.toFixed(2)}
                  </span>
                </div>
              )}
              {invoice.amountPaid > 0 && (
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                  <span>Balance Due:</span>
                  <span>
                    {invoice.currency || "$"}
                    {(calculateTotal() - invoice.amountPaid).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes and terms */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {invoice.notes && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Notes
            </h3>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {invoice.notes}
            </div>
          </div>
        )}
        {invoice.terms && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Terms & Conditions
            </h3>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {invoice.terms}
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <p className="mb-1">
          {invoice.from.name} • {invoice.from.phone} • {invoice.from.email}
        </p>
        <p>
          {invoice.footerNote ||
            "Thank you for your business. Please make payments by the due date."}
        </p>
      </div>
    </div>
  );
});

export default InvoiceTemplate;
