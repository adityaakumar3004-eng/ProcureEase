import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Vendors from "../pages/Vendors";
import Products from "../pages/Products";
import PurchaseOrders from "../pages/PurchaseOrders";
import Sales from "../pages/Sales";
import Inventory from "../pages/Inventory";
import Invoices from "../pages/Invoices";
import Payments from "../pages/Payments";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/vendors" element={<Vendors />} />

            <Route path="/products" element={<Products />} />

            <Route
                path="/purchase-orders"
                element={<PurchaseOrders />}
            />

            {/* Sales */}
            <Route path="/sales" element={<Sales />} />

            <Route path="/inventory" element={<Inventory />} />

            <Route path="/invoices" element={<Invoices />} />

            <Route path="/payments" element={<Payments />} />

            <Route path="/reports" element={<Reports />} />

            <Route
                path="/notifications"
                element={<Notifications />}
            />

            <Route path="/profile" element={<Profile />} />

          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
  );
}

export default AppRoutes;