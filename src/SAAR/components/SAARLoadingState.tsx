/**
 * Componente reutilizável para estado de carregamento
 */

import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export interface SAARLoadingStateProps {
  /** Mensagem opcional */
  message?: string;
  /** Quantidade de skeletons */
  skeletonCount?: number;
}

export default function SAARLoadingState({
  message,
  skeletonCount = 2,
}: SAARLoadingStateProps) {
  return (
    <div className="saar-tab-content">
      <Card>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton
              key={index}
              width={index === 0 ? "100%" : "60%"}
              height="2rem"
              style={{ marginTop: index > 0 ? "1rem" : 0 }}
            />
          ))}
          {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
        </div>
      </Card>
    </div>
  );
}

