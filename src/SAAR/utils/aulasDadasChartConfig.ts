/**
 * Configuração do gráfico ApexCharts para Aulas Dadas
 */

import type { DadosPorTurma } from "../types/AulasDadas.types";
import { DISCIPLINAS, CORES_DISCIPLINAS } from "../constants/AulasDadas.constants";

/**
 * Cria as opções de configuração do gráfico
 */
export function criarOpcoesGrafico(
  dadosPorTurma: Record<string, DadosPorTurma>,
  disciplinasSelecionadas: string[]
) {
  const turmas = Object.keys(dadosPorTurma);

  // Calcular cores baseado nas disciplinas selecionadas (na ordem correta)
  const cores = DISCIPLINAS.filter((d) =>
    disciplinasSelecionadas.includes(d.value)
  ).map((d) => CORES_DISCIPLINAS[d.value]);

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
        columnWidth: "35%",
        barHeight: "70%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        const valor = typeof val === "number" ? val : parseFloat(val);
        return `${valor.toFixed(1)}%`;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: turmas,
      title: {
        text: "Série",
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
      tickAmount: turmas.length,
    },
    yaxis: {
      title: {
        text: "Percentual (%)",
      },
      min: 0,
      max: 100,
    },
    fill: {
      opacity: 1,
    },
    colors: cores,
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          const valor = typeof val === "number" ? val : parseFloat(val);
          return `${valor.toFixed(1)}%`;
        },
      },
    },
  };
}

/**
 * Cria as séries do gráfico
 */
export function criarSeriesGrafico(
  dadosPorTurma: Record<string, DadosPorTurma>,
  disciplinasSelecionadas: string[]
) {
  const turmas = Object.keys(dadosPorTurma);
  const series: any[] = [];

  // Adicionar séries na ordem definida em DISCIPLINAS para manter consistência com as cores
  DISCIPLINAS.forEach((disciplina) => {
    if (disciplinasSelecionadas.includes(disciplina.value)) {
      let data: number[] = [];
      switch (disciplina.value) {
        case "LP":
          data = turmas.map((turma) => dadosPorTurma[turma].percentual_LP);
          break;
        case "Mat":
          data = turmas.map((turma) => dadosPorTurma[turma].percentual_Mat);
          break;
        case "Ciencias":
          data = turmas.map(
            (turma) => dadosPorTurma[turma].percentual_Ciencias
          );
          break;
        case "Historia":
          data = turmas.map(
            (turma) => dadosPorTurma[turma].percentual_Historia
          );
          break;
        case "Geografia":
          data = turmas.map(
            (turma) => dadosPorTurma[turma].percentual_Geografia
          );
          break;
      }
      series.push({
        name: disciplina.label,
        data: data,
      });
    }
  });

  return series;
}

