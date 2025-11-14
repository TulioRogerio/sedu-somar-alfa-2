/**
 * Funções de cálculo e agregação para dados de Visitas Técnicas
 */

import type {
  DadosVisitasTecnicas,
  DadosVisitasTecnicasRegional,
  DadosVisitasTecnicasMunicipio,
  DadosVisitasTecnicasEscola,
  VisitasTecnicasProps,
} from "../types/VisitasTecnicas.types";
import type { VisitaTecnicaRow } from "../../types/VisitasTecnicas";
import type { Escola } from "../../types/Escola";
import { calcularDadosVisitasTecnicasFiltrado as calcularDadosVisitasTecnicasFiltradoParser } from "../../utils/visitasTecnicasParser";
import { calcularDadosVisitasTecnicasFiltrado } from "../../utils/visitasTecnicasParser";
import { filtrarDadosVisitasTecnicas } from "./visitasTecnicasParser";
import { normalizarFiltrosHierarquia, escolaCorrespondeFiltros } from "./filtrosUtils";

/**
 * Formata número com separador de milhares (pt-BR)
 */
export function formatarNumero(numero: number): string {
  return numero.toLocaleString("pt-BR");
}

/**
 * Calcula dados de visitas técnicas agregados (baseado em filtros)
 */
export function calcularDadosVisitasTecnicas(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[],
  filtros?: VisitasTecnicasProps["filtros"]
): DadosVisitasTecnicas {
  const dadosFiltrados = filtrarDadosVisitasTecnicas(
    visitasData,
    escolasData,
    filtros
  );

  // Criar função de filtro para escolas baseada nos filtros do SAAR
  const criarFiltroEscola = (): ((escola: Escola) => boolean) | undefined => {
    if (!filtros || Object.keys(filtros).length === 0) {
      return undefined;
    }
    
    const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
    return (escola: Escola) => escolaCorrespondeFiltros(escola, filtrosNormalizados);
  };

  const dadosAgregados = calcularDadosVisitasTecnicasFiltradoParser(
    dadosFiltrados,
    escolasData,
    criarFiltroEscola()
  );

  // Converter para o formato esperado pelo SAAR
  const percentualAtasAssinadas = dadosAgregados.totalEsperadas > 0
    ? (dadosAgregados.totalAtasAssinadas / dadosAgregados.totalEsperadas) * 100
    : 0;

  // Garantir que porCiclo existe e é um array
  const porCiclo = (dadosAgregados.porCiclo || []).map((ciclo) => ({
    ciclo: ciclo.ciclo,
    esperadas: ciclo.esperadas,
    atasAssinadas: ciclo.atasAssinadas,
    percentualAtasAssinadas: ciclo.percentualAtasAssinadas,
    porEtapa: (ciclo.porEtapa || []).map((etapa) => ({
      etapa: etapa.etapa,
      esperadas: etapa.esperadas,
      atasAssinadas: etapa.atasAssinadas,
    })),
  }));

  return {
    totalEsperadas: dadosAgregados.totalEsperadas,
    totalAtasAssinadas: dadosAgregados.totalAtasAssinadas,
    percentualPendentes: dadosAgregados.percentualPendentes,
    percentualAtasAssinadas,
    porCiclo,
  };
}

/**
 * Calcula dados de visitas técnicas por regional
 */
export function calcularDadosVisitasTecnicasRegionais(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[],
  _filtros?: VisitasTecnicasProps["filtros"]
): DadosVisitasTecnicasRegional[] {
  const regionais = new Set(escolasData.map((e) => e.regional));
  const dados: DadosVisitasTecnicasRegional[] = [];

  regionais.forEach((regional) => {
    const dadosRegional = calcularDadosVisitasTecnicasFiltrado(
      visitasData,
      escolasData,
      (escola: Escola) => escola.regional === regional
    );
    dados.push({
      ...dadosRegional,
      regional,
    });
  });

  return dados.sort((a, b) => a.regional.localeCompare(b.regional));
}

/**
 * Calcula dados de visitas técnicas por município
 */
export function calcularDadosVisitasTecnicasMunicipios(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[],
  filtros?: VisitasTecnicasProps["filtros"]
): DadosVisitasTecnicasMunicipio[] {
  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  const escolasFiltradas = escolasData.filter((escola) =>
    escolaCorrespondeFiltros(escola, filtrosNormalizados)
  );

  const municipiosMap = new Map<
    string,
    { municipio: string; regional: string }
  >();
  escolasFiltradas.forEach((e) => {
    const key = `${e.municipio}-${e.regional}`;
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, { municipio: e.municipio, regional: e.regional });
    }
  });

  const dados: DadosVisitasTecnicasMunicipio[] = [];

  municipiosMap.forEach(({ municipio, regional: reg }) => {
    const dadosMunicipio = calcularDadosVisitasTecnicasFiltrado(
      visitasData,
      escolasData,
      (escola: Escola) => escola.municipio === municipio && escola.regional === reg
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
 * Calcula dados de visitas técnicas por escola
 */
export function calcularDadosVisitasTecnicasEscolas(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[],
  filtros?: VisitasTecnicasProps["filtros"]
): DadosVisitasTecnicasEscola[] {
  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  const escolasFiltradas = escolasData.filter((escola) =>
    escolaCorrespondeFiltros(escola, filtrosNormalizados)
  );

  const dados: DadosVisitasTecnicasEscola[] = [];

  escolasFiltradas.forEach((escola) => {
    const dadosEscola = calcularDadosVisitasTecnicasFiltrado(
      visitasData,
      escolasData,
      (e: Escola) => e.id === escola.id
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

/**
 * Determina o nível de agregação baseado nos filtros
 */
export function determinarNivel(
  filtros?: VisitasTecnicasProps["filtros"]
): "estado" | "regional" | "municipio" | "escola" {
  if (filtros?.escola) {
    return "escola";
  }
  if (filtros?.municipio) {
    return "municipio";
  }
  if (filtros?.regional) {
    return "regional";
  }
  return "estado";
}

/**
 * Obtém o título do card baseado nos filtros
 */
export function obterTituloCard(
  filtros?: VisitasTecnicasProps["filtros"]
): string {
  if (filtros?.escola) {
    return filtros.escola.label;
  }
  if (filtros?.municipio) {
    return filtros.municipio.label;
  }
  if (filtros?.regional) {
    return filtros.regional.label;
  }
  return "Espírito Santo";
}

