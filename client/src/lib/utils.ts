/**
 * Copyright (c) 2026 Carlos Eduardo Talero Angel — Bogotá, Colombia.
 * Todos los derechos reservados.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
