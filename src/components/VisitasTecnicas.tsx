import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { loadVisitasTecnicasCsv, calcularDadosVisitasTecnicas } from "../utils/visitasTecnicasParser";
import type { DadosVisitasTecnicasAgregados } from "../types/VisitasTecnicas";
import VisitasTecnicasModal from "./VisitasTecnicas.modal1";
import "./VisitasTecnicas.css";

type CicloSelecionado = 1 | 2 | 3;

export default function VisitasTecnicas() {
  const [dadosVisitas, setDadosVisitas] = useState<DadosVisitasTecnicasAgregados | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [cicloSelecionado, setCicloSelecionado] = useState<CicloSelecionado>(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const visitasData = await loadVisitasTecnicasCsv();
      const dados = calcularDadosVisitasTecnicas(visitasData);
      setDadosVisitas(dados);
    } catch (error) {
      console.error("Erro ao carregar dados de visitas técnicas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerMais = () => {
    setModalVisible(true);
  };

  const formatarNumero = (numero: number): string => {
    return numero.toLocaleString("pt-BR");
  };

  const formatarPercentual = (percentual: number): string => {
    return percentual.toFixed(2).replace(".", ",");
  };

  if (loading || !dadosVisitas) {
    return (
      <div className="visitas-tecnicas-container">
        <Card className="visitas-tecnicas-card-principal">
          <div className="visitas-tecnicas-card-content">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
              <p>Carregando dados...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Calcular métricas baseadas no ciclo selecionado
  const cicloDados = dadosVisitas.porCiclo.find(c => c.ciclo === cicloSelecionado);
  
  // Se houver dados do ciclo selecionado, usar esses dados; caso contrário, usar totais
  const visitasEsperadas = cicloDados ? cicloDados.esperadas : dadosVisitas.totalEsperadas;
  const atasAssinadas = cicloDados ? cicloDados.atasAssinadas : dadosVisitas.totalAtasAssinadas;
  const percentualPendentes = cicloDados 
    ? ((cicloDados.esperadas - cicloDados.atasAssinadas) / cicloDados.esperadas) * 100
    : dadosVisitas.percentualPendentes;

  return (
    <div className="visitas-tecnicas-container">
      <Card className="visitas-tecnicas-card-principal">
        <div className="visitas-tecnicas-card-content">
          <div className="visitas-tecnicas-titulo-principal">
            <i className="pi pi-briefcase"></i>
            <h2>Visitas Técnicas</h2>
            <a
              href="#"
              className="card-link"
              onClick={(e) => {
                e.preventDefault();
                handleVerMais();
              }}
            >
              Ver detalhes <i className="pi pi-external-link"></i>
            </a>
          </div>

          <div className="card-ciclos-selecao">
            <button
              className={`ciclo-btn ${cicloSelecionado === 1 ? 'ativo' : ''}`}
              onClick={() => setCicloSelecionado(1)}
            >
              Ciclo I
            </button>
            <button
              className={`ciclo-btn ${cicloSelecionado === 2 ? 'ativo' : ''}`}
              onClick={() => setCicloSelecionado(2)}
            >
              Ciclo II
            </button>
            <button
              className={`ciclo-btn ${cicloSelecionado === 3 ? 'ativo' : ''}`}
              onClick={() => setCicloSelecionado(3)}
            >
              Ciclo III
            </button>
          </div>

          <div className="card-metricas">
            <div className="metrica-item">
              <span className="metrica-valor">{formatarNumero(visitasEsperadas)}</span>
              <span className="metrica-label">Nº de Visitas Esperadas</span>
            </div>
            <div className="metrica-item">
              <span className="metrica-valor">{formatarNumero(atasAssinadas)}</span>
              <span className="metrica-label">N° de Atas Assinadas</span>
            </div>
            <div className="metrica-item">
              <span className="metrica-valor">{formatarPercentual(percentualPendentes)}%</span>
              <span className="metrica-label">de atas pendentes</span>
            </div>
          </div>
        </div>
      </Card>
      <VisitasTecnicasModal visible={modalVisible} onHide={() => setModalVisible(false)} />
    </div>
  );
}

