/**
 * Utilitários para parsing e processamento de dados de Produtos
 */

import type { ProdutosProps } from "../types/Produtos.types";
import type { CicloGestaoRow } from "../../types/CicloGestao";
import type { Escola } from "../../types/Escola";

/**
 * Aplica filtros do SAAR aos dados
 */
export function aplicarFiltrosProdutos(
  escola: Escola,
  filtros?: ProdutosProps["filtros"]
): boolean {
  if (!filtros) return true;

  if (filtros.estado && escola.regional) {
    // Assumindo que todas as escolas são do Espírito Santo
    // Se houver filtro de estado, pode ser aplicado aqui
  }

  if (filtros.regional && escola.regional !== filtros.regional.label) {
    return false;
  }

  if (filtros.municipio && escola.municipio !== filtros.municipio.label) {
    return false;
  }

  if (filtros.escola) {
    const escolaCSV = escola.nome?.trim().toLowerCase() || "";
    const escolaFiltro = filtros.escola.label?.trim().toLowerCase() || "";
    if (escolaCSV !== escolaFiltro) {
      return false;
    }
  }

  return true;
}

/**
 * Filtra dados do ciclo-gestao baseado nos filtros do SAAR
 */
export function filtrarDadosCicloGestao(
  cicloGestaoData: CicloGestaoRow[],
  escolasData: Escola[],
  filtros?: ProdutosProps["filtros"]
): CicloGestaoRow[] {
  // Se não há filtros, retornar todos os dados (Espírito Santo)
  if (!filtros || Object.keys(filtros).length === 0) {
    return cicloGestaoData;
  }

  // Criar mapa de escolas filtradas
  const escolasFiltradas = escolasData.filter((escola) =>
    aplicarFiltrosProdutos(escola, filtros)
  );

  const escolaIds = new Set(
    escolasFiltradas.map((e) => e.id.toString())
  );

  // Filtrar dados do ciclo-gestao que pertencem às escolas filtradas
  return cicloGestaoData.filter((row) => escolaIds.has(row.escola_id));
}

