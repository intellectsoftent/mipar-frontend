import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import IdolsPage from "./pages/IdolsPage.tsx";
import IdolDetailPage from "./pages/IdolDetailPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignupPage from "./pages/auth/SignupPage.tsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminIdolsPage from "./pages/admin/AdminIdolsPage.tsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import MyOrdersPage from "./pages/MyOrdersPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/idols" element={<IdolsPage />} />
          <Route path="/idols/:id" element={<IdolDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="idols" element={<AdminIdolsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
