/**
 * Hook customizado para carregar dados de indicadores (Eficácia)
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { getPublicPath } from "../../utils/pathUtils";
import type { IndicadorRow, EficaciaProps } from "../types/Eficacia.types";
import { normalizarFiltrosHierarquia } from "../utils/filtrosUtils";
import { ESTADO_PADRAO } from "../constants/shared.constants";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function aplicarFiltros(
  row: IndicadorRow,
  filtros?: EficaciaProps["filtros"]
): boolean {
  if (!filtros) return true;

  const filtrosNormalizados = normalizarFiltrosHierarquia(filtros);
  const { regionais, municipios, escolas } = filtrosNormalizados;

  // Aplicar filtros
  if (regionais.length > 0 && !regionais.includes(row.regional)) {
    return false;
  }

  if (municipios.length > 0 && !municipios.includes(row.municipio)) {
    return false;
  }

  if (escolas.length > 0) {
    const escolaCSV = row.escola_nome?.trim().toLowerCase() || "";
    if (!escolas.includes(escolaCSV)) {
      return false;
    }
  }

  return true;
}

export function useEficaciaData(filtros?: EficaciaProps["filtros"]) {
  const [dados, setDados] = useState<IndicadorRow[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const response = await fetch(getPublicPath("indicadores.csv"));

      if (!response.ok) {
        throw new Error(
          `Erro ao carregar CSV: ${response.status} ${response.statusText}`
        );
      }

      const csvContent = await response.text();
      const linhas = csvContent.split("\n").filter((l) => l.trim());
      const headers = parseCSVLine(linhas[0]);

      const dadosParseados: IndicadorRow[] = [];

      for (let i = 1; i < linhas.length; i++) {
        const valores = parseCSVLine(linhas[i]);

        if (valores.length !== headers.length) {
          continue;
        }

        const row: any = {};
        headers.forEach((header, index) => {
          let valor = valores[index]?.trim() || "";
          if (valor.startsWith('"') && valor.endsWith('"')) {
            valor = valor.slice(1, -1);
          }
          row[header.trim()] = valor;
        });

        if (!aplicarFiltros(row, filtros)) {
          continue;
        }

        // Preencher propriedades calculadas a partir dos indicadores
        const indicadorRow: IndicadorRow = {
          ...row,
          aulas_dadas: parseFloat(String(row.indicador_aulas_dadas || 0)),
          frequencia: parseFloat(String(row.indicador_frequencia || 0)),
          tarefas: parseFloat(String(row.indicador_tarefas || 0)),
          produtos: parseFloat(String(row.indicador_produtos || 0)),
          visitas_tecnicas: parseFloat(String(row.indicador_visitas_tecnicas || 0)),
        };

        dadosParseados.push(indicadorRow);
      }

      setDados(dadosParseados);
    } catch (error) {
      console.error("Erro ao carregar dados de eficácia:", error);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Função para agregar indicadores (média simples)
  const agregarIndicadores = useCallback((indicadores: IndicadorRow[]): IndicadorRow => {
    if (indicadores.length === 0) {
      return {} as IndicadorRow;
    }

    if (indicadores.length === 1) {
      return indicadores[0];
    }

    // Calcular médias dos indicadores
    const total = indicadores.length;
    const agregado: IndicadorRow = {
      ...indicadores[0],
      aulas_dadas: 0,
      frequencia: 0,
      tarefas: 0,
      produtos: 0,
      visitas_tecnicas: 0,
    };

    indicadores.forEach((ind) => {
      agregado.aulas_dadas! += parseFloat(String(ind.aulas_dadas || ind.indicador_aulas_dadas || 0)) / total;
      agregado.frequencia! += parseFloat(String(ind.frequencia || ind.indicador_frequencia || 0)) / total;
      agregado.tarefas! += parseFloat(String(ind.tarefas || ind.indicador_tarefas || 0)) / total;
      agregado.produtos! += parseFloat(String(ind.produtos || ind.indicador_produtos || 0)) / total;
      agregado.visitas_tecnicas! += parseFloat(String(ind.visitas_tecnicas || ind.indicador_visitas_tecnicas || 0)) / total;
    });

    return agregado;
  }, []);

  // Encontrar o indicador correspondente ao nível de filtro
  const indicadorAtual = useMemo(() => {
    if (!dados || dados.length === 0) return null;

    // Normalizar filtros para arrays
    const escolas = Array.isArray(filtros?.escola)
      ? filtros.escola
      : filtros?.escola
      ? [filtros.escola]
      : [];

    const municipios = Array.isArray(filtros?.municipio)
      ? filtros.municipio
      : filtros?.municipio
      ? [filtros.municipio]
      : [];

    const regionais = Array.isArray(filtros?.regional)
      ? filtros.regional
      : filtros?.regional
      ? [filtros.regional]
      : [];

    // Se há múltiplas escolas selecionadas, agregar
    if (escolas.length > 1) {
      const escolasFiltradas = dados.filter((d) => {
        const nome = (d.escola_nome || "").replace(/"/g, "").trim().toLowerCase();
        return escolas.some((e) => e.label?.trim().toLowerCase() === nome);
      });

      if (escolasFiltradas.length > 0) {
        return agregarIndicadores(escolasFiltradas);
      }
    }

    // Se há uma única escola, buscar por escola
    if (escolas.length === 1) {
      const escola = dados.find(
        (d) =>
          (d.escola_nome || "").replace(/"/g, "").trim().toLowerCase() ===
          escolas[0].label?.trim().toLowerCase()
      );
      if (escola) return escola;
    }

    // Se há múltiplos municípios selecionados, agregar
    if (municipios.length > 1) {
      const municipiosFiltrados = dados.filter((d) => {
        const municipio = (d.municipio || "").replace(/"/g, "").trim().toLowerCase();
        return municipios.some((m) => m.label?.trim().toLowerCase() === municipio) &&
          (!regionais.length || regionais.some((r) => 
            (d.regional || "").trim().toLowerCase() === r.label?.trim().toLowerCase()
          ));
      });

      if (municipiosFiltrados.length > 0) {
        return agregarIndicadores(municipiosFiltrados);
      }
    }

    // Se há um único município, buscar por município
    if (municipios.length === 1) {
      const municipio = dados.find(
        (d) =>
          (d.municipio || "").replace(/"/g, "").trim().toLowerCase() ===
          municipios[0].label?.trim().toLowerCase() &&
          (!regionais.length ||
            regionais.some((r) =>
              (d.regional || "").trim().toLowerCase() === r.label?.trim().toLowerCase()
            ))
      );
      if (municipio) return municipio;
    }

    // Se há múltiplas regionais selecionadas, agregar
    if (regionais.length > 1) {
      const regionaisFiltradas = dados.filter((d) => {
        const regional = (d.regional || "").trim().toLowerCase();
        return regionais.some((r) => r.label?.trim().toLowerCase() === regional) &&
          !d.municipio;
      });

      if (regionaisFiltradas.length > 0) {
        return agregarIndicadores(regionaisFiltradas);
      }
    }

    // Se há uma única regional, buscar por regional
    if (regionais.length === 1) {
      const regional = dados.find(
        (d) =>
          (d.regional || "").trim().toLowerCase() ===
          regionais[0].label?.trim().toLowerCase() && !d.municipio
      );
      if (regional) return regional;
    }

    // Estado (sem filtros ou filtro de estado)
    // Buscar registro onde escola_nome é o estado padrão e não tem escola_id
    const estado = dados.find((d) => {
      const nome = (d.escola_nome || "").replace(/"/g, "").trim();
      const id = (d.escola_id || "").trim();
      const municipio = (d.municipio || "").replace(/"/g, "").trim();
      return nome === ESTADO_PADRAO.label && id === "" && municipio === "";
    });
    if (estado) return estado;
    
    // Fallback: buscar qualquer registro sem escola_id e sem municipio
    return dados.find((d) => {
      const id = (d.escola_id || "").trim();
      const municipio = (d.municipio || "").replace(/"/g, "").trim();
      return id === "" && municipio === "";
    });
  }, [dados, filtros, agregarIndicadores]);

  return {
    dados,
    indicadorAtual,
    carregando,
  };
}

