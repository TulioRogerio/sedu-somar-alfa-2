import { useMemo } from "react";
import { Card } from "primereact/card";
import { useProdutosData } from "../hooks/useProdutosData";
import { useApexChart } from "../hooks/useApexChart";
import {
  formatarNumero,
  obterTituloCard,
} from "../utils/produtosCalculations";
import {
  criarOpcoesGraficoRosca,
  criarSeriesGraficoRosca,
} from "../utils/produtosChartConfig";
import type { ProdutosProps } from "../types/Produtos.types";
import "./SAAR.TabView.Produtos.css";

export default function SAARTabViewProdutos({
  filtros,
}: ProdutosProps) {
  const {
    dadosAgregados,
    dadosRegionais,
    dadosMunicipios,
    dadosEscolas,
    nivel,
    carregando,
  } = useProdutosData(filtros);
  const Chart = useApexChart();

  const tituloCard = useMemo(() => obterTituloCard(filtros), [filtros]);

  // Determinar quais dados exibir no grid
  const dadosGrid = useMemo(() => {
    switch (nivel) {
      case "estado":
        return dadosRegionais;
      case "regional":
        return dadosMunicipios;
      case "municipio":
        return dadosEscolas;
      case "escola":
        return [];
      default:
        return [];
    }
  }, [nivel, dadosRegionais, dadosMunicipios, dadosEscolas]);

  // Determinar tipo de dado para o grid
  const tipoDadoGrid = useMemo(() => {
    switch (nivel) {
      case "estado":
        return "regionais";
      case "regional":
        return "municipios";
      case "municipio":
        return "escolas";
      default:
        return "";
    }
  }, [nivel]);

  if (carregando) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "2rem" }}>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (!dadosAgregados) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "2rem" }}>
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="saar-produtos">
      {/* Card de Indicadores Agregados */}
      <Card className="saar-produtos-card-indicadores">
        <div className="saar-produtos-card-content">
          <h3 className="saar-produtos-card-titulo">{tituloCard}</h3>
          <div className="saar-produtos-tabela-dados">
            <div className="saar-produtos-dado-item">
              <span className="saar-produtos-dado-valor">
                {formatarNumero(dadosAgregados.total)}
              </span>
              <span className="saar-produtos-dado-label">
                Total de Produtos
              </span>
            </div>
            <div className="saar-produtos-dado-item">
              <span className="saar-produtos-dado-valor">
                {formatarNumero(dadosAgregados.faixa0_25)}
              </span>
              <span className="saar-produtos-dado-label">
                0 à 25% concluído
              </span>
            </div>
            <div className="saar-produtos-dado-item">
              <span className="saar-produtos-dado-valor">
                {formatarNumero(dadosAgregados.faixa26_50)}
              </span>
              <span className="saar-produtos-dado-label">
                26 a 50% concluído
              </span>
            </div>
            <div className="saar-produtos-dado-item">
              <span className="saar-produtos-dado-valor">
                {formatarNumero(dadosAgregados.faixa51_75)}
              </span>
              <span className="saar-produtos-dado-label">
                51 a 75% concluído
              </span>
            </div>
            <div className="saar-produtos-dado-item">
              <span className="saar-produtos-dado-valor">
                {formatarNumero(dadosAgregados.faixa76_100)}
              </span>
              <span className="saar-produtos-dado-label">
                76 a 100% concluído
              </span>
            </div>
            <div className="saar-produtos-dado-item">
              <span className="saar-produtos-dado-valor">
                {Math.round(dadosAgregados.percentualMedio)}%
              </span>
              <span className="saar-produtos-dado-label">
                Percentual Médio
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid de Gráficos */}
      {dadosGrid.length > 0 && (
        <div className="saar-produtos-grid-container">
          <div className="saar-produtos-grid-header">
            <h3 className="saar-produtos-grid-titulo">
              {tipoDadoGrid === "regionais"
                ? "Regionais"
                : tipoDadoGrid === "municipios"
                ? "Municípios"
                : "Escolas"}
            </h3>
          </div>
          <div className="saar-produtos-grid">
            {dadosGrid.map((dado, index) => {
              const opcoesGrafico = criarOpcoesGraficoRosca(dado);
              const seriesGrafico = criarSeriesGraficoRosca(dado);
              const tituloGrafico =
                "regional" in dado
                  ? dado.regional
                  : "municipio" in dado
                  ? dado.municipio
                  : dado.escola;

              return (
                <Card key={index} className="saar-produtos-grafico-card">
                  <div className="saar-produtos-grafico-card-content">
                    <h4 className="saar-produtos-grafico-card-titulo">
                      {tituloGrafico}
                    </h4>
                    <p className="saar-produtos-grafico-card-subtitulo">
                      Distribuição por Faixas
                    </p>
                    <div className="saar-produtos-grafico-info-numeros">
                      <span>Total: {formatarNumero(dado.total)}</span>
                    </div>
                    <div className="saar-produtos-grafico-wrapper">
                      {Chart ? (
                        <Chart
                          options={opcoesGrafico}
                          series={seriesGrafico}
                          type="donut"
                          height={250}
                          width="100%"
                        />
                      ) : (
                        <div className="saar-produtos-grafico-vazio">
                          <p>Carregando gráfico...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

