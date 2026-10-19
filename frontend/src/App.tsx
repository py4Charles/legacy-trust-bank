import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { HomePage } from "@/pages/public/HomePage";
import { ProductsPage } from "@/pages/public/ProductsPage";
import { ProductDetailPage } from "@/pages/public/ProductDetailPage";
import { SupportPage } from "@/pages/public/SupportPage";
import { SecurityPage } from "@/pages/public/SecurityPage";
import { RegisterPage } from "@/pages/public/RegisterPage";
import { AboutPage } from "@/pages/public/AboutPage";
import { NotFoundPage } from "@/pages/public/NotFoundPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardHome } from "@/pages/dashboard/DashboardHome";
import { AccountsPage } from "@/pages/dashboard/AccountsPage";
import { PaymentsPage } from "@/pages/dashboard/PaymentsPage";
import { CardsPage } from "@/pages/dashboard/CardsPage";
import { ApprovalsPage } from "@/pages/dashboard/ApprovalsPage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products/:category" element={<ProductsPage />} />
          <Route
            path="/products/:category/:slug"
            element={<ProductDetailPage />}
          />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="cards" element={<CardsPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
