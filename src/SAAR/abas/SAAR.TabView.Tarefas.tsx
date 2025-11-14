import { useMemo } from "react";
import { useTarefasData } from "../hooks/useTarefasData";
import {
  formatarNumero,
  calcularPercentualProgresso,
} from "../utils/tarefasCalculations";
import { obterTituloCard } from "../utils/sharedCalculations";
import {
  criarOpcoesGraficoColunas,
  criarSeriesGraficoColunas,
} from "../utils/tarefasChartConfig";
import { CORES_STATUS } from "../constants/Tarefas.constants";
import {
  SAARCardIndicador,
  SAARChartContainer,
  SAARLegend,
  SAARLoadingState,
  SAAREmptyState,
} from "../components";
import type { TarefasProps } from "../types/Tarefas.types";
import "./SAAR.TabView.Tarefas.css";

export default function SAARTabViewTarefas({ filtros }: TarefasProps) {
  const { dadosAgregados, carregando } = useTarefasData(filtros);

  const tituloCard = useMemo(() => obterTituloCard(filtros), [filtros]);

  // Calcular percentual de Tarefas Concluídas
  const percentualProgresso = useMemo(() => {
    if (!dadosAgregados) return 0;
    return calcularPercentualProgresso(dadosAgregados);
  }, [dadosAgregados]);

  // Preparar dados para o gráfico principal (dados agregados)
  const opcoesGrafico = useMemo(() => {
    if (!dadosAgregados) return null;
    return criarOpcoesGraficoColunas(dadosAgregados);
  }, [dadosAgregados]);

  const seriesGrafico = useMemo(() => {
    if (!dadosAgregados) return [];
    return criarSeriesGraficoColunas(dadosAgregados);
  }, [dadosAgregados]);

  // Itens da legenda
  const legendItems = useMemo(
    () => [
      { color: CORES_STATUS.previstas, label: "Previstas" },
      { color: CORES_STATUS.naoIniciadas, label: "Não Iniciadas" },
      { color: CORES_STATUS.emAndamento, label: "Em Andamento" },
      { color: CORES_STATUS.atrasadas, label: "Atrasadas" },
      { color: CORES_STATUS.concluidas, label: "Concluídas" },
      { color: CORES_STATUS.concluidasAtraso, label: "Concluídas com Atraso" },
    ],
    []
  );

  if (carregando) {
    return <SAARLoadingState />;
  }

  if (!dadosAgregados) {
    return <SAAREmptyState />;
  }

  return (
    <div className="saar-tarefas">
      <div className="saar-tarefas-left">
        <SAARCardIndicador
          valor={`${percentualProgresso}%`}
          label="Tarefas Concluídas"
          tooltip="Inclui Concluídas + Concluídas com Atraso"
          detalhes={{
            numero: formatarNumero(
              dadosAgregados.concluidas + dadosAgregados.concluidasAtraso
            ),
            texto: `de ${formatarNumero(dadosAgregados.total)} concluídas`,
          }}
        />
      </div>

      <div className="saar-tarefas-center">
        <div className="saar-tarefas-grafico">
          <SAARChartContainer
            title={tituloCard}
            subTitle="Distribuição de Status"
            options={opcoesGrafico}
            series={seriesGrafico}
            type="bar"
            height={400}
            loading={false}
          >
            <SAARLegend items={legendItems} />
          </SAARChartContainer>
        </div>
      </div>
    </div>
  );
}
