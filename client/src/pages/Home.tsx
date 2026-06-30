/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * Home Page — Creator Universe Design System
 * Hero asimétrico, Colecciones, Más Vendidos con Quick Add
 */

import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Zap, ShoppingCart, Plus, X, Check, Loader2 } from "lucide-react";
import { PRODUCTS, formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// ─── Quick Add Modal ──────────────────────────────────────────────────────────
interface QuickAddModalProps {
  product: Product | null;
  onClose: () => void;
}

function QuickAddModal({ product, onClose }: QuickAddModalProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product?.variants[0]?.color ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [addState, setAddState] = useState<"idle" | "loading" | "done">("idle");

  if (!product) return null;

  const currentVariant = product.variants.find((v) => v.color === selectedColor) ?? product.variants[0];
  const stockForSize = selectedSize ? (currentVariant.stock[selectedSize] ?? 0) : null;
  const isSizeOutOfStock = (size: string) => (currentVariant.stock[size] ?? 0) === 0;

  const handleAdd = () => {
    if (!selectedSize && product.sizes.length > 1) return;
    const size = product.sizes.length === 1 ? product.sizes[0] : selectedSize;
    setAddState("loading");
    setTimeout(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: currentVariant.images[0],
        color: selectedColor,
        size,
        quantity: 1,
        maxStock: currentVariant.stock[size] ?? 1,
      });
      setAddState("done");
      setTimeout(() => {
        onClose();
        setAddState("idle");
      }, 800);
    }, 600);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-surface border-border max-w-sm p-0 overflow-hidden">
        <DialogTitle className="sr-only">Añadir {product.name} al carrito</DialogTitle>
        <div className="flex gap-4 p-5">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-background">
            <img src={currentVariant.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold text-sm leading-tight">{product.name}</p>
            <p className="text-primary font-bold text-base mono mt-1">{formatPrice(product.price)}</p>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Color selector */}
          {product.variants.length > 1 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Color: <span className="text-foreground">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.color}
                    onClick={() => setSelectedColor(v.color)}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-all duration-150",
                      selectedColor === v.color ? "border-primary scale-110" : "border-border/50"
                    )}
                    style={{ backgroundColor: v.colorHex }}
                    aria-label={v.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 1 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Talla</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const outOfStock = isSizeOutOfStock(size);
                  return (
                    <button
                      key={size}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium border rounded-md transition-all duration-150",
                        outOfStock
                          ? "border-border/30 text-muted-foreground/40 line-through cursor-not-allowed"
                          : selectedSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {stockForSize !== null && stockForSize > 0 && stockForSize <= 3 && (
                <p className="text-destructive text-xs mt-1.5">Solo quedan {stockForSize} unidades</p>
              )}
            </div>
          )}

          {/* Add button */}
          <button
            onClick={handleAdd}
            disabled={addState !== "idle" || (product.sizes.length > 1 && !selectedSize)}
            className={cn(
              "w-full py-3 rounded-md font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-150",
              addState === "done"
                ? "bg-green-500 text-white"
                : "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]",
              (product.sizes.length > 1 && !selectedSize) && "opacity-50 cursor-not-allowed"
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {addState === "loading" && <Loader2 size={16} className="animate-spin" />}
            {addState === "done" && <Check size={16} className="animate-check-pop" />}
            {addState === "idle" && <ShoppingCart size={16} />}
            {addState === "loading" ? "Añadiendo..." : addState === "done" ? "¡Añadido!" : "Añadir al Carrito"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onQuickAdd }: { product: Product; onQuickAdd: (p: Product) => void }) {
  const [, navigate] = useLocation();
  const [hovered, setHovered] = useState(false);
  const variant = product.variants[0];
  const hasSecondImage = variant.images.length > 1 && variant.images[1] !== variant.images[0];

  return (
    <div
      className="product-card group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/producto/${product.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-background">
        <img
          src={variant.images[0]}
          alt={product.name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-300",
            hovered && hasSecondImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
          )}
        />
        {hasSecondImage && (
          <img
            src={variant.images[1]}
            alt={`${product.name} — vista trasera`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-300",
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNew && <span className="badge-new">Nuevo</span>}
          {product.isLimitedEdition && <span className="badge-new bg-purple-500">Limitado</span>}
          {product.isBestSeller && !product.isNew && <span className="badge-new bg-amber-500">Top Ventas</span>}
        </div>

        {/* Quick Add */}
        <button
          onClick={(e) => { e.stopPropagation(); onQuickAdd(product); }}
          className={cn(
            "absolute bottom-3 left-3 right-3 py-2.5 bg-primary text-primary-foreground",
            "text-xs font-bold uppercase tracking-widest rounded-md",
            "flex items-center justify-center gap-1.5",
            "transition-all duration-200",
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          aria-label={`Añadir rápido: ${product.name}`}
        >
          <Plus size={12} />
          Añadir rápido
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-foreground text-sm font-medium leading-tight">{product.name}</p>
        <p className="text-primary font-bold text-base mono mt-1">{formatPrice(product.price)}</p>
        {/* Color dots */}
        <div className="flex gap-1.5 mt-2">
          {product.variants.map((v) => (
            <span
              key={v.color}
              className="w-3 h-3 rounded-full border border-border/50"
              style={{ backgroundColor: v.colorHex }}
              title={v.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Collections Section ──────────────────────────────────────────────────────
const COLLECTION_ITEMS = [
  {
    id: "ropa",
    label: "Ropa",
    description: "Hoodies, tees y crewnecks",
    image: "/manus-storage/product-hoodie-black_2d9aa3ce.jpg",
    href: "/tienda?categoria=ropa",
  },
  {
    id: "accesorios",
    label: "Accesorios",
    description: "Gorras, bolsas y más",
    image: "/manus-storage/product-cap-black_6e729c21.jpg",
    href: "/tienda?categoria=accesorios",
  },
  {
    id: "edicion-limitada",
    label: "Edición Limitada",
    description: "Drops exclusivos numerados",
    image: "/manus-storage/collection-banner-limited_ce7adbaa.jpg",
    href: "/tienda?categoria=edicion-limitada",
  },
];

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [, navigate] = useLocation();
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const shopRef = useRef<HTMLElement>(null);

  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller || p.isNew).slice(0, 4);

  const handleViewCollection = () => {
    navigate("/tienda");
  };

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/manus-storage/hero-banner_c51068f7.jpg"
            alt="Nueva Colección"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-2 animate-fade-up stagger-1">
              <Zap size={14} className="text-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-widest">
                Nueva Colección 2026
              </span>
            </div>

            <h1
              className="text-white leading-none animate-fade-up stagger-2"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                letterSpacing: "0.02em",
              }}
            >
              Lleva el
              <br />
              <span className="text-primary">Fuego</span>
              <br />
              Contigo
            </h1>

            <p className="text-white/80 text-lg leading-relaxed animate-fade-up stagger-3 max-w-sm">
              Mercancía oficial. Diseñada para la crew. Hecha para durar.
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-up stagger-4">
              <button
                onClick={handleViewCollection}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-md hover:brightness-110 active:scale-[0.97] transition-all duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Ver Nueva Colección
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/colecciones")}
                className="flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium text-sm rounded-md hover:bg-white/10 active:scale-[0.97] transition-all duration-150"
              >
                Explorar todo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="py-20" ref={shopRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <h2
              className="text-foreground"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "0.04em",
              }}
            >
              Colecciones
            </h2>
            <Link href="/colecciones" className="text-primary text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COLLECTION_ITEMS.map((col, i) => (
              <Link
                key={col.id}
                href={col.href}
                className={cn(
                  "relative overflow-hidden rounded-xl group cursor-pointer",
                  "animate-fade-up",
                  i === 0 ? "stagger-1" : i === 1 ? "stagger-2" : "stagger-3"
                )}
                style={{ aspectRatio: i === 0 ? "3/4" : "3/4" }}
              >
                <img
                  src={col.image}
                  alt={col.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3
                    className="text-white text-2xl"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
                  >
                    {col.label}
                  </h3>
                  <p className="text-white/70 text-sm mt-0.5">{col.description}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider transition-all duration-200 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                    Ver colección <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                Los favoritos de la crew
              </p>
              <h2
                className="text-foreground"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "0.04em",
                }}
              >
                Más Vendidos
              </h2>
            </div>
            <Link href="/tienda" className="text-primary text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1">
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((product, i) => (
              <div
                key={product.id}
                className={cn("animate-fade-up", `stagger-${i + 1}`)}
              >
                <ProductCard product={product} onQuickAdd={setQuickAddProduct} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER CTA ───────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/manus-storage/collection-banner-limited_ce7adbaa.jpg"
              alt="Edición Limitada"
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-12 space-y-4">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">
                  Disponibilidad Limitada
                </span>
                <h2
                  className="text-white"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Drop #001
                  <br />
                  <span className="text-primary">100 Unidades</span>
                </h2>
                <button
                  onClick={() => navigate("/tienda?categoria=edicion-limitada")}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-md hover:brightness-110 active:scale-[0.97] transition-all duration-150"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Consíguelo Ahora
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Add Modal */}
      {quickAddProduct && (
        <QuickAddModal
          product={quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
        />
      )}
    </div>
  );
}
