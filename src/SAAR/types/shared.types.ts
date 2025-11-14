/**
 * Tipos compartilhados entre os componentes do SAAR
 */

/**
 * Filtros comuns usados em todas as abas
 */
export interface FiltroContexto {
  estado?: { label: string; value: string };
  regional?: { label: string; value: string } | { label: string; value: string }[];
  municipio?: { label: string; value: string } | { label: string; value: string }[];
  escola?: { label: string; value: string } | { label: string; value: string }[];
  saar?: { label: string; value: string };
}

/**
 * Props base para componentes de aba do SAAR
 */
export interface SAARBaseProps {
  filtros?: FiltroContexto;
}

/**
 * Estado de dados com loading
 */
export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error?: string | null;
}

/**
 * Opções de gráfico ApexCharts
 */
export type ApexChartOptions = import("apexcharts").ApexOptions;

/**
 * Séries de gráfico ApexCharts
 */
export type ApexChartSeries =
  | import("apexcharts").ApexAxisChartSeries
  | import("apexcharts").ApexNonAxisChartSeries;

