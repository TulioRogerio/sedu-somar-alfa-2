import { useState, useMemo } from "react";
import { Card } from "primereact/card";
import { MultiSelect } from "primereact/multiselect";
import { useVisitasTecnicasData } from "../hooks/useVisitasTecnicasData";
import {
  formatarNumero,
  obterTituloCard,
} from "../utils/visitasTecnicasCalculations";
import {
  criarOpcoesGraficoCombinadoPorCiclo,
  criarSeriesGraficoCombinadoPorCiclo,
} from "../utils/visitasTecnicasChartConfig";
import { CICLOS } from "../constants/VisitasTecnicas.constants";
import {
  SAARCardIndicador,
  SAARChartContainer,
  SAARLoadingState,
  SAAREmptyState,
} from "../components";
import type { VisitasTecnicasProps } from "../types/VisitasTecnicas.types";
import "./SAAR.TabView.VisitasTecnicas.css";

export default function SAARTabViewVisitasTecnicas({
  filtros,
}: VisitasTecnicasProps) {
  const { dadosAgregados, carregando } = useVisitasTecnicasData(filtros);
  const [ciclosSelecionados, setCiclosSelecionados] = useState<number[]>(
    CICLOS.map((c) => c.value)
  );

  const tituloCard = useMemo(() => obterTituloCard(filtros), [filtros]);

  // Filtrar ciclos selecionados e preparar gráficos
  const ciclosParaExibir = useMemo(() => {
    if (!dadosAgregados || !dadosAgregados.porCiclo) return [];
    return dadosAgregados.porCiclo.filter((ciclo) =>
      ciclosSelecionados.includes(ciclo.ciclo)
    );
  }, [dadosAgregados, ciclosSelecionados]);

  if (carregando) {
    return <SAARLoadingState />;
  }

  if (!dadosAgregados) {
    return <SAAREmptyState message="Nenhum ciclo selecionado ou dados disponíveis" />;
  }

  return (
    <div className="saar-visitas-tecnicas">
      <div className="saar-visitas-tecnicas-left">
        {/* Card de Indicadores */}
        <SAARCardIndicador
          valor={dadosAgregados.percentualAtasAssinadas}
          label="Visitas Técnicas"
          detalhes={{
            numero: formatarNumero(dadosAgregados.totalAtasAssinadas),
            texto: `de ${formatarNumero(dadosAgregados.totalEsperadas)} esperadas`,
          }}
        />

        {/* Card de Filtros */}
        <Card title="Filtros" className="saar-card-filtros">
          <div className="saar-card-content">
            <div className="saar-grafico-header">
              <div className="saar-filtro-disciplinas">
                <label htmlFor="ciclos-select" className="saar-filtro-label">
                  Ciclos
                </label>
                <MultiSelect
                  id="ciclos-select"
                  value={ciclosSelecionados}
                  options={[...CICLOS]}
                  onChange={(e) => {
                    const valores = e.value || [];
                    // Garantir que pelo menos um ciclo esteja selecionado
                    if (valores.length > 0) {
                      setCiclosSelecionados(valores);
                    }
                  }}
                  placeholder="Selecione os ciclos"
                  display="chip"
                  className="saar-multiselect"
                  style={{ width: "100%" }}
                  optionLabel="label"
                  optionValue="value"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="saar-visitas-tecnicas-right">
        <div className="saar-visitas-tecnicas-graficos">
          {ciclosParaExibir.length === 0 ? (
            <SAARChartContainer
              title={tituloCard}
              subTitle="Distribuição de Visitas Técnicas"
              options={null}
              series={[]}
              emptyMessage="Nenhum ciclo selecionado ou dados disponíveis"
            />
          ) : (
            ciclosParaExibir.map((ciclo) => {
              // Verificar se o ciclo tem etapas
              if (!ciclo.porEtapa || ciclo.porEtapa.length === 0) {
                const cicloLabel =
                  CICLOS.find((c) => c.value === ciclo.ciclo)?.label ||
                  `Ciclo ${ciclo.ciclo}`;
                return (
                  <SAARChartContainer
                    key={ciclo.ciclo}
                    title={`${cicloLabel} - ${tituloCard}`}
                    subTitle="Visitas Esperadas vs Atas Assinadas"
                    options={null}
                    series={[]}
                    emptyMessage="Nenhuma etapa disponível para este ciclo"
                  />
                );
              }

              const opcoesGrafico = criarOpcoesGraficoCombinadoPorCiclo(ciclo);
              const seriesGrafico = criarSeriesGraficoCombinadoPorCiclo(ciclo);
              const cicloLabel =
                CICLOS.find((c) => c.value === ciclo.ciclo)?.label ||
                `Ciclo ${ciclo.ciclo}`;

              return (
                <SAARChartContainer
                  key={ciclo.ciclo}
                  title={`${cicloLabel} - ${tituloCard}`}
                  options={opcoesGrafico}
                  series={seriesGrafico}
                  type="line"
                  height={400}
                  emptyMessage="Nenhum dado disponível para este ciclo"
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
