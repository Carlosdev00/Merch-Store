/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

/**
 * Footer Global — Creator Universe Design System
 * Redes sociales, políticas, newsletter "Únete a la Crew"
 */

import { useState } from "react";
import { Link } from "wouter";
import { Youtube, Instagram, Twitter, Music2, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SOCIAL_LINKS = [
  { icon: Youtube, label: "YouTube", href: "https://youtube.com", color: "#FF0000" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com", color: "#E1306C" },
  { icon: Music2, label: "TikTok", href: "https://tiktok.com", color: "#69C9D0" },
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com", color: "#1DA1F2" },
];

const POLICY_LINKS = [
  { href: "/terminos", label: "Términos y Condiciones" },
  { href: "/devoluciones", label: "Políticas de Devolución" },
  { href: "/privacidad", label: "Aviso de Privacidad" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Ingresa un correo válido.");
      return;
    }
    setError("");
    setSubscribed(true);
  };

  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/manus-storage/logo-flame_06ce910f.png"
                alt="MerchStore Logo"
                className="w-8 h-8 object-contain"
              />
              <span
                className="text-foreground font-bold text-lg tracking-wider uppercase"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.12em" }}
              >
                MerchStore
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Tu merch. Su universo. Mercancía oficial del canal para la crew que lleva su creador favorito puesto.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-md bg-surface-elevated flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links column */}
          <div className="space-y-4">
            <h3
              className="text-foreground text-sm font-bold uppercase tracking-widest"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.15em" }}
            >
              Legal
            </h3>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150 hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div className="space-y-4">
            <h3
              className="text-foreground text-sm font-bold uppercase tracking-widest"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.15em" }}
            >
              Únete a la Crew
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sé el primero en enterarte de nuevos drops, descuentos exclusivos y contenido de la comunidad.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2.5 text-sm font-medium text-green-400 animate-fade-up">
                <CheckCircle2 size={18} />
                <span>¡Ya eres parte del equipo! Revisa tu correo para un regalo sorpresa.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="tu@correo.com"
                    className={cn(
                      "flex-1 input-dark text-sm",
                      error && "error"
                    )}
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-primary text-primary-foreground rounded-md hover:brightness-110 active:scale-95 transition-all duration-150 flex-shrink-0"
                    aria-label="Suscribirse"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
                {error && (
                  <p className="text-destructive text-xs">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MerchStore. Todos los derechos reservados.</p>
          <p>Hecho con 🔥 para la comunidad</p>
        </div>
      </div>
    </footer>
  );
}
