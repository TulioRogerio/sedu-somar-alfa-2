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
        columnWidth: "60%",
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
        rotate: -45,
        rotateAlways: false,
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
      custom: (opts: any) => {
        const { seriesIndex, dataPointIndex, w } = opts;
        const turma = turmas[dataPointIndex];
        const serie = w.globals.seriesNames[seriesIndex];
        const percentual = w.globals.series[seriesIndex][dataPointIndex];
        
        // Identificar qual disciplina baseado no nome da série
        const disciplina = DISCIPLINAS.find((d) => d.label === serie);
        if (!disciplina || !dadosPorTurma[turma]) {
          return "";
        }
        
        const dadosTurma = dadosPorTurma[turma];
        let previstas = 0;
        let dadas = 0;
        
        switch (disciplina.value) {
          case "LP":
            previstas = dadosTurma.previstas_LP;
            dadas = dadosTurma.dadas_LP;
            break;
          case "Mat":
            previstas = dadosTurma.previstas_Mat;
            dadas = dadosTurma.dadas_Mat;
            break;
        }
        
        return `
          <div style="padding: 10px;">
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">
              ${serie} - ${turma}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="font-weight: 500;">Percentual: </span>
              <span>${percentual.toFixed(1)}%</span>
            </div>
            <div style="margin-bottom: 4px;">
              <span style="font-weight: 500;">Aulas Previstas: </span>
              <span>${previstas}</span>
            </div>
            <div>
              <span style="font-weight: 500;">Aulas Dadas: </span>
              <span>${dadas}</span>
            </div>
          </div>
        `;
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
        default:
          data = [];
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

