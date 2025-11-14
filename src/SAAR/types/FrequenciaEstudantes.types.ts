/**
 * Tipos e interfaces para o módulo de Frequência dos Estudantes
 */

import type { FiltroContexto } from "./shared.types";

export interface FrequenciaEstudantesProps {
  filtros?: FiltroContexto;
}

export interface FrequenciaEstudantesRow {
  regional: string;
  municipio: string;
  escola: string;
  serie: string;
  turma: string;
  aluno: string;
  dias_do_mes: number;
  presenca_falta: "P" | "F";
  data?: string; // Data completa (YYYY-MM-DD)
  dia_letivo?: number; // Índice sequencial do dia letivo
}

export interface DadosFrequenciaPorData {
  data: string;
  totalAlunos: number;
  totalPresencas: number;
  totalFaltas: number;
  percentualPresenca: number;
}

