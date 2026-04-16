import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CartProvider } from "./components/CartContext";
import { SiteShell } from "./components/SiteShell";
import { AccountPage } from "./pages/AccountPage";
import { AdminCatalogPage } from "./pages/AdminCatalogPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPromotionsPage } from "./pages/AdminPromotionsPage";
import { CombosPage } from "./pages/CombosPage";
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
            <SiteShell>
              <HomePage />
            </SiteShell>
          }
        />
        <Route
          path="/collections"
          element={
            <SiteShell>
              <CollectionPage />
            </SiteShell>
          }
        />
        <Route
          path="/combos"
          element={
            <SiteShell>
              <CombosPage />
            </SiteShell>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <SiteShell>
              <ProductDetailPage />
            </SiteShell>
          }
        />
        <Route
          path="/cart"
          element={
            <SiteShell>
              <CartPage />
            </SiteShell>
          }
        />
        <Route
          path="/checkout"
          element={
            <SiteShell>
              <CheckoutPage />
            </SiteShell>
          }
        />
        <Route
          path="/login"
          element={
            <SiteShell>
              <LoginPage />
            </SiteShell>
          }
        />
        <Route
          path="/account"
          element={
            <SiteShell>
              <AccountPage />
            </SiteShell>
          }
        />
        <Route
          path="/admin/login"
          element={
            <SiteShell>
              <AdminLoginPage />
            </SiteShell>
          }
        />
        <Route
          path="/admin"
          element={
            <SiteShell>
              <AdminDashboardPage />
            </SiteShell>
          }
        />
        <Route
          path="/admin/promotions"
          element={
            <SiteShell>
              <AdminPromotionsPage />
            </SiteShell>
          }
        />
        <Route
          path="/admin/catalog"
          element={
            <SiteShell>
              <AdminCatalogPage />
            </SiteShell>
          }
        />
        <Route
          path="/admin/store-sales"
          element={
            <SiteShell>
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
