/**
 * Configuração do gráfico ApexCharts Radar para Proficiência
 * Valores na escala de 0-1000 (proficiência)
 */

import type { ApexOptions } from "apexcharts";

/**
 * Cria as opções de configuração do gráfico radar para proficiência
 */
export function criarOpcoesGraficoRadarProficiencia(): ApexOptions {
  const categorias = [
    "Língua Portuguesa",
    "Matemática",
    "Leitura",
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
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return `${val.toFixed(0)}`;
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
      min: 0,
      max: 1000,
      labels: {
        formatter: (val: number, i: number) => {
          if (i % 2 === 0) {
            return `${val}`;
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
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontSize: "12px",
    },
  };
}

/**
 * Gera valores mockados de proficiência em Língua Portuguesa na faixa de 700±150
 */
export function gerarValoresMockadosProficienciaLP(): number[] {
  // Valores fixos na faixa de 550 a 850 (700 ± 150) para LP
  return [720, 680, 750, 650, 710];
}

/**
 * Gera valores mockados de proficiência em Matemática na faixa de 700±150
 */
export function gerarValoresMockadosProficienciaMat(): number[] {
  // Valores fixos na faixa de 550 a 850 (700 ± 150) para Matemática
  return [690, 730, 670, 760, 680];
}

/**
 * Gera valores mockados de proficiência em Leitura na faixa de 700±150
 */
export function gerarValoresMockadosProficienciaLeitura(): number[] {
  // Valores fixos na faixa de 550 a 850 (700 ± 150) para Leitura
  return [710, 750, 690, 720, 740];
}

