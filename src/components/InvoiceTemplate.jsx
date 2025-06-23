import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register fonts (you'll need to provide these font files)
Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.otf" },
    { src: "/fonts/Inter-Bold.otf", fontWeight: "bold" },
    { src: "/fonts/Inter-SemiBold.otf", fontWeight: "semibold" },
    { src: "/fonts/Inter-Light.otf", fontWeight: "light" },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Inter",
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    borderBottomStyle: "solid",
  },
  logoContainer: {
    width: 160,
  },
  logo: {
    width: "100%",
    height: 48,
    objectFit: "contain",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#101828",
    letterSpacing: -0.5,
  },
  invoiceDetails: {
    textAlign: "right",
    lineHeight: 1.6,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: "semibold",
    marginBottom: 4,
    color: "#101828",
  },
  statusBadge: {
    paddingVertical: 1,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontWeight: "semibold",
    color: "#fff",
    marginTop: 4,
    fontSize: 10,
    alignSelf: "flex-end",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "semibold",
    marginBottom: 8,
    color: "#344054",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addressBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 10,
  },
  addressCard: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  addressText: {
    lineHeight: 1.6,
    color: "#475467",
  },
  table: {
    width: "100%",
    marginBottom: 24,
  },
  tableHeader: {
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    borderBottomStyle: "solid",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    borderBottomStyle: "solid",
  },
  colDescription: {
    width: "40%",
    paddingRight: 8,
  },
  colQuantity: {
    width: "12%",
    textAlign: "right",
  },
  colPrice: {
    width: "18%",
    textAlign: "right",
  },
  colTax: {
    width: "15%",
    textAlign: "right",
  },
  colAmount: {
    width: "15%",
    textAlign: "right",
  },
  itemDescription: {
    fontWeight: "semibold",
    color: "#101828",
  },
  itemDetails: {
    color: "#667085",
    marginTop: 4,
    fontSize: 9,
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 32,
  },
  totalsBox: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderStyle: "solid",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  totalsHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    borderBottomStyle: "solid",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    alignItems: "center",
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#D0D5DD",
    borderTopStyle: "solid",
    paddingTop: 6,
    marginTop: 0,
    backgroundColor: "#F2F4F7",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  notesContainer: {
    flexDirection: "row",
    gap: 24,
    marginTop: 24,
  },
  notesBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: "center",
    color: "#667085",
    fontSize: 9,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EAECF0",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-30deg)",
    fontSize: 72,
    color: "#EAECF0",
    fontWeight: "bold",
    opacity: 0.2,
    letterSpacing: 4,
  },
  paymentCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAECF0",
    marginBottom: 24,
  },
  currencySymbol: {
    fontFeatureSettings: "'tnum' on, 'lnum' on",
  },
  amount: {
    fontFeatureSettings: "'tnum' on, 'lnum' on",
    fontWeight: "semibold",
  },
});

