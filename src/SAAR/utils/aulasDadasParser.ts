/**
 * Utilitários para parsing e processamento de dados de Aulas Dadas
 */

import type { AulasDadasRow, AulasDadasProps } from "../types/AulasDadas.types";

/**
 * Faz parse correto de uma linha CSV, respeitando campos entre aspas
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Aplica filtros aos dados do CSV
 */
export function aplicarFiltros(
  row: any,
  filtros?: AulasDadasProps["filtros"]
): boolean {
  if (!filtros) return true;

  if (filtros.regional && row.regional !== filtros.regional.label) {
    return false;
  }

  if (filtros.municipio && row.municipio !== filtros.municipio.label) {
    return false;
  }

  if (filtros.escola) {
    const escolaCSV = row.escola_nome?.trim().toLowerCase() || "";
    const escolaFiltro = filtros.escola.label?.trim().toLowerCase() || "";
    if (escolaCSV !== escolaFiltro) {
      return false;
    }
  }

  return true;
}

/**
 * Converte uma linha do CSV em um objeto AulasDadasRow
 */
export function parseRowToAulasDadas(
  row: any,
  headers: string[]
): AulasDadasRow | null {
  if (Object.keys(row).length === 0) return null;

  return {
    escola_id: parseInt(row.escola_id) || 0,
    escola_nome: row.escola_nome || "",
    regional: row.regional || "",
    municipio: row.municipio || "",
    turma: row.turma || "",
    data: row.data || "",
    dia_letivo: parseInt(row.dia_letivo) || 0,
    aulas_previstas_LP: parseInt(row.aulas_previstas_LP || "0"),
    aulas_previstas_Mat: parseInt(row.aulas_previstas_Mat || "0"),
    aulas_previstas_Ciencias: parseInt(row.aulas_previstas_Ciencias || "0"),
    aulas_previstas_Historia: parseInt(row.aulas_previstas_Historia || "0"),
    aulas_previstas_Geografia: parseInt(row.aulas_previstas_Geografia || "0"),
    aulas_dadas_LP: parseInt(row.aulas_dadas_LP || "0"),
    aulas_dadas_Mat: parseInt(row.aulas_dadas_Mat || "0"),
    aulas_dadas_Ciencias: parseInt(row.aulas_dadas_Ciencias || "0"),
    aulas_dadas_Historia: parseInt(row.aulas_dadas_Historia || "0"),
    aulas_dadas_Geografia: parseInt(row.aulas_dadas_Geografia || "0"),
  };
}

