/**
 * Constantes para o módulo de Produtos
 */

export interface FaixaProduto {
  label: string;
  value: string;
  cor: string;
}

export const FAIXAS_PRODUTO: FaixaProduto[] = [
  { label: "0 à 25% concluído", value: "0-25", cor: "#dc2626" },
  { label: "26 a 50% concluído", value: "26-50", cor: "#f57c00" },
  { label: "51 a 75% concluído", value: "51-75", cor: "#ff9800" },
  { label: "76 a 100% concluído", value: "76-100", cor: "#16a34a" },
];

export const CORES_FAIXAS = {
  "0-25": "#dc2626",
  "26-50": "#f57c00",
  "51-75": "#ff9800",
  "76-100": "#16a34a",
};

