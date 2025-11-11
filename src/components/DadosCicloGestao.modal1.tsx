import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  loadEscolasFromCsv,
  calcularDadosEspiritoSanto,
  calcularDadosRegionais,
  calcularDadosMunicipios,
  calcularDadosEscolaPorSerie,
} from "../utils/csvParser";
import type {
  Escola,
  DadosEspiritoSanto,
  DadosRegional,
  DadosMunicipio,
  DadosEscolaPorSerie,
} from "../types/Escola";
import "./DadosCicloGestao.modal1.css";

interface DadosCicloGestaoModalProps {
  visible: boolean;
  tipo: string | null;
  onHide: () => void;
}

export default function DadosCicloGestaoModal({
  visible,
  tipo,
  onHide,
}: DadosCicloGestaoModalProps) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [dadosES, setDadosES] = useState<DadosEspiritoSanto | null>(null);
  const [dadosRegionais, setDadosRegionais] = useState<DadosRegional[]>([]);
  const [dadosMunicipios, setDadosMunicipios] = useState<DadosMunicipio[]>([]);
  const [dadosEscolaPorSerie, setDadosEscolaPorSerie] = useState<
    DadosEscolaPorSerie[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Estados para controle de navegação hierárquica
  const [tabelaAtiva, setTabelaAtiva] = useState<
    "regionais" | "municipios" | "escolas" | "dados-escola"
  >("regionais");
  const [regionalSelecionada, setRegionalSelecionada] = useState<string | null>(
    null
  );
  const [municipioSelecionado, setMunicipioSelecionado] = useState<
    string | null
  >(null);
  const [escolaSelecionada, setEscolaSelecionada] = useState<Escola | null>(
    null
  );

  useEffect(() => {
    if (visible) {
      loadData();
      // Resetar navegação quando o modal abrir
      setTabelaAtiva("regionais");
      setRegionalSelecionada(null);
      setMunicipioSelecionado(null);
      setEscolaSelecionada(null);
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
      setDadosEscolaPorSerie(calcularDadosEscolaPorSerie(escolasData));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTitulo = () => {
    if (tipo === "numeros-totais") {
      return null;
    }
    switch (tipo) {
      case "alunos-regional":
        return "Alunos por Regional e Município";
      default:
        return "Detalhes";
    }
  };

  const formatarNumero = (numero: number): string => {
    return numero.toLocaleString("pt-BR");
  };

  // Funções de filtro
  const getMunicipiosFiltrados = (): DadosMunicipio[] => {
    if (!regionalSelecionada) return [];
    return dadosMunicipios.filter((m) => m.regional === regionalSelecionada);
  };

  const getEscolasFiltradas = (): Escola[] => {
    if (!municipioSelecionado) return [];
    return escolas.filter((e) => e.municipio === municipioSelecionado);
  };

  const getDadosEscolaFiltrados = (): DadosEscolaPorSerie[] => {
    if (!escolaSelecionada) return [];
    return dadosEscolaPorSerie.filter(
      (d) => d.escola === escolaSelecionada.nome
    );
  };

  // Função de transição com animação
  const transicionarTabela = (
    novaTabela: "regionais" | "municipios" | "escolas" | "dados-escola"
  ) => {
    setTabelaAtiva(novaTabela);
  };

  // Handlers de clique
  const handleRegionalClick = (regional: DadosRegional) => {
    setRegionalSelecionada(regional.regional);
    transicionarTabela("municipios");
  };

  const handleMunicipioClick = (municipio: DadosMunicipio) => {
    setMunicipioSelecionado(municipio.municipio);
    transicionarTabela("escolas");
  };

  const handleEscolaClick = (escola: Escola) => {
    setEscolaSelecionada(escola);
    transicionarTabela("dados-escola");
  };

  // Funções de navegação para voltar
  const voltarParaRegionais = () => {
    setRegionalSelecionada(null);
    setMunicipioSelecionado(null);
    setEscolaSelecionada(null);
    transicionarTabela("regionais");
  };

  const voltarParaMunicipios = () => {
    setMunicipioSelecionado(null);
    setEscolaSelecionada(null);
    transicionarTabela("municipios");
  };

  const voltarParaEscolas = () => {
    setEscolaSelecionada(null);
    transicionarTabela("escolas");
  };

  const renderCardEspiritoSanto = () => {
    if (!dadosES) return null;

    return (
      <Card className="modal-card">
        <div className="modal-card-content">
          <h3 className="modal-card-titulo">Espírito Santo</h3>
          <div className="modal-tabela-dados">
            <div className="dado-item">
              <span className="dado-label">Escolas</span>
              <span className="dado-valor">
                {formatarNumero(dadosES.escolas)}
              </span>
            </div>
            <div className="dado-item">
              <span className="dado-label">Turmas</span>
              <span className="dado-valor">
                {formatarNumero(dadosES.turmas)}
              </span>
            </div>
            <div className="dado-item">
              <span className="dado-label">Alunos</span>
              <span className="dado-valor">
                {formatarNumero(dadosES.alunos)}
              </span>
            </div>
            <div className="dado-item">
              <span className="dado-label">TCGPs</span>
              <span className="dado-valor">
                {formatarNumero(dadosES.tcgps)}
              </span>
            </div>
            <div className="dado-item">
              <span className="dado-label">Professores</span>
              <span className="dado-valor">
                {formatarNumero(dadosES.professores)}
              </span>
            </div>
            <div className="dado-item">
              <span className="dado-label">Pedagogos</span>
              <span className="dado-valor">
                {formatarNumero(dadosES.pedagogos)}
              </span>
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
            onRowClick={(e) => handleRegionalClick(e.data as DadosRegional)}
          >
            <Column field="regional" header="Regional" sortable />
            <Column
              field="escolas"
              header="Escolas"
              sortable
              body={(rowData) => formatarNumero(rowData.escolas)}
            />
            <Column
              field="turmas"
              header="Turmas"
              sortable
              body={(rowData) => formatarNumero(rowData.turmas)}
            />
            <Column
              field="alunos"
              header="Alunos"
              sortable
              body={(rowData) => formatarNumero(rowData.alunos)}
            />
            <Column
              field="professores"
              header="Professores"
              sortable
              body={(rowData) => formatarNumero(rowData.professores)}
            />
            <Column
              field="pedagogos"
              header="Pedagogos"
              sortable
              body={(rowData) => formatarNumero(rowData.pedagogos)}
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
            onRowClick={(e) => handleMunicipioClick(e.data as DadosMunicipio)}
          >
            <Column field="municipio" header="Município" sortable />
            <Column
              field="escolas"
              header="Escolas"
              sortable
              body={(rowData) => formatarNumero(rowData.escolas)}
            />
            <Column
              field="turmas"
              header="Turmas"
              sortable
              body={(rowData) => formatarNumero(rowData.turmas)}
            />
            <Column
              field="alunos"
              header="Alunos"
              sortable
              body={(rowData) => formatarNumero(rowData.alunos)}
            />
            <Column
              field="professores"
              header="Professores"
              sortable
              body={(rowData) => formatarNumero(rowData.professores)}
            />
            <Column
              field="pedagogos"
              header="Pedagogos"
              sortable
              body={(rowData) => formatarNumero(rowData.pedagogos)}
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
            className="modal-datatable tabela-clickable"
            onRowClick={(e) => handleEscolaClick(e.data as Escola)}
          >
            <Column field="nome" header="Escola" sortable />
            <Column
              field="total_turmas"
              header="Turmas"
              sortable
              body={(rowData) => formatarNumero(rowData.total_turmas || 0)}
            />
            <Column
              field="total_alunos"
              header="Alunos"
              sortable
              body={(rowData) => formatarNumero(rowData.total_alunos || 0)}
            />
            <Column
              field="total_professores"
              header="Professores"
              sortable
              body={(rowData) => formatarNumero(rowData.total_professores || 0)}
            />
            <Column
              field="total_pedagogos"
              header="Pedagogos"
              sortable
              body={(rowData) => formatarNumero(rowData.total_pedagogos || 0)}
            />
          </DataTable>
        </div>
      </Card>
    );
  };

  const renderCardSeries = () => {
    const dadosFiltrados = getDadosEscolaFiltrados();

    // Função para transformar dados da escola em linhas de turmas
    const transformarEmLinhas = (escola: DadosEscolaPorSerie) => {
      const linhas: Array<{
        serie1: { nome: string; alunos: number } | null;
        serie2: { nome: string; alunos: number } | null;
        serie3: { nome: string; alunos: number } | null;
        serie4: { nome: string; alunos: number } | null;
        serie5: { nome: string; alunos: number } | null;
        isTotal?: boolean;
      }> = [];

      // Encontrar o número máximo de turmas em qualquer série
      const maxTurmas = Math.max(
        escola.serie1.length,
        escola.serie2.length,
        escola.serie3.length,
        escola.serie4.length,
        escola.serie5.length
      );

      // Criar uma linha para cada turma (de 1 até maxTurmas)
      for (let i = 0; i < maxTurmas; i++) {
        linhas.push({
          serie1: escola.serie1[i] || null,
          serie2: escola.serie2[i] || null,
          serie3: escola.serie3[i] || null,
          serie4: escola.serie4[i] || null,
          serie5: escola.serie5[i] || null,
        });
      }

      // Adicionar linha de total no final
      linhas.push({
        serie1: {
          nome: "Total",
          alunos: escola.serie1.reduce((sum, t) => sum + t.alunos, 0),
        },
        serie2: {
          nome: "Total",
          alunos: escola.serie2.reduce((sum, t) => sum + t.alunos, 0),
        },
        serie3: {
          nome: "Total",
          alunos: escola.serie3.reduce((sum, t) => sum + t.alunos, 0),
        },
        serie4: {
          nome: "Total",
          alunos: escola.serie4.reduce((sum, t) => sum + t.alunos, 0),
        },
        serie5: {
          nome: "Total",
          alunos: escola.serie5.reduce((sum, t) => sum + t.alunos, 0),
        },
        isTotal: true,
      });

      return linhas;
    };

    return (
      <div
        className={`escolas-container tabela-container ${
          tabelaAtiva === "dados-escola" ? "aberta" : "fechada"
        }`}
      >
        {dadosFiltrados.map((escola, index) => {
          const linhas = transformarEmLinhas(escola);

          return (
            <Card key={index} className="modal-card escola-card">
              <div className="modal-card-content">
                <div className="modal-card-header-nav">
                  <h3 className="modal-card-titulo">
                    Dados da Escola "{escola.escola}"
                  </h3>
                  <button className="btn-voltar" onClick={voltarParaEscolas}>
                    <i className="pi pi-arrow-left"></i>
                    Voltar
                  </button>
                </div>
                <DataTable
                  value={linhas}
                  loading={loading}
                  className="modal-datatable escola-datatable"
                >
                  <Column
                    header="1ª Série"
                    body={(rowData) => {
                      if (rowData.isTotal) {
                        return (
                          <span className="total-row">
                            {formatarNumero(rowData.serie1?.alunos || 0)} alunos
                          </span>
                        );
                      }
                      if (!rowData.serie1) {
                        return <span>-</span>;
                      }
                      return (
                        <div className="turma-info">
                          <span className="turma-nome">
                            {rowData.serie1.nome}:
                          </span>
                          <span className="turma-alunos">
                            {formatarNumero(rowData.serie1.alunos)} alunos
                          </span>
                        </div>
                      );
                    }}
                  />
                  <Column
                    header="2ª Série"
                    body={(rowData) => {
                      if (rowData.isTotal) {
                        return (
                          <span className="total-row">
                            {formatarNumero(rowData.serie2?.alunos || 0)} alunos
                          </span>
                        );
                      }
                      if (!rowData.serie2) {
                        return <span>-</span>;
                      }
                      return (
                        <div className="turma-info">
                          <span className="turma-nome">
                            {rowData.serie2.nome}:
                          </span>
                          <span className="turma-alunos">
                            {formatarNumero(rowData.serie2.alunos)} alunos
                          </span>
                        </div>
                      );
                    }}
                  />
                  <Column
                    header="3ª Série"
                    body={(rowData) => {
                      if (rowData.isTotal) {
                        return (
                          <span className="total-row">
                            {formatarNumero(rowData.serie3?.alunos || 0)} alunos
                          </span>
                        );
                      }
                      if (!rowData.serie3) {
                        return <span>-</span>;
                      }
                      return (
                        <div className="turma-info">
                          <span className="turma-nome">
                            {rowData.serie3.nome}:
                          </span>
                          <span className="turma-alunos">
                            {formatarNumero(rowData.serie3.alunos)} alunos
                          </span>
                        </div>
                      );
                    }}
                  />
                  <Column
                    header="4ª Série"
                    body={(rowData) => {
                      if (rowData.isTotal) {
                        return (
                          <span className="total-row">
                            {formatarNumero(rowData.serie4?.alunos || 0)} alunos
                          </span>
                        );
                      }
                      if (!rowData.serie4) {
                        return <span>-</span>;
                      }
                      return (
                        <div className="turma-info">
                          <span className="turma-nome">
                            {rowData.serie4.nome}:
                          </span>
                          <span className="turma-alunos">
                            {formatarNumero(rowData.serie4.alunos)} alunos
                          </span>
                        </div>
                      );
                    }}
                  />
                  <Column
                    header="5ª Série"
                    body={(rowData) => {
                      if (rowData.isTotal) {
                        return (
                          <span className="total-row">
                            {formatarNumero(rowData.serie5?.alunos || 0)} alunos
                          </span>
                        );
                      }
                      if (!rowData.serie5) {
                        return <span>-</span>;
                      }
                      return (
                        <div className="turma-info">
                          <span className="turma-nome">
                            {rowData.serie5.nome}:
                          </span>
                          <span className="turma-alunos">
                            {formatarNumero(rowData.serie5.alunos)} alunos
                          </span>
                        </div>
                      );
                    }}
                  />
                </DataTable>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderConteudo = () => {
    if (tipo === "numeros-totais") {
      return (
        <div className="modal-conteudo">
          {renderCardEspiritoSanto()}
          {tabelaAtiva === "regionais" && renderCardRegionais()}
          {tabelaAtiva === "municipios" && renderCardMunicipios()}
          {tabelaAtiva === "escolas" && renderCardEscolas()}
          {tabelaAtiva === "dados-escola" && renderCardSeries()}
        </div>
      );
    }

    return null;
  };


  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={getTitulo()}
      className="dados-ciclo-gestao-modal"
      modal
      draggable={false}
      resizable={false}
      style={{ width: "95vw", maxWidth: "1400px", height: "90vh" }}
    >
      {renderConteudo()}
    </Dialog>
  );
}
