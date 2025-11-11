/**
 * Tipos para dados de visitas técnicas
 */

export interface VisitaTecnicaRow {
  escola_id: string;
  ciclo: string; // "1", "2" ou "3"
  etapa: string;
  numero_visita: string; // "1", "2", "3" ou vazio
  tematica: string;
  realizada: string; // "true" ou "false"
  ata_assinada: string; // "true" ou "false"
  data_visita: string; // YYYY-MM-DD ou vazio
  data_ata: string; // YYYY-MM-DD ou vazio
}

export interface DadosVisitasTecnicasPorCiclo {
  ciclo: number;
  esperadas: number;
  realizadas: number;
  atasAssinadas: number;
  percentualRealizadas: number;
  percentualAtasAssinadas: number;
  porEtapa: {
    etapa: string;
    esperadas: number;
    realizadas: number;
    atasAssinadas: number;
  }[];
  porTematica: {
    tematica: string;
    esperadas: number;
    realizadas: number;
    atasAssinadas: number;
  }[];
}

export interface DadosVisitasTecnicasAgregados {
  totalEsperadas: number;
  totalRealizadas: number;
  totalAtasAssinadas: number;
  percentualPendentes: number;
  porCiclo: DadosVisitasTecnicasPorCiclo[];
}

export interface DadosVisitasTecnicasRegional extends DadosVisitasTecnicasAgregados {
  regional: string;
}

export interface DadosVisitasTecnicasMunicipio extends DadosVisitasTecnicasAgregados {
  municipio: string;
  regional: string;
}

export interface DadosVisitasTecnicasEscola extends DadosVisitasTecnicasAgregados {
  escola: string;
  municipio: string;
  regional: string;
}

