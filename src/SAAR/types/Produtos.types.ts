/**
 * Tipos e interfaces para o módulo de Produtos
 */

import type { FiltroContexto } from "./shared.types";

export interface ProdutosProps {
  filtros?: FiltroContexto;
}

export interface DadosProdutos {
  total: number;
  faixa0_25: number;
  faixa26_50: number;
  faixa51_75: number;
  faixa76_100: number;
  percentualMedio: number;
}

export interface DadosProdutosRegional extends DadosProdutos {
  regional: string;
}

export interface DadosProdutosMunicipio extends DadosProdutos {
  municipio: string;
  regional: string;
}

export interface DadosProdutosEscola extends DadosProdutos {
  escola: string;
  municipio: string;
  regional: string;
}

export type NivelAgregacao = "estado" | "regional" | "municipio" | "escola";

