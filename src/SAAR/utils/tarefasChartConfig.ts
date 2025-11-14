/**
 * Configuração do gráfico ApexCharts para Tarefas
 */

import type { DadosTarefas } from "../types/Tarefas.types";
import { CORES_STATUS } from "../constants/Tarefas.constants";

/**
 * Cria as opções de configuração do gráfico de colunas
 */
export function criarOpcoesGraficoColunas(dados: DadosTarefas) {
  const total = dados.total;

  const labels = [
    "Previstas",
    "Não Iniciadas",
    "Em Andamento",
    "Atrasadas",
    "Concluídas",
    "Concluídas com Atraso",
  ];

  const cores = [
    CORES_STATUS.previstas,
    CORES_STATUS.naoIniciadas,
    CORES_STATUS.emAndamento,
    CORES_STATUS.atrasadas,
    CORES_STATUS.concluidas,
    CORES_STATUS.concluidasAtraso,
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
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number | string) => {
        const valor = typeof val === "number" ? val : parseFloat(String(val));
        const percentage = total > 0 ? ((valor / total) * 100).toFixed(1) : "0.0";
        return `${valor} (${percentage}%)`;
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
        formatter: (val: number | string) => {
          const valor = typeof val === "number" ? val : parseFloat(String(val));
          const percentage = total > 0 ? ((valor / total) * 100).toFixed(2) : "0.00";
          return `${valor} tarefas (${percentage}%)`;
        },
      },
    },
  };
}

/**
 * Cria as séries do gráfico de colunas
 */
export function criarSeriesGraficoColunas(dados: DadosTarefas) {
  return [
    {
      name: "Tarefas",
      data: [
        dados.previstas,
        dados.naoIniciadas,
        dados.emAndamento,
        dados.atrasadas,
        dados.concluidas,
        dados.concluidasAtraso,
      ],
    },
  ];
}

// Manter funções antigas para compatibilidade (se necessário)
export function criarOpcoesGraficoRosca(dados: DadosTarefas) {
  return criarOpcoesGraficoColunas(dados);
}

export function criarSeriesGraficoRosca(dados: DadosTarefas) {
  return criarSeriesGraficoColunas(dados);
}

