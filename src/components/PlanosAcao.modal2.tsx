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
  const [pendencias, setPendencias] = useState<{
    regional: string;
    municipio: string;
    escola: string;
  }[]>([]);
  const [planosInativos, setPlanosInativos] = useState<{
    regional: string;
    municipio: string;
    escola: string;
    planoAcaoId: string;
  }[]>([]);

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

      // Calcular pendências
      const escolasComMapas = new Set(
        cicloData.map((row) => parseInt(row.escola_id))
      );
      const pendenciasList = escolasData
        .filter((escola) => !escolasComMapas.has(escola.id))
        .map((escola) => ({
          regional: escola.regional,
          municipio: escola.municipio,
          escola: escola.nome,
        }));
      setPendencias(pendenciasList);

      // Calcular planos inativos
      const planosInativosList: {
        regional: string;
        municipio: string;
        escola: string;
        planoAcaoId: string;
      }[] = [];
      
      const planosUnicos = new Set(
        cicloData.map((row) => `${row.escola_id}-${row.plano_acao_id}`)
      );
      
      for (const planoKey of planosUnicos) {
        const [escolaId, planoId] = planoKey.split('-');
        const dadosPlano = cicloData.filter(
          (row) => row.escola_id === escolaId && row.plano_acao_id === planoId
        );
        
        // Verificar se o plano está inativo
        const temTarefasEmAndamento = dadosPlano.some(
          (row) => parseInt(row.tarefas_em_andamento || '0') > 0
        );
        const temTarefasAtrasadas = dadosPlano.some(
          (row) => parseInt(row.tarefas_atrasadas || '0') > 0
        );
        const temTarefas = dadosPlano.some(
          (row) => parseInt(row.tarefas_total || '0') > 0
        );
        
        if (temTarefas && !temTarefasEmAndamento && !temTarefasAtrasadas) {
          const escola = escolasData.find((e) => e.id.toString() === escolaId);
          if (escola) {
            planosInativosList.push({
              regional: escola.regional,
              municipio: escola.municipio,
              escola: escola.nome,
              planoAcaoId: planoId,
            });
          }
        }
      }
      
      setPlanosInativos(planosInativosList);
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
            <div className="dado-item">
              <span className="dado-valor">
                {formatarNumero(dadosES.planosInativos)}
              </span>
              <span className="dado-label">Planos Inativos</span>
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
            <Column
              field="possuiPlanosInativos"
              header={<span>Possui Planos de<br />Ação Inativos</span>}
              sortable
              body={(rowData) => (
                <span
                  className={`badge ${
                    rowData.possuiPlanosInativos ? "badge-sim" : "badge-nao"
                  }`}
                >
                  {rowData.possuiPlanosInativos ? "Sim" : "Não"}
                </span>
              )}
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
            <Column
              field="possuiPlanosInativos"
              header={<span>Possui Planos de<br />Ação Inativos</span>}
              sortable
              body={(rowData) => (
                <span
                  className={`badge ${
                    rowData.possuiPlanosInativos ? "badge-sim" : "badge-nao"
                  }`}
                >
                  {rowData.possuiPlanosInativos ? "Sim" : "Não"}
                </span>
              )}
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
            <Column
              field="possuiPlanosInativos"
              header={<span>Possui Planos de<br />Ação Inativos</span>}
              sortable
              body={(rowData) => (
                <span
                  className={`badge ${
                    rowData.possuiPlanosInativos ? "badge-sim" : "badge-nao"
                  }`}
                >
                  {rowData.possuiPlanosInativos ? "Sim" : "Não"}
                </span>
              )}
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderCardPendencias = () => {
    return (
      <Card className="modal-card modal-card-pendencias">
        <div className="modal-card-content">
          <h3 className="modal-card-titulo" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="pi pi-exclamation-triangle" style={{ color: "#f57c00" }}></i>
            Pendências de Postagem
          </h3>
          <p style={{ margin: "0 0 1rem 0", color: "#495057" }}>
            Existem escolas que ainda não postaram seus Mapas de Ação:
          </p>
          
          {pendencias.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#28a745" }}>
              <i className="pi pi-check-circle" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}></i>
              <p style={{ margin: 0, fontWeight: 500 }}>Nenhuma pendência encontrada. Todas as escolas postaram seus Mapas de Ação.</p>
            </div>
          ) : (
            <>
              <DataTable
                value={pendencias}
                className="modal-datatable"
                emptyMessage="Nenhuma pendência encontrada"
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
              >
                <Column
                  field="regional"
                  header="Regional"
                  sortable
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="municipio"
                  header="Município"
                  sortable
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="escola"
                  header="Escola"
                  sortable
                  style={{ minWidth: "300px" }}
                />
              </DataTable>
              
              <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #dee2e6" }}>
                <p style={{ margin: 0, fontWeight: 600, color: "#212529", fontSize: "1rem" }}>
                  Total de pendências: <span style={{ color: "#dc2626" }}>{pendencias.length}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    );
  };

  const renderCardPlanosInativos = () => {
    if (planosInativos.length === 0) return null;

    return (
      <Card className="modal-card">
        <div className="modal-card-content">
          <h3 className="modal-card-titulo" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="pi pi-exclamation-circle" style={{ color: "#dc2626" }}></i>
            Planos de Ação Inativos
          </h3>
          <p style={{ margin: "0 0 1rem 0", color: "#495057" }}>
            Escolas com planos de ação inativos (sem tarefas em andamento e sem tarefas atrasadas):
          </p>
          
          <DataTable
            value={planosInativos}
            className="modal-datatable"
            emptyMessage="Nenhum plano inativo encontrado"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
          >
            <Column
              field="regional"
              header="Regional"
              sortable
              style={{ minWidth: "200px" }}
            />
            <Column
              field="municipio"
              header="Município"
              sortable
              style={{ minWidth: "200px" }}
            />
            <Column
              field="escola"
              header="Escola"
              sortable
              style={{ minWidth: "300px" }}
            />
            <Column
              field="planoAcaoId"
              header="ID do Plano"
              sortable
              style={{ minWidth: "120px" }}
            />
          </DataTable>
          
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #dee2e6" }}>
            <p style={{ margin: 0, fontWeight: 600, color: "#212529", fontSize: "1rem" }}>
              Total de planos inativos: <span style={{ color: "#dc2626" }}>{planosInativos.length}</span>
            </p>
          </div>
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
          {renderCardPlanosInativos()}
          {renderCardMunicipios()}
          {renderCardEscolas()}
          {renderCardPendencias()}
        </>
      )}
    </Dialog>
  );
}

