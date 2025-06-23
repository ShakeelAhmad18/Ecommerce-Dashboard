import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f5f5f5",
  },
  tableCol: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  productImage: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
});

// Create Document Component
const ProductPDF = ({ products }) => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Product Inventory Report</Text>
          <Text style={styles.subtitle}>Generated on {currentDate}</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            {["ID", "Product", "Price", "Size", "Stock", "Status"].map(
              (header, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.tableColHeader,
                    width: index === 1 ? "30%" : "14%",
                  }}
                >
                  <Text style={styles.tableCellHeader}>{header}</Text>
                </View>
              )
            )}
          </View>

          {/* Table Rows */}
          {products.map((product, index) => (
            <View key={product.id} style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: "14%" }}>
                <Text style={styles.tableCell}>#{product.id}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "30%" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {product.image && (
                    <Image src={product.image} style={styles.productImage} />
                  )}
                  <Text style={styles.tableCell}>{product.name}</Text>
                </View>
              </View>
              <View style={{ ...styles.tableCol, width: "14%" }}>
                <Text style={styles.tableCell}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "14%" }}>
                <Text style={styles.tableCell}>{product.size}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "14%" }}>
                <Text style={styles.tableCell}>{product.qty}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "14%" }}>
                <Text
                  style={{
                    ...styles.tableCell,
                    color:
                      product.status === "Available" ? "#28a745" : "#dc3545",
                  }}
                >
                  {product.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProductPDF;
