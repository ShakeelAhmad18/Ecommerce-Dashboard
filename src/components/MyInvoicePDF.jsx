import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Create styles for your PDF with a modern Culters brand feel
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40, // Increased padding
    fontFamily: "Helvetica",
    color: "#333333", // Dark charcoal for main text
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50, // More space
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C5282", // Culters primary blue
  },
  invoiceDetailsBlock: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: "extrabold",
    color: "#2C5282", // Culters primary blue
    marginBottom: 10,
  },
  detailText: {
    fontSize: 10,
    color: "#6B7280", // Subtle gray
    marginBottom: 3,
  },
  detailValue: {
    fontWeight: "bold",
    color: "#333333",
  },
  companyAddress: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 5,
    lineHeight: 1.4,
  },

  // From and Bill To Sections
  addressBlock: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#F0F4F8", // Light blue background
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressColumn: {
    width: "48%", // Two columns
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2C5282", // Culters primary blue
    marginBottom: 8,
  },
  addressText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.4,
  },

  // Table Styling
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#E5E7EB", // Light gray border
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#2C5282", // Culters primary blue
    color: "#FFFFFF",
    padding: 10,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableCol: {
    width: "25%",
    padding: 10,
    fontSize: 10,
    color: "#333333",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableColTotal: {
    textAlign: "right",
    borderRightWidth: 0, // Last column doesn't need right border
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB", // Very light gray for even rows
  },
  tableCellRight: {
    textAlign: "right",
  },

  // Totals and Status Section
  summarySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    alignItems: "flex-end", // Align totals to the bottom
  },
  statusContainer: {
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-start", // Status badge aligns to top
    minWidth: 80,
    textAlign: "center",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statusPaid: {
    backgroundColor: "#D1FAE5", // Light green
    color: "#059669", // Dark green
  },
  statusUnpaid: {
    backgroundColor: "#FEF3C7", // Light yellow
    color: "#D97706", // Dark yellow
  },
  statusOverdue: {
    backgroundColor: "#FEE2E2", // Light red
    color: "#DC2626", // Dark red
  },
  notesSection: {
    flex: 1,
    marginRight: 30,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2C5282",
    marginBottom: 5,
  },
  notesContent: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 1.5,
  },
  totalsTable: {
    width: "35%",
    flexDirection: "column",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    marginBottom: 5,
  },
  totalLabel: {
    color: "#6B7280",
  },
  totalValue: {
    fontWeight: "semibold",
    color: "#333333",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB", // Light gray divider
  },

  // Footer Section
  footer: {
    fontSize: 8,
    textAlign: "center",
    marginTop: "auto", // Pushes footer to the bottom of the page
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    color: "#6B7280",
    lineHeight: 1.6,
  },
});

// Define the PDF document content as a React component
export const MyInvoicePDF = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.logo}>Culters</Text>
          <Text style={styles.companyAddress}>
            123 Business Rd., Suite 400{"\n"}
            City, State, 12345{"\n"}
            info@culters.com{"\n"}
            +1 (555) 123-4567
          </Text>
        </View>
        <View style={styles.invoiceDetailsBlock}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.detailText}>
            Invoice #: <Text style={styles.detailValue}>{invoice.id}</Text>
          </Text>
          <Text style={styles.detailText}>
            Date:{" "}
            <Text style={styles.detailValue}>
              {new Date(invoice.date).toLocaleDateString()}
            </Text>
          </Text>
          <Text style={styles.detailText}>
            Due Date:{" "}
            <Text style={styles.detailValue}>
              {new Date(invoice.dueDate).toLocaleDateString()}
            </Text>
          </Text>
        </View>
      </View>

      {/* Address Blocks */}
      <View style={styles.addressBlock}>
        <View style={styles.addressColumn}>
          <Text style={styles.addressTitle}>Bill To:</Text>
          <Text style={styles.addressText}>{invoice.client}</Text>
          {/* Add more client details as needed */}
          <Text style={styles.addressText}>Client Address Line 1</Text>
          <Text style={styles.addressText}>Client City, State, Zip</Text>
        </View>
        <View style={styles.addressColumn}>
          <Text style={styles.addressTitle}>From:</Text>
          <Text style={styles.addressText}>Culters Inc.</Text>
          <Text style={styles.addressText}>123 Main Street</Text>
          <Text style={styles.addressText}>Anytown, CA 90210</Text>
          <Text style={styles.addressText}>contact@culters.com</Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Item</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Quantity</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Price</Text>
          </View>
          <View style={[styles.tableCol, styles.tableColTotal]}>
            <Text style={[styles.tableHeader, styles.tableCellRight]}>
              Total
            </Text>
          </View>
        </View>
        {/* Table Body */}
        {invoice.items.map((item, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.tableRowEven : null,
            ]}
          >
            <View style={styles.tableCol}>
              <Text>{item.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{item.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>${item.price.toFixed(2)}</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColTotal]}>
              <Text style={styles.tableCellRight}>
                ${(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Totals and Status Section */}
      <View style={styles.summarySection}>
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesContent}>
            Please note that all payments are due within 30 days of the invoice
            date. Late payments may incur additional charges as per our terms
            and conditions.
          </Text>
          <View
            style={[
              styles.statusContainer,
              invoice.status === "paid"
                ? styles.statusPaid
                : invoice.status === "unpaid"
                ? styles.statusUnpaid
                : styles.statusOverdue,
              { marginTop: 15 }, // Add some margin above the status
            ]}
          >
            <Text style={styles.statusText}>
              Status:{" "}
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.totalsTable}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${invoice.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (0%):</Text>
            <Text style={styles.totalValue}>$0.00</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text>GRAND TOTAL:</Text>
            <Text>${invoice.amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer} fixed>
        Culters Inc. | A Professional Invoicing Solution | For inquiries, please
        contact info@culters.com or visit www.culters.com
        {"\n"}
        Page{" "}
        <Text
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} of ${totalPages}`
          }
        />
      </Text>
    </Page>
  </Document>
);
