/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import EditorialPolicyPage from "./pages/EditorialPolicyPage";
import SpecialPage from "./pages/SpecialPage";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AdminNewsList from "./pages/admin/AdminNewsList";
import AdminNewsEditor from "./pages/admin/AdminNewsEditor";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAuthors from "./pages/admin/AdminAuthors";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminAds from "./pages/admin/AdminAds";
import AdminSettings from "./pages/admin/AdminSettings";
import { seedInitialFirestoreData } from "./lib/firestoreService";

export default function App() {
  useEffect(() => {
    seedInitialFirestoreData();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="news/:slug" element={<ArticlePage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="editorial" element={<EditorialPolicyPage />} />
            <Route path="special" element={<SpecialPage />} />
          </Route>
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="news" element={<AdminNewsList />} />
              <Route path="news/new" element={<AdminNewsEditor />} />
              <Route path="news/:id" element={<AdminNewsEditor />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="authors" element={<AdminAuthors />} />
              <Route path="ads" element={<AdminAds />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
