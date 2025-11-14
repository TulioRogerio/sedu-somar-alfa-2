/**
 * Tipos e interfaces para o módulo de Tarefas
 */

export interface TarefasProps {
  filtros?: {
    estado?: { label: string; value: string };
    regional?: { label: string; value: string };
    municipio?: { label: string; value: string };
    escola?: { label: string; value: string };
    saar?: { label: string; value: string };
  };
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

