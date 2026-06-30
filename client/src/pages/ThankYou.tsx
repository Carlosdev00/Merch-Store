/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * ThankYou Page — Confirmación de Compra
 * Creator Universe Design System
 * Mensaje de éxito, video de agradecimiento, resumen de orden
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Package, Truck, Mail, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThankYou() {
  const [location, navigate] = useLocation();
  const [emailSent, setEmailSent] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const nombre = params.get("nombre") ?? "Crew";
  const orden = params.get("orden") ?? "00000";

  // Simulate email sent
  useEffect(() => {
    const t = setTimeout(() => setEmailSent(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const steps = [
    { icon: CheckCircle2, label: "Pedido confirmado", done: true },
    { icon: Package, label: "Preparando tu merch", done: false },
    { icon: Truck, label: "En camino", done: false },
  ];

  return (
    <div className="container py-16 max-w-3xl mx-auto">
      {/* Success header */}
      <div className="text-center space-y-4 animate-fade-up">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green-400 animate-check-pop" />
          </div>
        </div>
        <div>
          <h1
            className="text-foreground leading-tight"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "0.04em",
            }}
          >
            ¡Gracias por tu apoyo,
            <br />
            <span className="text-primary">{nombre}!</span>
          </h1>
          <p className="text-muted-foreground text-base mt-3">
            Tu pedido <span className="text-foreground font-bold mono">#{orden}</span> está confirmado y en camino.
          </p>
        </div>
      </div>

      {/* Email notification */}
      <div className={cn(
        "mt-8 flex items-center gap-3 p-4 rounded-xl border transition-all duration-500 animate-fade-up stagger-2",
        emailSent
          ? "border-green-500/30 bg-green-500/5 text-green-400"
          : "border-border bg-surface text-muted-foreground"
      )}>
        <Mail size={18} className="flex-shrink-0" />
        <p className="text-sm">
          {emailSent
            ? "Hemos enviado la confirmación a tu correo electrónico con todos los detalles."
            : "Enviando confirmación a tu correo..."}
        </p>
      </div>

      {/* Order progress */}
      <div className="mt-8 p-6 bg-surface rounded-xl border border-border animate-fade-up stagger-3">
        <h2
          className="text-foreground text-xl mb-5"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          Estado del Pedido
        </h2>
        <div className="flex items-center gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
                    step.done
                      ? "border-green-500 bg-green-500/10"
                      : "border-border bg-surface-elevated"
                  )}>
                    <Icon size={18} className={step.done ? "text-green-400" : "text-muted-foreground"} />
                  </div>
                  <span className={cn(
                    "text-xs font-medium text-center max-w-[80px]",
                    step.done ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2 mb-6 transition-colors duration-300",
                    step.done ? "bg-green-500/50" : "bg-border"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order summary */}
      <div className="mt-6 p-6 bg-surface rounded-xl border border-border animate-fade-up stagger-4">
        <h2
          className="text-foreground text-xl mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          Resumen de tu Orden
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Número de orden</span>
            <span className="text-foreground font-bold mono">#{orden}</span>
          </div>
          <div className="flex justify-between">
            <span>Método de envío</span>
            <span className="text-foreground">Envío Estándar (5–8 días)</span>
          </div>
          <div className="flex justify-between">
            <span>Estado</span>
            <span className="text-green-400 font-medium">Confirmado ✓</span>
          </div>
        </div>
      </div>

      {/* Thank you video */}
      <div className="mt-6 p-6 bg-surface rounded-xl border border-border animate-fade-up stagger-5">
        <h2
          className="text-foreground text-xl mb-3"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          Un mensaje para ti 🔥
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Gracias por ser parte de la crew. Aquí hay un mensaje especial para ti.
        </p>
        {!showVideo ? (
          <div
            className="relative aspect-video rounded-xl overflow-hidden bg-background cursor-pointer group"
            onClick={() => setShowVideo(true)}
          >
            <img
              src="/manus-storage/hero-banner_c51068f7.jpg"
              alt="Video de agradecimiento"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-200">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
              Mensaje exclusivo para la crew — 0:45
            </div>
          </div>
        ) : (
          <div className="aspect-video rounded-xl overflow-hidden bg-background animate-fade-up">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Mensaje de agradecimiento"
            />
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center animate-fade-up stagger-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-md hover:brightness-110 active:scale-[0.97] transition-all duration-150"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Volver a la Tienda
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
