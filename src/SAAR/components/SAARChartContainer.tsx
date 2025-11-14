/**
 * Componente reutilizável para container de gráfico
 * Gerencia estados de loading, empty e exibição do gráfico
 */

import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { useApexChart } from "../hooks/useApexChart";
import type { ApexOptions } from "apexcharts";
import "./SAARChartContainer.css";

export interface SAARChartContainerProps {
  /** Título do card */
  title: string;
  /** Subtítulo opcional */
  subTitle?: string;
  /** Opções do gráfico ApexCharts */
  options?: ApexOptions | null;
  /** Séries do gráfico */
  series?: any;
  /** Tipo do gráfico */
  type?: "line" | "bar" | "radar" | "pie" | "donut" | "area";
  /** Altura do gráfico */
  height?: number;
  /** Estado de carregamento */
  loading?: boolean;
  /** Mensagem quando não há dados */
  emptyMessage?: string;
  /** Classe CSS adicional */
  className?: string;
  /** Conteúdo adicional após o gráfico (ex: legenda) */
  children?: React.ReactNode;
}

export default function SAARChartContainer({
  title,
  subTitle,
  options,
  series,
  type = "bar",
  height = 400,
  loading = false,
  emptyMessage = "Nenhum dado disponível",
  className = "",
  children,
}: SAARChartContainerProps) {
  const Chart = useApexChart();

  if (loading) {
    return (
      <Card
        title={title}
        subTitle={subTitle}
        className={`saar-grafico-container ${className}`}
      >
        <div className="saar-grafico-vazio">
          <Skeleton width="100%" height={`${height}px`} />
        </div>
      </Card>
    );
  }

  const hasData = options && series && Array.isArray(series) && series.length > 0;

  return (
    <Card
      title={title}
      subTitle={subTitle}
      className={`saar-grafico-container ${className}`}
    >
      <div className="saar-grafico-content-wrapper">
        <div className="saar-grafico-chart-area">
          {!Chart ? (
            <div className="saar-grafico-vazio">
              <Skeleton width="100%" height={`${height}px`} />
            </div>
          ) : hasData ? (
            <div style={{ width: "100%" }}>
              <Chart
                options={options}
                series={series}
                type={type}
                height={height}
                width="100%"
              />
            </div>
          ) : (
            <div className="saar-grafico-vazio">
              <p>{emptyMessage}</p>
            </div>
          )}
        </div>
        {children && <div className="saar-grafico-extra-content">{children}</div>}
      </div>
    </Card>
  );
}

