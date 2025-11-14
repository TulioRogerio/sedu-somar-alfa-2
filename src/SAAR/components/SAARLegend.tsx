/**
 * Componente reutilizável para legenda customizada
 * Usado em gráficos que precisam de legenda adicional
 */

import "./SAARLegend.css";

export interface LegendItem {
  /** Cor do marcador */
  color: string;
  /** Label do item */
  label: string;
}

export interface SAARLegendProps {
  /** Itens da legenda */
  items: LegendItem[];
  /** Classe CSS adicional */
  className?: string;
  /** Orientação da legenda */
  orientation?: "horizontal" | "vertical";
}

export default function SAARLegend({
  items,
  className = "",
  orientation = "vertical",
}: SAARLegendProps) {
  return (
    <div
      className={`saar-legend-customizada saar-legend-${orientation} ${className}`}
    >
      {items.map((item, index) => (
        <div key={index} className="saar-legend-item">
          <span
            className="saar-legend-marker"
            style={{ backgroundColor: item.color }}
          />
          <span className="saar-legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

