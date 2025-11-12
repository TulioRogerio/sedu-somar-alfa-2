/**
 * Hook customizado para carregar ApexCharts dinamicamente (evita problemas de SSR)
 */

import { useState, useEffect } from "react";

export function useApexChart() {
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-apexcharts")
        .then((module) => {
          // @ts-ignore
          setChart(() => module.default);
        })
        .catch((error) => {
          console.error("Erro ao carregar react-apexcharts:", error);
        });
    }
  }, []);

  return Chart;
}

