/**
 * Hook customizado para carregar e processar dados de Visitas Técnicas
 */

import { useState, useEffect, useCallback } from "react";
import { loadEscolasFromCsv } from "../../utils/csvParser";
import { loadVisitasTecnicasCsv } from "../../utils/visitasTecnicasParser";
import type { VisitaTecnicaRow } from "../../types/VisitasTecnicas";
import type { Escola } from "../../types/Escola";
import type {
  DadosVisitasTecnicas,
  VisitasTecnicasProps,
} from "../types/VisitasTecnicas.types";
import { calcularDadosVisitasTecnicas } from "../utils/visitasTecnicasCalculations";

export function useVisitasTecnicasData(
  filtros?: VisitasTecnicasProps["filtros"]
) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [visitasData, setVisitasData] = useState<VisitaTecnicaRow[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const [dadosAgregados, setDadosAgregados] = useState<
    DadosVisitasTecnicas | null
  >(null);

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const [escolasData, visitas] = await Promise.all([
        loadEscolasFromCsv(),
        loadVisitasTecnicasCsv(),
      ]);

      setEscolas(escolasData);
      setVisitasData(visitas);
    } catch (error) {
      console.error("Erro ao carregar dados de visitas técnicas:", error);
      setEscolas([]);
      setVisitasData([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Calcular dados agregados quando dados ou filtros mudarem
  useEffect(() => {
    if (escolas.length === 0 || visitasData.length === 0) {
      setDadosAgregados(null);
      return;
    }

    try {
      // Calcular dados agregados
      const dados = calcularDadosVisitasTecnicas(
        visitasData,
        escolas,
        filtros
      );
      
      // Garantir que porCiclo existe
      if (dados && !dados.porCiclo) {
        dados.porCiclo = [];
      }
      
      setDadosAgregados(dados);
    } catch (error) {
      console.error("Erro ao calcular dados agregados de visitas técnicas:", error);
      setDadosAgregados(null);
    }
  }, [escolas, visitasData, filtros]);

  return {
    dadosAgregados,
    carregando,
  };
}

