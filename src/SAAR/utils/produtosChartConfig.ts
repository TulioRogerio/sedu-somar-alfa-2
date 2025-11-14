/**
 * Configuração do gráfico ApexCharts para Produtos
 */

import type { DadosProdutos } from "../types/Produtos.types";
import { CORES_FAIXAS } from "../constants/Produtos.constants";

/**
 * Cria as opções de configuração do gráfico donut
 */
export function criarOpcoesGraficoRosca(dados: DadosProdutos) {
  const total = dados.total;
  const valores = [
    dados.faixa0_25,
    dados.faixa26_50,
    dados.faixa51_75,
    dados.faixa76_100,
  ];

  const labels = [
    "0 à 25% concluído",
    "26 a 50% concluído",
    "51 a 75% concluído",
    "76 a 100% concluído",
  ];

  // Criar labels com percentuais
  const labelsComPercentuais = labels.map((label, index) => {
    const value = valores[index];
    const percentage =
      total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
    return `${label}: ${percentage}%`;
  });

  return {
    chart: {
      type: "donut" as const,
      toolbar: {
        show: false,
      },
    },
    labels: labelsComPercentuais,
    colors: [
      CORES_FAIXAS["0-25"],
      CORES_FAIXAS["26-50"],
      CORES_FAIXAS["51-75"],
      CORES_FAIXAS["76-100"],
    ],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: function (_val: number, opts: any) {
        // Mostrar label apenas se o valor for maior que 5% do total
        const value = valores[opts.seriesIndex];
        const percentage = total > 0 ? (value / total) * 100 : 0;
        if (percentage >= 5) {
          return `${percentage.toFixed(1)}%`;
        }
        return "";
      },
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
      dropShadow: {
        enabled: true,
        color: "#000",
        opacity: 0.5,
        blur: 2,
      },
    },
    tooltip: {
      y: {
        formatter: function (_val: number, opts: any) {
          const value = valores[opts.seriesIndex];
          const percentage =
            total > 0 ? ((value / total) * 100).toFixed(2) : "0";
          return `${value} (${percentage}%)`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: function () {
                return total.toString();
              },
              fontSize: "16px",
              fontWeight: 600,
              color: "#495057",
            },
          },
        },
      },
    },
  };
}

/**
 * Cria as séries do gráfico (valores das faixas)
 */
export function criarSeriesGraficoRosca(dados: DadosProdutos): number[] {
  return [
    dados.faixa0_25,
    dados.faixa26_50,
    dados.faixa51_75,
    dados.faixa76_100,
  ];
}

/**
 * Cria as opções de configuração do gráfico de colunas
 */
export function criarOpcoesGraficoColunas(dados: DadosProdutos) {
  const total = dados.total;

  const labels = [
    "0 à 25% concluído",
    "26 a 50% concluído",
    "51 a 75% concluído",
    "76 a 100% concluído",
  ];

  const cores = [
    CORES_FAIXAS["0-25"],
    CORES_FAIXAS["26-50"],
    CORES_FAIXAS["51-75"],
    CORES_FAIXAS["76-100"],
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
        text: "Faixas de Conclusão",
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
          return `${valor} produtos (${percentage}%)`;
        },
      },
    },
  };
}

/**
 * Cria as séries do gráfico de colunas
 */
export function criarSeriesGraficoColunas(dados: DadosProdutos) {
  return [
    {
      name: "Produtos",
      data: [
        dados.faixa0_25,
        dados.faixa26_50,
        dados.faixa51_75,
        dados.faixa76_100,
      ],
    },
  ];
}

