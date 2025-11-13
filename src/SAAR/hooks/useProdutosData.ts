/**
 * Hook customizado para carregar e processar dados de Produtos
 */

import { useState, useEffect, useCallback } from "react";
import { loadEscolasFromCsv } from "../../utils/csvParser";
import { loadCicloGestaoCsv } from "../../utils/cicloGestaoParser";
import type { CicloGestaoRow } from "../../types/CicloGestao";
import type { Escola } from "../../types/Escola";
import type {
  DadosProdutos,
  DadosProdutosRegional,
  DadosProdutosMunicipio,
  DadosProdutosEscola,
  ProdutosProps,
} from "../types/Produtos.types";
import {
  calcularDadosProdutos,
  calcularDadosProdutosRegionais,
  calcularDadosProdutosMunicipios,
  calcularDadosProdutosEscolas,
  determinarNivel,
} from "../utils/produtosCalculations";

export function useProdutosData(filtros?: ProdutosProps["filtros"]) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [cicloGestaoData, setCicloGestaoData] = useState<CicloGestaoRow[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const [dadosAgregados, setDadosAgregados] = useState<DadosProdutos | null>(
    null
  );
  const [dadosRegionais, setDadosRegionais] = useState<
    DadosProdutosRegional[]
  >([]);
  const [dadosMunicipios, setDadosMunicipios] = useState<
    DadosProdutosMunicipio[]
  >([]);
  const [dadosEscolas, setDadosEscolas] = useState<DadosProdutosEscola[]>([]);
  const [nivel, setNivel] = useState<"estado" | "regional" | "municipio" | "escola">("estado");

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
      console.error("Erro ao carregar dados de produtos:", error);
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
    const dados = calcularDadosProdutos(
      cicloGestaoData,
      escolas,
      filtros
    );
    setDadosAgregados(dados);

    // Calcular dados do nível apropriado
    switch (nivelAtual) {
      case "estado":
        const regionais = calcularDadosProdutosRegionais(
          cicloGestaoData,
          escolas,
          filtros
        );
        setDadosRegionais(regionais);
        setDadosMunicipios([]);
        setDadosEscolas([]);
        break;

      case "regional":
        const municipios = calcularDadosProdutosMunicipios(
          cicloGestaoData,
          escolas,
          filtros
        );
        setDadosMunicipios(municipios);
        setDadosRegionais([]);
        setDadosEscolas([]);
        break;

      case "municipio":
        const escolasCalc = calcularDadosProdutosEscolas(
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

