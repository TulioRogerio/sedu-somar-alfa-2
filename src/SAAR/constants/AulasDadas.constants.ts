/**
 * Constantes para o módulo de Aulas Dadas
 */

import type { Disciplina } from "../types/AulasDadas.types";

export const DISCIPLINAS: Disciplina[] = [
  { label: "Língua Portuguesa", value: "LP" },
  { label: "Matemática", value: "Mat" },
];

export const CORES_DISCIPLINAS: Record<string, string> = {
  LP: "#2196f3", // Azul
  Mat: "#4caf50", // Verde
};

export const ORDEM_TURMAS = [
  "3ª Série",
  "2ª Série",
  "1ª Série",
  "9º Ano",
  "8º Ano",
  "7º Ano",
  "6º Ano",
  "2ª Série - I",
  "1ª Série - I",
  "9º Ano - I",
  "8º Ano - I",
  "7º Ano - I",
];

