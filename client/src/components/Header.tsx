/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * Header Global — Creator Universe Design System
 * Sticky header con blur backdrop, logo, nav, cuenta y carrito con badge
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/colecciones", label: "Colecciones" },
  { href: "/soporte", label: "Soporte" },
];

export default function Header() {
  const [location] = useLocation();
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgeBounce, setBadgeBounce] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Bounce badge when totalItems changes
  useEffect(() => {
    if (totalItems > 0) {
      setBadgeBounce(true);
      const t = setTimeout(() => setBadgeBounce(false), 400);
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 flex-shrink-0">
                <img
                  src="/manus-storage/logo-flame_06ce910f.png"
                  alt="MerchStore Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-foreground font-bold text-lg tracking-wider uppercase hidden sm:block"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.12em" }}
              >
                MerchStore
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors duration-150",
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {location === link.href && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Account */}
              <Link
                href="/cuenta"
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-md hover:bg-surface"
                aria-label="Mi cuenta"
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-md hover:bg-surface"
                aria-label={`Carrito (${totalItems} artículos)`}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span
                    className={cn(
                      "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1",
                      "bg-primary text-primary-foreground text-[10px] font-bold",
                      "rounded-full flex items-center justify-center",
                      badgeBounce && "animate-badge-bounce"
                    )}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-md hover:bg-surface"
                aria-label="Menú"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-border">
            <nav className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium uppercase tracking-wider rounded-md transition-colors duration-150",
                    location === link.href
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-18" />
    </>
  );
}
