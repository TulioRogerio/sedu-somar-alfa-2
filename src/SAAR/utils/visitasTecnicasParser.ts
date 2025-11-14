/**
 * Utilitários para parsing e processamento de dados de Visitas Técnicas
 */

import type { VisitasTecnicasProps } from "../types/VisitasTecnicas.types";
import type { VisitaTecnicaRow } from "../../types/VisitasTecnicas";
import type { Escola } from "../../types/Escola";
import { normalizarFiltrosHierarquia, escolaCorrespondeFiltros } from "./filtrosUtils";

/**
 * Aplica filtros do SAAR aos dados
 */
export function aplicarFiltrosVisitasTecnicas(
  escola: Escola,
  filtros?: VisitasTecnicasProps["filtros"]
): boolean {
  if (!filtros) return true;

  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  return escolaCorrespondeFiltros(escola, filtrosNormalizados);
}

/**
 * Filtra dados de visitas técnicas baseado nos filtros do SAAR
 */
export function filtrarDadosVisitasTecnicas(
  visitasData: VisitaTecnicaRow[],
  escolasData: Escola[],
  filtros?: VisitasTecnicasProps["filtros"]
): VisitaTecnicaRow[] {
  if (!filtros || Object.keys(filtros).length === 0) {
    return visitasData;
  }

  const escolasFiltradas = escolasData.filter((escola) =>
    aplicarFiltrosVisitasTecnicas(escola, filtros)
  );

  const escolaIds = new Set(
    escolasFiltradas.map((e) => e.id.toString())
  );

  return visitasData.filter((row) => escolaIds.has(row.escola_id));
}

