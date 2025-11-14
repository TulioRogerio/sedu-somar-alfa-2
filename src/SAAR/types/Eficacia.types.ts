import type { FiltroContexto } from "./shared.types";

export interface IndicadorRow {
  escola_id: string;
  escola_nome: string;
  regional: string;
  municipio: string;
  indicador_aulas_dadas: string;
  indicador_frequencia: string;
  indicador_tarefas: string;
  indicador_produtos: string;
  indicador_visitas_tecnicas: string;
  // Propriedades calculadas (usadas internamente)
  aulas_dadas?: number;
  frequencia?: number;
  tarefas?: number;
  produtos?: number;
  visitas_tecnicas?: number;
}

export interface EficaciaProps {
  filtros?: FiltroContexto;
}

