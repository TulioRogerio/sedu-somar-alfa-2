import { useState, useEffect, useMemo } from "react";
import { Card } from "primereact/card";
import { MultiSelect } from "primereact/multiselect";
import { Skeleton } from "primereact/skeleton";
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
  >(() => {
    // Garantir que apenas as disciplinas disponíveis sejam selecionadas
    const disciplinasDisponiveis = DISCIPLINAS.map((d) => d.value);
    return disciplinasDisponiveis;
  });

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

  // Garantir que apenas disciplinas válidas estejam selecionadas
  useEffect(() => {
    const disciplinasValidas = DISCIPLINAS.map((d) => d.value);
    const disciplinasFiltradas = disciplinasSelecionadas.filter((d) =>
      disciplinasValidas.includes(d)
    );
    if (disciplinasFiltradas.length !== disciplinasSelecionadas.length) {
      setDisciplinasSelecionadas(
        disciplinasFiltradas.length > 0
          ? disciplinasFiltradas
          : disciplinasValidas
      );
    }
  }, [disciplinasSelecionadas]);

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
    <div className="saar-aulas-dadas">
      <div className="saar-aulas-dadas-left">
        {/* Card de Indicadores */}
        <Card
          title="Indicador"
          className="saar-card-indicador"
        >
          <div className="saar-card-content">
            <div className="saar-indicador-item">
              <div className="saar-indicador-valor">
                {indicadorAula.toFixed(2)}%
              </div>
              <div className="saar-indicador-label">Aulas Dadas</div>
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
                    // Filtrar apenas disciplinas válidas (LP e Mat)
                    const disciplinasValidas = DISCIPLINAS.map((d) => d.value);
                    const valoresFiltrados = valores.filter((v: string) =>
                      disciplinasValidas.includes(v)
                    );
                    // Garantir que pelo menos uma disciplina esteja selecionada
                    if (valoresFiltrados.length > 0) {
                      setDisciplinasSelecionadas(valoresFiltrados);
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
        </Card>
      </div>

      <div className="saar-aulas-dadas-right">
        <div className="saar-aulas-dadas-grafico">
          <Card className="saar-grafico-container">
            {!Chart ? (
              <div className="saar-grafico-vazio">
                <Skeleton width="100%" height="400px" />
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
          </Card>
        </div>
      </div>
    </div>
  );
}
