/**
 * Funções de cálculo e agregação para dados de Tarefas
 */

import type {
  DadosTarefas,
  DadosTarefasRegional,
  DadosTarefasMunicipio,
  DadosTarefasEscola,
  TarefasProps,
} from "../types/Tarefas.types";
import type { CicloGestaoRow } from "../../types/CicloGestao";
import type { Escola } from "../../types/Escola";
import { filtrarDadosCicloGestao } from "./tarefasParser";

/**
 * Formata número com separador de milhares (pt-BR)
 */
export function formatarNumero(numero: number): string {
  return numero.toLocaleString("pt-BR");
}

/**
 * Calcula dados de tarefas filtrado por escolas
 */
function calcularDadosTarefasFiltrado(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtro?: (escola: Escola) => boolean
): DadosTarefas {
  let escolasFiltradas = escolasData;
  if (filtro) {
    escolasFiltradas = escolasData.filter(filtro);
  }

  const escolaIds = new Set(escolasFiltradas.map((e) => e.id.toString()));
  const dadosFiltrados = cicloGestaoData.filter((row) =>
    escolaIds.has(row.escola_id)
  );

  let total = 0;
  let previstas = 0;
  let naoIniciadas = 0;
  let emAndamento = 0;
  let atrasadas = 0;
  let concluidas = 0;
  let concluidasAtraso = 0;

  dadosFiltrados.forEach((row) => {
    total += parseInt(row.tarefas_total) || 0;
    previstas += parseInt(row.tarefas_previstas) || 0;
    naoIniciadas += parseInt(row.tarefas_nao_iniciadas) || 0;
    emAndamento += parseInt(row.tarefas_em_andamento) || 0;
    atrasadas += parseInt(row.tarefas_atrasadas) || 0;
    concluidas += parseInt(row.tarefas_concluidas) || 0;
    concluidasAtraso += parseInt(row.tarefas_concluidas_atraso) || 0;
  });

  return {
    total,
    previstas,
    naoIniciadas,
    emAndamento,
    atrasadas,
    concluidas,
    concluidasAtraso,
  };
}

/**
 * Calcula dados de tarefas agregados (baseado em filtros)
 */
export function calcularDadosTarefas(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: TarefasProps["filtros"]
): DadosTarefas {
  const dadosFiltrados = filtrarDadosCicloGestao(
    cicloGestaoData,
    escolasData,
    filtros
  );
  return calcularDadosTarefasFiltrado(dadosFiltrados, escolasData);
}

/**
 * Calcula dados de tarefas por regional
 */
export function calcularDadosTarefasRegionais(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: TarefasProps["filtros"]
): DadosTarefasRegional[] {
  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  const escolasFiltradas = escolasData.filter((escola) =>
    escolaCorrespondeFiltros(escola, filtrosNormalizados)
  );

  const regionaisSet = new Set(escolasFiltradas.map((e) => e.regional));
  const dados: DadosTarefasRegional[] = [];

  regionaisSet.forEach((regional) => {
    const dadosRegional = calcularDadosTarefasFiltrado(
      cicloGestaoData,
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
 * Calcula dados de tarefas por município
 */
export function calcularDadosTarefasMunicipios(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: TarefasProps["filtros"]
): DadosTarefasMunicipio[] {
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

  const dados: DadosTarefasMunicipio[] = [];

  municipiosMap.forEach(({ municipio, regional: reg }) => {
    const dadosMunicipio = calcularDadosTarefasFiltrado(
      cicloGestaoData,
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
 * Calcula dados de tarefas por escola
 */
export function calcularDadosTarefasEscolas(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: TarefasProps["filtros"]
): DadosTarefasEscola[] {
  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  const escolasFiltradas = escolasData.filter((escola) =>
    escolaCorrespondeFiltros(escola, filtrosNormalizados)
  );

  const dados: DadosTarefasEscola[] = [];

  escolasFiltradas.forEach((escola) => {
    const dadosEscola = calcularDadosTarefasFiltrado(
      cicloGestaoData,
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

/**
 * Obtém o título do card baseado nos filtros
 */
export function obterTituloCard(
  filtros?: TarefasProps["filtros"]
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

/**
 * Calcula o percentual de progresso geral (concluídas + concluídas com atraso)
 */
export function calcularPercentualProgresso(dados: DadosTarefas): number {
  if (!dados || typeof dados !== "object") return 0;
  if (dados.total === undefined || dados.total === null || dados.total === 0) return 0;
  
  const concluidas = dados.concluidas || 0;
  const concluidasAtraso = dados.concluidasAtraso || 0;
  const total = dados.total;
  
  if (total === 0) return 0;
  
  const percentual = ((concluidas + concluidasAtraso) / total) * 100;
  return Math.min(100, Math.max(0, percentual));
}

