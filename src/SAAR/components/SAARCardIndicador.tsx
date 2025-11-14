/**
 * Componente reutilizável para exibir card de indicador
 * Usado em múltiplas abas do SAAR
 */

import { Card } from "primereact/card";
import { Tooltip } from "primereact/tooltip";
import "./SAARCardIndicador.css";

export interface SAARCardIndicadorProps {
  /** Valor principal do indicador (ex: percentual) */
  valor: string | number;
  /** Label do indicador */
  label: string;
  /** Detalhes adicionais (ex: "de X esperadas") */
  detalhes?: {
    numero: string | number;
    texto: string;
  };
  /** Tooltip opcional para o label */
  tooltip?: string;
  /** Classe CSS adicional */
  className?: string;
}

export default function SAARCardIndicador({
  valor,
  label,
  detalhes,
  tooltip,
  className = "",
}: SAARCardIndicadorProps) {
  // Formatar valor: se for string com %, extrair número e formatar com 1 decimal
  // Se for number, formatar com 1 decimal
  let valorFormatado: string;
  
  if (typeof valor === "string") {
    // Se contém %, é um percentual - extrair número e formatar
    if (valor.includes("%")) {
      const numeroStr = valor.replace("%", "").trim();
      const numero = parseFloat(numeroStr);
      if (!isNaN(numero)) {
        valorFormatado = `${numero.toFixed(1).replace(".", ",")}%`;
      } else {
        valorFormatado = valor;
      }
    } else {
      valorFormatado = valor;
    }
  } else {
    // Se for number, formatar com 1 casa decimal
    valorFormatado = valor.toFixed(1).replace(".", ",");
  }

  return (
    <Card title="Indicador" className={`saar-card-indicador ${className}`}>
      <div className="saar-card-content">
        <div className="saar-indicador-item">
          <div className="saar-indicador-valor">{valorFormatado}</div>
          {tooltip ? (
            <div
              className="saar-indicador-label"
              data-pr-tooltip={tooltip}
              data-pr-position="top"
              data-pr-at="center top"
            >
              {label}
            </div>
          ) : (
            <div className="saar-indicador-label">{label}</div>
          )}
          {tooltip && <Tooltip target=".saar-indicador-label" />}
        </div>
        {detalhes && (
          <div className="saar-indicador-detalhes">
            <div className="saar-indicador-linha">
              <span className="saar-indicador-numero">{detalhes.numero}</span>
              <span className="saar-indicador-texto">{detalhes.texto}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

