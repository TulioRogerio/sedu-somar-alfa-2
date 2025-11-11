import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registrar componentes do Chart.js necessários para gráfico de rosca
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
import { loadEscolasFromCsv } from "../utils/csvParser";
import {
  loadCicloGestaoCsv,
  calcularDadosTarefas,
  calcularDadosTarefasRegionais,
  calcularDadosTarefasMunicipios,
  calcularDadosTarefasEscolas,
} from "../utils/cicloGestaoParser";
import type { Escola } from "../types/Escola";
import type {
  DadosTarefas,
  DadosTarefasRegional,
  DadosTarefasMunicipio,
  DadosTarefasEscola,
} from "../types/CicloGestao";
import "./Tarefas.modal1.css";

interface TarefasModalProps {
  visible: boolean;
  onHide: () => void;
}

export default function TarefasModal({ visible, onHide }: TarefasModalProps) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [cicloGestaoData, setCicloGestaoData] = useState<any[]>([]);
  const [dadosES, setDadosES] = useState<DadosTarefas | null>(null);
  const [dadosRegionais, setDadosRegionais] = useState<DadosTarefasRegional[]>(
    []
  );
  const [dadosMunicipios, setDadosMunicipios] = useState<
    DadosTarefasMunicipio[]
  >([]);
  const [dadosEscolas, setDadosEscolas] = useState<DadosTarefasEscola[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para controle de navegação hierárquica
  const [nivelAtivo, setNivelAtivo] = useState<
    "regionais" | "municipios" | "escolas"
  >("regionais");
  const [regionalSelecionada, setRegionalSelecionada] = useState<string | null>(
    null
  );
  const [municipioSelecionado, setMunicipioSelecionado] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (visible) {
      loadData();
      // Resetar navegação quando o modal abrir
      setNivelAtivo("regionais");
      setRegionalSelecionada(null);
      setMunicipioSelecionado(null);
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const escolasData = await loadEscolasFromCsv();
      setEscolas(escolasData);

      const cicloData = await loadCicloGestaoCsv();
      setCicloGestaoData(cicloData);

      setDadosES(calcularDadosTarefas(cicloData));
      setDadosRegionais(calcularDadosTarefasRegionais(cicloData, escolasData));
      setDadosMunicipios([]);
      setDadosEscolas([]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarNumero = (numero: number): string => {
    return numero.toLocaleString("pt-BR");
  };

  // Funções de filtro
  const getMunicipiosFiltrados = (): DadosTarefasMunicipio[] => {
    if (!regionalSelecionada) return [];
    return calcularDadosTarefasMunicipios(
      cicloGestaoData,
      escolas,
      regionalSelecionada
    );
  };

  const getEscolasFiltradas = (): DadosTarefasEscola[] => {
    if (!municipioSelecionado) return [];
    return calcularDadosTarefasEscolas(
      cicloGestaoData,
      escolas,
      municipioSelecionado,
      regionalSelecionada || undefined
    );
  };

  // Handlers de clique nos gráficos
  const handleRegionalClick = (regional: DadosTarefasRegional) => {
    setRegionalSelecionada(regional.regional);
    setNivelAtivo("municipios");
  };

  const handleMunicipioClick = (municipio: DadosTarefasMunicipio) => {
    setMunicipioSelecionado(municipio.municipio);
    setNivelAtivo("escolas");
  };

  // Funções de navegação para voltar
  const voltarParaRegionais = () => {
    setRegionalSelecionada(null);
    setMunicipioSelecionado(null);
    setNivelAtivo("regionais");
  };

  const voltarParaMunicipios = () => {
    setMunicipioSelecionado(null);
    setNivelAtivo("municipios");
  };

  // Preparar dados do gráfico
  const prepararDadosGrafico = (dados: DadosTarefas): any => {
    const valores = [
      dados.previstas,
      dados.naoIniciadas,
      dados.emAndamento,
      dados.atrasadas,
      dados.concluidas,
      dados.concluidasAtraso,
    ];

    const total = valores.reduce((a: number, b: number) => a + b, 0);

    // Criar labels com percentuais
    const labelsBase = [
      "Previstas",
      "Não Iniciadas",
      "Em Andamento",
      "Atrasadas",
      "Concluídas",
      "Concluídas com Atraso",
    ];

    const labels = labelsBase.map((label, index) => {
      const value = valores[index];
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
      return `${label}: ${percentage}%`;
    });

    const data = {
      labels: labels,
      datasets: [
        {
          data: valores,
          backgroundColor: [
            "#9333ea", // Previstas - roxo
            "#374151", // Não Iniciadas - cinza escuro
            "#2563eb", // Em Andamento - azul
            "#dc2626", // Atrasadas - vermelho
            "#16a34a", // Concluídas - verde
            "#ca8a04", // Concluídas com Atraso - amarelo dourado
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            padding: 10,
            font: {
              size: 12,
            },
            boxWidth: 15,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage =
                total > 0 ? ((value / total) * 100).toFixed(2) : 0;
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
        datalabels: {
          display: function (context: any) {
            // Mostrar label apenas se o valor for maior que 5% do total
            const value = context.dataset.data[context.dataIndex];
            const percentage = total > 0 ? (value / total) * 100 : 0;
            return percentage >= 5;
          },
          color: "#ffffff",
          font: {
            weight: "bold" as const,
            size: 12,
          },
          formatter: function (value: number) {
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
            return `${percentage}%`;
          },
          textStrokeColor: "rgba(0, 0, 0, 0.5)",
          textStrokeWidth: 2,
        },
      },
    };

    return { data, options };
  };

  const renderCardEspiritoSanto = () => {
    if (!dadosES) return null;

    return (
      <Card className="modal-card">
        <div className="modal-card-content">
          <h3 className="modal-card-titulo">Espírito Santo</h3>
          <div className="modal-tabela-dados-tarefas">
            <div className="dado-item-tarefas">
              <span className="dado-valor">
                {formatarNumero(dadosES.total)}
              </span>
              <span className="dado-label">Total de Tarefas</span>
            </div>
            <div className="dado-item-tarefas">
              <span className="dado-valor">
                {formatarNumero(dadosES.concluidas + dadosES.concluidasAtraso)}
              </span>
              <span className="dado-label">Tarefas Concluídas</span>
            </div>
            <div className="dado-item-tarefas">
              <span className="dado-valor">
                {formatarNumero(dadosES.previstas)}
              </span>
              <span className="dado-label">Previstas</span>
            </div>
            <div className="dado-item-tarefas">
              <span className="dado-valor">
                {formatarNumero(dadosES.naoIniciadas)}
              </span>
              <span className="dado-label">Não Iniciadas</span>
            </div>
            <div className="dado-item-tarefas">
              <span className="dado-valor">
                {formatarNumero(dadosES.emAndamento)}
              </span>
              <span className="dado-label">Em Andamento</span>
            </div>
            <div className="dado-item-tarefas">
              <span className="dado-valor">
                {formatarNumero(dadosES.atrasadas)}
              </span>
              <span className="dado-label">Atrasadas</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderGraficosRegionais = () => {
    if (nivelAtivo !== "regionais") return null;

    return (
      <div className="graficos-grid-container">
        <div className="graficos-header">
          <h3 className="modal-card-titulo">Regionais</h3>
        </div>
        <div className="graficos-grid">
          {dadosRegionais.map((regional) => {
            const chartData = prepararDadosGrafico(regional);
            return (
              <Card
                key={regional.regional}
                className="grafico-card clickable"
                onClick={() => handleRegionalClick(regional)}
              >
                <div className="grafico-card-content">
                  <h4 className="grafico-card-titulo">{regional.regional}</h4>
                  <p className="grafico-card-subtitulo">
                    Distribuição de Status
                  </p>
                  <div className="grafico-info-numeros">
                    <span>Total: {formatarNumero(regional.total)}</span>
                  </div>
                  <div className="grafico-wrapper">
                    <Chart
                      type="doughnut"
                      data={chartData.data}
                      options={chartData.options}
                      style={{ height: "250px" }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGraficosMunicipios = () => {
    if (nivelAtivo !== "municipios" || !regionalSelecionada) return null;

    const municipiosFiltrados = getMunicipiosFiltrados();

    return (
      <div className="graficos-grid-container">
        <div className="graficos-header">
          <h3 className="modal-card-titulo">
            Municípios - {regionalSelecionada}
          </h3>
          <button className="btn-voltar" onClick={voltarParaRegionais}>
            <i className="pi pi-arrow-left"></i>
            Voltar
          </button>
        </div>
        <div className="graficos-grid">
          {municipiosFiltrados.map((municipio) => {
            const chartData = prepararDadosGrafico(municipio);
            return (
              <Card
                key={`${municipio.municipio}-${municipio.regional}`}
                className="grafico-card clickable"
                onClick={() => handleMunicipioClick(municipio)}
              >
                <div className="grafico-card-content">
                  <h4 className="grafico-card-titulo">{municipio.municipio}</h4>
                  <p className="grafico-card-subtitulo">
                    Distribuição de Status
                  </p>
                  <div className="grafico-info-numeros">
                    <span>Total: {formatarNumero(municipio.total)}</span>
                  </div>
                  <div className="grafico-wrapper">
                    <Chart
                      type="doughnut"
                      data={chartData.data}
                      options={chartData.options}
                      style={{ height: "250px" }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGraficosEscolas = () => {
    if (nivelAtivo !== "escolas" || !municipioSelecionado) return null;

    const escolasFiltradas = getEscolasFiltradas();

    return (
      <div className="graficos-grid-container">
        <div className="graficos-header">
          <h3 className="modal-card-titulo">
            Escolas - {municipioSelecionado}
          </h3>
          <button className="btn-voltar" onClick={voltarParaMunicipios}>
            <i className="pi pi-arrow-left"></i>
            Voltar
          </button>
        </div>
        <div className="graficos-grid">
          {escolasFiltradas.map((escola) => {
            const chartData = prepararDadosGrafico(escola);
            return (
              <Card
                key={`${escola.escola}-${escola.municipio}`}
                className="grafico-card"
              >
                <div className="grafico-card-content">
                  <h4 className="grafico-card-titulo">{escola.escola}</h4>
                  <p className="grafico-card-subtitulo">
                    Distribuição de Status
                  </p>
                  <div className="grafico-info-numeros">
                    <span>Total: {formatarNumero(escola.total)}</span>
                  </div>
                  <div className="grafico-wrapper">
                    <Chart
                      type="doughnut"
                      data={chartData.data}
                      options={chartData.options}
                      style={{ height: "250px" }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={null}
      className="tarefas-modal"
      modal
      draggable={false}
      resizable={false}
      style={{ width: "95vw", maxWidth: "1400px", height: "90vh" }}
    >
      <div className="modal-conteudo">
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
            <p>Carregando dados...</p>
          </div>
        ) : (
          <>
            {renderCardEspiritoSanto()}
            {renderGraficosRegionais()}
            {renderGraficosMunicipios()}
            {renderGraficosEscolas()}
          </>
        )}
      </div>
    </Dialog>
  );
}
