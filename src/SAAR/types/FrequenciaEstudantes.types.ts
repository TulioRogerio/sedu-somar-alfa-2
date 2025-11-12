/**
 * Tipos e interfaces para o módulo de Frequência dos Estudantes
 */

export interface FrequenciaEstudantesProps {
  filtros?: {
    estado?: { label: string; value: string };
    regional?: { label: string; value: string };
    municipio?: { label: string; value: string };
    escola?: { label: string; value: string };
    saar?: { label: string; value: string };
  };
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

