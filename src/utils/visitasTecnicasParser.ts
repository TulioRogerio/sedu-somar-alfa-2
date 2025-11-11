import { parseCSV } from "./csvParserUtils";
import { getPublicPath } from "./pathUtils";
import type { VisitaTecnicaRow, DadosVisitasTecnicasAgregados, DadosVisitasTecnicasPorCiclo } from "../types/VisitasTecnicas";
import type { Escola } from "../types/Escola";

/**
 * Carrega e parseia o arquivo visitas-tecnicas.csv
 */
export async function loadVisitasTecnicasCsv(): Promise<VisitaTecnicaRow[]> {
  try {
    const response = await fetch(getPublicPath("visitas-tecnicas.csv"));
    if (!response.ok) {
      throw new Error(`Erro ao carregar CSV: ${response.status}`);
    }
    const text = await response.text();
    const parsedData = parseCSV(text);
    
    return parsedData as unknown as VisitaTecnicaRow[];
  } catch (error) {
    console.error("Erro ao carregar visitas-tecnicas.csv:", error);
    return [];
  }
}

/**
 * Calcula dados agregados de visitas técnicas
 */
function calcularDadosVisitasTecnicasFiltrado(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[],
  filtro?: (escola: Escola) => boolean
): DadosVisitasTecnicasAgregados {
  let escolasFiltradas = escolasData;
  if (filtro) {
    escolasFiltradas = escolasData.filter(filtro);
  }

  const escolaIds = new Set(escolasFiltradas.map((e) => e.id.toString()));
  const visitasFiltradas = visitasData.filter((v) =>
    escolaIds.has(v.escola_id)
  );

  // Agrupar por ciclo
  const dadosPorCiclo = new Map<number, {
    esperadas: number;
    realizadas: number;
    atasAssinadas: number;
    porEtapa: Map<string, { esperadas: number; realizadas: number; atasAssinadas: number }>;
    porTematica: Map<string, { esperadas: number; realizadas: number; atasAssinadas: number }>;
  }>();

  visitasFiltradas.forEach((visita) => {
    const ciclo = parseInt(visita.ciclo) || 0;
    
    if (!dadosPorCiclo.has(ciclo)) {
      dadosPorCiclo.set(ciclo, {
        esperadas: 0,
        realizadas: 0,
        atasAssinadas: 0,
        porEtapa: new Map(),
        porTematica: new Map(),
      });
    }

    const dadosCiclo = dadosPorCiclo.get(ciclo)!;
    
    // Contar como esperada (sempre conta como esperada)
    dadosCiclo.esperadas++;
    
    // Contar como realizada
    if (visita.realizada === "true") {
      dadosCiclo.realizadas++;
    }
    
    // Contar atas assinadas
    if (visita.ata_assinada === "true") {
      dadosCiclo.atasAssinadas++;
    }

    // Agrupar por etapa
    const etapa = visita.etapa || "Sem etapa";
    if (!dadosCiclo.porEtapa.has(etapa)) {
      dadosCiclo.porEtapa.set(etapa, { esperadas: 0, realizadas: 0, atasAssinadas: 0 });
    }
    const dadosEtapa = dadosCiclo.porEtapa.get(etapa)!;
    dadosEtapa.esperadas++;
    if (visita.realizada === "true") dadosEtapa.realizadas++;
    if (visita.ata_assinada === "true") dadosEtapa.atasAssinadas++;

    // Agrupar por temática
    const tematica = visita.tematica || "Sem temática";
    if (!dadosCiclo.porTematica.has(tematica)) {
      dadosCiclo.porTematica.set(tematica, { esperadas: 0, realizadas: 0, atasAssinadas: 0 });
    }
    const dadosTematica = dadosCiclo.porTematica.get(tematica)!;
    dadosTematica.esperadas++;
    if (visita.realizada === "true") dadosTematica.realizadas++;
    if (visita.ata_assinada === "true") dadosTematica.atasAssinadas++;
  });

  // Converter para array de DadosVisitasTecnicasPorCiclo
  const porCiclo: DadosVisitasTecnicasPorCiclo[] = [];
  
  dadosPorCiclo.forEach((dados, ciclo) => {
    const percentualRealizadas = dados.esperadas > 0
      ? (dados.realizadas / dados.esperadas) * 100
      : 0;
    
    const percentualAtasAssinadas = dados.esperadas > 0
      ? (dados.atasAssinadas / dados.esperadas) * 100
      : 0;

    porCiclo.push({
      ciclo,
      esperadas: dados.esperadas,
      realizadas: dados.realizadas,
      atasAssinadas: dados.atasAssinadas,
      percentualRealizadas,
      percentualAtasAssinadas,
      porEtapa: Array.from(dados.porEtapa.entries()).map(([etapa, dadosEtapa]) => ({
        etapa,
        ...dadosEtapa,
      })),
      porTematica: Array.from(dados.porTematica.entries()).map(([tematica, dadosTematica]) => ({
        tematica,
        ...dadosTematica,
      })),
    });
  });

  // Ordenar por ciclo
  porCiclo.sort((a, b) => a.ciclo - b.ciclo);

  // Calcular totais
  let totalEsperadas = 0;
  let totalRealizadas = 0;
  let totalAtasAssinadas = 0;

  porCiclo.forEach((dados) => {
    totalEsperadas += dados.esperadas;
    totalRealizadas += dados.realizadas;
    totalAtasAssinadas += dados.atasAssinadas;
  });

  const percentualPendentes = totalEsperadas > 0
    ? ((totalEsperadas - totalAtasAssinadas) / totalEsperadas) * 100
    : 0;

  return {
    totalEsperadas,
    totalRealizadas,
    totalAtasAssinadas,
    percentualPendentes,
    porCiclo,
  };
}

