import { useState, useEffect, useMemo } from "react";
import { MultiSelect } from "primereact/multiselect";
import { useAulasDadasData } from "../hooks/useAulasDadasData";
import { useApexChart } from "../hooks/useApexChart";
import {
  calcularIndicadorAula,
  agruparDadosPorTurma,
} from "../utils/aulasDadasCalculations";
import {
  criarOpcoesGrafico,
  criarSeriesGrafico,
} from "../utils/aulasDadasChartConfig";
import { DISCIPLINAS } from "../constants/AulasDadas.constants";
import type { AulasDadasProps } from "../types/AulasDadas.types";
import "./SAAR.TabView.AulasDadas.css";

export default function SAARTabViewAulasDadas({ filtros }: AulasDadasProps) {
  const { dados, carregando } = useAulasDadasData(filtros);
  const Chart = useApexChart();
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<
    string[]
  >(DISCIPLINAS.map((d) => d.value));

  // Obter todas as turmas disponíveis e criar opções para o MultiSelect
  const todasTurmas = useMemo(() => {
    const turmasSet = new Set<string>();
    dados.forEach((row) => {
      turmasSet.add(row.turma);
    });
    return Array.from(turmasSet);
  }, [dados]);

  // Opções de séries para o MultiSelect
  const opcoesSeries = useMemo(() => {
    return todasTurmas.map((turma) => ({
      label: turma,
      value: turma,
    }));
  }, [todasTurmas]);

  // Estado para séries selecionadas (inicialmente todas)
  const [seriesSelecionadas, setSeriesSelecionadas] = useState<string[]>([]);

  // Atualizar séries selecionadas quando todasTurmas mudar (apenas na primeira vez)
  useEffect(() => {
    if (todasTurmas.length > 0 && seriesSelecionadas.length === 0) {
      setSeriesSelecionadas([...todasTurmas]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todasTurmas]);

  // Calcular indicador de aula
  const indicadorAula = useMemo(() => calcularIndicadorAula(dados), [dados]);

  // Agrupar dados por turma com percentuais
  const dadosPorTurma = useMemo(
    () => agruparDadosPorTurma(dados, seriesSelecionadas),
    [dados, seriesSelecionadas]
  );

  // Configuração do gráfico
  const opcoesGrafico = useMemo(
    () => criarOpcoesGrafico(dadosPorTurma, disciplinasSelecionadas),
    [dadosPorTurma, disciplinasSelecionadas]
  );

  const seriesGrafico = useMemo(
    () => criarSeriesGrafico(dadosPorTurma, disciplinasSelecionadas),
    [dadosPorTurma, disciplinasSelecionadas]
  );

  if (carregando) {
    return (
      <div className="saar-tab-content">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="saar-aulas-dadas">
      <div className="saar-aulas-dadas-left">
        {/* Card de Indicadores */}
        <div className="saar-card-indicador">
          <div className="saar-card-header">
            <h3 className="saar-card-title">Indicador</h3>
          </div>
          <div className="saar-card-content">
            <div className="saar-indicador-item">
              <div className="saar-indicador-valor">
                {indicadorAula.toFixed(2)}%
              </div>
              <div className="saar-indicador-label">Aulas Dadas</div>
            </div>
          </div>
        </div>

        {/* Card de Filtros */}
        <div className="saar-card-filtros">
          <div className="saar-card-header">
            <h3 className="saar-card-title">Filtros</h3>
          </div>
          <div className="saar-card-content">
            <div className="saar-grafico-header">
              <div className="saar-filtro-disciplinas">
                <label
                  htmlFor="disciplinas-select"
                  className="saar-filtro-label"
                >
                  Disciplinas
                </label>
                <MultiSelect
                  id="disciplinas-select"
                  value={disciplinasSelecionadas}
                  options={DISCIPLINAS}
                  onChange={(e) => {
                    const valores = e.value || [];
                    // Garantir que pelo menos uma disciplina esteja selecionada
                    if (valores.length > 0) {
                      setDisciplinasSelecionadas(valores);
                    }
                  }}
                  placeholder="Selecione as disciplinas"
                  display="chip"
                  className="saar-multiselect"
                  style={{ width: "100%" }}
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
        </div>
      </div>

      <div className="saar-aulas-dadas-right">
        <div className="saar-aulas-dadas-grafico">
          <div className="saar-grafico-container">
            {carregando ? (
              <div className="saar-grafico-vazio">
                <p>Carregando dados...</p>
              </div>
            ) : !Chart ? (
              <div className="saar-grafico-vazio">
                <p>Carregando gráfico...</p>
              </div>
            ) : Object.keys(dadosPorTurma).length > 0 ? (
              <Chart
                options={opcoesGrafico}
                series={seriesGrafico}
                type="bar"
                height={Math.max(400, Object.keys(dadosPorTurma).length * 80)}
              />
            ) : (
              <div className="saar-grafico-vazio">
                <p>Nenhum dado disponível para os filtros selecionados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
