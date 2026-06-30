/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * Products data store — Creator Universe MerchStore
 * Catálogo completo de productos con variantes, imágenes y metadata
 */

export interface ProductVariant {
  color: string;
  colorHex: string;
  images: string[]; // [front, back/detail]
  stock: { [size: string]: number };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "ropa" | "accesorios" | "edicion-limitada";
  isNew: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  description: string;
  sizes: string[];
  variants: ProductVariant[];
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "hoodie-flame-black",
    name: "Hoodie Flame Classic",
    price: 890,
    category: "ropa",
    isNew: true,
    isBestSeller: true,
    isLimitedEdition: false,
    description:
      "El hoodie definitivo de la crew. Corte oversized, tela premium 400g/m², logo bordado en pecho y gráfico full-back. Hecho para durar y para que te vean.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    variants: [
      {
        color: "Negro",
        colorHex: "#111111",
        images: [
          "/manus-storage/product-hoodie-black_2d9aa3ce.jpg",
          "/manus-storage/product-hoodie-back_93851612.jpg",
        ],
        stock: { XS: 5, S: 8, M: 0, L: 12, XL: 6, XXL: 3 },
      },
    ],
    tags: ["hoodie", "bestseller", "nuevo"],
  },
  {
    id: "tshirt-orange-flame",
    name: "T-Shirt Orange Fire",
    price: 450,
    category: "ropa",
    isNew: true,
    isBestSeller: false,
    isLimitedEdition: false,
    description:
      "Camiseta de algodón 100% peinado, corte regular fit. Gráfico de llama en el pecho, colores que no se desvanecen. La pieza más versátil de la colección.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    variants: [
      {
        color: "Naranja",
        colorHex: "#E85D1A",
        images: [
          "/manus-storage/product-tshirt-orange_6be6592b.jpg",
          "/manus-storage/product-tshirt-orange_6be6592b.jpg",
        ],
        stock: { XS: 10, S: 15, M: 20, L: 18, XL: 8, XXL: 4 },
      },
    ],
    tags: ["tshirt", "nuevo"],
  },
  {
    id: "cap-snapback-black",
    name: "Cap Snapback Crew",
    price: 320,
    category: "accesorios",
    isNew: false,
    isBestSeller: true,
    isLimitedEdition: false,
    description:
      "Gorra snapback de panel estructurado. Logo bordado en relieve al frente, ajuste trasero con cierre de plástico. Talla única.",
    sizes: ["Única"],
    variants: [
      {
        color: "Negro",
        colorHex: "#111111",
        images: [
          "/manus-storage/product-cap-black_6e729c21.jpg",
          "/manus-storage/product-cap-black_6e729c21.jpg",
        ],
        stock: { Única: 25 },
      },
    ],
    tags: ["gorra", "accesorios", "bestseller"],
  },
  {
    id: "crewneck-charcoal",
    name: "Crewneck Essential",
    price: 680,
    category: "ropa",
    isNew: false,
    isBestSeller: false,
    isLimitedEdition: false,
    description:
      "Sudadera crewneck de felpa francesa 320g/m². Diseño minimalista con logo pequeño en pecho izquierdo. El básico que no puede faltar en tu guardarropa.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    variants: [
      {
        color: "Carbón",
        colorHex: "#3A3A3A",
        images: [
          "/manus-storage/product-crewneck_62f193bd.jpg",
          "/manus-storage/product-crewneck_62f193bd.jpg",
        ],
        stock: { XS: 3, S: 7, M: 10, L: 9, XL: 5, XXL: 2 },
      },
    ],
    tags: ["crewneck", "ropa"],
  },
  {
    id: "totebag-canvas",
    name: "Tote Bag Canvas",
    price: 250,
    category: "accesorios",
    isNew: false,
    isBestSeller: false,
    isLimitedEdition: false,
    description:
      "Bolsa tote de lona gruesa 12oz. Serigrafía de llama en negro y naranja. Asas largas para llevar al hombro. Capacidad 15L.",
    sizes: ["Única"],
    variants: [
      {
        color: "Negro",
        colorHex: "#111111",
        images: [
          "/manus-storage/product-totebag_0cbc5257.jpg",
          "/manus-storage/product-totebag_0cbc5257.jpg",
        ],
        stock: { Única: 30 },
      },
    ],
    tags: ["totebag", "accesorios"],
  },
  {
    id: "hoodie-limited-collab",
    name: "Hoodie Limited Drop #001",
    price: 1290,
    category: "edicion-limitada",
    isNew: true,
    isBestSeller: false,
    isLimitedEdition: true,
    description:
      "Edición limitada de 100 unidades numeradas. Diseño exclusivo en colaboración con artista invitado. Certificado de autenticidad incluido. Una vez agotado, no vuelve.",
    sizes: ["S", "M", "L", "XL"],
    variants: [
      {
        color: "Negro",
        colorHex: "#111111",
        images: [
          "/manus-storage/collection-banner-limited_ce7adbaa.jpg",
          "/manus-storage/product-hoodie-back_93851612.jpg",
        ],
        stock: { S: 2, M: 0, L: 1, XL: 3 },
      },
    ],
    tags: ["edicion-limitada", "hoodie", "nuevo", "collab"],
  },
];

export const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "ropa", label: "Ropa" },
  { id: "accesorios", label: "Accesorios" },
  { id: "edicion-limitada", label: "Edición Limitada" },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Única"];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
}

export const DISCOUNT_CODES: { [code: string]: number } = {
  YOUTUBER10: 10,
  CREW15: 15,
  LAUNCH20: 20,
  CREW2024: 5,
};
