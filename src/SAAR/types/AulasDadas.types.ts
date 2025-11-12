/**
 * Tipos e interfaces para o módulo de Aulas Dadas
 */

export interface AulasDadasProps {
  filtros?: {
    estado?: { label: string; value: string };
    regional?: { label: string; value: string };
    municipio?: { label: string; value: string };
    escola?: { label: string; value: string };
    saar?: { label: string; value: string };
  };
}

export interface AulasDadasRow {
  escola_id: number;
  escola_nome: string;
  regional: string;
  municipio: string;
  turma: string;
  data: string;
  dia_letivo: number;
  aulas_previstas_LP: number;
  aulas_previstas_Mat: number;
  aulas_previstas_Ciencias: number;
  aulas_previstas_Historia: number;
  aulas_previstas_Geografia: number;
  aulas_dadas_LP: number;
  aulas_dadas_Mat: number;
  aulas_dadas_Ciencias: number;
  aulas_dadas_Historia: number;
  aulas_dadas_Geografia: number;
}

export interface DadosPorTurma {
  previstas_LP: number;
  previstas_Mat: number;
  previstas_Ciencias: number;
  previstas_Historia: number;
  previstas_Geografia: number;
  dadas_LP: number;
  dadas_Mat: number;
  dadas_Ciencias: number;
  dadas_Historia: number;
  dadas_Geografia: number;
  percentual_LP: number;
  percentual_Mat: number;
  percentual_Ciencias: number;
  percentual_Historia: number;
  percentual_Geografia: number;
  percentual_Total: number;
}

export interface Disciplina {
  label: string;
  value: string;
}

