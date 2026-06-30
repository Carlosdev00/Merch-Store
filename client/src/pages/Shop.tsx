/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * Shop Page — Catálogo / Tienda
 * Creator Universe Design System
 * Filtros, ordenamiento, grid de productos con hover swap de imagen
 */

import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { SlidersHorizontal, ChevronDown, X, Plus, Check, Loader2, ShoppingCart } from "lucide-react";
import { PRODUCTS, CATEGORIES, SIZES, formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type SortOption = "novedades" | "precio-asc" | "precio-desc";

// ─── Quick Add Modal (same as Home but standalone) ────────────────────────────
function QuickAddModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product?.variants[0]?.color ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [addState, setAddState] = useState<"idle" | "loading" | "done">("idle");

  if (!product) return null;
  const currentVariant = product.variants.find((v) => v.color === selectedColor) ?? product.variants[0];
  const isSizeOutOfStock = (size: string) => (currentVariant.stock[size] ?? 0) === 0;
  const stockForSize = selectedSize ? (currentVariant.stock[selectedSize] ?? 0) : null;

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
      setTimeout(() => { onClose(); setAddState("idle"); }, 800);
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
          {product.variants.length > 1 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Color: <span className="text-foreground">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.variants.map((v) => (
                  <button key={v.color} onClick={() => setSelectedColor(v.color)}
                    className={cn("w-7 h-7 rounded-full border-2 transition-all duration-150", selectedColor === v.color ? "border-primary scale-110" : "border-border/50")}
                    style={{ backgroundColor: v.colorHex }} aria-label={v.color} />
                ))}
              </div>
            </div>
          )}
          {product.sizes.length > 1 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Talla</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const outOfStock = isSizeOutOfStock(size);
                  return (
                    <button key={size} onClick={() => !outOfStock && setSelectedSize(size)} disabled={outOfStock}
                      className={cn("px-3 py-1.5 text-xs font-medium border rounded-md transition-all duration-150",
                        outOfStock ? "border-border/30 text-muted-foreground/40 line-through cursor-not-allowed"
                          : selectedSize === size ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")}>
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
          <button onClick={handleAdd} disabled={addState !== "idle" || (product.sizes.length > 1 && !selectedSize)}
            className={cn("w-full py-3 rounded-md font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-150",
              addState === "done" ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]",
              (product.sizes.length > 1 && !selectedSize) && "opacity-50 cursor-not-allowed")}
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
    <div className="product-card group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/producto/${product.id}`)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-background">
        <img src={variant.images[0]} alt={product.name}
          className={cn("absolute inset-0 w-full h-full object-cover transition-all duration-300",
            hovered && hasSecondImage ? "opacity-0 scale-105" : "opacity-100 scale-100")} />
        {hasSecondImage && (
          <img src={variant.images[1]} alt={`${product.name} — vista trasera`}
            className={cn("absolute inset-0 w-full h-full object-cover transition-all duration-300",
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-105")} />
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNew && <span className="badge-new">Nuevo</span>}
          {product.isLimitedEdition && <span className="badge-new bg-purple-500">Limitado</span>}
          {product.isBestSeller && !product.isNew && <span className="badge-new bg-amber-500">Top Ventas</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onQuickAdd(product); }}
          className={cn("absolute bottom-3 left-3 right-3 py-2.5 bg-primary text-primary-foreground",
            "text-xs font-bold uppercase tracking-widest rounded-md",
            "flex items-center justify-center gap-1.5 transition-all duration-200",
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          aria-label={`Añadir rápido: ${product.name}`}>
          <Plus size={12} /> Añadir rápido
        </button>
      </div>
      <div className="p-3.5">
        <p className="text-foreground text-sm font-medium leading-tight">{product.name}</p>
        <p className="text-primary font-bold text-base mono mt-1">{formatPrice(product.price)}</p>
        <div className="flex gap-1.5 mt-2">
          {product.variants.map((v) => (
            <span key={v.color} className="w-3 h-3 rounded-full border border-border/50"
              style={{ backgroundColor: v.colorHex }} title={v.color} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Shop Page ────────────────────────────────────────────────────────────────
export default function Shop() {
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState("todos");
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<SortOption>("novedades");
  const [showFilters, setShowFilters] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] ?? "");
    const cat = params.get("categoria");
    if (cat) setActiveCategory(cat);
  }, [location]);

  const toggleSize = (size: string) => {
    setActiveSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== "todos") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (activeSizes.length > 0) {
      result = result.filter((p) =>
        activeSizes.some((size) =>
          p.variants.some((v) => (v.stock[size] ?? 0) > 0)
        )
      );
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case "precio-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "novedades":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [activeCategory, activeSizes, priceRange, sortBy]);

  const activeFiltersCount = (activeCategory !== "todos" ? 1 : 0) + activeSizes.length;

  const clearFilters = () => {
    setActiveCategory("todos");
    setActiveSizes([]);
    setPriceRange([0, 2000]);
    setSortBy("novedades");
  };

  return (
    <div className="container py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-foreground"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em" }}
        >
          Tienda
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all duration-150",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none bg-surface border border-border text-foreground text-xs font-medium px-4 py-2 pr-8 rounded-md cursor-pointer focus:border-primary outline-none transition-colors duration-150"
          >
            <option value="novedades">Novedades</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all duration-150",
            showFilters || activeFiltersCount > 0
              ? "bg-primary/10 border-primary text-primary"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <SlidersHorizontal size={12} />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150">
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mb-8 p-5 bg-surface rounded-xl border border-border animate-fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Size filter */}
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3">Talla</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium border rounded-md transition-all duration-150",
                      activeSizes.includes(size)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3">
                Precio: hasta {formatPrice(priceRange[1])}
              </p>
              <input
                type="range"
                min={0}
                max={2000}
                step={50}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(2000)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <p className="text-foreground font-medium text-lg">No hay productos con esos filtros</p>
          <p className="text-muted-foreground text-sm">Intenta cambiar los filtros o explorar todas las categorías.</p>
          <button onClick={clearFilters} className="mt-2 text-primary text-sm font-medium hover:underline underline-offset-4">
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, i) => (
            <div key={product.id} className={cn("animate-fade-up", `stagger-${Math.min(i + 1, 6)}`)}>
              <ProductCard product={product} onQuickAdd={setQuickAddProduct} />
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Modal */}
      {quickAddProduct && (
        <QuickAddModal product={quickAddProduct} onClose={() => setQuickAddProduct(null)} />
      )}
    </div>
  );
}
