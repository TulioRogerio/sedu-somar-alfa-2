import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import {
  loadEscolasFromCsv,
  calcularDadosEspiritoSanto,
  calcularDadosRegionais,
  calcularDadosMunicipios,
  calcularTCGPEscolas,
  agruparEscolasPorTCGP,
} from "../utils/csvParser";
import type {
  Escola,
  DadosEspiritoSanto,
  DadosRegional,
  DadosMunicipio,
  DadosTCGPEscola,
  DadosTCGPDetalhes,
} from "../types/Escola";
import "./DadosCicloGestao.modal1.css";

interface DadosCicloGestaoModal2Props {
  visible: boolean;
  onHide: () => void;
}

export default function DadosCicloGestaoModal2({
  visible,
  onHide,
}: DadosCicloGestaoModal2Props) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [dadosES, setDadosES] = useState<DadosEspiritoSanto | null>(null);
  const [dadosRegionais, setDadosRegionais] = useState<DadosRegional[]>([]);
  const [dadosMunicipios, setDadosMunicipios] = useState<DadosMunicipio[]>([]);
  const [tcgpsEscolas, setTcgpsEscolas] = useState<DadosTCGPEscola[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para navegação de TCGP's
  const [tabelaTCGPsAtiva, setTabelaTCGPsAtiva] = useState<
    "estado" | "regionais" | "municipios" | "escolas"
  >("estado");
  const [regionalTCGPsSelecionada, setRegionalTCGPsSelecionada] = useState<
    string | null
  >(null);
  const [municipioTCGPsSelecionado, setMunicipioTCGPsSelecionado] = useState<
    string | null
  >(null);

  // Estado para modal de detalhes da TCGP
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [detalhesTCGP, setDetalhesTCGP] = useState<DadosTCGPDetalhes | null>(
    null
  );

  useEffect(() => {
    if (visible) {
      loadData();
      // Resetar navegação de TCGP's
      setTabelaTCGPsAtiva("estado");
      setRegionalTCGPsSelecionada(null);
      setMunicipioTCGPsSelecionado(null);
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const escolasData = await loadEscolasFromCsv();
      setEscolas(escolasData);
      setDadosES(calcularDadosEspiritoSanto(escolasData));
      setDadosRegionais(calcularDadosRegionais(escolasData));
      setDadosMunicipios(calcularDadosMunicipios(escolasData));
      // Carregar dados de TCGP's
      setTcgpsEscolas(calcularTCGPEscolas(escolasData));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarNumero = (numero: number): string => {
    return numero.toLocaleString("pt-BR");
  };

  // Funções de filtro para TCGP's
  const getTCGPsMunicipiosFiltrados = (): DadosMunicipio[] => {
    if (!regionalTCGPsSelecionada) return [];
    return dadosMunicipios.filter(
      (m) => m.regional === regionalTCGPsSelecionada
    );
  };

  const getTCGPsEscolasFiltradas = (): DadosTCGPEscola[] => {
    if (!municipioTCGPsSelecionado) return [];
    const escolasDoMunicipio = escolas
      .filter((e) => e.municipio === municipioTCGPsSelecionado)
      .map((e) => e.nome);
    return tcgpsEscolas.filter((t) => escolasDoMunicipio.includes(t.escola));
  };

  // Função de transição para TCGP's
  const transicionarTabelaTCGPs = (
    novaTabela: "estado" | "regionais" | "municipios" | "escolas"
  ) => {
    setTabelaTCGPsAtiva(novaTabela);
  };

  // Handlers de clique para TCGP's
  const handleRegionalTCGPsClick = (regional: DadosRegional) => {
    setRegionalTCGPsSelecionada(regional.regional);
    transicionarTabelaTCGPs("municipios");
  };

  const handleMunicipioTCGPsClick = (municipio: DadosMunicipio) => {
    setMunicipioTCGPsSelecionado(municipio.municipio);
    transicionarTabelaTCGPs("escolas");
  };

  const handleEscolaTCGPsClick = (escola: DadosTCGPEscola) => {
    if (escola.nome_tcgp && escola.email_tcgp) {
      const tcgpsMap = agruparEscolasPorTCGP(escolas);
      const detalhes = tcgpsMap.get(escola.nome_tcgp);
      if (detalhes) {
        setDetalhesTCGP(detalhes);
        setModalDetalhesVisible(true);
      }
    }
  };

  // Funções de navegação para voltar (TCGP's)
  const voltarParaRegionaisTCGPs = () => {
    setMunicipioTCGPsSelecionado(null);
    setRegionalTCGPsSelecionada(null);
    transicionarTabelaTCGPs("estado");
  };

  const voltarParaMunicipiosTCGPs = () => {
    setMunicipioTCGPsSelecionado(null);
    transicionarTabelaTCGPs("municipios");
  };

  const renderCardTCGPsEstado = () => {
    if (!dadosES) return null;

    return (
      <Card className="modal-card">
        <div className="modal-card-content">
          <h3 className="modal-card-titulo">Espírito Santo</h3>
          <div className="modal-tabela-dados">
            <div className="dado-item">
              <span className="dado-label">TCGPs</span>
              <span className="dado-valor">
                {formatarNumero(dadosES.tcgps)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderCardTCGPsRegionais = () => {
    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaTCGPsAtiva === "estado" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <h3 className="modal-card-titulo">TCGP's por Regional</h3>
          <DataTable
            value={dadosRegionais}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            className="modal-datatable tabela-clickable"
            onRowClick={(e) =>
              handleRegionalTCGPsClick(e.data as DadosRegional)
            }
          >
            <Column field="regional" header="Regional" sortable />
            <Column
              field="tcgps"
              header="TCGPs"
              sortable
              body={(rowData) => formatarNumero(rowData.tcgps)}
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderCardTCGPsMunicipios = () => {
    const municipiosFiltrados = getTCGPsMunicipiosFiltrados();

    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaTCGPsAtiva === "municipios" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <div className="modal-card-header-nav">
            <h3 className="modal-card-titulo">
              TCGP's por Município{" "}
              {regionalTCGPsSelecionada && `- ${regionalTCGPsSelecionada}`}
            </h3>
            <button className="btn-voltar" onClick={voltarParaRegionaisTCGPs}>
              <i className="pi pi-arrow-left"></i>
              Voltar
            </button>
          </div>
          <DataTable
            value={municipiosFiltrados}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            className="modal-datatable tabela-clickable"
            onRowClick={(e) =>
              handleMunicipioTCGPsClick(e.data as DadosMunicipio)
            }
          >
            <Column field="municipio" header="Município" sortable />
            <Column
              field="tcgps"
              header="TCGPs"
              sortable
              body={(rowData) => formatarNumero(rowData.tcgps)}
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderCardTCGPsEscolas = () => {
    const escolasFiltradas = getTCGPsEscolasFiltradas();

    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaTCGPsAtiva === "escolas" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <div className="modal-card-header-nav">
            <h3 className="modal-card-titulo">
              TCGP's por Escola{" "}
              {municipioTCGPsSelecionado && `- ${municipioTCGPsSelecionado}`}
            </h3>
            <button className="btn-voltar" onClick={voltarParaMunicipiosTCGPs}>
              <i className="pi pi-arrow-left"></i>
              Voltar
            </button>
          </div>
          <DataTable
            value={escolasFiltradas}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            className="modal-datatable tabela-clickable"
            onRowClick={(e) =>
              handleEscolaTCGPsClick(e.data as DadosTCGPEscola)
            }
          >
            <Column field="escola" header="Escola" sortable />
            <Column
              field="nome_tcgp"
              header="Nome da TCGP"
              sortable
              body={(rowData) => rowData.nome_tcgp || "-"}
            />
            <Column
              field="tcgps"
              header="TCGPs"
              sortable
              body={(rowData) => formatarNumero(rowData.tcgps)}
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderConteudoTCGPs = () => {
    return (
      <div className="modal-conteudo">
        {renderCardTCGPsEstado()}
        {tabelaTCGPsAtiva === "estado" && renderCardTCGPsRegionais()}
        {tabelaTCGPsAtiva === "municipios" && renderCardTCGPsMunicipios()}
        {tabelaTCGPsAtiva === "escolas" && renderCardTCGPsEscolas()}
      </div>
    );
  };

  return (
    <>
      <Dialog
        visible={visible}
        onHide={onHide}
        header="TCGP's por Regional e Município"
        className="dados-ciclo-gestao-modal"
        modal
        draggable={false}
        resizable={false}
        style={{ width: "95vw", maxWidth: "1400px", height: "90vh" }}
      >
        {renderConteudoTCGPs()}
      </Dialog>

      <Dialog
        header={
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <i
              className="pi pi-user"
              style={{ fontSize: "1.5rem", color: "#0d6efd" }}
            ></i>
            <span>Detalhes do TCGP</span>
          </div>
        }
        visible={modalDetalhesVisible}
        style={{ width: "50vw", minWidth: "500px" }}
        onHide={() => {
          if (!modalDetalhesVisible) return;
          setModalDetalhesVisible(false);
        }}
        modal
        className="tcgp-detalhes-dialog"
      >
        {detalhesTCGP && (
          <div style={{ padding: "0.5rem 0" }}>
            {/* Card de Informações Pessoais */}
            <Card
              style={{
                marginBottom: "1.5rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              <div style={{ padding: "1.5rem", color: "#ffffff" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}
                    >
                      {detalhesTCGP.nome_tcgp}
                    </h3>
                  </div>
                </div>
                <Divider
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    margin: "1rem 0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <i
                    className="pi pi-envelope"
                    style={{ fontSize: "1.1rem" }}
                  ></i>
                  <a
                    href={`mailto:${detalhesTCGP.email_tcgp}`}
                    style={{
                      color: "#ffffff",
                      textDecoration: "none",
                      fontSize: "1rem",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.8")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {detalhesTCGP.email_tcgp}
                  </a>
                </div>
              </div>
            </Card>

            {/* Card de Escolas */}
            <Card style={{ border: "1px solid #e9ecef", borderRadius: "8px" }}>
              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <i
                    className="pi pi-building"
                    style={{ fontSize: "1.25rem", color: "#0d6efd" }}
                  ></i>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Escolas que atua ({detalhesTCGP.escolas.length})
                  </h4>
                </div>
                <Divider />
                <div style={{ marginTop: "1.25rem" }}>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    {detalhesTCGP.escolas.map((escola, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          padding: "1rem",
                          background: "#f8f9fa",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          border: "1px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#e9ecef";
                          e.currentTarget.style.borderColor = "#dee2e6";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f8f9fa";
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#0d6efd",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            flexShrink: 0,
                            marginTop: "0.125rem",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <span
                            style={{
                              fontSize: "0.95rem",
                              color: "#212529",
                              fontWeight: 600,
                            }}
                          >
                            {escola.nome}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontSize: "0.85rem",
                              color: "#6c757d",
                            }}
                          >
                            <i className="pi pi-map-marker" style={{ fontSize: "0.75rem" }}></i>
                            <span>
                              {escola.endereco}, {escola.numero} - {escola.bairro}, {escola.municipio}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Dialog>
    </>
  );
}
