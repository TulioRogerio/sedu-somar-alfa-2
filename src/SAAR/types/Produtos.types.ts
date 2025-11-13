/**
 * Tipos e interfaces para o módulo de Produtos
 */

export interface ProdutosProps {
  filtros?: {
    estado?: { label: string; value: string };
    regional?: { label: string; value: string };
    municipio?: { label: string; value: string };
    escola?: { label: string; value: string };
    saar?: { label: string; value: string };
  };
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

