/**
 * Tipos e interfaces para o módulo de Visitas Técnicas no SAAR
 */

export interface VisitasTecnicasProps {
  filtros?: {
    estado?: { label: string; value: string };
    regional?: { label: string; value: string };
    municipio?: { label: string; value: string };
    escola?: { label: string; value: string };
    saar?: { label: string; value: string };
  };
}

export interface DadosVisitasTecnicasPorEtapa {
  etapa: string;
  esperadas: number;
  atasAssinadas: number;
}

export interface DadosVisitasTecnicasPorCiclo {
  ciclo: number;
  esperadas: number;
  atasAssinadas: number;
  percentualAtasAssinadas: number;
  porEtapa: DadosVisitasTecnicasPorEtapa[];
}

export interface DadosVisitasTecnicas {
  totalEsperadas: number;
  totalAtasAssinadas: number;
  percentualPendentes: number;
  percentualAtasAssinadas: number;
  porCiclo: DadosVisitasTecnicasPorCiclo[];
}

export interface DadosVisitasTecnicasRegional extends DadosVisitasTecnicas {
  regional: string;
}

export interface DadosVisitasTecnicasMunicipio extends DadosVisitasTecnicas {
  municipio: string;
  regional: string;
}

export interface DadosVisitasTecnicasEscola extends DadosVisitasTecnicas {
  escola: string;
  municipio: string;
  regional: string;
}

export type NivelAgregacao = "estado" | "regional" | "municipio" | "escola";

