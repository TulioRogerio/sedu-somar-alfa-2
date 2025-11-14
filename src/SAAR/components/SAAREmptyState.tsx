/**
 * Componente para exibir estado vazio quando não há dados
 */

import { Card } from "primereact/card";

export interface SAAREmptyStateProps {
  message?: string;
  className?: string;
}

export default function SAAREmptyState({
  message = "Nenhum dado disponível",
  className = "",
}: SAAREmptyStateProps) {
  return (
    <div className={`saar-tab-content ${className}`}>
      <Card>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>{message}</p>
        </div>
      </Card>
    </div>
  );
}
