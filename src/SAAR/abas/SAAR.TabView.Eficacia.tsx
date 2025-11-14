import { useMemo } from "react";
import { useEficaciaData } from "../hooks/useEficaciaData";
import { obterTituloCard } from "../utils/sharedCalculations";
import {
  criarOpcoesGraficoRadar,
  criarSeriesGraficoRadar,
} from "../utils/eficaciaChartConfig";
import {
  criarOpcoesGraficoRadarProficiencia,
  gerarValoresMockadosProficienciaLP,
  gerarValoresMockadosProficienciaMat,
  gerarValoresMockadosProficienciaLeitura,
} from "../utils/proficienciaChartConfig";
import {
  SAARChartContainer,
  SAARLoadingState,
} from "../components";
import type { EficaciaProps } from "../types/Eficacia.types";
import "./SAAR.TabView.Eficacia.css";

export default function SAARTabViewEficacia({ filtros }: EficaciaProps) {
  const { indicadorAtual, carregando } = useEficaciaData(filtros);

  const tituloCard = useMemo(() => obterTituloCard(filtros), [filtros]);

  // Preparar dados para o gráfico radar
  const opcoesGrafico = useMemo(() => {
    if (!indicadorAtual) return null;
    return criarOpcoesGraficoRadar(indicadorAtual);
  }, [indicadorAtual]);

  const seriesGrafico = useMemo(() => {
    if (!indicadorAtual) return [];
    return [
      {
        name: "Indicadores",
        data: criarSeriesGraficoRadar(indicadorAtual),
      },
    ];
  }, [indicadorAtual]);

  // Sempre criar opções e séries, mesmo que vazias
  const opcoesGraficoFinal = useMemo(() => {
    if (opcoesGrafico) return opcoesGrafico;
    // Criar opções vazias se não houver indicador
    return criarOpcoesGraficoRadar(null);
  }, [opcoesGrafico]);

  const seriesGraficoFinal = useMemo(() => {
    if (seriesGrafico.length > 0) return seriesGrafico;
    // Criar série vazia se não houver indicador
    return [
      {
        name: "Indicadores",
        data: [0, 0, 0, 0, 0],
      },
    ];
  }, [seriesGrafico]);

  // Preparar gráfico de proficiências (gráfico da direita)
  const opcoesGraficoProficiencia = useMemo(() => {
    return criarOpcoesGraficoRadarProficiencia();
  }, []);

  const seriesGraficoProficiencia = useMemo(() => {
    const valoresLP = gerarValoresMockadosProficienciaLP();
    const valoresMat = gerarValoresMockadosProficienciaMat();
    const valoresLeitura = gerarValoresMockadosProficienciaLeitura();
    
    // Calcular média de cada proficiência para representar no eixo
    const mediaLP = valoresLP.reduce((sum, val) => sum + val, 0) / valoresLP.length;
    const mediaMat = valoresMat.reduce((sum, val) => sum + val, 0) / valoresMat.length;
    const mediaLeitura = valoresLeitura.reduce((sum, val) => sum + val, 0) / valoresLeitura.length;
    
    return [
      {
        name: "Proficiências",
        data: [
          Math.round(mediaLP), // Língua Portuguesa
          Math.round(mediaMat), // Matemática
          Math.round(mediaLeitura), // Leitura
        ],
      },
    ];
  }, []);

  if (carregando) {
    return <SAARLoadingState />;
  }

  return (
    <div className="saar-eficacia">
      <div className="saar-eficacia-grid">
        <SAARChartContainer
          title={tituloCard}
          subTitle="Indicadores de Eficácia"
          options={opcoesGraficoFinal}
          series={seriesGraficoFinal}
          type="radar"
          height={500}
          loading={false}
          emptyMessage={
            indicadorAtual
              ? undefined
              : "Nenhum indicador encontrado para os filtros selecionados."
          }
        />
        <SAARChartContainer
          title={tituloCard}
          subTitle="Proficiências"
          options={opcoesGraficoProficiencia}
          series={seriesGraficoProficiencia}
          type="radar"
          height={500}
          loading={false}
        />
      </div>
    </div>
  );
}

