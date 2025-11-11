import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import PlanosAcaoModal2 from "./PlanosAcao.modal2";
import DadosCicloGestaoModal from "./DadosCicloGestao.modal1";
import DadosCicloGestaoModal2 from "./DadosCicloGestao.modal2";
import DadosCicloGestaoModal3 from "./DadosCicloGestao.modal3";
import { loadEscolasFromCsv, calcularDadosEspiritoSanto } from "../utils/csvParser";
import "./PlanosAcao.css";
import "./DadosCicloGestao.css";

export default function PlanosAcao() {
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState<string | null>(null);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [dadosGerais, setDadosGerais] = useState<{
    escolas: number;
    alunos: number;
    tcgps: number;
    professores: number;
    pedagogos: number;
    coordenadores: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const escolas = await loadEscolasFromCsv();
        const dados = calcularDadosEspiritoSanto(escolas);
        setDadosGerais(dados);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleVerDetalhes = (tipo: string) => {
    setModalTipo(tipo);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalTipo(null);
  };

  return (
    <div className="planos-acao-container">
      <Card className="planos-acao-card-principal">
        <div className="planos-acao-card-content">
          <div className="planos-acao-titulo-principal">
            <i className="pi pi-chart-line"></i>
            <h2>Dados do Ciclo de Gestão</h2>
          </div>

          <div className="planos-acao-cards dados-ciclo-gestao-cards">
            {/* Card 1 - Escolas e Profissionais */}
            <Card className="card-numeros-totais">
              <div className="card-content">
                <div className="card-linha-1">
                  <div className="card-icon">
                    <i className="pi pi-building"></i>
                  </div>
                  <h3 className="card-titulo">Escolas e Profissionais</h3>
                  <a
                    href="#"
                    className="card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerDetalhes("numeros-totais");
                    }}
                  >
                    Ver detalhes <i className="pi pi-external-link"></i>
                  </a>
                </div>
                <div className="card-linha-2">
                  {loading ? (
                    <p className="card-descricao">Carregando dados...</p>
                  ) : dadosGerais ? (
                    <p className="card-descricao">
                      {dadosGerais.escolas.toLocaleString("pt-BR")} escolas |{" "}
                      {dadosGerais.alunos.toLocaleString("pt-BR")} alunos |{" "}
                      {dadosGerais.tcgps.toLocaleString("pt-BR")} TCGP's |{" "}
                      {dadosGerais.professores.toLocaleString("pt-BR")} professores |{" "}
                      {dadosGerais.pedagogos.toLocaleString("pt-BR")} pedagogos |{" "}
                      {dadosGerais.coordenadores} coordenadores municipais
                    </p>
                  ) : (
                    <p className="card-descricao">Erro ao carregar dados</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Card 2 - Escolas e Metas */}
            <Card className="card-escolas-metas">
              <div className="card-content">
                <div className="card-linha-1">
                  <div className="card-icon">
                    <i className="pi pi-map-marker"></i>
                  </div>
                  <h3 className="card-titulo">Escolas e Metas</h3>
                  <a
                    href="#"
                    className="card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setModal3Visible(true);
                    }}
                  >
                    Ver detalhes <i className="pi pi-external-link"></i>
                  </a>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">
                    Veja detalhes das metas pactuadas para o ano de 2026.
                  </p>
                </div>
              </div>
            </Card>

            {/* Card 3 - Planos de Ação */}
            <Card className="card-alunos-regional">
              <div className="card-content">
                <div className="card-linha-1">
                  <div className="card-icon">
                    <i className="pi pi-users"></i>
                  </div>
                  <h3 className="card-titulo">Planos de Ação</h3>
                  <a
                    href="#"
                    className="card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalDetalhesVisible(true);
                    }}
                  >
                    Ver detalhes <i className="pi pi-external-link"></i>
                  </a>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">Planos de Ação em 100% das escolas do CdG</p>
                </div>
              </div>
            </Card>

            {/* Card 4 - TCGP's por Regional e Município */}
            <Card className="card-tcgps-regional">
              <div className="card-content">
                <div className="card-linha-1">
                  <div className="card-icon">
                    <i className="pi pi-id-card"></i>
                  </div>
                  <h3 className="card-titulo">
                    TCGP's por Regional e Município
                  </h3>
                  <a
                    href="#"
                    className="card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setModal2Visible(true);
                    }}
                  >
                    Ver detalhes <i className="pi pi-external-link"></i>
                  </a>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">
                    Veja a distribuição dos 812 TCGPs.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <PlanosAcaoModal2
        visible={modalDetalhesVisible}
        onHide={() => setModalDetalhesVisible(false)}
      />
      
      <DadosCicloGestaoModal
        visible={modalVisible}
        tipo={modalTipo}
        onHide={handleCloseModal}
      />
      
      <DadosCicloGestaoModal2
        visible={modal2Visible}
        onHide={() => setModal2Visible(false)}
      />
      
      <DadosCicloGestaoModal3
        visible={modal3Visible}
        onHide={() => setModal3Visible(false)}
      />
    </div>
  );
}
