import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { loadCicloGestaoCsv, calcularDadosTarefas } from "../utils/cicloGestaoParser";
import type { DadosTarefas } from "../types/CicloGestao";
import TarefasModal from "./Tarefas.modal1";
import "./Tarefas.css";

export default function Tarefas() {
  const [dadosTarefas, setDadosTarefas] = useState<DadosTarefas | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const cicloData = await loadCicloGestaoCsv();
      const dados = calcularDadosTarefas(cicloData);
      setDadosTarefas(dados);
    } catch (error) {
      console.error("Erro ao carregar dados de tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhes = () => {
    setModalVisible(true);
  };

  const calcularPercentual = (valor: number, total: number): number => {
    if (total === 0) return 0;
    return (valor / total) * 100;
  };

  const formatarPercentual = (percentual: number): string => {
    return percentual.toFixed(2).replace(".", ",");
  };

  if (loading || !dadosTarefas) {
    return (
      <div className="tarefas-container">
        <Card className="tarefas-card-principal">
          <div className="tarefas-card-content">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
              <p>Carregando dados...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const progressoGeralPercentual = calcularPercentual(
    dadosTarefas.concluidas + dadosTarefas.concluidasAtraso,
    dadosTarefas.total
  );
  const progressoGeralConcluidas = dadosTarefas.concluidas + dadosTarefas.concluidasAtraso;

  return (
    <div className="tarefas-container">
      <Card className="tarefas-card-principal">
        <div className="tarefas-card-content">
          <div className="tarefas-titulo-principal">
            <i className="pi pi-check-square"></i>
            <h2>Tarefas</h2>
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

          <div className="tarefas-progresso-geral">
            <div className="progresso-geral-card">
              <div className="progresso-geral-linha-1">
                <span className="progresso-geral-titulo">Progresso geral</span>
              </div>
              <div className="progresso-geral-linha-2">
                <span className="progresso-geral-percentual">
                  {formatarPercentual(progressoGeralPercentual)}%
                </span>
              </div>
              <div className="progresso-geral-linha-3">
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${progressoGeralPercentual}%` }}
                  ></div>
                </div>
              </div>
              <div className="progresso-geral-linha-4">
                <span className="progresso-geral-contagem">
                  {progressoGeralConcluidas} de {dadosTarefas.total} tarefas concluídas
                </span>
              </div>
            </div>
          </div>

          <div className="tarefas-cards">
            <div className="minicard minicard-previstas">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">Previstas</span>
                  <span className="card-percentual">
                    {formatarPercentual(calcularPercentual(dadosTarefas.previstas, dadosTarefas.total))}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${calcularPercentual(dadosTarefas.previstas, dadosTarefas.total)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosTarefas.previstas} de {dadosTarefas.total} tarefas
                  </span>
                </div>
              </div>
            </div>
            <div className="minicard minicard-nao-iniciadas">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">Não Iniciadas</span>
                  <span className="card-percentual">
                    {formatarPercentual(calcularPercentual(dadosTarefas.naoIniciadas, dadosTarefas.total))}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${calcularPercentual(dadosTarefas.naoIniciadas, dadosTarefas.total)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosTarefas.naoIniciadas} de {dadosTarefas.total} tarefas
                  </span>
                </div>
              </div>
            </div>
            <div className="minicard minicard-em-andamento">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">Em andamento</span>
                  <span className="card-percentual">
                    {formatarPercentual(calcularPercentual(dadosTarefas.emAndamento, dadosTarefas.total))}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${calcularPercentual(dadosTarefas.emAndamento, dadosTarefas.total)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosTarefas.emAndamento} de {dadosTarefas.total} tarefas
                  </span>
                </div>
              </div>
            </div>
            <div className="minicard minicard-atrasadas">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">Atrasadas</span>
                  <span className="card-percentual">
                    {formatarPercentual(calcularPercentual(dadosTarefas.atrasadas, dadosTarefas.total))}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${calcularPercentual(dadosTarefas.atrasadas, dadosTarefas.total)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosTarefas.atrasadas} de {dadosTarefas.total} tarefas
                  </span>
                </div>
              </div>
            </div>
            <div className="minicard minicard-concluidas">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">Concluídas</span>
                  <span className="card-percentual">
                    {formatarPercentual(calcularPercentual(dadosTarefas.concluidas, dadosTarefas.total))}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${calcularPercentual(dadosTarefas.concluidas, dadosTarefas.total)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosTarefas.concluidas} de {dadosTarefas.total} tarefas
                  </span>
                </div>
              </div>
            </div>
            <div className="minicard minicard-concluidas-atraso">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">Concluídas com atraso</span>
                  <span className="card-percentual">
                    {formatarPercentual(calcularPercentual(dadosTarefas.concluidasAtraso, dadosTarefas.total))}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${calcularPercentual(dadosTarefas.concluidasAtraso, dadosTarefas.total)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosTarefas.concluidasAtraso} de {dadosTarefas.total} tarefas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <TarefasModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
      />
    </div>
  );
}

