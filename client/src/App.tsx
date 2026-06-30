/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * App.tsx — Creator Universe MerchStore
 * Routing, providers, layout global
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Collections from "./pages/Collections";
import Support from "./pages/Support";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/tienda" component={() => <Layout><Shop /></Layout>} />
      <Route path="/colecciones" component={() => <Layout><Collections /></Layout>} />
      <Route path="/soporte" component={() => <Layout><Support /></Layout>} />
      <Route path="/producto/:id" component={({ params }) => <Layout><ProductDetail productId={params.id} /></Layout>} />
      <Route path="/checkout" component={() => <Layout><Checkout /></Layout>} />
      <Route path="/gracias" component={() => <Layout><ThankYou /></Layout>} />
      <Route path="/404" component={() => <Layout><NotFound /></Layout>} />
      <Route component={() => <Layout><NotFound /></Layout>} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <CartProvider>
          <TooltipProvider>
            <Toaster theme="dark" />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
