/**
 * Utilitários para parsing e processamento de dados de Frequência dos Estudantes
 */

import type {
  FrequenciaEstudantesRow,
  FrequenciaEstudantesProps,
} from "../types/FrequenciaEstudantes.types";
import { normalizarFiltrosHierarquia } from "./filtrosUtils";

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
  filtros?: FrequenciaEstudantesProps["filtros"]
): boolean {
  if (!filtros) return true;

  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  const { regionais, municipios, escolas } = filtrosNormalizados;

  // Aplicar filtros (nota: CSV usa nomes diferentes)
  if (regionais.length > 0 && !regionais.includes(row.Regional)) {
    return false;
  }

  if (municipios.length > 0 && !municipios.includes(row.Município)) {
    return false;
  }

  if (escolas.length > 0) {
    const escolaCSV = row.Escola?.trim().toLowerCase() || "";
    if (!escolas.includes(escolaCSV)) {
      return false;
    }
  }

  return true;
}

/**
 * Converte uma linha do CSV em um objeto FrequenciaEstudantesRow
 */
export function parseRowToFrequencia(
  row: any
): FrequenciaEstudantesRow | null {
  if (Object.keys(row).length === 0) return null;

  return {
    regional: row.Regional || "",
    municipio: row.Município || "",
    escola: row.Escola || "",
    serie: row.Série || "",
    turma: row.Turma || "",
    aluno: row.Aluno || "",
    dias_do_mes: parseInt(row["Dias do mês"] || "0"),
    presenca_falta: (row["Presença/Falta"] || "P") === "P" ? "P" : "F",
    data: row.Data || undefined,
    dia_letivo: row["Dia Letivo"] ? parseInt(row["Dia Letivo"]) : undefined,
  };
}