/**
 * Calcula dados agregados de visitas técnicas para todo o estado
 */
export function calcularDadosVisitasTecnicas(
  visitasData: VisitaTecnicaRow[]
): DadosVisitasTecnicasAgregados {
  // Agrupar por ciclo
  const dadosPorCiclo = new Map<number, {
    esperadas: number;
    realizadas: number;
    atasAssinadas: number;
    porEtapa: Map<string, { esperadas: number; realizadas: number; atasAssinadas: number }>;
    porTematica: Map<string, { esperadas: number; realizadas: number; atasAssinadas: number }>;
  }>();

  visitasData.forEach((visita) => {
    const ciclo = parseInt(visita.ciclo) || 0;
    
    if (!dadosPorCiclo.has(ciclo)) {
      dadosPorCiclo.set(ciclo, {
        esperadas: 0,
        realizadas: 0,
        atasAssinadas: 0,
        porEtapa: new Map(),
        porTematica: new Map(),
      });
    }

    const dadosCiclo = dadosPorCiclo.get(ciclo)!;
    
    // Contar como esperada (sempre conta como esperada)
    dadosCiclo.esperadas++;
    
    // Contar como realizada
    if (visita.realizada === "true") {
      dadosCiclo.realizadas++;
    }
    
    // Contar atas assinadas
    if (visita.ata_assinada === "true") {
      dadosCiclo.atasAssinadas++;
    }

    // Agrupar por etapa
    const etapa = visita.etapa || "Sem etapa";
    if (!dadosCiclo.porEtapa.has(etapa)) {
      dadosCiclo.porEtapa.set(etapa, { esperadas: 0, realizadas: 0, atasAssinadas: 0 });
    }
    const dadosEtapa = dadosCiclo.porEtapa.get(etapa)!;
    dadosEtapa.esperadas++;
    if (visita.realizada === "true") dadosEtapa.realizadas++;
    if (visita.ata_assinada === "true") dadosEtapa.atasAssinadas++;

    // Agrupar por temática
    const tematica = visita.tematica || "Sem temática";
    if (!dadosCiclo.porTematica.has(tematica)) {
      dadosCiclo.porTematica.set(tematica, { esperadas: 0, realizadas: 0, atasAssinadas: 0 });
    }
    const dadosTematica = dadosCiclo.porTematica.get(tematica)!;
    dadosTematica.esperadas++;
    if (visita.realizada === "true") dadosTematica.realizadas++;
    if (visita.ata_assinada === "true") dadosTematica.atasAssinadas++;
  });

  // Converter para array de DadosVisitasTecnicasPorCiclo
  const porCiclo: DadosVisitasTecnicasPorCiclo[] = [];
  
  dadosPorCiclo.forEach((dados, ciclo) => {
    const percentualRealizadas = dados.esperadas > 0
      ? (dados.realizadas / dados.esperadas) * 100
      : 0;
    
    const percentualAtasAssinadas = dados.esperadas > 0
      ? (dados.atasAssinadas / dados.esperadas) * 100
      : 0;

    porCiclo.push({
      ciclo,
      esperadas: dados.esperadas,
      realizadas: dados.realizadas,
      atasAssinadas: dados.atasAssinadas,
      percentualRealizadas,
      percentualAtasAssinadas,
      porEtapa: Array.from(dados.porEtapa.entries()).map(([etapa, dadosEtapa]) => ({
        etapa,
        ...dadosEtapa,
      })),
      porTematica: Array.from(dados.porTematica.entries()).map(([tematica, dadosTematica]) => ({
        tematica,
        ...dadosTematica,
      })),
    });
  });

  // Ordenar por ciclo
  porCiclo.sort((a, b) => a.ciclo - b.ciclo);

  // Calcular totais
  let totalEsperadas = 0;
  let totalRealizadas = 0;
  let totalAtasAssinadas = 0;

  porCiclo.forEach((dados) => {
    totalEsperadas += dados.esperadas;
    totalRealizadas += dados.realizadas;
    totalAtasAssinadas += dados.atasAssinadas;
  });

  const percentualPendentes = totalEsperadas > 0
    ? ((totalEsperadas - totalAtasAssinadas) / totalEsperadas) * 100
    : 0;

  return {
    totalEsperadas,
    totalRealizadas,
    totalAtasAssinadas,
    percentualPendentes,
    porCiclo,
  };
}

