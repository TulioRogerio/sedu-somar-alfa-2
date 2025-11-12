import { useState, useEffect, useMemo } from "react";
import { MultiSelect } from "primereact/multiselect";
import { getPublicPath } from "../../utils/pathUtils";
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

// Opções de disciplinas
const DISCIPLINAS = [
  { label: "Língua Portuguesa", value: "LP" },
  { label: "Matemática", value: "Mat" },
  { label: "Ciências", value: "Ciencias" },
  { label: "História", value: "Historia" },
  { label: "Geografia", value: "Geografia" },
];

export default function SAARTabViewAulasDadas({ filtros }: AulasDadasProps) {
  const [dados, setDados] = useState<AulasDadasRow[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<string[]>(
    DISCIPLINAS.map((d) => d.value)
  );
  const [Chart, setChart] = useState<any>(null);

  // Carregar Chart dinamicamente apenas no cliente (evita problemas de SSR no GitHub Pages)
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

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      console.log("Iniciando carregamento do CSV...");
      const response = await fetch(getPublicPath("aulas-dadas.csv"));
      console.log("Resposta do fetch:", response.status, response.statusText);
      if (!response.ok) {
        console.error("Erro ao carregar CSV:", response.status, response.statusText);
        throw new Error(`Erro ao carregar CSV: ${response.status} ${response.statusText}`);
      }

      const csvContent = await response.text();
      console.log("Tamanho do CSV carregado:", csvContent.length, "caracteres");
      const linhas = csvContent.split("\n").filter((l) => l.trim());
      console.log("Total de linhas após split:", linhas.length);
      
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
      console.log("Headers encontrados:", headers);

      const dadosParseados: AulasDadasRow[] = [];
      let linhasProcessadas = 0;
      let linhasFiltradas = 0;
      
      for (let i = 1; i < linhas.length; i++) {
        linhasProcessadas++;
        const valores = parseCSVLine(linhas[i]);
        
        // Verificar se a linha tem o número correto de colunas
        if (valores.length !== headers.length) {
          console.warn(`Linha ${i} tem ${valores.length} colunas, esperado ${headers.length}. Linha:`, linhas[i].substring(0, 100));
          continue;
        }
        
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
        let deveIncluir = true;
        
        if (filtros?.regional) {
          if (row.regional !== filtros.regional.label) {
            deveIncluir = false;
          }
        }
        if (deveIncluir && filtros?.municipio) {
          if (row.municipio !== filtros.municipio.label) {
            deveIncluir = false;
          }
        }
        if (deveIncluir && filtros?.escola) {
          // Comparação case-insensitive e removendo espaços extras
          const escolaCSV = row.escola_nome?.trim().toLowerCase() || "";
          const escolaFiltro = filtros.escola.label?.trim().toLowerCase() || "";
          if (escolaCSV !== escolaFiltro) {
            deveIncluir = false;
          }
        }
        
        if (!deveIncluir) {
          linhasFiltradas++;
          continue;
        }

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

      console.log("=== DEBUG AULAS DADAS ===");
      console.log("Total de linhas no CSV:", linhas.length - 1);
      console.log("Linhas processadas:", linhasProcessadas);
      console.log("Linhas filtradas (excluídas):", linhasFiltradas);
      console.log("Dados após filtros:", dadosParseados.length, "registros");
      console.log("Filtros aplicados:", JSON.stringify(filtros, null, 2));
      if (dadosParseados.length > 0) {
        console.log("Primeiros 3 registros:", dadosParseados.slice(0, 3));
        console.log("Exemplo de regional no CSV:", dadosParseados[0].regional);
        console.log("Exemplo de municipio no CSV:", dadosParseados[0].municipio);
        console.log("Exemplo de escola no CSV:", dadosParseados[0].escola_nome);
      } else {
        console.warn("⚠️ Nenhum dado encontrado após aplicar filtros!");
        if (filtros?.escola) {
          console.warn("Filtro de escola ativo:", filtros.escola.label);
        }
        if (filtros?.municipio) {
          console.warn("Filtro de município ativo:", filtros.municipio.label);
        }
        if (filtros?.regional) {
          console.warn("Filtro de regional ativo:", filtros.regional.label);
        }
      }
      console.log("========================");
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

  // Obter todas as turmas disponíveis e criar opções para o MultiSelect
  const todasTurmas = useMemo(() => {
    const turmasSet = new Set<string>();
    dados.forEach((row) => {
      turmasSet.add(row.turma);
    });
    return Array.from(turmasSet);
  }, [dados]);

  // Opções de séries para o MultiSelect
  const opcoesSeries = useMemo(() => {
    return todasTurmas.map((turma) => ({
      label: turma,
      value: turma,
    }));
  }, [todasTurmas]);

  // Estado para séries selecionadas (inicialmente todas)
  const [seriesSelecionadas, setSeriesSelecionadas] = useState<string[]>([]);

  // Atualizar séries selecionadas quando todasTurmas mudar (apenas na primeira vez)
  useEffect(() => {
    if (todasTurmas.length > 0 && seriesSelecionadas.length === 0) {
      setSeriesSelecionadas([...todasTurmas]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todasTurmas]);

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

    // Filtrar dados por séries selecionadas
    const dadosFiltrados = seriesSelecionadas.length > 0
      ? dados.filter((row) => seriesSelecionadas.includes(row.turma))
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
  }, [dados, seriesSelecionadas]);

  // Mapeamento de cores por disciplina
  const coresDisciplinas: Record<string, string> = {
    LP: "#2196f3", // Azul
    Mat: "#4caf50", // Verde
    Ciencias: "#ff9800", // Laranja
    Historia: "#9c27b0", // Roxo
    Geografia: "#f44336", // Vermelho
  };

  // Configuração do gráfico
  const opcoesGrafico = useMemo(() => {
    const turmas = Object.keys(dadosPorTurma);
    
    // Calcular cores baseado nas disciplinas selecionadas (na ordem correta)
    const cores = DISCIPLINAS.filter((d) =>
      disciplinasSelecionadas.includes(d.value)
    ).map((d) => coresDisciplinas[d.value]);

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
      colors: cores,
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
  }, [dadosPorTurma, disciplinasSelecionadas]);

  const seriesGrafico = useMemo(() => {
    const turmas = Object.keys(dadosPorTurma);
    const series: any[] = [];

    // Adicionar séries na ordem definida em DISCIPLINAS para manter consistência com as cores
    DISCIPLINAS.forEach((disciplina) => {
      if (disciplinasSelecionadas.includes(disciplina.value)) {
        let data: number[] = [];
        switch (disciplina.value) {
          case "LP":
            data = turmas.map((turma) => dadosPorTurma[turma].percentual_LP);
            break;
          case "Mat":
            data = turmas.map((turma) => dadosPorTurma[turma].percentual_Mat);
            break;
          case "Ciencias":
            data = turmas.map((turma) => dadosPorTurma[turma].percentual_Ciencias);
            break;
          case "Historia":
            data = turmas.map((turma) => dadosPorTurma[turma].percentual_Historia);
            break;
          case "Geografia":
            data = turmas.map((turma) => dadosPorTurma[turma].percentual_Geografia);
            break;
        }
        series.push({
          name: disciplina.label,
          data: data,
        });
      }
    });

    return series;
  }, [dadosPorTurma, disciplinasSelecionadas]);

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
              <div className="saar-filtro-disciplinas">
                <label htmlFor="disciplinas-select" className="saar-filtro-label">
                  Disciplinas
                </label>
                <MultiSelect
                  id="disciplinas-select"
                  value={disciplinasSelecionadas}
                  options={DISCIPLINAS}
                  onChange={(e) => {
                    const valores = e.value || [];
                    // Garantir que pelo menos uma disciplina esteja selecionada
                    if (valores.length > 0) {
                      setDisciplinasSelecionadas(valores);
                    }
                  }}
                  placeholder="Selecione as disciplinas"
                  display="chip"
                  className="saar-multiselect"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="saar-filtro-disciplinas">
                <label htmlFor="series-select" className="saar-filtro-label">
                  Séries
                </label>
                <MultiSelect
                  id="series-select"
                  value={seriesSelecionadas}
                  options={opcoesSeries}
                  onChange={(e) => {
                    const valores = e.value || [];
                    // Garantir que pelo menos uma série esteja selecionada
                    if (valores.length > 0) {
                      setSeriesSelecionadas(valores);
                    }
                  }}
                  placeholder="Selecione as séries"
                  display="chip"
                  className="saar-multiselect"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="saar-aulas-dadas-right">
        <div className="saar-aulas-dadas-grafico">
          <div className="saar-grafico-container">
            {carregando ? (
              <div className="saar-grafico-vazio">
                <p>Carregando dados...</p>
              </div>
            ) : !Chart ? (
              <div className="saar-grafico-vazio">
                <p>Carregando gráfico...</p>
              </div>
            ) : Object.keys(dadosPorTurma).length > 0 ? (
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
