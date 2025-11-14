/**
 * Tipos e interfaces para o módulo de Tarefas
 */

import type { FiltroContexto } from "./shared.types";

export interface TarefasProps {
  filtros?: FiltroContexto;
}

export interface DadosTarefas {
  total: number;
  previstas: number;
  naoIniciadas: number;
  emAndamento: number;
  atrasadas: number;
  concluidas: number;
  concluidasAtraso: number;
}

export interface DadosTarefasRegional extends DadosTarefas {
  regional: string;
}

export interface DadosTarefasMunicipio extends DadosTarefas {
  municipio: string;
  regional: string;
}

export interface DadosTarefasEscola extends DadosTarefas {
  escola: string;
  municipio: string;
  regional: string;
}

export type NivelAgregacao = "estado" | "regional" | "municipio" | "escola";

