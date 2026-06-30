/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * Support Page — Soporte
 * Creator Universe Design System
 */

import { useState } from "react";
import { ChevronDown, Mail, MessageCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "¿Cuánto tiempo tarda mi pedido en llegar?",
    a: "El envío estándar tarda entre 5 y 8 días hábiles. El envío express llega en 2 a 3 días hábiles. Recibirás un correo con el número de rastreo una vez que tu pedido sea enviado.",
  },
  {
    q: "¿Puedo cambiar o devolver mi pedido?",
    a: "Sí, aceptamos devoluciones y cambios dentro de los 30 días posteriores a la entrega. El producto debe estar en condiciones originales, sin uso y con etiquetas. Visita nuestra política de devoluciones para más detalles.",
  },
  {
    q: "¿Cómo sé qué talla elegir?",
    a: "En cada página de producto encontrarás un enlace a nuestra guía de tallas con medidas exactas en centímetros. Para un fit oversized, recomendamos subir una talla.",
  },
  {
    q: "¿Los colores del producto son exactos a las fotos?",
    a: "Hacemos todo lo posible para que las fotos representen fielmente los colores reales. Sin embargo, puede haber ligeras variaciones dependiendo de la pantalla de tu dispositivo.",
  },
  {
    q: "¿Cuáles son los métodos de pago aceptados?",
    a: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, Amex), PayPal y MercadoPago.",
  },
  {
    q: "¿Hacen envíos internacionales?",
    a: "Por el momento solo enviamos dentro de México. Estamos trabajando para expandir nuestros envíos internacionales próximamente.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-foreground text-sm font-medium">{q}</span>
        <ChevronDown
          size={16}
          className={cn("text-muted-foreground flex-shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <p className="text-muted-foreground text-sm pb-4 leading-relaxed animate-fade-up">
          {a}
        </p>
      )}
    </div>
  );
}

export default function Support() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <div className="mb-10">
        <h1
          className="text-foreground"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.04em",
          }}
        >
          Soporte
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Estamos aquí para ayudarte. Revisa las preguntas frecuentes o contáctanos directamente.
        </p>
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2
          className="text-foreground text-2xl mb-5"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          Preguntas Frecuentes
        </h2>
        <div className="bg-surface rounded-xl border border-border px-5">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section>
        <h2
          className="text-foreground text-2xl mb-5"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          Contáctanos
        </h2>
        <div className="bg-surface rounded-xl border border-border p-6">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center animate-fade-up">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <Check size={24} className="text-green-400" />
              </div>
              <p className="text-foreground font-medium">¡Mensaje enviado!</p>
              <p className="text-muted-foreground text-sm">Te responderemos en menos de 24 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Nombre</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Tu nombre"
                    className="input-dark w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Correo</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="tu@correo.com"
                    className="input-dark w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1.5">Mensaje</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  rows={5}
                  className="input-dark w-full resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-md hover:brightness-110 active:scale-[0.97] transition-all duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <Mail size={16} />
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
          <MessageCircle size={12} />
          <span>Tiempo de respuesta promedio: menos de 24 horas en días hábiles.</span>
        </div>
      </section>
    </div>
  );
}
