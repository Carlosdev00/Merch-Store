/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * ProductDetail Page — Detalle de Producto
 * Creator Universe Design System
 * Galería, selector de variantes, guía de tallas, cantidad, Añadir al Carrito y Comprar Ahora
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Ruler, Minus, Plus, ShoppingCart, Zap, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getProductById, formatPrice } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ProductDetailProps {
  productId: string;
}

// ─── Size Guide Modal ─────────────────────────────────────────────────────────
function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-surface border-border max-w-lg">
        <DialogTitle
          className="text-foreground text-2xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          Guía de Tallas
        </DialogTitle>
        <p className="text-muted-foreground text-sm">Medidas en centímetros. Mide tu cuerpo y compara con la tabla.</p>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Talla</th>
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Pecho (cm)</th>
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Largo (cm)</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Hombros (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: "XS", pecho: "86–91", largo: "66", hombros: "41" },
                { size: "S", pecho: "91–96", largo: "69", hombros: "43" },
                { size: "M", pecho: "96–101", largo: "72", hombros: "46" },
                { size: "L", pecho: "101–106", largo: "74", hombros: "48" },
                { size: "XL", pecho: "106–111", largo: "76", hombros: "51" },
                { size: "XXL", pecho: "111–116", largo: "78", hombros: "53" },
              ].map((row) => (
                <tr key={row.size} className="border-b border-border/50 hover:bg-surface-elevated transition-colors duration-100">
                  <td className="py-2.5 pr-4 text-foreground font-bold">{row.size}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{row.pecho}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{row.largo}</td>
                  <td className="py-2.5 text-muted-foreground">{row.hombros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Para un fit oversized, sube una talla. Para fit regular, usa tu talla habitual.
        </p>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────
export default function ProductDetail({ productId }: ProductDetailProps) {
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const product = getProductById(productId);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addState, setAddState] = useState<"idle" | "loading" | "done">("idle");
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Producto no encontrado.</p>
        <button onClick={() => navigate("/tienda")} className="mt-4 text-primary hover:underline">
          Volver a la tienda
        </button>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariantIdx];
  const images = currentVariant.images;
  const stockForSize = selectedSize ? (currentVariant.stock[selectedSize] ?? 0) : null;
  const maxStock = stockForSize ?? 10;
  const isSizeOutOfStock = (size: string) => (currentVariant.stock[size] ?? 0) === 0;

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      setSizeError(true);
      return;
    }
    const size = product.sizes.length === 1 ? product.sizes[0] : selectedSize;
    setAddState("loading");
    setTimeout(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        color: currentVariant.color,
        size,
        quantity,
        maxStock: currentVariant.stock[size] ?? 10,
      });
      setAddState("done");
      setTimeout(() => setAddState("idle"), 2000);
    }, 700);
  };

  const handleBuyNow = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      setSizeError(true);
      return;
    }
    const size = product.sizes.length === 1 ? product.sizes[0] : selectedSize;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      color: currentVariant.color,
      size,
      quantity,
      maxStock: currentVariant.stock[size] ?? 10,
    });
    navigate("/checkout");
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/tienda")}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 mb-8"
      >
        <ArrowLeft size={14} />
        Volver a la tienda
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* ── Gallery ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface group">
            <img
              src={images[activeImageIdx]}
              alt={`${product.name} — imagen ${activeImageIdx + 1}`}
              className="w-full h-full object-cover transition-opacity duration-200"
            />
            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveImageIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && <span className="badge-new">Nuevo</span>}
              {product.isLimitedEdition && <span className="badge-new bg-purple-500">Limitado</span>}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 flex-shrink-0",
                    activeImageIdx === i ? "border-primary" : "border-border/50 hover:border-border"
                  )}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="space-y-6">
          {/* Name & Price */}
          <div>
            <h1
              className="text-foreground leading-tight"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "0.04em",
              }}
            >
              {product.name}
            </h1>
            <p className="text-primary text-3xl font-bold mono mt-2">{formatPrice(product.price)}</p>
            {product.isLimitedEdition && (
              <div className="flex items-center gap-1.5 mt-2 text-amber-400 text-sm">
                <Zap size={14} />
                <span className="font-medium">Edición limitada — pocas unidades disponibles</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

          {/* Color selector */}
          {product.variants.length > 1 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3">
                Color: <span className="text-foreground font-medium">{currentVariant.color}</span>
              </p>
              <div className="flex gap-2.5">
                {product.variants.map((v, i) => (
                  <button
                    key={v.color}
                    onClick={() => { setSelectedVariantIdx(i); setActiveImageIdx(0); }}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all duration-150",
                      selectedVariantIdx === i ? "border-primary scale-110 shadow-lg shadow-primary/30" : "border-border/50 hover:border-border"
                    )}
                    style={{ backgroundColor: v.colorHex }}
                    aria-label={v.color}
                    title={v.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className={cn("text-xs uppercase tracking-wider", sizeError ? "text-destructive" : "text-muted-foreground")}>
                  {sizeError ? "Selecciona una talla" : "Talla"}
                  {selectedSize && <span className="text-foreground font-medium ml-1">— {selectedSize}</span>}
                </p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4"
                >
                  <Ruler size={12} />
                  Guía de tallas
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const outOfStock = isSizeOutOfStock(size);
                  return (
                    <button
                      key={size}
                      onClick={() => { if (!outOfStock) { setSelectedSize(size); setSizeError(false); } }}
                      disabled={outOfStock}
                      className={cn(
                        "w-12 h-12 text-sm font-medium border rounded-md transition-all duration-150",
                        outOfStock
                          ? "border-border/30 text-muted-foreground/40 line-through cursor-not-allowed"
                          : selectedSize === size
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : cn(
                              "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                              sizeError && "border-destructive/50"
                            )
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {stockForSize !== null && stockForSize > 0 && stockForSize <= 3 && (
                <p className="text-destructive text-xs mt-2">
                  ⚠ Solo quedan {stockForSize} unidades en talla {selectedSize}
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3">Cantidad</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                aria-label="Disminuir cantidad"
              >
                <Minus size={14} />
              </button>
              <span className="text-foreground font-bold text-lg w-8 text-center mono">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                disabled={quantity >= maxStock}
                className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                aria-label="Aumentar cantidad"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={addState !== "idle"}
              className={cn(
                "w-full py-4 rounded-md font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-150",
                addState === "done"
                  ? "bg-green-500 text-white"
                  : "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]",
                addState !== "idle" && "cursor-not-allowed"
              )}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {addState === "loading" && <Loader2 size={18} className="animate-spin" />}
              {addState === "done" && <Check size={18} className="animate-check-pop" />}
              {addState === "idle" && <ShoppingCart size={18} />}
              {addState === "loading" ? "Añadiendo..." : addState === "done" ? "¡Añadido al carrito!" : "Añadir al Carrito"}
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 rounded-md font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 border border-border text-foreground hover:bg-surface-elevated hover:border-primary/50 active:scale-[0.98] transition-all duration-150"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Zap size={18} className="text-primary" />
              Comprar Ahora
            </button>
          </div>

          {/* Trust signals */}
          <div className="pt-2 border-t border-border space-y-2">
            {[
              "Envío gratis en pedidos mayores a $800 MXN",
              "Devoluciones gratuitas en 30 días",
              "Pago 100% seguro y encriptado",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2 text-muted-foreground text-xs">
                <Check size={12} className="text-green-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
}
