/**
 * Configuração do gráfico ApexCharts para Visitas Técnicas
 */

import type { ApexOptions } from "apexcharts";
import type { DadosVisitasTecnicas, DadosVisitasTecnicasPorCiclo } from "../types/VisitasTecnicas.types";
import {
  COR_PLANEJAMENTO,
  COR_EXECUCAO,
  COR_SAAR,
  COR_CORRECAO_ROTAS,
  COR_BALANCO_FINAL,
  COR_LINHA_ESPERADAS,
  COR_CICLO_I,
  COR_CICLO_II,
  COR_CICLO_III,
} from "../constants/VisitasTecnicas.constants";

/**
 * Obtém a cor das colunas baseada no número do ciclo
 */
function obterCorCiclo(ciclo: number): string {
  switch (ciclo) {
    case 1:
      return COR_CICLO_I; // Azul
    case 2:
      return COR_CICLO_II; // Laranja
    case 3:
      return COR_CICLO_III; // Roxo/Violeta
    default:
      return COR_CICLO_I; // Azul como padrão
  }
}

/**
 * Cria as opções de configuração do gráfico de colunas
 */
export function criarOpcoesGraficoColunas(dados: DadosVisitasTecnicas) {
  const valores = [
    dados.totalEsperadas,
    dados.totalAtasAssinadas,
  ];

  const labels = [
    "Esperadas",
    "Atas Assinadas",
  ];

  const cores = [
    "#64748b", // Cinza azulado para Esperadas
    "#10b981", // Verde esmeralda para Atas Assinadas
  ];

  return {
    chart: {
      type: "bar" as const,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
        columnWidth: "50%",
        distributed: true,
        stroke: {
          width: 0,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        const valor = typeof val === "number" ? val : parseFloat(val.toString());
        return valor.toString();
      },
      offsetY: -20,
      style: {
        fontSize: "11px",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: labels,
      title: {
        text: "Status",
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
        text: "Quantidade",
      },
      min: 0,
    },
    fill: {
      opacity: 1,
    },
    colors: cores,
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          const valor = typeof val === "number" ? val : parseFloat(val.toString());
          return `${valor} visitas`;
        },
      },
    },
  };
}

/**
 * Cria as séries do gráfico de colunas
 */
export function criarSeriesGraficoColunas(dados: DadosVisitasTecnicas) {
  return [
    {
      name: "Visitas Técnicas",
      data: [
        dados.totalEsperadas,
        dados.totalAtasAssinadas,
      ],
    },
  ];
}

/**
 * Cria as opções de configuração do gráfico combinado (line + bar) para um ciclo
 */
export function criarOpcoesGraficoCombinadoPorCiclo(
  dadosCiclo: DadosVisitasTecnicasPorCiclo
): ApexOptions {
  if (!dadosCiclo.porEtapa || dadosCiclo.porEtapa.length === 0) {
    return {
      chart: { type: "line" as const, toolbar: { show: false } },
      xaxis: { categories: [] },
      yaxis: { min: 0 },
    };
  }

  const etapas = dadosCiclo.porEtapa.map((e) => e.etapa);

  return {
    chart: {
      type: "line" as const,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
        columnWidth: "50%",
        distributed: false,
        stroke: {
          width: 0,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        const valor = typeof val === "number" ? val : parseFloat(val.toString());
        return valor > 0 ? valor.toString() : "";
      },
      offsetY: -20,
      style: {
        fontSize: "11px",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: etapas,
      title: {
        text: "Etapas",
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
        text: "Quantidade",
      },
      min: 0,
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontSize: "12px",
      itemMargin: {
        horizontal: 20,
        vertical: 5,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          const valor = typeof val === "number" ? val : parseFloat(val.toString());
          return `${valor} visitas`;
        },
      },
    },
  };
}

/**
 * Cria as séries do gráfico combinado (line + bar) para um ciclo
 */
export function criarSeriesGraficoCombinadoPorCiclo(
  dadosCiclo: DadosVisitasTecnicasPorCiclo
) {
  if (!dadosCiclo.porEtapa || dadosCiclo.porEtapa.length === 0) {
    const corColunas = obterCorCiclo(dadosCiclo.ciclo);
    return [
      { 
        name: "Visitas Técnicas Esperadas para cada etapa", 
        type: "line", 
        data: [],
        color: COR_LINHA_ESPERADAS,
      },
      { 
        name: "Atas das Visitas Técnicas registradas", 
        type: "column", 
        data: [],
        color: corColunas,
      },
    ];
  }

  // Todas as colunas do ciclo terão a mesma cor
  const corColunas = obterCorCiclo(dadosCiclo.ciclo);

  return [
    {
      name: "Visitas Técnicas Esperadas para cada etapa",
      type: "line",
      data: dadosCiclo.porEtapa.map((e) => e.esperadas),
      color: COR_LINHA_ESPERADAS,
    },
    {
      name: "Atas das Visitas Técnicas registradas",
      type: "column",
      data: dadosCiclo.porEtapa.map((e) => e.atasAssinadas),
      color: corColunas,
    },
  ];
}

