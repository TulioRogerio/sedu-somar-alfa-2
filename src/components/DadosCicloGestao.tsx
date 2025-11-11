import { useState } from "react";
import { Card } from "primereact/card";
import DadosCicloGestaoModal from "./DadosCicloGestao.modal1";
import DadosCicloGestaoModal2 from "./DadosCicloGestao.modal2";
import DadosCicloGestaoModal3 from "./DadosCicloGestao.modal3";
import "./DadosCicloGestao.css";

export default function DadosCicloGestao() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState<string | null>(null);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);

  const handleVerDetalhes = (tipo: string) => {
    setModalTipo(tipo);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalTipo(null);
  };

  return (
    <div className="dados-ciclo-gestao-container">
      <Card className="dados-ciclo-gestao-card-principal">
        <div className="dados-ciclo-gestao-card-content">
          <h2 className="dados-ciclo-gestao-titulo-principal">
            Dados do Ciclo de Gestão
          </h2>

          <div className="dados-ciclo-gestao-cards">
            {/* Card 1 - Números totais */}
            <Card className="card-numeros-totais">
              <div className="card-content">
                <div className="card-linha-1">
                  <div className="card-icon">
                    <i className="pi pi-building"></i>
                  </div>
                  <h3 className="card-titulo">Números totais</h3>
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
                  <p className="card-descricao">
                    412 escolas | 42.580 alunos | 812 TCGP's | 840 professores
                    930 pedagogos | 78 coordenadores municipais
                  </p>
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

            {/* Card 3 - Card Temporário */}
            <Card className="card-alunos-regional">
              <div className="card-content">
                <div className="card-linha-1">
                  <div className="card-icon">
                    <i className="pi pi-users"></i>
                  </div>
                  <h3 className="card-titulo">[Card Temporário]</h3>
                  <a
                    href="#"
                    className="card-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerDetalhes("alunos-regional");
                    }}
                  >
                    Ver detalhes <i className="pi pi-external-link"></i>
                  </a>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">[Card temporário]</p>
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
