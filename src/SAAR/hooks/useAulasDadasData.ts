/**
 * Hook customizado para carregar e processar dados de Aulas Dadas
 */

import { useState, useEffect, useCallback } from "react";
import { getPublicPath } from "../../utils/pathUtils";
import type { AulasDadasRow, AulasDadasProps } from "../types/AulasDadas.types";
import {
  parseCSVLine,
  aplicarFiltros,
  parseRowToAulasDadas,
} from "../utils/aulasDadasParser";

export function useAulasDadasData(filtros?: AulasDadasProps["filtros"]) {
  const [dados, setDados] = useState<AulasDadasRow[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const response = await fetch(getPublicPath("aulas-dadas.csv"));

      if (!response.ok) {
        throw new Error(
          `Erro ao carregar CSV: ${response.status} ${response.statusText}`
        );
      }

      const csvContent = await response.text();
      const linhas = csvContent.split("\n").filter((l) => l.trim());
      const headers = parseCSVLine(linhas[0]);

      const dadosParseados: AulasDadasRow[] = [];

      for (let i = 1; i < linhas.length; i++) {
        const valores = parseCSVLine(linhas[i]);

        // Verificar se a linha tem o número correto de colunas
        if (valores.length !== headers.length) {
          continue;
        }

        const row: any = {};
        headers.forEach((header, index) => {
          let valor = valores[index]?.trim() || "";
          // Remover aspas se houver
          if (valor.startsWith('"') && valor.endsWith('"')) {
            valor = valor.slice(1, -1);
          }
          row[header.trim()] = valor;
        });

        // Aplicar filtros
        if (!aplicarFiltros(row, filtros)) {
          continue;
        }

        const parsedRow = parseRowToAulasDadas(row);
        if (parsedRow) {
          dadosParseados.push(parsedRow);
        }
      }

      setDados(dadosParseados);
    } catch (error) {
      console.error("Erro ao carregar dados de aulas dadas:", error);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return { dados, carregando };
}

