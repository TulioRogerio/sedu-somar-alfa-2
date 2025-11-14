import { useMemo } from "react";
import { useProdutosData } from "../hooks/useProdutosData";
import { formatarNumero } from "../utils/produtosCalculations";
import { obterTituloCard } from "../utils/sharedCalculations";
import {
  criarOpcoesGraficoColunas,
  criarSeriesGraficoColunas,
} from "../utils/produtosChartConfig";
import { CORES_FAIXAS } from "../constants/Produtos.constants";
import {
  SAARCardIndicador,
  SAARChartContainer,
  SAARLegend,
  SAARLoadingState,
  SAAREmptyState,
} from "../components";
import type { ProdutosProps } from "../types/Produtos.types";
import "./SAAR.TabView.Produtos.css";

export default function SAARTabViewProdutos({
  filtros,
}: ProdutosProps) {
  const { dadosAgregados, carregando } = useProdutosData(filtros);

  const tituloCard = useMemo(() => obterTituloCard(filtros), [filtros]);

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
      { color: CORES_FAIXAS["0-25"], label: "0 à 25% concluído" },
      { color: CORES_FAIXAS["26-50"], label: "26 a 50% concluído" },
      { color: CORES_FAIXAS["51-75"], label: "51 a 75% concluído" },
      { color: CORES_FAIXAS["76-100"], label: "76 a 100% concluído" },
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
    <div className="saar-produtos">
      <div className="saar-produtos-left">
        <SAARCardIndicador
          valor={`${Math.round(dadosAgregados.percentualMedio)}%`}
          label="Percentual Médio"
          detalhes={{
            numero: formatarNumero(dadosAgregados.total),
            texto: "Total de Produtos",
          }}
        />
      </div>

      <div className="saar-produtos-center">
        <div className="saar-produtos-grafico">
          <SAARChartContainer
            title={tituloCard}
            subTitle="Distribuição por Faixas"
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
