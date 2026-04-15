import { BrowserRouter, Route, Routes } from "react-router-dom";

import { SiteShell } from "./components/SiteShell";
import { AccountPage } from "./pages/AccountPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CollectionPage } from "./pages/CollectionPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SiteShell activeNav="collections">
              <HomePage />
            </SiteShell>
          }
        />
        <Route
          path="/collections"
          element={
            <SiteShell activeNav="collections">
              <CollectionPage />
            </SiteShell>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <SiteShell activeNav="collections">
              <ProductDetailPage />
            </SiteShell>
          }
        />
        <Route
          path="/cart"
          element={
            <SiteShell activeNav="collections">
              <CartPage />
            </SiteShell>
          }
        />
        <Route
          path="/checkout"
          element={
            <SiteShell activeNav="collections">
              <CheckoutPage />
            </SiteShell>
          }
        />
        <Route
          path="/login"
          element={
            <SiteShell activeNav="collections">
              <LoginPage />
            </SiteShell>
          }
        />
        <Route
          path="/account"
          element={
            <SiteShell activeNav="collections">
              <AccountPage />
            </SiteShell>
          }
        />
        <Route
          path="/admin/login"
          element={
            <SiteShell activeNav="collections">
              <AdminLoginPage />
            </SiteShell>
          }
        />
        <Route
          path="/admin"
          element={
            <SiteShell activeNav="collections">
              <AdminDashboardPage />
            </SiteShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
