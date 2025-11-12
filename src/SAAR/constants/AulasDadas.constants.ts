/**
 * Constantes para o módulo de Aulas Dadas
 */

import type { Disciplina } from "../types/AulasDadas.types";

export const DISCIPLINAS: Disciplina[] = [
  { label: "Língua Portuguesa", value: "LP" },
  { label: "Matemática", value: "Mat" },
  { label: "Ciências", value: "Ciencias" },
  { label: "História", value: "Historia" },
  { label: "Geografia", value: "Geografia" },
];

export const CORES_DISCIPLINAS: Record<string, string> = {
  LP: "#2196f3", // Azul
  Mat: "#4caf50", // Verde
  Ciencias: "#ff9800", // Laranja
  Historia: "#9c27b0", // Roxo
  Geografia: "#f44336", // Vermelho
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

