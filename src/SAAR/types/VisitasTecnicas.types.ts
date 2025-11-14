/**
 * Tipos e interfaces para o módulo de Visitas Técnicas no SAAR
 */

import type { FiltroContexto } from "./shared.types";

export interface VisitasTecnicasProps {
  filtros?: FiltroContexto;
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

