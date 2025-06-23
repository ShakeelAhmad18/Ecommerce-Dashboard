import { BrowserRouter, Navigate, Route, Router, Routes, useLocation,  } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Signup from "./pages/Signup";
import Sneakers from "./pages/Sneakers";
import Bag from "./pages/Bag";
import Tshirts from "./pages/Tshirts";
import Jacket from "./pages/Jacket";
import AddProduct from "./pages/AddProduct";
import AccountSettings from "./pages/AccountSettings";
import Transaction from "./pages/Transaction";
import AddOrder from "./pages/AddOrder";
import Customer from "./pages/Customer";
import AddCustomer from "./pages/AddCustomer";
import SalesReport from "./pages/SalesReport";
import Help from "./pages/Help";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import InventoryManagement from "./pages/InventoryManagement";
import SalesDashboard from "./pages/SalesDashboard";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/OrderTracking";
import Coupons from "./pages/Coupons";
import Staff from "./pages/Staff";
import AddStaff from "./pages/AddStaff";
import FlashSales from "./pages/FlashSales";
import Payments from "./pages/Payments";
import PaymentDetails from "./pages/PaymentDetails";
import TransactionDetail from "./pages/TransactionDetail";
import InvoiceDetail from "./pages/InvoiceDetail";


function App() {
 
     const location=useLocation();

     if(location.pathname === "/") {
        return <Navigate to="/dashboard" replace />;
     }
    
  return (
    <>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="products/sneakers" element={<Sneakers />} />
            <Route path="products/jacket" element={<Jacket />} />
            <Route path="products/t-shirts" element={<Tshirts />} />
            <Route path="products/add-product" element={<AddProduct />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="products/bags" element={<Bag />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="add-order" element={<AddOrder />} />
            <Route path="customers" element={<Customer />} />
            <Route path="add-customer" element={<AddCustomer />} />
            <Route path="sales-reports" element={<SalesReport />} />
            <Route path="help" element={<Help />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="create-invoice" element={<CreateInvoice />} />
            <Route path="inventory-management" element={<InventoryManagement/>}/>
            <Route path="sales-dashboard" element={<SalesDashboard/>}/>
            <Route path="orders" element={<Orders />} />
            <Route path="orders-tracking" element={<TrackOrder />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="staff" element={<Staff />} />
            <Route path="add-staff" element={<AddStaff />} />
            <Route path="flash-sales" element={<FlashSales />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payment-details/:id" element={<PaymentDetails />} />
            <Route path="transaction-details/:id" element={<TransactionDetail />} />
            <Route path="invoice-details/:id" element={<InvoiceDetail />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </>
  );
}

export default App
