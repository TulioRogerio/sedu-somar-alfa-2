import { useState, useEffect, useMemo } from "react";
// @ts-ignore
import Chart from "react-apexcharts";
import "./SAAR.TabView.AulasDadas.css";

interface AulasDadasProps {
  filtros?: {
    estado?: { label: string; value: string };
    regional?: { label: string; value: string };
    municipio?: { label: string; value: string };
    escola?: { label: string; value: string };
    saar?: { label: string; value: string };
  };
}

interface AulasDadasRow {
  escola_id: number;
  escola_nome: string;
  regional: string;
  municipio: string;
  turma: string;
  data: string;
  dia_letivo: number;
  aulas_previstas_LP: number;
  aulas_previstas_Mat: number;
  aulas_previstas_Ciencias: number;
  aulas_previstas_Historia: number;
  aulas_previstas_Geografia: number;
  aulas_dadas_LP: number;
  aulas_dadas_Mat: number;
  aulas_dadas_Ciencias: number;
  aulas_dadas_Historia: number;
  aulas_dadas_Geografia: number;
}

export default function SAARTabViewAulasDadas({ filtros }: AulasDadasProps) {
  const [dados, setDados] = useState<AulasDadasRow[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const response = await fetch("/aulas-dadas.csv");
      if (!response.ok) throw new Error("Erro ao carregar CSV");

      const csvContent = await response.text();
      const linhas = csvContent.split("\n").filter((l) => l.trim());
      
      // Função para fazer parse correto de CSV com campos entre aspas
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const headers = parseCSVLine(linhas[0]);

      const dadosParseados: AulasDadasRow[] = [];
      for (let i = 1; i < linhas.length; i++) {
        const valores = parseCSVLine(linhas[i]);
        const row: any = {};
        headers.forEach((header, index) => {
          let valor = valores[index]?.trim() || "";
          // Remover aspas se houver
          if (valor.startsWith('"') && valor.endsWith('"')) {
            valor = valor.slice(1, -1);
          }
          row[header.trim()] = valor;
        });

        // Aplicar filtros
        if (filtros?.regional && row.regional !== filtros.regional.label)
          continue;
        if (filtros?.municipio && row.municipio !== filtros.municipio.label)
          continue;
        if (filtros?.escola && row.escola_nome !== filtros.escola.label)
          continue;

        dadosParseados.push({
          escola_id: parseInt(row.escola_id),
          escola_nome: row.escola_nome,
          regional: row.regional,
          municipio: row.municipio,
          turma: row.turma,
          data: row.data,
          dia_letivo: parseInt(row.dia_letivo),
          aulas_previstas_LP: parseInt(row.aulas_previstas_LP || "0"),
          aulas_previstas_Mat: parseInt(row.aulas_previstas_Mat || "0"),
          aulas_previstas_Ciencias: parseInt(
            row.aulas_previstas_Ciencias || "0"
          ),
          aulas_previstas_Historia: parseInt(
            row.aulas_previstas_Historia || "0"
          ),
          aulas_previstas_Geografia: parseInt(
            row.aulas_previstas_Geografia || "0"
          ),
          aulas_dadas_LP: parseInt(row.aulas_dadas_LP || "0"),
          aulas_dadas_Mat: parseInt(row.aulas_dadas_Mat || "0"),
          aulas_dadas_Ciencias: parseInt(row.aulas_dadas_Ciencias || "0"),
          aulas_dadas_Historia: parseInt(row.aulas_dadas_Historia || "0"),
          aulas_dadas_Geografia: parseInt(row.aulas_dadas_Geografia || "0"),
        });
      }

      console.log("Dados carregados:", dadosParseados.length, "registros");
      console.log("Filtros aplicados:", filtros);
      setDados(dadosParseados);
    } catch (error) {
      console.error("Erro ao carregar dados de aulas dadas:", error);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  };

  // Calcular indicador de aula (percentual de aulas dadas sobre aulas previstas)
  const indicadorAula = useMemo(() => {
    if (dados.length === 0) return 0;

    // Soma total de aulas previstas (todas as disciplinas)
    const totalPrevistas = dados.reduce(
      (sum, row) =>
        sum +
        row.aulas_previstas_LP +
        row.aulas_previstas_Mat +
        row.aulas_previstas_Ciencias +
        row.aulas_previstas_Historia +
        row.aulas_previstas_Geografia,
      0
    );

    // Soma total de aulas dadas (todas as disciplinas)
    const totalDadas = dados.reduce(
      (sum, row) =>
        sum +
        row.aulas_dadas_LP +
        row.aulas_dadas_Mat +
        row.aulas_dadas_Ciencias +
        row.aulas_dadas_Historia +
        row.aulas_dadas_Geografia,
      0
    );

    // Calcular percentual: (aulas dadas / aulas previstas) * 100
    if (totalPrevistas === 0) return 0;

    const percentual = (totalDadas / totalPrevistas) * 100;

    return Math.min(100, Math.max(0, percentual));
  }, [dados]);

  // Ordem das turmas conforme exemplo
  const ordemTurmas = [
    "3ª Série",
    "2ª Série",
    "1ª Série",
    "9º Ano",
    "8º Ano",
    "7º Ano",
    "6º Ano",
    "2ª Série - I",
    "1ª Série - I",
    "9º Ano - I",
    "8º Ano - I",
    "7º Ano - I",
  ];

  // Obter todas as turmas disponíveis (para mostrar badges)
  const todasTurmas = useMemo(() => {
    const turmasSet = new Set<string>();
    dados.forEach((row) => {
      turmasSet.add(row.turma);
    });
    return Array.from(turmasSet);
  }, [dados]);

  // Agrupar dados por turma com percentuais
  const dadosPorTurma = useMemo(() => {
    const agrupado: Record<
      string,
      {
        previstas_LP: number;
        previstas_Mat: number;
        previstas_Ciencias: number;
        previstas_Historia: number;
        previstas_Geografia: number;
        dadas_LP: number;
        dadas_Mat: number;
        dadas_Ciencias: number;
        dadas_Historia: number;
        dadas_Geografia: number;
        percentual_LP: number;
        percentual_Mat: number;
        percentual_Ciencias: number;
        percentual_Historia: number;
        percentual_Geografia: number;
        percentual_Total: number;
      }
    > = {};

    // Filtrar dados por turma selecionada se houver
    const dadosFiltrados = turmaSelecionada
      ? dados.filter((row) => row.turma === turmaSelecionada)
      : dados;

    dadosFiltrados.forEach((row) => {
      if (!agrupado[row.turma]) {
        agrupado[row.turma] = {
          previstas_LP: 0,
          previstas_Mat: 0,
          previstas_Ciencias: 0,
          previstas_Historia: 0,
          previstas_Geografia: 0,
          dadas_LP: 0,
          dadas_Mat: 0,
          dadas_Ciencias: 0,
          dadas_Historia: 0,
          dadas_Geografia: 0,
          percentual_LP: 0,
          percentual_Mat: 0,
          percentual_Ciencias: 0,
          percentual_Historia: 0,
          percentual_Geografia: 0,
          percentual_Total: 0,
        };
      }

      agrupado[row.turma].previstas_LP += row.aulas_previstas_LP;
      agrupado[row.turma].previstas_Mat += row.aulas_previstas_Mat;
      agrupado[row.turma].previstas_Ciencias += row.aulas_previstas_Ciencias;
      agrupado[row.turma].previstas_Historia += row.aulas_previstas_Historia;
      agrupado[row.turma].previstas_Geografia += row.aulas_previstas_Geografia;
      agrupado[row.turma].dadas_LP += row.aulas_dadas_LP;
      agrupado[row.turma].dadas_Mat += row.aulas_dadas_Mat;
      agrupado[row.turma].dadas_Ciencias += row.aulas_dadas_Ciencias;
      agrupado[row.turma].dadas_Historia += row.aulas_dadas_Historia;
      agrupado[row.turma].dadas_Geografia += row.aulas_dadas_Geografia;
    });

    // Calcular percentuais
    Object.keys(agrupado).forEach((turma) => {
      const dados = agrupado[turma];
      dados.percentual_LP =
        dados.previstas_LP > 0
          ? Number(((dados.dadas_LP / dados.previstas_LP) * 100).toFixed(1))
          : 0;
      dados.percentual_Mat =
        dados.previstas_Mat > 0
          ? Number(((dados.dadas_Mat / dados.previstas_Mat) * 100).toFixed(1))
          : 0;
      dados.percentual_Ciencias =
        dados.previstas_Ciencias > 0
          ? Number(
              ((dados.dadas_Ciencias / dados.previstas_Ciencias) * 100).toFixed(
                1
              )
            )
          : 0;
      dados.percentual_Historia =
        dados.previstas_Historia > 0
          ? Number(
              ((dados.dadas_Historia / dados.previstas_Historia) * 100).toFixed(
                1
              )
            )
          : 0;
      dados.percentual_Geografia =
        dados.previstas_Geografia > 0
          ? Number(
              (
                (dados.dadas_Geografia / dados.previstas_Geografia) *
                100
              ).toFixed(1)
            )
          : 0;

      const totalPrevistas =
        dados.previstas_LP +
        dados.previstas_Mat +
        dados.previstas_Ciencias +
        dados.previstas_Historia +
        dados.previstas_Geografia;
      const totalDadas =
        dados.dadas_LP +
        dados.dadas_Mat +
        dados.dadas_Ciencias +
        dados.dadas_Historia +
        dados.dadas_Geografia;
      dados.percentual_Total =
        totalPrevistas > 0
          ? Number(((totalDadas / totalPrevistas) * 100).toFixed(1))
          : 0;
    });

    // Ordenar conforme ordemTurmas
    const ordenado: Record<string, (typeof agrupado)[string]> = {};
    ordemTurmas.forEach((turma) => {
      if (agrupado[turma]) {
        ordenado[turma] = agrupado[turma];
      }
    });

    // Adicionar turmas que não estão na lista de ordem
    Object.keys(agrupado).forEach((turma) => {
      if (!ordenado[turma]) {
        ordenado[turma] = agrupado[turma];
      }
    });

    return ordenado;
  }, [dados, turmaSelecionada]);

  // Configuração do gráfico
  const opcoesGrafico = useMemo(() => {
    const turmas = Object.keys(dadosPorTurma);

    return {
      chart: {
        type: "bar" as const,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          dataLabels: {
            position: "top",
          },
          columnWidth: "35%",
          barHeight: "70%",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => {
          const valor = typeof val === "number" ? val : parseFloat(val);
          return `${valor.toFixed(1)}%`;
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#333"],
        },
      },
      xaxis: {
        categories: turmas,
        title: {
          text: "Série",
        },
        labels: {
          style: {
            fontSize: "12px",
          },
        },
        tickAmount: turmas.length,
      },
      yaxis: {
        title: {
          text: "Percentual (%)",
        },
        min: 0,
        max: 100,
      },
      fill: {
        opacity: 1,
      },
      colors: ["#2196f3", "#4caf50", "#ff9800", "#9c27b0", "#f44336"],
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            const valor = typeof val === "number" ? val : parseFloat(val);
            return `${valor.toFixed(1)}%`;
          },
        },
      },
    };
  }, [dadosPorTurma]);

  const seriesGrafico = useMemo(() => {
    const turmas = Object.keys(dadosPorTurma);
    const percentuaisLP = turmas.map(
      (turma) => dadosPorTurma[turma].percentual_LP
    );
    const percentuaisMat = turmas.map(
      (turma) => dadosPorTurma[turma].percentual_Mat
    );
    const percentuaisCiencias = turmas.map(
      (turma) => dadosPorTurma[turma].percentual_Ciencias
    );
    const percentuaisHistoria = turmas.map(
      (turma) => dadosPorTurma[turma].percentual_Historia
    );
    const percentuaisGeografia = turmas.map(
      (turma) => dadosPorTurma[turma].percentual_Geografia
    );

    return [
      {
        name: "Língua Portuguesa",
        data: percentuaisLP,
      },
      {
        name: "Matemática",
        data: percentuaisMat,
      },
      {
        name: "Ciências",
        data: percentuaisCiencias,
      },
      {
        name: "História",
        data: percentuaisHistoria,
      },
      {
        name: "Geografia",
        data: percentuaisGeografia,
      },
    ];
  }, [dadosPorTurma]);

  if (carregando) {
    return (
      <div className="saar-tab-content">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="saar-aulas-dadas">
      <div className="saar-aulas-dadas-left">
        {/* Card de Indicadores */}
        <div className="saar-card-indicador">
          <div className="saar-card-header">
            <h3 className="saar-card-title">Indicador</h3>
          </div>
          <div className="saar-card-content">
            <div className="saar-indicador-item">
              <div className="saar-indicador-valor">
                {indicadorAula.toFixed(2)}%
              </div>
              <div className="saar-indicador-label">Aulas Dadas</div>
            </div>
          </div>
        </div>

        {/* Card de Filtros */}
        <div className="saar-card-filtros">
          <div className="saar-card-header">
            <h3 className="saar-card-title">Filtros</h3>
          </div>
          <div className="saar-card-content">
            <div className="saar-grafico-header">
              <div className="saar-grafico-turmas">
                {todasTurmas.map((turma) => (
                  <span
                    key={turma}
                    className={`saar-turma-badge ${
                      turmaSelecionada === turma
                        ? "saar-turma-badge-selected"
                        : ""
                    }`}
                    onClick={() => {
                      setTurmaSelecionada(
                        turmaSelecionada === turma ? null : turma
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {turma}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="saar-aulas-dadas-right">
        <div className="saar-aulas-dadas-grafico">
          <div className="saar-grafico-container">
            {Object.keys(dadosPorTurma).length > 0 ? (
              <Chart
                options={opcoesGrafico}
                series={seriesGrafico}
                type="bar"
                height={Math.max(400, Object.keys(dadosPorTurma).length * 80)}
              />
            ) : (
              <div className="saar-grafico-vazio">
                <p>Nenhum dado disponível para os filtros selecionados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
