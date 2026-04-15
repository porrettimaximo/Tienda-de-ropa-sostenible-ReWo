import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CartProvider } from "./components/CartContext";
import { SiteShell } from "./components/SiteShell";
import { AccountPage } from "./pages/AccountPage";
import { AdminCatalogPage } from "./pages/AdminCatalogPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CollectionPage } from "./pages/CollectionPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { StoreSalePage } from "./pages/StoreSalePage";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
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
          <Route
            path="/admin/catalog"
            element={
              <SiteShell activeNav="collections">
                <AdminCatalogPage />
              </SiteShell>
            }
          />
          <Route
            path="/admin/store-sales"
            element={
              <SiteShell activeNav="collections">
                <StoreSalePage />
              </SiteShell>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
