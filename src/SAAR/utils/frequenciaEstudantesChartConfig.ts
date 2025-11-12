/**
 * Configuração do gráfico ApexCharts para Frequência dos Estudantes
 */

import type { DadosFrequenciaPorData } from "../types/FrequenciaEstudantes.types";

/**
 * Cria as opções de configuração do gráfico de linha
 */
export function criarOpcoesGrafico(
  dadosPorData: DadosFrequenciaPorData[]
) {
  const datas = dadosPorData.map((d) => {
    // Formatar data para exibição (DD/MM)
    const date = new Date(d.data);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}`;
  });

  return {
    chart: {
      type: "line" as const,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: datas,
      title: {
        text: "Data",
      },
      labels: {
        style: {
          fontSize: "11px",
        },
        rotate: -45,
        rotateAlways: false,
      },
    },
    yaxis: {
      title: {
        text: "Frequência (%)",
      },
      min: 0,
      max: 100,
      labels: {
        formatter: (val: number) => {
          return `${val.toFixed(1)}%`;
        },
      },
    },
    colors: ["#2196f3"], // Azul para a linha
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return `${val.toFixed(1)}%`;
        },
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 4,
    },
  };
}

/**
 * Cria as séries do gráfico (frequência percentual)
 */
export function criarSeriesGrafico(
  dadosPorData: DadosFrequenciaPorData[]
) {
  const frequencias = dadosPorData.map((d) => d.percentualPresenca);

  return [
    {
      name: "Frequência",
      data: frequencias,
    },
  ];
}

