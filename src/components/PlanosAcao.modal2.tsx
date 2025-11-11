import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { loadEscolasFromCsv } from "../utils/csvParser";
import {
  loadCicloGestaoCsv,
  calcularDadosPlanosAcaoEstado,
  calcularDadosPlanosAcaoRegionais,
  calcularDadosPlanosAcaoMunicipios,
  calcularDadosPlanosAcaoEscolas,
} from "../utils/cicloGestaoParser";
import type { Escola } from "../types/Escola";
import type {
  DadosPlanosAcao,
  DadosPlanosAcaoRegional,
  DadosPlanosAcaoMunicipio,
  DadosPlanosAcaoEscola,
} from "../types/CicloGestao";
import "./PlanosAcao.modal1.css";

interface PlanosAcaoModal2Props {
  visible: boolean;
  onHide: () => void;
}

export default function PlanosAcaoModal2({
  visible,
  onHide,
}: PlanosAcaoModal2Props) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [cicloGestaoData, setCicloGestaoData] = useState<any[]>([]);
  const [dadosES, setDadosES] = useState<DadosPlanosAcao | null>(null);
  const [dadosRegionais, setDadosRegionais] = useState<
    DadosPlanosAcaoRegional[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Estados para controle de navegação hierárquica
  const [tabelaAtiva, setTabelaAtiva] = useState<
    "regionais" | "municipios" | "escolas"
  >("regionais");
  const [regionalSelecionada, setRegionalSelecionada] = useState<
    string | null
  >(null);
  const [municipioSelecionado, setMunicipioSelecionado] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (visible) {
      loadData();
      // Resetar navegação quando o modal abrir
      setTabelaAtiva("regionais");
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

      setDadosES(calcularDadosPlanosAcaoEstado(cicloData, escolasData));
      setDadosRegionais(
        calcularDadosPlanosAcaoRegionais(cicloData, escolasData)
      );
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
  const getMunicipiosFiltrados = (): DadosPlanosAcaoMunicipio[] => {
    if (!regionalSelecionada) return [];
    return calcularDadosPlanosAcaoMunicipios(
      cicloGestaoData,
      escolas,
      regionalSelecionada
    );
  };

  const getEscolasFiltradas = (): DadosPlanosAcaoEscola[] => {
    if (!municipioSelecionado) return [];
    return calcularDadosPlanosAcaoEscolas(
      cicloGestaoData,
      escolas,
      municipioSelecionado,
      regionalSelecionada || undefined
    );
  };

  // Função de transição com animação
  const transicionarTabela = (
    novaTabela: "regionais" | "municipios" | "escolas"
  ) => {
    setTabelaAtiva(novaTabela);
  };

  // Handlers de clique
  const handleRegionalClick = (regional: DadosPlanosAcaoRegional) => {
    setRegionalSelecionada(regional.regional);
    transicionarTabela("municipios");
  };

  const handleMunicipioClick = (municipio: DadosPlanosAcaoMunicipio) => {
    setMunicipioSelecionado(municipio.municipio);
    transicionarTabela("escolas");
  };

  // Funções de navegação para voltar
  const voltarParaRegionais = () => {
    setRegionalSelecionada(null);
    setMunicipioSelecionado(null);
    transicionarTabela("regionais");
  };

  const voltarParaMunicipios = () => {
    setMunicipioSelecionado(null);
    transicionarTabela("municipios");
  };

  const renderCardEspiritoSanto = () => {
    if (!dadosES) return null;

    return (
      <Card className="modal-card">
        <div className="modal-card-content">
          <h3 className="modal-card-titulo">Espírito Santo</h3>
          <div className="modal-tabela-dados">
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.planosAcao)}
              </span>
              <span className="dado-label">Planos de Ação</span>
            </div>
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.mapasAcao)}
              </span>
              <span className="dado-label">Mapas de Ação</span>
            </div>
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.mapasLP)}
              </span>
              <span className="dado-label">Mapas de Língua Portuguesa</span>
            </div>
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.mapasMat)}
              </span>
              <span className="dado-label">Mapas de Matemática</span>
            </div>
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.mapasLeitura)}
              </span>
              <span className="dado-label">Mapas de Leitura</span>
            </div>
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.mapasOutros)}
              </span>
              <span className="dado-label">Outros mapas</span>
            </div>
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.validados)}
              </span>
              <span className="dado-label">Validados pelo TCGP</span>
            </div>
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.pendentes)}
              </span>
              <span className="dado-label">Não validados pelo TCGP</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderCardRegionais = () => {
    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaAtiva === "regionais" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <h3 className="modal-card-titulo">Dados das Regionais</h3>
          <DataTable
            value={dadosRegionais}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            className="modal-datatable tabela-clickable"
            onRowClick={(e) =>
              handleRegionalClick(e.data as DadosPlanosAcaoRegional)
            }
          >
            <Column field="regional" header="Regional" sortable />
            <Column
              field="planosAcao"
              header="Planos de Ação"
              sortable
              body={(rowData) => formatarNumero(rowData.planosAcao)}
            />
            <Column
              field="mapasAcao"
              header="Mapas de Ação"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasAcao)}
            />
            <Column
              field="mapasLP"
              header={<span>Mapas de<br />Língua Portuguesa</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.mapasLP)}
            />
            <Column
              field="mapasMat"
              header={<span>Mapas de<br />Matemática</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.mapasMat)}
            />
            <Column
              field="mapasLeitura"
              header="Mapas de Leitura"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasLeitura)}
            />
            <Column
              field="mapasOutros"
              header="Outros mapas"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasOutros)}
            />
            <Column
              field="validados"
              header={<span>Validados pelo<br />TCGP</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.validados)}
            />
            <Column
              field="pendentes"
              header={<span>Não validados<br />pelo TCGP</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.pendentes)}
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderCardMunicipios = () => {
    const municipiosFiltrados = getMunicipiosFiltrados();

    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaAtiva === "municipios" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <div className="modal-card-header-nav">
            <h3 className="modal-card-titulo">
              Dados dos Municípios{" "}
              {regionalSelecionada && `- ${regionalSelecionada}`}
            </h3>
            <button className="btn-voltar" onClick={voltarParaRegionais}>
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
              handleMunicipioClick(e.data as DadosPlanosAcaoMunicipio)
            }
          >
            <Column field="municipio" header="Município" sortable />
            <Column
              field="planosAcao"
              header="Planos de Ação"
              sortable
              body={(rowData) => formatarNumero(rowData.planosAcao)}
            />
            <Column
              field="mapasAcao"
              header="Mapas de Ação"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasAcao)}
            />
            <Column
              field="mapasLP"
              header={<span>Mapas de<br />Língua Portuguesa</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.mapasLP)}
            />
            <Column
              field="mapasMat"
              header={<span>Mapas de<br />Matemática</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.mapasMat)}
            />
            <Column
              field="mapasLeitura"
              header="Mapas de Leitura"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasLeitura)}
            />
            <Column
              field="mapasOutros"
              header="Outros mapas"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasOutros)}
            />
            <Column
              field="validados"
              header={<span>Validados pelo<br />TCGP</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.validados)}
            />
            <Column
              field="pendentes"
              header={<span>Não validados<br />pelo TCGP</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.pendentes)}
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderCardEscolas = () => {
    const escolasFiltradas = getEscolasFiltradas();

    return (
      <Card
        className={`modal-card tabela-container ${
          tabelaAtiva === "escolas" ? "aberta" : "fechada"
        }`}
      >
        <div className="modal-card-content">
          <div className="modal-card-header-nav">
            <h3 className="modal-card-titulo">
              Dados das Escolas{" "}
              {municipioSelecionado && `- ${municipioSelecionado}`}
            </h3>
            <button className="btn-voltar" onClick={voltarParaMunicipios}>
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
              field="planosAcao"
              header="Planos de Ação"
              sortable
              body={(rowData) => formatarNumero(rowData.planosAcao)}
            />
            <Column
              field="mapasAcao"
              header="Mapas de Ação"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasAcao)}
            />
            <Column
              field="mapasLP"
              header={<span>Mapas de<br />Língua Portuguesa</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.mapasLP)}
            />
            <Column
              field="mapasMat"
              header={<span>Mapas de<br />Matemática</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.mapasMat)}
            />
            <Column
              field="mapasLeitura"
              header="Mapas de Leitura"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasLeitura)}
            />
            <Column
              field="mapasOutros"
              header="Outros mapas"
              sortable
              body={(rowData) => formatarNumero(rowData.mapasOutros)}
            />
            <Column
              field="validados"
              header={<span>Validados pelo<br />TCGP</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.validados)}
            />
            <Column
              field="pendentes"
              header={<span>Não validados<br />pelo TCGP</span>}
              sortable
              body={(rowData) => formatarNumero(rowData.pendentes)}
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={null}
      className="planos-acao-modal dados-ciclo-gestao-modal"
      modal
      draggable={false}
      resizable={false}
      style={{ width: "95vw", maxWidth: "1400px", maxHeight: "90vh" }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
          <p>Carregando dados...</p>
        </div>
      ) : (
        <>
          {renderCardEspiritoSanto()}
          {renderCardRegionais()}
          {renderCardMunicipios()}
          {renderCardEscolas()}
        </>
      )}
    </Dialog>
  );
}

