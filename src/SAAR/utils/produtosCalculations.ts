/**
 * Funções de cálculo e agregação para dados de Produtos
 */

import type {
  DadosProdutos,
  DadosProdutosRegional,
  DadosProdutosMunicipio,
  DadosProdutosEscola,
  ProdutosProps,
} from "../types/Produtos.types";
import type { CicloGestaoRow } from "../../types/CicloGestao";
import type { Escola } from "../../types/Escola";
import { filtrarDadosCicloGestao } from "./produtosParser";

/**
 * Formata número com separador de milhares (pt-BR)
 */
export function formatarNumero(numero: number): string {
  return numero.toLocaleString("pt-BR");
}

/**
 * Calcula dados de produtos filtrado por escolas
 */
function calcularDadosProdutosFiltrado(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtro?: (escola: Escola) => boolean
): DadosProdutos {
  let escolasFiltradas = escolasData;
  if (filtro) {
    escolasFiltradas = escolasData.filter(filtro);
  }

  const escolaIds = new Set(escolasFiltradas.map((e) => e.id.toString()));
  const dadosFiltrados = cicloGestaoData.filter((row) =>
    escolaIds.has(row.escola_id)
  );

  let total = 0;
  let faixa0_25 = 0;
  let faixa26_50 = 0;
  let faixa51_75 = 0;
  let faixa76_100 = 0;
  let somaPercentuais = 0;

  dadosFiltrados.forEach((row) => {
    const produtoStatus = row.produto_status?.trim() || "";

    if (produtoStatus) {
      total++;

      // Extrair o valor numérico do status
      let percentualMedio = 0;

      // Normalizar o formato (aceita tanto "0-25" quanto "0 – 25")
      const statusNormalizado = produtoStatus.replace(/[–—]/g, "-").trim();

      if (statusNormalizado === "0-25") {
        faixa0_25++;
        percentualMedio = 12.5; // média da faixa
      } else if (statusNormalizado === "26-50") {
        faixa26_50++;
        percentualMedio = 38; // média da faixa
      } else if (statusNormalizado === "51-75") {
        faixa51_75++;
        percentualMedio = 63; // média da faixa
      } else if (statusNormalizado === "76-100") {
        faixa76_100++;
        percentualMedio = 88; // média da faixa
      }

      somaPercentuais += percentualMedio;
    }
  });

  const percentualMedio = total > 0 ? somaPercentuais / total : 0;

  return {
    total,
    faixa0_25,
    faixa26_50,
    faixa51_75,
    faixa76_100,
    percentualMedio,
  };
}

/**
 * Calcula dados de produtos agregados (baseado em filtros)
 */
export function calcularDadosProdutos(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: ProdutosProps["filtros"]
): DadosProdutos {
  const dadosFiltrados = filtrarDadosCicloGestao(
    cicloGestaoData,
    escolasData,
    filtros
  );

  return calcularDadosProdutosFiltrado(dadosFiltrados, escolasData);
}

/**
 * Calcula dados de produtos por regional
 */
export function calcularDadosProdutosRegionais(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: ProdutosProps["filtros"]
): DadosProdutosRegional[] {
  // Se há filtro de regional, não mostrar regionais (mostrar municípios)
  if (filtros?.regional) {
    return [];
  }

  // Aplicar filtros base (estado, SAAR) - se não houver filtros, mostrar todas
  const filtrosBase = filtros && Object.keys(filtros).length > 0
    ? { estado: filtros?.estado, saar: filtros?.saar }
    : undefined;
  
  const dadosFiltrados = filtrarDadosCicloGestao(
    cicloGestaoData,
    escolasData,
    filtrosBase
  );

  // Obter todas as regionais (sem filtro de regional)
  const regionais = new Set(escolasData.map((e) => e.regional));
  const dados: DadosProdutosRegional[] = [];

  regionais.forEach((regional) => {
    const dadosRegional = calcularDadosProdutosFiltrado(
      dadosFiltrados,
      escolasData,
      (escola) => escola.regional === regional
    );
    dados.push({
      ...dadosRegional,
      regional,
    });
  });

  return dados.sort((a, b) => a.regional.localeCompare(b.regional));
}

/**
 * Calcula dados de produtos por município
 */
export function calcularDadosProdutosMunicipios(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: ProdutosProps["filtros"]
): DadosProdutosMunicipio[] {
  // Se há filtro de município, não mostrar municípios (mostrar escolas)
  if (filtros?.municipio) {
    return [];
  }

  // Se não há filtro de regional, não mostrar municípios (mostrar regionais)
  if (!filtros?.regional) {
    return [];
  }

  // Aplicar filtros base
  const dadosFiltrados = filtrarDadosCicloGestao(
    cicloGestaoData,
    escolasData,
    filtros
  );

  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  const escolasFiltradas = escolasData.filter((e) =>
    escolaCorrespondeFiltros(e, filtrosNormalizados)
  );

  const municipiosMap = new Map<
    string,
    { municipio: string; regional: string }
  >();
  escolasFiltradas.forEach((e) => {
    const key = `${e.municipio}-${e.regional}`;
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, {
        municipio: e.municipio,
        regional: e.regional,
      });
    }
  });

  const dados: DadosProdutosMunicipio[] = [];

  municipiosMap.forEach(({ municipio, regional: reg }) => {
    const dadosMunicipio = calcularDadosProdutosFiltrado(
      dadosFiltrados,
      escolasData,
      (escola) => escola.municipio === municipio && escola.regional === reg
    );
    dados.push({
      ...dadosMunicipio,
      municipio,
      regional: reg,
    });
  });

  return dados.sort((a, b) => a.municipio.localeCompare(b.municipio));
}

/**
 * Calcula dados de produtos por escola
 */
export function calcularDadosProdutosEscolas(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: ProdutosProps["filtros"]
): DadosProdutosEscola[] {
  // Se há filtro de escola, não mostrar escolas (mostrar apenas card da escola)
  if (filtros?.escola) {
    return [];
  }

  // Se não há filtro de município, não mostrar escolas (mostrar municípios ou regionais)
  if (!filtros?.municipio) {
    return [];
  }

  // Aplicar filtros base
  const dadosFiltrados = filtrarDadosCicloGestao(
    cicloGestaoData,
    escolasData,
    filtros
  );

  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  const escolasFiltradas = escolasData.filter((e) =>
    escolaCorrespondeFiltros(e, filtrosNormalizados)
  );

  const dados: DadosProdutosEscola[] = [];

  escolasFiltradas.forEach((escola) => {
    const dadosEscola = calcularDadosProdutosFiltrado(
      dadosFiltrados,
      escolasData,
      (e) => e.id === escola.id
    );
    dados.push({
      ...dadosEscola,
      escola: escola.nome,
      municipio: escola.municipio,
      regional: escola.regional,
    });
  });

  return dados.sort((a, b) => a.escola.localeCompare(b.escola));
}

/**
 * Determina o nível de agregação baseado nos filtros
 */
export function determinarNivel(
  filtros?: ProdutosProps["filtros"]
): "estado" | "regional" | "municipio" | "escola" {
  if (filtros?.escola) return "escola";
  if (filtros?.municipio) return "municipio";
  if (filtros?.regional) return "regional";
  return "estado";
}

/**
 * Obtém o título do card baseado nos filtros
 */
export function obterTituloCard(
  filtros?: ProdutosProps["filtros"]
): string {
  if (filtros?.escola) return filtros.escola.label;
  if (filtros?.municipio) return filtros.municipio.label;
  if (filtros?.regional) return filtros.regional.label;
  return "Espírito Santo";
}