const InvoiceTemplate = React.forwardRef(({ invoice }, ref) => {
  // Calculations
  const calculateItemTotal = (item) => {
    return item.quantity * item.price * (1 + item.tax / 100);
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const calculateTax = () => {
    return invoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.price * item.tax) / 100,
      0
    );
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * invoice.discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "#12B76A";
      case "pending":
        return "#F79009";
      case "overdue":
        return "#F04438";
      case "draft":
        return "#667085";
      default:
        return "#667085";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(invoice.locale || "en-US", {
      style: "currency",
      currency: invoice.currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace(/^(\D+)/, "$1 ");
  };

  return (
    <Document>
      <Page size="A3" style={styles.page} ref={ref}>
        {/* Watermark for draft status */}
        {invoice.status.toLowerCase() === "draft" && (
          <View style={styles.watermark}>
            <Text>DRAFT</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {invoice.from.logo ? (
              <Image src={invoice.from.logo} style={styles.logo} />
            ) : (
              <Text style={styles.invoiceTitle}>INVOICE</Text>
            )}
          </View>

          <View style={styles.invoiceDetails}>
            <Text style={styles.invoiceNumber}>
             {invoice.invoiceNumber}
            </Text>
            <Text>Issued: {formatDate(invoice.date)}</Text>
            <Text>Due: {formatDate(invoice.dueDate)}</Text>
            {invoice.poNumber && <Text>PO #: {invoice.poNumber}</Text>}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(invoice.status) },
              ]}
            >
              <Text>{invoice.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        {/* Addresses */}
        <View style={styles.addressBox}>
          <View style={styles.addressCard}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={[styles.addressText, { fontWeight: "semibold" }]}>
              {invoice.from.name}
            </Text>
            <Text style={styles.addressText}>
              {invoice.from.addressLine1}
              {"\n"}
              {invoice.from.email}
              {"\n"}
              {invoice.from.phone}
            </Text>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={[styles.addressText, { fontWeight: "semibold" }]}>
              {invoice.to.name}
            </Text>
            <Text style={styles.addressText}>
              {invoice.to.address}
              {"\n"}
              {invoice.to.email}
              {"\n"}
              {invoice.to.phone}
            </Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <Text style={styles.addressText}>
            <Text style={{ fontWeight: "semibold" }}>Method:</Text>{" "}
            {invoice.paymentMethod}
            {"\n"}
            {invoice.paymentAccount && (
              <Text>
                <Text style={{ fontWeight: "semibold" }}>Account:</Text>{" "}
                {invoice.paymentAccount}
              </Text>
            )}
            {invoice.paymentInstructions && (
              <Text>
                {"\n"}
                <Text style={{ fontWeight: "semibold" }}>
                  Instructions:
                </Text>{" "}
                {invoice.paymentInstructions}
              </Text>
            )}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDescription, { fontWeight: "semibold" }]}>
              Item
            </Text>
            <Text style={[styles.colQuantity, { fontWeight: "semibold" }]}>
              Qty
            </Text>
            <Text style={[styles.colPrice, { fontWeight: "semibold" }]}>
              Unit Price
            </Text>
            <Text style={[styles.colTax, { fontWeight: "semibold" }]}>Tax</Text>
            <Text style={[styles.colAmount, { fontWeight: "semibold" }]}>
              Amount
            </Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.colDescription}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                {item.details && (
                  <Text style={styles.itemDetails}>{item.details}</Text>
                )}
              </View>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colPrice}>
                <Text style={styles.currencySymbol}>
                  {invoice.currencySymbol || "$"}
                </Text>
                {item.price.toFixed(2)}
              </Text>
              <Text style={styles.colTax}>{item.tax}%</Text>
              <Text style={styles.colAmount}>
                <Text style={styles.currencySymbol}>
                  {invoice.currencySymbol || "$"}
                </Text>
                {calculateItemTotal(item).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsHeader}>
              <Text style={styles.sectionTitle}>Summary</Text>
            </View>
            <View>
              <View style={styles.totalRow}>
                <Text>Subtotal:</Text>
                <Text style={styles.amount}>
                  {formatCurrency(calculateSubtotal())}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text>Tax:</Text>
                <Text style={styles.amount}>
                  {formatCurrency(calculateTax())}
                </Text>
              </View>
              {invoice.discount > 0 && (
                <View style={styles.totalRow}>
                  <Text>Discount ({invoice.discount}%):</Text>
                  <Text style={styles.amount}>
                    -{formatCurrency(calculateDiscount())}
                  </Text>
                </View>
              )}
              <View style={[styles.totalRow, styles.grandTotal]}>
                <Text style={{ fontWeight: "semibold" }}>Total Due:</Text>
                <Text style={[styles.amount, { fontWeight: "bold" }]}>
                  {formatCurrency(calculateTotal())}
                </Text>
              </View>
              {invoice.amountPaid > 0 && (
                <>
                  <View style={styles.totalRow}>
                    <Text>Amount Paid:</Text>
                    <Text style={styles.amount}>
                      {formatCurrency(invoice.amountPaid)}
                    </Text>
                  </View>
                  <View style={[styles.totalRow, styles.grandTotal]}>
                    <Text style={{ fontWeight: "semibold" }}>Balance Due:</Text>
                    <Text style={[styles.amount, { fontWeight: "bold" }]}>
                      {formatCurrency(calculateTotal() - invoice.amountPaid)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <View style={styles.notesContainer}>
            {invoice.notes && (
              <View style={styles.notesBox}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={[styles.addressText, { marginTop: 8 }]}>
                  {invoice.notes}
                </Text>
              </View>
            )}
            {invoice.terms && (
              <View style={styles.notesBox}>
                <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                <Text style={[styles.addressText, { marginTop: 8 }]}>
                  {invoice.terms}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            {invoice.from.name} • {invoice.from.phone} • {invoice.from.email}
          </Text>
          <Text style={{ marginTop: 4 }}>
            {invoice.footerNote ||
              "Thank you for your business! Please make payment by the due date."}
          </Text>
          {invoice.from.website && (
            <Text style={{ marginTop: 4 }}>{invoice.from.website}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
});

export default InvoiceTemplate;
