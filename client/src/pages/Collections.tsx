/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * Collections Page — Colecciones
 * Creator Universe Design System
 */

import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    id: "ropa",
    label: "Ropa",
    description: "Hoodies, tees, crewnecks y más. Diseñados para la crew que vive el canal.",
    image: "/manus-storage/product-hoodie-black_2d9aa3ce.jpg",
    count: 4,
    href: "/tienda?categoria=ropa",
  },
  {
    id: "accesorios",
    label: "Accesorios",
    description: "Gorras, bolsas y complementos para completar tu look.",
    image: "/manus-storage/product-cap-black_6e729c21.jpg",
    count: 2,
    href: "/tienda?categoria=accesorios",
  },
  {
    id: "edicion-limitada",
    label: "Edición Limitada",
    description: "Drops exclusivos numerados. Una vez agotados, no vuelven.",
    image: "/manus-storage/collection-banner-limited_ce7adbaa.jpg",
    count: 1,
    href: "/tienda?categoria=edicion-limitada",
  },
];

export default function Collections() {
  const [, navigate] = useLocation();

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1
          className="text-foreground"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.04em",
          }}
        >
          Colecciones
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Explora todas las categorías de la tienda oficial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLLECTIONS.map((col, i) => (
          <div
            key={col.id}
            onClick={() => navigate(col.href)}
            className="group cursor-pointer rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-200 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-background">
              <img
                src={col.image}
                alt={col.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
            <div className="p-5 bg-surface">
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    className="text-foreground text-2xl"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
                  >
                    {col.label}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{col.description}</p>
                  <p className="text-muted-foreground text-xs mt-2">{col.count} producto{col.count !== 1 ? "s" : ""}</p>
                </div>
                <ArrowRight size={18} className="text-primary mt-1 group-hover:translate-x-1 transition-transform duration-150 flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
