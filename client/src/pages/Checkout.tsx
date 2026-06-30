/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * Checkout Page — Proceso de Pago
 * Creator Universe Design System
 * Formulario con validación en tiempo real, descuentos, métodos de pago
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Wallet, Tag, Check, Loader2, Lock, ChevronDown, Truck, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, DISCOUNT_CODES } from "@/lib/products";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  address: z.string().min(5, "Ingresa una dirección completa"),
  city: z.string().min(2, "Ingresa tu ciudad"),
  phone: z.string().min(10, "Ingresa un número de teléfono válido"),
  zipCode: z.string().min(5, "Ingresa tu código postal"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

type PaymentMethod = "card" | "paypal" | "mercadopago";
type ShippingMethod = "standard" | "express";

const SHIPPING_OPTIONS = [
  { id: "standard" as ShippingMethod, label: "Envío Estándar", description: "5–8 días hábiles", price: 99 },
  { id: "express" as ShippingMethod, label: "Envío Express", description: "2–3 días hábiles", price: 199 },
];

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  const shippingCost = SHIPPING_OPTIONS.find((s) => s.id === shippingMethod)?.price ?? 99;
  const discountAmount = appliedDiscount ? Math.round(subtotal * (appliedDiscount.percent / 100)) : 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) return;
    const percent = DISCOUNT_CODES[code];
    if (percent) {
      setAppliedDiscount({ code, percent });
      setDiscountError("");
    } else {
      setDiscountError("Código inválido. Intenta con YOUTUBER10");
      setAppliedDiscount(null);
    }
  };

  const onSubmit = (data: CheckoutForm) => {
    if (items.length === 0) return;
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      navigate(`/gracias?nombre=${encodeURIComponent(data.firstName)}&orden=${Math.floor(Math.random() * 90000) + 10000}`);
    }, 2500);
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Tu carrito está vacío.</p>
        <button onClick={() => navigate("/tienda")} className="mt-4 text-primary hover:underline">
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Lock size={20} className="absolute inset-0 m-auto text-primary" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-bold text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
              Procesando tu pedido
            </p>
            <p className="text-muted-foreground text-sm mt-1">No cierres esta ventana...</p>
          </div>
        </div>
      )}

      <div className="container py-10">
        <div className="mb-8">
          <h1
            className="text-foreground"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em" }}
          >
            Checkout
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
            <Lock size={12} />
            <span>Pago seguro y encriptado</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
            {/* ── Left: Form ── */}
            <div className="space-y-8">
              {/* Contact */}
              <section>
                <h2 className="text-foreground font-bold text-sm uppercase tracking-widest mb-4 pb-3 border-b border-border"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Datos de Contacto
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Correo electrónico</label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="tu@correo.com"
                      className={cn("input-dark w-full", errors.email && "error")}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Nombre</label>
                      <input {...register("firstName")} placeholder="Juan" className={cn("input-dark w-full", errors.firstName && "error")} />
                      {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Apellido</label>
                      <input {...register("lastName")} placeholder="García" className={cn("input-dark w-full", errors.lastName && "error")} />
                      {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Teléfono</label>
                    <input {...register("phone")} type="tel" placeholder="+52 55 1234 5678" className={cn("input-dark w-full", errors.phone && "error")} />
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </section>

              {/* Shipping address */}
              <section>
                <h2 className="text-foreground font-bold text-sm uppercase tracking-widest mb-4 pb-3 border-b border-border"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Dirección de Envío
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Dirección completa</label>
                    <input {...register("address")} placeholder="Calle, número, colonia" className={cn("input-dark w-full", errors.address && "error")} />
                    {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Ciudad</label>
                      <input {...register("city")} placeholder="Ciudad de México" className={cn("input-dark w-full", errors.city && "error")} />
                      {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Código Postal</label>
                      <input {...register("zipCode")} placeholder="06600" className={cn("input-dark w-full", errors.zipCode && "error")} />
                      {errors.zipCode && <p className="text-destructive text-xs mt-1">{errors.zipCode.message}</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Shipping method */}
              <section>
                <h2 className="text-foreground font-bold text-sm uppercase tracking-widest mb-4 pb-3 border-b border-border"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Método de Envío
                </h2>
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-150",
                        shippingMethod === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-150",
                          shippingMethod === option.id ? "border-primary" : "border-border"
                        )}>
                          {shippingMethod === option.id && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {option.id === "express" ? <Zap size={14} className="text-primary" /> : <Truck size={14} className="text-muted-foreground" />}
                            <span className="text-foreground text-sm font-medium">{option.label}</span>
                          </div>
                          <p className="text-muted-foreground text-xs mt-0.5">{option.description}</p>
                        </div>
                      </div>
                      <span className="text-foreground font-bold text-sm mono">{formatPrice(option.price)}</span>
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={shippingMethod === option.id}
                        onChange={() => setShippingMethod(option.id)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment method */}
              <section>
                <h2 className="text-foreground font-bold text-sm uppercase tracking-widest mb-4 pb-3 border-b border-border"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Método de Pago
                </h2>
                <div className="flex gap-3 mb-5">
                  {[
                    { id: "card" as PaymentMethod, label: "Tarjeta", icon: CreditCard },
                    { id: "paypal" as PaymentMethod, label: "PayPal", icon: Wallet },
                    { id: "mercadopago" as PaymentMethod, label: "MercadoPago", icon: Wallet },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-medium transition-all duration-150",
                        paymentMethod === id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 animate-fade-up">
                    <div>
                      <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Número de tarjeta</label>
                      <input placeholder="1234 5678 9012 3456" className="input-dark w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Vencimiento</label>
                        <input placeholder="MM/AA" className="input-dark w-full" />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">CVV</label>
                        <input placeholder="123" className="input-dark w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Nombre en la tarjeta</label>
                      <input placeholder="Juan García" className="input-dark w-full" />
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="p-6 rounded-lg bg-surface-elevated border border-border text-center animate-fade-up">
                    <p className="text-muted-foreground text-sm">Serás redirigido a PayPal para completar tu pago de forma segura.</p>
                  </div>
                )}

                {paymentMethod === "mercadopago" && (
                  <div className="p-6 rounded-lg bg-surface-elevated border border-border text-center animate-fade-up">
                    <p className="text-muted-foreground text-sm">Serás redirigido a MercadoPago para completar tu pago.</p>
                  </div>
                )}
              </section>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="space-y-4">
              <div className="bg-surface rounded-xl border border-border p-5 sticky top-24">
                <h2 className="text-foreground font-bold text-sm uppercase tracking-widest mb-4 pb-3 border-b border-border"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Resumen del Pedido
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-background">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-xs font-medium leading-tight truncate">{item.name}</p>
                        <p className="text-muted-foreground text-xs">{item.color} · {item.size}</p>
                      </div>
                      <p className="text-foreground text-xs font-bold mono flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Discount code */}
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={discountCode}
                        onChange={(e) => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(""); }}
                        placeholder="Código de descuento"
                        className={cn("input-dark w-full pl-9 text-sm", discountError && "error")}
                        disabled={!!appliedDiscount}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={!!appliedDiscount}
                      className="px-4 py-3 bg-surface-elevated border border-border text-foreground text-xs font-bold uppercase tracking-wider rounded-md hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      Aplicar
                    </button>
                  </div>
                  {discountError && <p className="text-destructive text-xs mt-1.5">{discountError}</p>}
                  {appliedDiscount && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-green-400 text-xs font-medium animate-fade-up">
                      <Check size={12} />
                      <span>Código "{appliedDiscount.code}" aplicado — {appliedDiscount.percent}% de descuento</span>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span className="mono">{formatPrice(shippingCost)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-400">
                      <span>Descuento ({appliedDiscount.percent}%)</span>
                      <span className="mono">−{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-foreground font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="mono text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  form="checkout-form"
                  onClick={handleSubmit(onSubmit)}
                  className="w-full mt-5 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-md flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all duration-150"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Lock size={16} />
                  Finalizar Pedido
                </button>

                <p className="text-muted-foreground text-xs text-center mt-3">
                  Al finalizar, aceptas nuestros términos y condiciones.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
