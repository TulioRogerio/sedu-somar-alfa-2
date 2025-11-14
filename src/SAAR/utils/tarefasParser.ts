/**
 * Utilitários para parsing e processamento de dados de Tarefas
 */

import type { TarefasProps } from "../types/Tarefas.types";
import type { CicloGestaoRow } from "../../types/CicloGestao";
import type { Escola } from "../../types/Escola";
import { normalizarFiltrosHierarquia, escolaCorrespondeFiltros } from "./filtrosUtils";

/**
 * Aplica filtros do SAAR aos dados
 */
export function aplicarFiltrosTarefas(
  escola: Escola,
  filtros?: TarefasProps["filtros"]
): boolean {
  if (!filtros) return true;

  // Assumindo que todas as escolas são do Espírito Santo
  // Se houver filtro de estado, pode ser aplicado aqui
  if (filtros.estado && escola.regional) {
    // Estado já está implícito
  }

  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  return escolaCorrespondeFiltros(escola, filtrosNormalizados);
}

/**
 * Filtra dados do ciclo-gestao baseado nos filtros do SAAR
 */
export function filtrarDadosCicloGestao(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: TarefasProps["filtros"]
): CicloGestaoRow[] {
  // Se não há filtros, retornar todos os dados (Espírito Santo)
  if (!filtros || Object.keys(filtros).length === 0) {
    return cicloGestaoData;
  }

  // Criar mapa de escolas filtradas
  const escolasFiltradas = escolasData.filter((escola) =>
    aplicarFiltrosTarefas(escola, filtros)
  );

  const escolaIds = new Set(
    escolasFiltradas.map((e) => e.id.toString())
  );

  // Filtrar dados do ciclo-gestao que pertencem às escolas filtradas
  return cicloGestaoData.filter((row) => escolaIds.has(row.escola_id));
}

