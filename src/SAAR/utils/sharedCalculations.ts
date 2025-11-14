/**
 * Funções de cálculo compartilhadas entre os módulos do SAAR
 */

import type { FiltroContexto } from "../types/shared.types";
import { ESTADO_PADRAO } from "../constants/shared.constants";

/**
 * Obtém o título do card baseado nos filtros aplicados
 */
export function obterTituloCard(filtros?: FiltroContexto): string {
  if (!filtros) {
    return ESTADO_PADRAO.label;
  }

  // Prioridade: escola > município > regional > estado
  const escolas = Array.isArray(filtros.escola) 
    ? filtros.escola 
    : filtros.escola 
    ? [filtros.escola] 
    : [];
  
  if (escolas.length > 0) {
    if (escolas.length === 1) {
      return escolas[0].label;
    }
    return `${escolas.length} Escolas`;
  }

  const municipios = Array.isArray(filtros.municipio) 
    ? filtros.municipio 
    : filtros.municipio 
    ? [filtros.municipio] 
    : [];
  
  if (municipios.length > 0) {
    if (municipios.length === 1) {
      return municipios[0].label;
    }
    return `${municipios.length} Municípios`;
  }

  const regionais = Array.isArray(filtros.regional) 
    ? filtros.regional 
    : filtros.regional 
    ? [filtros.regional] 
    : [];
  
  if (regionais.length > 0) {
    if (regionais.length === 1) {
      return regionais[0].label;
    }
    return `${regionais.length} Regionais`;
  }

  return filtros.estado?.label || ESTADO_PADRAO.label;
}

/**
 * Formata número com separador de milhares (pt-BR)
 */
export function formatarNumero(numero: number): string {
  return numero.toLocaleString("pt-BR");
}

/**
 * Formata percentual com 2 casas decimais (pt-BR)
 */
export function formatarPercentual(percentual: number, casasDecimais: number = 2): string {
  return percentual.toFixed(casasDecimais).replace(".", ",");
}

