/**
 * Constantes compartilhadas entre os módulos do SAAR
 */

export const ESTADO_PADRAO = {
  label: "Espírito Santo",
  value: "espirito-santo",
} as const;

export const SAAR_PADRAO = {
  label: "SAAR I",
  value: "saar-i",
} as const;

export const OPCOES_SAAR = [
  { label: "SAAR I", value: "saar-i" },
  { label: "SAAR II", value: "saar-ii" },
  { label: "Balanço Final", value: "balanco-final" },
] as const;

export const ANO_PADRAO = 2025;

