/**
 * Utilitários para normalização e manipulação de filtros
 */

import type { FiltroContexto } from "../types/shared.types";

/**
 * Normaliza um filtro para array, facilitando o processamento
 */
export function normalizarFiltroParaArray<T extends { label: string; value: string }>(
  filtro: T | T[] | undefined
): T[] {
  if (!filtro) return [];
  if (Array.isArray(filtro)) return filtro;
  return [filtro];
}

/**
 * Normaliza todos os filtros de hierarquia para arrays
 */
export function normalizarFiltrosHierarquia(filtros?: FiltroContexto) {
  if (!filtros) {
    return {
      regionais: [],
      municipios: [],
      escolas: [],
    };
  }

  const regionais = normalizarFiltroParaArray(filtros.regional);
  const municipios = normalizarFiltroParaArray(filtros.municipio);
  const escolas = normalizarFiltroParaArray(filtros.escola);

  return {
    regionais: regionais.map((r) => r.label),
    municipios: municipios.map((m) => m.label),
    escolas: escolas.map((e) => e.label?.trim().toLowerCase() || ""),
  };
}

/**
 * Verifica se uma escola corresponde aos filtros aplicados
 */
export function escolaCorrespondeFiltros(
  escola: { regional?: string; municipio?: string; nome?: string },
  filtrosNormalizados: ReturnType<typeof normalizarFiltrosHierarquia>
): boolean {
  const { regionais, municipios, escolas } = filtrosNormalizados;

  if (regionais.length > 0 && !regionais.includes(escola.regional || "")) {
    return false;
  }

  if (municipios.length > 0 && !municipios.includes(escola.municipio || "")) {
    return false;
  }

  if (escolas.length > 0) {
    const escolaNome = escola.nome?.trim().toLowerCase() || "";
    if (!escolas.includes(escolaNome)) {
      return false;
    }
  }

  return true;
}

