/**
 * Configuração do gráfico ApexCharts Radar para Eficácia
 */

import type { ApexOptions } from "apexcharts";
import type { IndicadorRow } from "../types/Eficacia.types";

// Exportações

/**
 * Cria as opções de configuração do gráfico radar
 */
export function criarOpcoesGraficoRadar(indicador: IndicadorRow | null): ApexOptions {
  const categorias = [
    "Aulas Dadas",
    "Frequência",
    "Tarefas",
    "Produtos",
    "Visitas Técnicas",
  ];

  return {
    chart: {
      type: "radar" as const,
      height: 500,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: "#e9e9e9",
          fill: {
            colors: ["#f8f8f8", "#fff"],
          },
        },
      },
    },
    colors: ["#2196f3"],
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColor: "#2196f3",
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return `${val.toFixed(1)}%`;
        },
      },
    },
    xaxis: {
      categories: categorias,
      labels: {
        show: true,
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number, i: number) => {
          if (i % 2 === 0) {
            return `${val}%`;
          } else {
            return "";
          }
        },
        style: {
          fontSize: "11px",
        },
      },
    },
    fill: {
      opacity: 0.3,
    },
    stroke: {
      width: 2,
    },
    legend: {
      show: false,
    },
  };
}

/**
 * Cria as séries do gráfico radar
 */
export function criarSeriesGraficoRadar(
  indicador: IndicadorRow | null
): number[] {
  if (!indicador) {
    return [0, 0, 0, 0, 0];
  }

  return [
    parseFloat(indicador.indicador_aulas_dadas) || 0,
    parseFloat(indicador.indicador_frequencia) || 0,
    parseFloat(indicador.indicador_tarefas) || 0,
    parseFloat(indicador.indicador_produtos) || 0,
    parseFloat(indicador.indicador_visitas_tecnicas) || 0,
  ];
}

