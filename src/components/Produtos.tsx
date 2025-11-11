import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { loadCicloGestaoCsv, calcularDadosProdutos } from "../utils/cicloGestaoParser";
import type { DadosProdutos } from "../types/CicloGestao";
import ProdutosModal from "./Produtos.modal1";
import "./Produtos.css";

export default function Produtos() {
  const [dadosProdutos, setDadosProdutos] = useState<DadosProdutos | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const cicloData = await loadCicloGestaoCsv();
      const dados = calcularDadosProdutos(cicloData);
      setDadosProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar dados de produtos:", error);
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

  if (loading || !dadosProdutos) {
    return (
      <div className="produtos-container">
        <Card className="produtos-card-principal">
          <div className="produtos-card-content">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
              <p>Carregando dados...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const percentual0_25 = calcularPercentual(dadosProdutos.faixa0_25, dadosProdutos.total);
  const percentual26_50 = calcularPercentual(dadosProdutos.faixa26_50, dadosProdutos.total);
  const percentual51_75 = calcularPercentual(dadosProdutos.faixa51_75, dadosProdutos.total);
  const percentual76_100 = calcularPercentual(dadosProdutos.faixa76_100, dadosProdutos.total);

  return (
    <div className="produtos-container">
      <Card className="produtos-card-principal">
        <div className="produtos-card-content">
          <div className="produtos-titulo-principal">
            <i className="pi pi-box"></i>
            <h2>Produtos</h2>
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

          <div className="produtos-cards">
            <div className="minicard minicard-faixa-0-25">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">0 à 25% concluído</span>
                  <span className="card-percentual">
                    {formatarPercentual(percentual0_25)}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentual0_25}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosProdutos.faixa0_25} de {dadosProdutos.total} produtos
                  </span>
                </div>
              </div>
            </div>
            <div className="minicard minicard-faixa-26-50">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">26 a 50% concluído</span>
                  <span className="card-percentual">
                    {formatarPercentual(percentual26_50)}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentual26_50}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosProdutos.faixa26_50} de {dadosProdutos.total} produtos
                  </span>
                </div>
              </div>
            </div>
            <div className="minicard minicard-faixa-51-75">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">51 a 75% concluído</span>
                  <span className="card-percentual">
                    {formatarPercentual(percentual51_75)}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentual51_75}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosProdutos.faixa51_75} de {dadosProdutos.total} produtos
                  </span>
                </div>
              </div>
            </div>
            <div className="minicard minicard-faixa-76-100">
              <div className="minicard-content">
                <div className="card-linha-1">
                  <span className="card-status">76 a 100% concluído</span>
                  <span className="card-percentual">
                    {formatarPercentual(percentual76_100)}%
                  </span>
                </div>
                <div className="card-linha-2">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentual76_100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="card-linha-3">
                  <span className="card-contagem">
                    {dadosProdutos.faixa76_100} de {dadosProdutos.total} produtos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <ProdutosModal visible={modalVisible} onHide={() => setModalVisible(false)} />
    </div>
  );
}

