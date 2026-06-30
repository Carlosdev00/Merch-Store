/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * CartDrawer — Carrito Lateral
 * Creator Universe Design System
 * Slide desde la derecha, overlay oscuro, animaciones de eliminación y subtotal dinámico
 */

import { useEffect, useRef, useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface AnimatingItem {
  id: string;
  removing: boolean;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const [, navigate] = useLocation();
  const [animatingItems, setAnimatingItems] = useState<AnimatingItem[]>([]);
  const [prevSubtotal, setPrevSubtotal] = useState(subtotal);
  const [subtotalFlip, setSubtotalFlip] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Subtotal flip animation
  useEffect(() => {
    if (subtotal !== prevSubtotal) {
      setSubtotalFlip(true);
      const t = setTimeout(() => {
        setSubtotalFlip(false);
        setPrevSubtotal(subtotal);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [subtotal, prevSubtotal]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleRemove = (id: string) => {
    setAnimatingItems((prev) => [...prev, { id, removing: true }]);
    setTimeout(() => {
      removeItem(id);
      setAnimatingItems((prev) => prev.filter((i) => i.id !== id));
    }, 250);
  };

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const isRemoving = (id: string) => animatingItems.some((i) => i.id === id && i.removing);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px]",
          "bg-surface border-l border-border flex flex-col",
          "transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ willChange: "transform" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-primary" />
            <h2
              className="text-foreground text-xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
            >
              Tu Carrito
            </h2>
            {totalItems > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-elevated rounded-md transition-colors duration-150"
            aria-label="Cerrar carrito"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <ShoppingBag size={48} className="text-muted-foreground/30" />
              <div>
                <p className="text-foreground font-medium">Tu carrito está vacío</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Agrega productos para comenzar tu pedido.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 text-primary text-sm font-medium hover:underline underline-offset-4"
              >
                Seguir comprando →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex gap-4 p-3 rounded-lg bg-surface-elevated border border-border/50",
                  "transition-all duration-250",
                  isRemoving(item.id) && "animate-slide-out-left opacity-0"
                )}
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-background">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium leading-tight truncate">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {item.color} · {item.size}
                  </p>
                  <p className="text-primary text-sm font-bold mt-1 mono">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-6 h-6 rounded flex items-center justify-center bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-foreground text-sm font-medium w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="w-6 h-6 rounded flex items-center justify-center bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors duration-150 self-start"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-6 py-5 border-t border-border space-y-4 bg-surface">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Subtotal</span>
              <span
                className={cn(
                  "text-foreground text-lg font-bold mono",
                  subtotalFlip && "animate-number-flip"
                )}
              >
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Envío calculado en el checkout. Impuestos incluidos.
            </p>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-md hover:brightness-110 active:scale-[0.98] transition-all duration-150"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Proceder al Pago
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
