/**
 * Funções de cálculo e agregação para dados de Aulas Dadas
 */

import type {
  AulasDadasRow,
  DadosPorTurma,
} from "../types/AulasDadas.types";
import { ORDEM_TURMAS } from "../constants/AulasDadas.constants";

/**
 * Calcula o indicador de aula (percentual de aulas dadas sobre aulas previstas)
 */
export function calcularIndicadorAula(dados: AulasDadasRow[]): number {
  if (dados.length === 0) return 0;

  const totalPrevistas = dados.reduce(
    (sum, row) =>
      sum +
      row.aulas_previstas_LP +
      row.aulas_previstas_Mat +
      row.aulas_previstas_Ciencias +
      row.aulas_previstas_Historia +
      row.aulas_previstas_Geografia,
    0
  );

  const totalDadas = dados.reduce(
    (sum, row) =>
      sum +
      row.aulas_dadas_LP +
      row.aulas_dadas_Mat +
      row.aulas_dadas_Ciencias +
      row.aulas_dadas_Historia +
      row.aulas_dadas_Geografia,
    0
  );

  if (totalPrevistas === 0) return 0;

  const percentual = (totalDadas / totalPrevistas) * 100;
  return Math.min(100, Math.max(0, percentual));
}

/**
 * Agrupa dados por turma e calcula percentuais
 */
export function agruparDadosPorTurma(
  dados: AulasDadasRow[],
  seriesSelecionadas: string[]
): Record<string, DadosPorTurma> {
  const agrupado: Record<string, DadosPorTurma> = {};

  // Filtrar dados por séries selecionadas
  const dadosFiltrados =
    seriesSelecionadas.length > 0
      ? dados.filter((row) => seriesSelecionadas.includes(row.turma))
      : dados;

  dadosFiltrados.forEach((row) => {
    if (!agrupado[row.turma]) {
      agrupado[row.turma] = {
        previstas_LP: 0,
        previstas_Mat: 0,
        previstas_Ciencias: 0,
        previstas_Historia: 0,
        previstas_Geografia: 0,
        dadas_LP: 0,
        dadas_Mat: 0,
        dadas_Ciencias: 0,
        dadas_Historia: 0,
        dadas_Geografia: 0,
        percentual_LP: 0,
        percentual_Mat: 0,
        percentual_Ciencias: 0,
        percentual_Historia: 0,
        percentual_Geografia: 0,
        percentual_Total: 0,
      };
    }

    agrupado[row.turma].previstas_LP += row.aulas_previstas_LP;
    agrupado[row.turma].previstas_Mat += row.aulas_previstas_Mat;
    agrupado[row.turma].previstas_Ciencias += row.aulas_previstas_Ciencias;
    agrupado[row.turma].previstas_Historia += row.aulas_previstas_Historia;
    agrupado[row.turma].previstas_Geografia += row.aulas_previstas_Geografia;
    agrupado[row.turma].dadas_LP += row.aulas_dadas_LP;
    agrupado[row.turma].dadas_Mat += row.aulas_dadas_Mat;
    agrupado[row.turma].dadas_Ciencias += row.aulas_dadas_Ciencias;
    agrupado[row.turma].dadas_Historia += row.aulas_dadas_Historia;
    agrupado[row.turma].dadas_Geografia += row.aulas_dadas_Geografia;
  });

  // Calcular percentuais
  Object.keys(agrupado).forEach((turma) => {
    const dados = agrupado[turma];
    dados.percentual_LP =
      dados.previstas_LP > 0
        ? Number(((dados.dadas_LP / dados.previstas_LP) * 100).toFixed(1))
        : 0;
    dados.percentual_Mat =
      dados.previstas_Mat > 0
        ? Number(((dados.dadas_Mat / dados.previstas_Mat) * 100).toFixed(1))
        : 0;
    dados.percentual_Ciencias =
      dados.previstas_Ciencias > 0
        ? Number(
            ((dados.dadas_Ciencias / dados.previstas_Ciencias) * 100).toFixed(
              1
            )
          )
        : 0;
    dados.percentual_Historia =
      dados.previstas_Historia > 0
        ? Number(
            ((dados.dadas_Historia / dados.previstas_Historia) * 100).toFixed(1)
          )
        : 0;
    dados.percentual_Geografia =
      dados.previstas_Geografia > 0
        ? Number(
            (
              (dados.dadas_Geografia / dados.previstas_Geografia) *
              100
            ).toFixed(1)
          )
        : 0;

    const totalPrevistas =
      dados.previstas_LP +
      dados.previstas_Mat +
      dados.previstas_Ciencias +
      dados.previstas_Historia +
      dados.previstas_Geografia;
    const totalDadas =
      dados.dadas_LP +
      dados.dadas_Mat +
      dados.dadas_Ciencias +
      dados.dadas_Historia +
      dados.dadas_Geografia;
    dados.percentual_Total =
      totalPrevistas > 0
        ? Number(((totalDadas / totalPrevistas) * 100).toFixed(1))
        : 0;
  });

  // Ordenar conforme ordemTurmas
  const ordenado: Record<string, DadosPorTurma> = {};
  ORDEM_TURMAS.forEach((turma) => {
    if (agrupado[turma]) {
      ordenado[turma] = agrupado[turma];
    }
  });

  // Adicionar turmas que não estão na lista de ordem
  Object.keys(agrupado).forEach((turma) => {
    if (!ordenado[turma]) {
      ordenado[turma] = agrupado[turma];
    }
  });

  return ordenado;
}

