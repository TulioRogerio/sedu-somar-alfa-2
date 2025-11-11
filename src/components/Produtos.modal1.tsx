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
  calcularDadosProdutos,
  calcularDadosProdutosRegionais,
  calcularDadosProdutosMunicipios,
  calcularDadosProdutosEscolas,
} from "../utils/cicloGestaoParser";
import type { Escola } from "../types/Escola";
import type {
  DadosProdutos,
  DadosProdutosRegional,
  DadosProdutosMunicipio,
  DadosProdutosEscola,
} from "../types/CicloGestao";
import "./Produtos.modal1.css";

interface ProdutosModalProps {
  visible: boolean;
  onHide: () => void;
}

export default function ProdutosModal({ visible, onHide }: ProdutosModalProps) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [cicloGestaoData, setCicloGestaoData] = useState<any[]>([]);
  const [dadosES, setDadosES] = useState<DadosProdutos | null>(null);
  const [dadosRegionais, setDadosRegionais] = useState<DadosProdutosRegional[]>(
    []
  );
  const [dadosMunicipios, setDadosMunicipios] = useState<
    DadosProdutosMunicipio[]
  >([]);
  const [dadosEscolas, setDadosEscolas] = useState<DadosProdutosEscola[]>([]);
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

      setDadosES(calcularDadosProdutos(cicloData));
      setDadosRegionais(calcularDadosProdutosRegionais(cicloData, escolasData));
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
  const getMunicipiosFiltrados = (): DadosProdutosMunicipio[] => {
    if (!regionalSelecionada) return [];
    return calcularDadosProdutosMunicipios(
      cicloGestaoData,
      escolas,
      regionalSelecionada
    );
  };

  const getEscolasFiltradas = (): DadosProdutosEscola[] => {
    if (!municipioSelecionado) return [];
    return calcularDadosProdutosEscolas(
      cicloGestaoData,
      escolas,
      municipioSelecionado,
      regionalSelecionada || undefined
    );
  };

  // Handlers de clique nos gráficos
  const handleRegionalClick = (regional: DadosProdutosRegional) => {
    setRegionalSelecionada(regional.regional);
    setNivelAtivo("municipios");
  };

  const handleMunicipioClick = (municipio: DadosProdutosMunicipio) => {
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
  const prepararDadosGrafico = (dados: DadosProdutos): any => {
    const valores = [
      dados.faixa0_25,
      dados.faixa26_50,
      dados.faixa51_75,
      dados.faixa76_100,
    ];

    const total = valores.reduce((a: number, b: number) => a + b, 0);

    // Criar labels com percentuais
    const labelsBase = [
      "0 à 25% concluído",
      "26 a 50% concluído",
      "51 a 75% concluído",
      "76 a 100% concluído",
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
            "#dc2626", // 0-25% - vermelho
            "#f57c00", // 26-50% - laranja escuro
            "#ff9800", // 51-75% - laranja claro
            "#16a34a", // 76-100% - verde
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
          <div className="modal-tabela-dados-produtos">
            <div className="dado-item-produtos">
              <span className="dado-valor">
                {formatarNumero(dadosES.total)}
              </span>
              <span className="dado-label">Total de Produtos</span>
            </div>
            <div className="dado-item-produtos">
              <span className="dado-valor">
                {formatarNumero(dadosES.faixa0_25)}
              </span>
              <span className="dado-label">0 à 25% concluído</span>
            </div>
            <div className="dado-item-produtos">
              <span className="dado-valor">
                {formatarNumero(dadosES.faixa26_50)}
              </span>
              <span className="dado-label">26 a 50% concluído</span>
            </div>
            <div className="dado-item-produtos">
              <span className="dado-valor">
                {formatarNumero(dadosES.faixa51_75)}
              </span>
              <span className="dado-label">51 a 75% concluído</span>
            </div>
            <div className="dado-item-produtos">
              <span className="dado-valor">
                {formatarNumero(dadosES.faixa76_100)}
              </span>
              <span className="dado-label">76 a 100% concluído</span>
            </div>
            <div className="dado-item-produtos">
              <span className="dado-valor">
                {Math.round(dadosES.percentualMedio)}%
              </span>
              <span className="dado-label">Percentual Médio</span>
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
                    Distribuição por Faixas
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
                    Distribuição por Faixas
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
                    Distribuição por Faixas
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
      className="produtos-modal"
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

