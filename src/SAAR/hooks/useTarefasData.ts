/**
 * Hook customizado para carregar e processar dados de Tarefas
 */

import { useState, useEffect, useCallback } from "react";
import { loadEscolasFromCsv } from "../../utils/csvParser";
import { loadCicloGestaoCsv } from "../../utils/cicloGestaoParser";
import type { CicloGestaoRow } from "../../types/CicloGestao";
import type { Escola } from "../../types/Escola";
import type {
  DadosTarefas,
  DadosTarefasRegional,
  DadosTarefasMunicipio,
  DadosTarefasEscola,
  TarefasProps,
  NivelAgregacao,
} from "../types/Tarefas.types";
import {
  calcularDadosTarefas,
  calcularDadosTarefasRegionais,
  calcularDadosTarefasMunicipios,
  calcularDadosTarefasEscolas,
} from "../utils/tarefasCalculations";

/**
 * Determina o nível de agregação baseado nos filtros
 */
function determinarNivel(filtros?: TarefasProps["filtros"]): NivelAgregacao {
  if (filtros?.escola) return "escola";
  if (filtros?.municipio) return "municipio";
  if (filtros?.regional) return "regional";
  return "estado";
}

export function useTarefasData(filtros?: TarefasProps["filtros"]) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [cicloGestaoData, setCicloGestaoData] = useState<CicloGestaoRow[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const [dadosAgregados, setDadosAgregados] = useState<DadosTarefas | null>(
    null
  );
  const [dadosRegionais, setDadosRegionais] = useState<
    DadosTarefasRegional[]
  >([]);
  const [dadosMunicipios, setDadosMunicipios] = useState<
    DadosTarefasMunicipio[]
  >([]);
  const [dadosEscolas, setDadosEscolas] = useState<DadosTarefasEscola[]>([]);
  const [nivel, setNivel] = useState<NivelAgregacao>("estado");

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const [escolasData, cicloData] = await Promise.all([
        loadEscolasFromCsv(),
        loadCicloGestaoCsv(),
      ]);

      setEscolas(escolasData);
      setCicloGestaoData(cicloData);
    } catch (error) {
      console.error("Erro ao carregar dados de tarefas:", error);
      setEscolas([]);
      setCicloGestaoData([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Calcular dados agregados quando dados ou filtros mudarem
  useEffect(() => {
    if (escolas.length === 0 || cicloGestaoData.length === 0) return;

    const nivelAtual = determinarNivel(filtros);
    setNivel(nivelAtual);

    // Calcular dados agregados (card superior)
    const dados = calcularDadosTarefas(
      cicloGestaoData,
      escolas,
      filtros
    );
    setDadosAgregados(dados);

    // Calcular dados do nível apropriado
    switch (nivelAtual) {
      case "estado":
        const regionais = calcularDadosTarefasRegionais(
          cicloGestaoData,
          escolas,
          filtros
        );
        setDadosRegionais(regionais);
        setDadosMunicipios([]);
        setDadosEscolas([]);
        break;

      case "regional":
        const municipios = calcularDadosTarefasMunicipios(
          cicloGestaoData,
          escolas,
          filtros
        );
        setDadosMunicipios(municipios);
        setDadosRegionais([]);
        setDadosEscolas([]);
        break;

      case "municipio":
        const escolasCalc = calcularDadosTarefasEscolas(
          cicloGestaoData,
          escolas,
          filtros
        );
        setDadosEscolas(escolasCalc);
        setDadosRegionais([]);
        setDadosMunicipios([]);
        break;

      case "escola":
        setDadosRegionais([]);
        setDadosMunicipios([]);
        setDadosEscolas([]);
        break;
    }
  }, [escolas, cicloGestaoData, filtros]);

  return {
    dadosAgregados,
    dadosRegionais,
    dadosMunicipios,
    dadosEscolas,
    nivel,
    carregando,
  };
}

