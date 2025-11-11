import { useState } from "react";
import { Card } from "primereact/card";
import PlanosAcaoModal1 from "./PlanosAcao.modal1";
import PlanosAcaoModal2 from "./PlanosAcao.modal2";
import "./PlanosAcao.css";

export default function PlanosAcao() {
  const [modalPendenciasVisible, setModalPendenciasVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [deveAbrirPanorama, setDeveAbrirPanorama] = useState(false);

  const handleVerDetalhes = () => {
    // Primeiro mostra pendências, depois panorama geral
    setModalPendenciasVisible(true);
    setDeveAbrirPanorama(true);
  };

  const handleMapasAcaoClick = () => {
    // Modal 1: Pendências de Postagem
    setModalPendenciasVisible(true);
    setDeveAbrirPanorama(false);
  };

  const handlePlanosAcaoClick = () => {
    // Modal 2: Panorama Geral (direto)
    setModalDetalhesVisible(true);
  };

  const handleFecharPendencias = () => {
    setModalPendenciasVisible(false);
    // Se deve abrir panorama após fechar pendências
    if (deveAbrirPanorama) {
      setTimeout(() => {
        setModalDetalhesVisible(true);
        setDeveAbrirPanorama(false);
      }, 300);
    }
  };

  return (
    <div className="planos-acao-container">
      <Card className="planos-acao-card-principal">
        <div className="planos-acao-card-content">
          <div className="planos-acao-titulo-principal">
            <i className="pi pi-map"></i>
            <h2>Planos de Ação</h2>
            <a
              href="#"
              className="card-link"
              onClick={(e) => {
                e.preventDefault();
                handleVerDetalhes();
              }}
            >
              Ver detalhes <i className="pi pi-external-link"></i>
            </a>
          </div>

          <div className="planos-acao-cards">
            <div 
              className="minicard minicard-1"
              onClick={handlePlanosAcaoClick}
              style={{ cursor: "pointer" }}
            >
              <div className="minicard-content">
                <div className="card-linha-1">
                  <p className="card-numero">412</p>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">
                    Planos de Ação em 100% das escolas do CdG
                  </p>
                </div>
              </div>
            </div>
            <div 
              className="minicard minicard-2"
              onClick={handleMapasAcaoClick}
              style={{ cursor: "pointer" }}
            >
              <div className="minicard-content">
                <div className="card-linha-1">
                  <p className="card-numero">1.248</p>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">Mapas de Ação. </p>
                  <p className="card-descricao">Uma média: 3,4 por escola</p>
                </div>
              </div>
            </div>
            <div className="minicard minicard-3">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <p className="card-numero">100%</p>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">
                    De testes de consistência validados pelos TCGPs
                  </p>
                </div>
              </div>
            </div>
            <div className="minicard minicard-4">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <p className="card-numero">416</p>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">Mapas de ação</p>
                  <p className="card-descricao">de Matemática</p>
                </div>
              </div>
            </div>
            <div className="minicard minicard-5">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <p className="card-numero">482</p>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">
                    Mapas de ação de Língua Portuguesa
                  </p>
                </div>
              </div>
            </div>
            <div className="minicard minicard-6">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <div className="card-numeros-duplos">
                    <p className="card-numero">482</p>
                    <span className="card-conector">e</span>
                    <p className="card-numero">472</p>
                  </div>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">
                    Problemas e Desafios cadastrados
                  </p>
                </div>
              </div>
            </div>
            <div className="minicard minicard-7">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <p className="card-numero">350</p>
                </div>
                <div className="card-linha-2">
                  <p className="card-descricao">Mapas de ação de Leitura</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <PlanosAcaoModal1
        visible={modalPendenciasVisible}
        onHide={handleFecharPendencias}
      />
      <PlanosAcaoModal2
        visible={modalDetalhesVisible}
        onHide={() => setModalDetalhesVisible(false)}
      />
    </div>
  );
}
