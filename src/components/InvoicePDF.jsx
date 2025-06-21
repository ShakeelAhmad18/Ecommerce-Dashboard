import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// --- Font Registration ---
// You need to register the font family and its various styles (regular, italic, bold)
// @react-pdf/renderer doesn't inherently know about 'Helvetica-Oblique'.
// You can either:
// 1. Use CDN links for a common, open-source font like Inter or Roboto.
// 2. Host the .ttf files locally in your public folder and use relative paths.
//    (e.g., if you place Helvetica-Oblique.ttf in public/fonts, use '/fonts/Helvetica-Oblique.ttf')

// Option 1: Using Inter font from CDN (Recommended if you don't have Helvetica .ttf files)
// Inter is a good alternative often used for its readability and modern look.
Font.register({
  family: "Inter", // We'll use 'Inter' as the font family name
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Italic.ttf",
      fontStyle: "italic",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-Bold.ttf",
      fontWeight: 700,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/inter-font@3.19.0/Inter-BoldItalic.ttf",
      fontStyle: "italic",
      fontWeight: 700,
    },
  ],
});

// Option 2: If you have actual Helvetica .ttf files locally, use this (adjust paths)
// IMPORTANT: You need to replace 'path/to/your/...' with the actual paths to your font files.
// For example, if you put them in `public/fonts/`, the path would be `/fonts/Helvetica.ttf`.
/*
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'path/to/your/Helvetica.ttf', fontWeight: 400 }, // Regular Helvetica
    { src: 'path/to/your/Helvetica-Oblique.ttf', fontStyle: 'italic', fontWeight: 400 }, // Oblique/Italic
    { src: 'path/to/your/Helvetica-Bold.ttf', fontWeight: 700 }, // Bold
    { src: 'path/to/your/Helvetica-BoldOblique.ttf', fontStyle: 'italic', fontWeight: 700 }, // Bold Italic
  ],
});
*/
// Choose either Option 1 OR Option 2, not both simultaneously.
// For the purpose of this example, Option 1 (Inter from CDN) is active.

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    // Use the registered font family here
    fontFamily: "Inter", // Change to 'Helvetica' if you use Option 2 above
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 15,
    padding: 5,
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  column: {
    flexDirection: "column",
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 10,
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f2f2f2",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
  },
  tableCell: {
    fontSize: 9,
    color: "#333",
  },
  totalContainer: {
    marginTop: 20,
    borderTop: "1px solid #bfbfbf",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 10,
    color: "#333",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4f46e5", // A nice indigo color
  },
  notes: {
    marginTop: 20,
    fontSize: 9,
    color: "#555",
  },
  // Example of using italic font style
  italicText: {
    fontStyle: "italic",
  },
  boldText: {
    fontWeight: "bold",
  },
});

const InvoicePDF = ({ invoice }) => {
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
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>INVOICE</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={styles.label}>Invoice #:</Text>{" "}
              {invoice.invoiceNumber}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Date:</Text> {formatDate(invoice.date)}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Due Date:</Text>{" "}
              {formatDate(invoice.dueDate)}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Title:</Text>{" "}
              <Text style={styles.boldText}>{invoice.title}</Text>
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={styles.label}>Payment Method:</Text>{" "}
              {invoice.paymentMethod}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Status:</Text> {invoice.status}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.section}>
            <Text style={styles.text}>
              <Text style={styles.label}>From:</Text>
            </Text>
            <Text style={styles.text}>{invoice.from.name}</Text>
            <Text style={styles.text}>{invoice.from.address}</Text>
            <Text style={styles.text}>{invoice.from.email}</Text>
            <Text style={styles.text}>{invoice.from.phone}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.text}>
              <Text style={styles.label}>To:</Text>
            </Text>
            <Text style={styles.text}>{invoice.to.name}</Text>
            <Text style={styles.text}>{invoice.to.address}</Text>
            <Text style={styles.text}>{invoice.to.email}</Text>
            <Text style={styles.text}>{invoice.to.phone}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Qty</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Price</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Tax</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>
          {invoice.items.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.tax}%</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  ${calculateItemTotal(item).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalContainer}>
          <View style={styles.column}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>
                ${calculateSubtotal().toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%):</Text>
              <Text style={styles.totalValue}>
                ${calculateTax().toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount ({invoice.discount}%):
              </Text>
              <Text style={styles.totalValue}>
                -${calculateDiscount().toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotal}>
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.label}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
