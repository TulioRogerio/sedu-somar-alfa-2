import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  loadEscolasFromCsv,
  calcularMetasEstado,
  calcularMetasRegionais,
  calcularMetasMunicipios,
  calcularMetasEscolas,
} from "../utils/csvParser";
import type {
  Escola,
  DadosMetasEstado,
  DadosMetasRegional,
  DadosMetasMunicipio,
  DadosMetasEscola,
} from "../types/Escola";
import "./DadosCicloGestao.modal1.css";

interface DadosCicloGestaoModal3Props {
  visible: boolean;
  onHide: () => void;
}

export default function DadosCicloGestaoModal3({
  visible,
  onHide,
}: DadosCicloGestaoModal3Props) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [metasEstado, setMetasEstado] = useState<DadosMetasEstado | null>(
    null
  );
  const [metasRegionais, setMetasRegionais] = useState<DadosMetasRegional[]>(
    []
  );
  const [metasMunicipios, setMetasMunicipios] = useState<DadosMetasMunicipio[]>(
    []
  );
  const [metasEscolas, setMetasEscolas] = useState<DadosMetasEscola[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para navegação de metas
  const [tabelaMetasAtiva, setTabelaMetasAtiva] = useState<
    "estado" | "regionais" | "municipios" | "escolas"
  >("estado");
  const [regionalMetasSelecionada, setRegionalMetasSelecionada] = useState<
    string | null
  >(null);
  const [municipioMetasSelecionado, setMunicipioMetasSelecionado] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (visible) {
      loadData();
      // Resetar navegação de metas
      setTabelaMetasAtiva("estado");
      setRegionalMetasSelecionada(null);
      setMunicipioMetasSelecionado(null);
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const escolasData = await loadEscolasFromCsv();
      setEscolas(escolasData);
      // Carregar dados de metas
      setMetasEstado(calcularMetasEstado(escolasData));
      setMetasRegionais(calcularMetasRegionais(escolasData));
      setMetasMunicipios(calcularMetasMunicipios(escolasData));
      setMetasEscolas(calcularMetasEscolas(escolasData));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funções de filtro para metas
  const getMetasMunicipiosFiltrados = (): DadosMetasMunicipio[] => {
    if (!regionalMetasSelecionada) return [];
    return metasMunicipios.filter(
      (m) => m.regional === regionalMetasSelecionada
    );
  };

  const getMetasEscolasFiltradas = (): DadosMetasEscola[] => {
    if (!municipioMetasSelecionado) return [];
    const escolasDoMunicipio = escolas
      .filter((e) => e.municipio === municipioMetasSelecionado)
      .map((e) => e.nome);
    return metasEscolas.filter((m) => escolasDoMunicipio.includes(m.escola));
  };

  // Função de transição para metas
  const transicionarTabelaMetas = (
    novaTabela: "estado" | "regionais" | "municipios" | "escolas"
  ) => {
    setTabelaMetasAtiva(novaTabela);
  };

  // Handlers de clique para metas
  const handleRegionalMetasClick = (regional: DadosMetasRegional) => {
    setRegionalMetasSelecionada(regional.regional);
    transicionarTabelaMetas("municipios");
  };

  const handleMunicipioMetasClick = (municipio: DadosMetasMunicipio) => {
    setMunicipioMetasSelecionado(municipio.municipio);
    transicionarTabelaMetas("escolas");
  };

  // Funções de navegação para voltar (metas)
  const voltarParaRegionaisMetas = () => {
    setMunicipioMetasSelecionado(null);
    setRegionalMetasSelecionada(null);
    transicionarTabelaMetas("estado");
  };

  const voltarParaMunicipiosMetas = () => {
    setMunicipioMetasSelecionado(null);
    transicionarTabelaMetas("municipios");
  };

  const formatarNumeroDecimal = (numero: number): string => {
    return numero.toFixed(1);
  };

  const renderCardMetasEstado = () => {
    if (!metasEstado) return null;

    return (
      <Card className="modal-card">
        <div className="modal-card-content">
          <h3 className="modal-card-titulo">Espírito Santo</h3>
          <div className="modal-tabela-dados">
            <div className="dado-item">
              <span className="dado-label">Meta IDEBES ALFA 2024</span>
              <span className="dado-valor">
                {formatarNumeroDecimal(metasEstado.meta_idebes_alfa_2024)}
              </span>
            </div>
            <div className="dado-item">
              <span className="dado-label">IDEBES ALFA 2024</span>
              <span className="dado-valor">
                {formatarNumeroDecimal(metasEstado.idebes_alfa_2024)}
              </span>
            </div>
            <div className="dado-item">
              <span className="dado-label">Meta IDEBES ALFA 2025</span>
              <span className="dado-valor">
                {formatarNumeroDecimal(metasEstado.meta_idebes_alfa_2025)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderCardMetasRegionais = () => {
    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaMetasAtiva === "estado" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <h3 className="modal-card-titulo">Metas das Regionais</h3>
          <DataTable
            value={metasRegionais}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            className="modal-datatable tabela-clickable"
            onRowClick={(e) =>
              handleRegionalMetasClick(e.data as DadosMetasRegional)
            }
          >
            <Column field="regional" header="Regional" sortable />
            <Column
              field="meta_idebes_alfa_2024"
              header="Meta IDEBES ALFA 2024"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.meta_idebes_alfa_2024)
              }
            />
            <Column
              field="idebes_alfa_2024"
              header="IDEBES ALFA 2024"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.idebes_alfa_2024)
              }
            />
            <Column
              field="meta_idebes_alfa_2025"
              header="Meta IDEBES ALFA 2025"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.meta_idebes_alfa_2025)
              }
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderCardMetasMunicipios = () => {
    const municipiosFiltrados = getMetasMunicipiosFiltrados();

    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaMetasAtiva === "municipios" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <div className="modal-card-header-nav">
            <h3 className="modal-card-titulo">
              Metas dos Municípios{" "}
              {regionalMetasSelecionada && `- ${regionalMetasSelecionada}`}
            </h3>
            <button className="btn-voltar" onClick={voltarParaRegionaisMetas}>
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
              handleMunicipioMetasClick(e.data as DadosMetasMunicipio)
            }
          >
            <Column field="municipio" header="Município" sortable />
            <Column
              field="meta_idebes_alfa_2024"
              header="Meta IDEBES ALFA 2024"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.meta_idebes_alfa_2024)
              }
            />
            <Column
              field="idebes_alfa_2024"
              header="IDEBES ALFA 2024"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.idebes_alfa_2024)
              }
            />
            <Column
              field="meta_idebes_alfa_2025"
              header="Meta IDEBES ALFA 2025"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.meta_idebes_alfa_2025)
              }
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderCardMetasEscolas = () => {
    const escolasFiltradas = getMetasEscolasFiltradas();

    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaMetasAtiva === "escolas" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <div className="modal-card-header-nav">
            <h3 className="modal-card-titulo">
              Metas das Escolas{" "}
              {municipioMetasSelecionado && `- ${municipioMetasSelecionado}`}
            </h3>
            <button className="btn-voltar" onClick={voltarParaMunicipiosMetas}>
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
            className="modal-datatable"
          >
            <Column field="escola" header="Escola" sortable />
            <Column
              field="meta_idebes_alfa_2024"
              header="Meta IDEBES ALFA 2024"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.meta_idebes_alfa_2024)
              }
            />
            <Column
              field="idebes_alfa_2024"
              header="IDEBES ALFA 2024"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.idebes_alfa_2024)
              }
            />
            <Column
              field="meta_idebes_alfa_2025"
              header="Meta IDEBES ALFA 2025"
              sortable
              body={(rowData) =>
                formatarNumeroDecimal(rowData.meta_idebes_alfa_2025)
              }
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderConteudoEscolasMetas = () => {
    return (
      <div className="modal-conteudo">
        {renderCardMetasEstado()}
        {tabelaMetasAtiva === "estado" && renderCardMetasRegionais()}
        {tabelaMetasAtiva === "municipios" && renderCardMetasMunicipios()}
        {tabelaMetasAtiva === "escolas" && renderCardMetasEscolas()}
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Escolas e Metas"
      className="dados-ciclo-gestao-modal"
      modal
      draggable={false}
      resizable={false}
      style={{ width: "95vw", maxWidth: "1400px", height: "90vh" }}
    >
      {renderConteudoEscolasMetas()}
    </Dialog>
  );
}

