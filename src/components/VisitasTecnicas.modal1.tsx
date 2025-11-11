import { useEffect, useState, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { TabView, TabPanel } from "primereact/tabview";
import { MultiSelect } from "primereact/multiselect";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Registrar componentes do Chart.js necessários para gráficos combinados
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import { loadEscolasFromCsv } from "../utils/csvParser";
import {
  loadVisitasTecnicasCsv,
  calcularDadosVisitasTecnicas,
  calcularDadosVisitasTecnicasRegionais,
  calcularDadosVisitasTecnicasMunicipios,
  calcularDadosVisitasTecnicasEscolas,
} from "../utils/visitasTecnicasParser";
import type { Escola } from "../types/Escola";
import type {
  DadosVisitasTecnicasAgregados,
  DadosVisitasTecnicasRegional,
  DadosVisitasTecnicasMunicipio,
  DadosVisitasTecnicasEscola,
} from "../types/VisitasTecnicas";
import "./VisitasTecnicas.modal1.css";

interface VisitasTecnicasModalProps {
  visible: boolean;
  onHide: () => void;
}

export default function VisitasTecnicasModal({ visible, onHide }: VisitasTecnicasModalProps) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [visitasData, setVisitasData] = useState<any[]>([]);
  const [dadosES, setDadosES] = useState<DadosVisitasTecnicasAgregados | null>(null);
  const [dadosRegionais, setDadosRegionais] = useState<DadosVisitasTecnicasRegional[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para dropdowns (agora suportam múltipla seleção)
  const [regionaisSelecionadas, setRegionaisSelecionadas] = useState<DadosVisitasTecnicasRegional[]>([]);
  const [municipiosSelecionados, setMunicipiosSelecionados] = useState<DadosVisitasTecnicasMunicipio[]>([]);
  const [escolasSelecionadas, setEscolasSelecionadas] = useState<DadosVisitasTecnicasEscola[]>([]);

  useEffect(() => {
    if (visible) {
      loadData();
      // Resetar seleções quando o modal abrir
      setRegionaisSelecionadas([]);
      setMunicipiosSelecionados([]);
      setEscolasSelecionadas([]);
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const escolasData = await loadEscolasFromCsv();
      setEscolas(escolasData);

      const visitas = await loadVisitasTecnicasCsv();
      setVisitasData(visitas);

      setDadosES(calcularDadosVisitasTecnicas(visitas));
      setDadosRegionais(calcularDadosVisitasTecnicasRegionais(visitas, escolasData));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarNumero = (numero: number): string => {
    return numero.toLocaleString("pt-BR");
  };

  // Funções para obter listas filtradas (agora trabalha com arrays)
  const municipiosDisponiveis = useMemo(() => {
    if (regionaisSelecionadas.length === 0) return [];
    // Obter todos os municípios das regionais selecionadas
    const municipiosUnicos = new Map<string, DadosVisitasTecnicasMunicipio>();
    regionaisSelecionadas.forEach(regional => {
      const municipios = calcularDadosVisitasTecnicasMunicipios(visitasData, escolas, regional.regional);
      municipios.forEach(municipio => {
        const key = `${municipio.municipio}-${municipio.regional}`;
        if (!municipiosUnicos.has(key)) {
          municipiosUnicos.set(key, municipio);
        }
      });
    });
    return Array.from(municipiosUnicos.values());
  }, [visitasData, escolas, regionaisSelecionadas]);

  const escolasDisponiveis = useMemo(() => {
    if (municipiosSelecionados.length === 0) return [];
    // Obter todas as escolas dos municípios selecionados
    const escolasUnicas = new Map<string, DadosVisitasTecnicasEscola>();
    municipiosSelecionados.forEach(municipio => {
      const escolasData = calcularDadosVisitasTecnicasEscolas(visitasData, escolas, municipio.municipio);
      escolasData.forEach(escola => {
        const key = `${escola.escola}-${escola.municipio}`;
        if (!escolasUnicas.has(key)) {
          escolasUnicas.set(key, escola);
        }
      });
    });
    return Array.from(escolasUnicas.values());
  }, [visitasData, escolas, municipiosSelecionados]);

  // Handlers para mudanças nos dropdowns
  const handleRegionaisChange = (regionais: DadosVisitasTecnicasRegional[]) => {
    setRegionaisSelecionadas(regionais || []);
    setMunicipiosSelecionados([]);
    setEscolasSelecionadas([]);
  };

  const handleMunicipiosChange = (municipios: DadosVisitasTecnicasMunicipio[]) => {
    setMunicipiosSelecionados(municipios || []);
    setEscolasSelecionadas([]);
  };

  // Preparar dados do gráfico combinado (linha + barras) para um ciclo específico
  const prepararDadosGrafico = (
    dados: DadosVisitasTecnicasAgregados | DadosVisitasTecnicasRegional | DadosVisitasTecnicasMunicipio | DadosVisitasTecnicasEscola, 
    ciclo: number,
    tema: 'estado' | 'regional' | 'municipio' | 'escola' = 'estado'
  ) => {
    const cicloDados = dados.porCiclo.find(c => c.ciclo === ciclo);
    
    if (!cicloDados) {
      return {
        data: {
          labels: [],
          datasets: []
        },
        options: {}
      };
    }

    // Cores baseadas no tema
    const cores = {
      estado: {
        linha: '#0d6efd',
        barra: '#90caf9',
        borda: '#0d6efd',
      },
      regional: {
        linha: '#7b1fa2',
        barra: '#e1bee7',
        borda: '#7b1fa2',
      },
      municipio: {
        linha: '#388e3c',
        barra: '#a5d6a7',
        borda: '#388e3c',
      },
      escola: {
        linha: '#f57c00',
        barra: '#ffcc80',
        borda: '#f57c00',
      },
    };

    const corTema = cores[tema];

    // Etapas do ciclo
    const etapas = cicloDados.porEtapa.map(e => e.etapa);
    
    const data = {
      labels: etapas,
      datasets: [
        {
          type: 'line' as const,
          label: 'Visitas Previstas',
          data: cicloDados.porEtapa.map(e => e.esperadas),
          borderColor: corTema.linha,
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: corTema.linha,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1,
          pointHoverRadius: 6,
          tension: 0.1,
          order: 1, // Linha atrás das barras
        },
        {
          type: 'bar' as const,
          label: 'Atas Assinadas',
          data: cicloDados.porEtapa.map(e => e.atasAssinadas),
          backgroundColor: corTema.barra,
          borderColor: corTema.borda,
          borderWidth: 1,
          borderRadius: 4,
          order: 2, // Barras na frente
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
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
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              return `${label}: ${formatarNumero(value)}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: function (value: any) {
              return formatarNumero(value);
            },
          },
        },
        x: {
          ticks: {
            maxRotation: 60,
            minRotation: 60,
            font: {
              size: 11,
            },
            padding: 10,
            autoSkip: false,
          },
          grid: {
            display: false,
          },
        },
      },
    };

    return { data, options };
  };

  // Função genérica para renderizar um card
  const renderCard = (
    dados: DadosVisitasTecnicasAgregados | DadosVisitasTecnicasRegional | DadosVisitasTecnicasMunicipio | DadosVisitasTecnicasEscola,
    titulo: string,
    tema: 'estado' | 'regional' | 'municipio' | 'escola'
  ) => {
    const classes = {
      estado: 'modal-card-espirito-santo',
      regional: 'modal-card-regional',
      municipio: 'modal-card-municipio',
      escola: 'modal-card-escola',
    };

    return (
      <Card className={`modal-card ${classes[tema]}`}>
        <div className="modal-card-header">
          <h3>{titulo}</h3>
        </div>
        <div className="modal-card-content">
          <div className="modal-content-grid">
            <div className="modal-card-metricas">
              <div className="metrica">
                <span className="metrica-valor">{formatarNumero(dados.totalEsperadas)}</span>
                <span className="metrica-label">Visitas Esperadas</span>
              </div>
              <div className="metrica">
                <span className="metrica-valor">{formatarNumero(dados.totalAtasAssinadas)}</span>
                <span className="metrica-label">Atas Assinadas</span>
              </div>
              <div className="metrica">
                <span className="metrica-valor">{dados.percentualPendentes.toFixed(2).replace(".", ",")}%</span>
                <span className="metrica-label">Atas Pendentes</span>
              </div>
            </div>
            <div className="grafico-container">
              <h4>Ciclo I</h4>
              <Chart type="bar" data={prepararDadosGrafico(dados, 1, tema).data} options={prepararDadosGrafico(dados, 1, tema).options} />
            </div>
            <div className="grafico-container">
              <h4>Ciclo II</h4>
              <Chart type="bar" data={prepararDadosGrafico(dados, 2, tema).data} options={prepararDadosGrafico(dados, 2, tema).options} />
            </div>
            <div className="grafico-container">
              <h4>Ciclo III</h4>
              <Chart type="bar" data={prepararDadosGrafico(dados, 3, tema).data} options={prepararDadosGrafico(dados, 3, tema).options} />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Visitas Técnicas - Detalhes"
      className="visitas-tecnicas-modal"
      style={{ width: "95vw", maxWidth: "1600px" }}
      modal
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
          <p>Carregando dados...</p>
        </div>
      ) : (
        <TabView className="visitas-tecnicas-tabview">
          <TabPanel 
            header={
              <span className="tab-header">
                <i className="pi pi-map-marker" style={{ marginRight: "0.5rem" }}></i>
                Estado
              </span>
            }
          >
            <div className="tab-content-wrapper">
              {dadosES && renderCard(dadosES, "Espírito Santo", "estado")}
            </div>
          </TabPanel>
          
          <TabPanel 
            header={
              <span className="tab-header">
                <i className="pi pi-building" style={{ marginRight: "0.5rem" }}></i>
                Regionais
              </span>
            }
          >
            <div className="tab-content-wrapper">
              <div className="filters-section">
                <div className="filter-group">
                  <div className="filter-item">
                    <label htmlFor="regional-multiselect">
                      <i className="pi pi-filter"></i>
                      Regionais
                    </label>
                    <MultiSelect
                      id="regional-multiselect"
                      value={regionaisSelecionadas}
                      options={dadosRegionais}
                      onChange={(e) => handleRegionaisChange(e.value || [])}
                      optionLabel="regional"
                      placeholder="Selecione uma ou mais..."
                      className="visitas-multiselect compact"
                      filter
                      filterPlaceholder="Buscar..."
                      display="chip"
                      panelClassName="visitas-dropdown-panel"
                    />
                  </div>
                </div>
              </div>
              {regionaisSelecionadas.length > 0 && (
                <div className="cards-grid">
                  {regionaisSelecionadas.map((regional) => (
                    <div key={regional.regional} className="card-wrapper">
                      {renderCard(regional, regional.regional, "regional")}
                    </div>
                  ))}
                </div>
              )}
              {regionaisSelecionadas.length === 0 && (
                <div className="empty-state">
                  <i className="pi pi-info-circle"></i>
                  <p>Selecione uma ou mais Regionais para visualizar os dados</p>
                </div>
              )}
            </div>
          </TabPanel>
          
          <TabPanel 
            header={
              <span className="tab-header">
                <i className="pi pi-home" style={{ marginRight: "0.5rem" }}></i>
                Municípios
              </span>
            }
          >
            <div className="tab-content-wrapper">
              <div className="filters-section">
                <div className="filter-group">
                  <div className="filter-item">
                    <label htmlFor="regional-multiselect-municipio">
                      <i className="pi pi-filter"></i>
                      Regionais
                    </label>
                    <MultiSelect
                      id="regional-multiselect-municipio"
                      value={regionaisSelecionadas}
                      options={dadosRegionais}
                      onChange={(e) => handleRegionaisChange(e.value || [])}
                      optionLabel="regional"
                      placeholder="Selecione uma ou mais..."
                      className="visitas-multiselect compact"
                      filter
                      filterPlaceholder="Buscar..."
                      display="chip"
                      panelClassName="visitas-dropdown-panel"
                    />
                  </div>
                  {regionaisSelecionadas.length > 0 && (
                    <div className="filter-item">
                      <label htmlFor="municipio-multiselect">
                        <i className="pi pi-filter"></i>
                        Municípios
                      </label>
                      <MultiSelect
                        id="municipio-multiselect"
                        value={municipiosSelecionados}
                        options={municipiosDisponiveis}
                        onChange={(e) => handleMunicipiosChange(e.value || [])}
                        optionLabel="municipio"
                        placeholder="Selecione uma ou mais..."
                        className="visitas-multiselect compact"
                        filter
                        filterPlaceholder="Buscar..."
                        display="chip"
                        disabled={regionaisSelecionadas.length === 0}
                        panelClassName="visitas-dropdown-panel"
                      />
                    </div>
                  )}
                </div>
              </div>
              {municipiosSelecionados.length > 0 && (
                <div className="cards-grid">
                  {municipiosSelecionados.map((municipio) => (
                    <div key={`${municipio.municipio}-${municipio.regional}`} className="card-wrapper">
                      {renderCard(municipio, municipio.municipio, "municipio")}
                    </div>
                  ))}
                </div>
              )}
              {municipiosSelecionados.length === 0 && (
                <div className="empty-state">
                  <i className="pi pi-info-circle"></i>
                  <p>{regionaisSelecionadas.length === 0 ? "Selecione uma ou mais Regionais primeiro" : "Selecione um ou mais Municípios para visualizar os dados"}</p>
                </div>
              )}
            </div>
          </TabPanel>
          
          <TabPanel 
            header={
              <span className="tab-header">
                <i className="pi pi-sitemap" style={{ marginRight: "0.5rem" }}></i>
                Escolas
              </span>
            }
          >
            <div className="tab-content-wrapper">
              <div className="filters-section">
                <div className="filter-group">
                  <div className="filter-item">
                    <label htmlFor="regional-multiselect-escola">
                      <i className="pi pi-filter"></i>
                      Regionais
                    </label>
                    <MultiSelect
                      id="regional-multiselect-escola"
                      value={regionaisSelecionadas}
                      options={dadosRegionais}
                      onChange={(e) => handleRegionaisChange(e.value || [])}
                      optionLabel="regional"
                      placeholder="Selecione uma ou mais..."
                      className="visitas-multiselect compact"
                      filter
                      filterPlaceholder="Buscar..."
                      display="chip"
                      panelClassName="visitas-dropdown-panel"
                    />
                  </div>
                  {regionaisSelecionadas.length > 0 && (
                    <div className="filter-item">
                      <label htmlFor="municipio-multiselect-escola">
                        <i className="pi pi-filter"></i>
                        Municípios
                      </label>
                      <MultiSelect
                        id="municipio-multiselect-escola"
                        value={municipiosSelecionados}
                        options={municipiosDisponiveis}
                        onChange={(e) => handleMunicipiosChange(e.value || [])}
                        optionLabel="municipio"
                        placeholder="Selecione uma ou mais..."
                        className="visitas-multiselect compact"
                        filter
                        filterPlaceholder="Buscar..."
                        display="chip"
                        disabled={regionaisSelecionadas.length === 0}
                        panelClassName="visitas-dropdown-panel"
                      />
                    </div>
                  )}
                  {municipiosSelecionados.length > 0 && (
                    <div className="filter-item">
                      <label htmlFor="escola-multiselect">
                        <i className="pi pi-filter"></i>
                        Escolas
                      </label>
                      <MultiSelect
                        id="escola-multiselect"
                        value={escolasSelecionadas}
                        options={escolasDisponiveis}
                        onChange={(e) => setEscolasSelecionadas(e.value || [])}
                        optionLabel="escola"
                        placeholder="Selecione uma ou mais..."
                        className="visitas-multiselect compact"
                        filter
                        filterPlaceholder="Buscar..."
                        display="chip"
                        disabled={municipiosSelecionados.length === 0}
                        panelClassName="visitas-dropdown-panel"
                      />
                    </div>
                  )}
                </div>
              </div>
              {escolasSelecionadas.length > 0 && (
                <div className="cards-grid">
                  {escolasSelecionadas.map((escola) => (
                    <div key={`${escola.escola}-${escola.municipio}`} className="card-wrapper">
                      {renderCard(escola, escola.escola, "escola")}
                    </div>
                  ))}
                </div>
              )}
              {escolasSelecionadas.length === 0 && (
                <div className="empty-state">
                  <i className="pi pi-info-circle"></i>
                  <p>
                    {regionaisSelecionadas.length === 0 
                      ? "Selecione uma ou mais Regionais primeiro" 
                      : municipiosSelecionados.length === 0 
                        ? "Selecione um ou mais Municípios primeiro" 
                        : "Selecione uma ou mais Escolas para visualizar os dados"}
                  </p>
                </div>
              )}
            </div>
          </TabPanel>
        </TabView>
      )}
    </Dialog>
  );
}

