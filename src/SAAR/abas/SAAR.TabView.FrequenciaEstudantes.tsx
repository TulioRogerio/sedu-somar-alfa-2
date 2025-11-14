import { useState, useEffect, useMemo } from "react";
import { Card } from "primereact/card";
import { MultiSelect } from "primereact/multiselect";
import { Slider } from "primereact/slider";
import { Skeleton } from "primereact/skeleton";
import { useFrequenciaEstudantesData } from "../hooks/useFrequenciaEstudantesData";
import { useApexChart } from "../hooks/useApexChart";
import {
  calcularIndicadorFrequencia,
  calcularTotalAlunos,
  agruparDadosPorData,
} from "../utils/frequenciaEstudantesCalculations";
import {
  criarOpcoesGrafico,
  criarSeriesGrafico,
} from "../utils/frequenciaEstudantesChartConfig";
import type { FrequenciaEstudantesProps } from "../types/FrequenciaEstudantes.types";
import "./SAAR.TabView.FrequenciaEstudantes.css";

export default function SAARTabViewFrequenciaEstudantes({
  filtros,
}: FrequenciaEstudantesProps) {
  const { dados, carregando } = useFrequenciaEstudantesData(filtros);
  const Chart = useApexChart();

  // Obter todas as séries disponíveis
  const todasSeries = useMemo(() => {
    const seriesSet = new Set<string>();
    dados.forEach((row) => {
      if (row.serie) {
        seriesSet.add(row.serie);
      }
    });
    return Array.from(seriesSet).sort();
  }, [dados]);

  // Opções de séries para o MultiSelect
  const opcoesSeries = useMemo(() => {
    return todasSeries.map((serie) => ({
      label: serie,
      value: serie,
    }));
  }, [todasSeries]);

  // Estado para séries selecionadas (inicialmente apenas 2º Ano)
  const [seriesSelecionadas, setSeriesSelecionadas] = useState<string[]>([]);

  // Calcular total de dias letivos disponíveis (fevereiro + março)
  const totalDiasLetivos = useMemo(() => {
    const getDiasUteis = (ano: number, mes: number): number => {
      let count = 0;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      for (let dia = 1; dia <= ultimoDia; dia++) {
        const data = new Date(ano, mes - 1, dia);
        const diaSemana = data.getDay();
        if (diaSemana > 0 && diaSemana < 6) {
          count++;
        }
      }
      return count;
    };
    return getDiasUteis(2025, 2) + getDiasUteis(2025, 3);
  }, []);

  // Estado para range de dias letivos selecionado (padrão: todos os dias)
  const [rangeDiasLetivos, setRangeDiasLetivos] = useState<[number, number]>([
    1,
    totalDiasLetivos,
  ]);

  // Atualizar range quando totalDiasLetivos mudar
  useEffect(() => {
    if (totalDiasLetivos > 0) {
      setRangeDiasLetivos([1, totalDiasLetivos]);
    }
  }, [totalDiasLetivos]);

  // Atualizar séries selecionadas quando todasSeries mudar (padrão: apenas 2º Ano)
  useEffect(() => {
    if (todasSeries.length > 0 && seriesSelecionadas.length === 0) {
      // Selecionar apenas "2º Ano" por padrão
      const serie2Ano = todasSeries.find((s) => s === "2º Ano");
      if (serie2Ano) {
        setSeriesSelecionadas([serie2Ano]);
      } else {
        // Se não encontrar "2º Ano", usar a primeira série disponível
        setSeriesSelecionadas([todasSeries[0]]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todasSeries]);

  // Filtrar dados por séries selecionadas e período
  const dadosFiltrados = useMemo(() => {
    let dadosFiltrados = dados;

    // Filtrar por séries
    if (seriesSelecionadas.length > 0) {
      dadosFiltrados = dadosFiltrados.filter((row) =>
        seriesSelecionadas.includes(row.serie)
      );
    }

    // Filtrar por range de dias letivos
    dadosFiltrados = dadosFiltrados.filter((row) => {
      let diaLetivo: number | null = null;

      // Prioridade 1: usar dia_letivo se disponível
      if (row.dia_letivo) {
        diaLetivo = row.dia_letivo;
      }
      // Prioridade 2: usar data para calcular dia letivo
      else if (row.data) {
        // Calcular qual dia letivo é baseado na data
        const dataRow = new Date(row.data);
        const getDiasUteis = (ano: number, mes: number): Date[] => {
          const dias: Date[] = [];
          const ultimoDia = new Date(ano, mes, 0).getDate();
          for (let dia = 1; dia <= ultimoDia; dia++) {
            const data = new Date(ano, mes - 1, dia);
            const diaSemana = data.getDay();
            if (diaSemana > 0 && diaSemana < 6) {
              dias.push(data);
            }
          }
          return dias;
        };
        const diasFev = getDiasUteis(2025, 2);
        const diasMar = getDiasUteis(2025, 3);
        const todosDias = [...diasFev, ...diasMar];
        const indice = todosDias.findIndex(
          (d) =>
            d.getFullYear() === dataRow.getFullYear() &&
            d.getMonth() === dataRow.getMonth() &&
            d.getDate() === dataRow.getDate()
        );
        if (indice >= 0) {
          diaLetivo = indice + 1; // Converter para 1-based
        }
      }
      // Prioridade 3: usar dias_do_mes como aproximação
      else {
        // Assumir que dias <= 20 são fevereiro, > 20 são março
        if (row.dias_do_mes <= 20) {
          diaLetivo = row.dias_do_mes; // Aproximação
        } else {
          const diasFev = 20; // Aproximação
          diaLetivo = diasFev + (row.dias_do_mes - 20);
        }
      }

      // Se não conseguiu determinar o dia letivo, incluir no filtro
      if (diaLetivo === null) {
        return true;
      }

      // Verificar se está dentro do range selecionado
      return diaLetivo >= rangeDiasLetivos[0] && diaLetivo <= rangeDiasLetivos[1];
    });

    return dadosFiltrados;
  }, [dados, seriesSelecionadas, rangeDiasLetivos]);

  // Calcular indicador de frequência
  const indicadorFrequencia = useMemo(
    () => calcularIndicadorFrequencia(dadosFiltrados),
    [dadosFiltrados]
  );

  // Calcular total de alunos únicos
  const totalAlunos = useMemo(
    () => calcularTotalAlunos(dadosFiltrados),
    [dadosFiltrados]
  );

  // Agrupar dados por data com frequência acumulada
  const dadosPorData = useMemo(() => {
    return agruparDadosPorData(dadosFiltrados, 2, 2025);
  }, [dadosFiltrados]);

  // Configuração do gráfico
  const opcoesGrafico = useMemo(
    () => criarOpcoesGrafico(dadosPorData),
    [dadosPorData]
  );

  const seriesGrafico = useMemo(
    () => criarSeriesGrafico(dadosPorData),
    [dadosPorData]
  );

  if (carregando) {
    return (
      <div className="saar-tab-content">
        <Card>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Skeleton width="100%" height="2rem" />
            <Skeleton width="60%" height="2rem" style={{ marginTop: "1rem" }} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="saar-frequencia-estudantes">
      <div className="saar-frequencia-estudantes-left">
        {/* Card de Indicadores */}
        <Card
          title="Indicador"
          className="saar-card-indicador"
        >
          <div className="saar-card-content">
            <div className="saar-indicador-item">
              <div className="saar-indicador-valor">
                {indicadorFrequencia.toFixed(2)}%
              </div>
              <div className="saar-indicador-label">Frequência</div>
            </div>
            <div className="saar-indicador-item" style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e9ecef" }}>
              <div className="saar-indicador-valor" style={{ fontSize: "1.5rem", color: "#495057" }}>
                {totalAlunos.toLocaleString("pt-BR")}
              </div>
              <div className="saar-indicador-label">Alunos</div>
            </div>
          </div>
        </Card>

        {/* Card de Filtros */}
        <Card
          title="Filtros"
          className="saar-card-filtros"
        >
          <div className="saar-card-content">
            <div className="saar-grafico-header">
              <div className="saar-filtro-disciplinas">
                <label htmlFor="periodo-slider" className="saar-filtro-label">
                  Período (Dias Letivos: {rangeDiasLetivos[0]} - {rangeDiasLetivos[1]})
                </label>
                <Slider
                  id="periodo-slider"
                  value={rangeDiasLetivos}
                  onChange={(e) => setRangeDiasLetivos(e.value as [number, number])}
                  range
                  min={1}
                  max={totalDiasLetivos}
                  className="saar-slider"
                />
              </div>
              <div className="saar-filtro-disciplinas">
                <label htmlFor="series-select" className="saar-filtro-label">
                  Séries
                </label>
                <MultiSelect
                  id="series-select"
                  value={seriesSelecionadas}
                  options={opcoesSeries}
                  onChange={(e) => {
                    const valores = e.value || [];
                    // Garantir que pelo menos uma série esteja selecionada
                    if (valores.length > 0) {
                      setSeriesSelecionadas(valores);
                    }
                  }}
                  placeholder="Selecione as séries"
                  display="chip"
                  className="saar-multiselect"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="saar-frequencia-estudantes-right">
        <div className="saar-frequencia-estudantes-grafico">
          <Card className="saar-grafico-container">
            {!Chart ? (
              <div className="saar-grafico-vazio">
                <Skeleton width="100%" height="400px" />
              </div>
            ) : dadosPorData.length > 0 ? (
              <Chart
                options={opcoesGrafico}
                series={seriesGrafico}
                type="bar"
                height={400}
                width="100%"
              />
            ) : (
              <div className="saar-grafico-vazio">
                <p>Nenhum dado disponível para os filtros selecionados</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