/**
 * Calcula dados agregados de visitas técnicas por regional
 */
export function calcularDadosVisitasTecnicasRegionais(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[]
): import("../types/VisitasTecnicas").DadosVisitasTecnicasRegional[] {
  const regionais = new Set(escolasData.map((e) => e.regional));
  const dados: import("../types/VisitasTecnicas").DadosVisitasTecnicasRegional[] = [];

  regionais.forEach((regional) => {
    const dadosRegional = calcularDadosVisitasTecnicasFiltrado(
      visitasData,
      escolasData,
      (escola) => escola.regional === regional
    );
    dados.push({
      ...dadosRegional,
      regional,
    });
  });

  return dados.sort((a, b) => a.regional.localeCompare(b.regional));
}

/**
 * Calcula dados agregados de visitas técnicas por município
 */
export function calcularDadosVisitasTecnicasMunicipios(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[],
  regional?: string
): import("../types/VisitasTecnicas").DadosVisitasTecnicasMunicipio[] {
  let escolasFiltradas = escolasData;
  if (regional) {
    escolasFiltradas = escolasData.filter((e) => e.regional === regional);
  }

  const municipiosMap = new Map<string, { municipio: string; regional: string }>();
  escolasFiltradas.forEach((e) => {
    const key = `${e.municipio}-${e.regional}`;
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, { municipio: e.municipio, regional: e.regional });
    }
  });

  const dados: import("../types/VisitasTecnicas").DadosVisitasTecnicasMunicipio[] = [];

  municipiosMap.forEach(({ municipio, regional: reg }) => {
    const dadosMunicipio = calcularDadosVisitasTecnicasFiltrado(
      visitasData,
      escolasData,
      (escola) => escola.municipio === municipio && escola.regional === reg
    );
    dados.push({
      ...dadosMunicipio,
      municipio,
      regional: reg,
    });
  });

  return dados.sort((a, b) => a.municipio.localeCompare(b.municipio));
}

/**
 * Calcula dados agregados de visitas técnicas por escola
 */
export function calcularDadosVisitasTecnicasEscolas(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[],
  municipio?: string,
  regional?: string
): import("../types/VisitasTecnicas").DadosVisitasTecnicasEscola[] {
  let escolasFiltradas = escolasData;
  if (municipio) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.municipio === municipio);
  }
  if (regional) {
    escolasFiltradas = escolasFiltradas.filter((e) => e.regional === regional);
  }

  const dados: import("../types/VisitasTecnicas").DadosVisitasTecnicasEscola[] = [];

  escolasFiltradas.forEach((escola) => {
    const dadosEscola = calcularDadosVisitasTecnicasFiltrado(
      visitasData,
      escolasData,
      (e) => e.id === escola.id
    );
    dados.push({
      ...dadosEscola,
      escola: escola.nome,
      municipio: escola.municipio,
      regional: escola.regional,
    });
  });

  return dados.sort((a, b) => a.escola.localeCompare(b.escola));
}

