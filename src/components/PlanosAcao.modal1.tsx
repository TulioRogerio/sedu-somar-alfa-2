import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { loadEscolasFromCsv } from "../utils/csvParser";
import type { Escola } from "../types/Escola";
import "./PlanosAcao.modal1.css";

interface PlanosAcaoModalProps {
  visible: boolean;
  onHide: () => void;
}

interface PendenciaPostagem {
  regional: string;
  municipio: string;
  escola: string;
}

export default function PlanosAcaoModal({
  visible,
  onHide,
}: PlanosAcaoModalProps) {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [pendencias, setPendencias] = useState<PendenciaPostagem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const escolasData = await loadEscolasFromCsv();
      setEscolas(escolasData);
      
      // Carregar dados do ciclo-gestao.csv
      const cicloGestaoData = await loadCicloGestaoCsv();
      
      // Identificar escolas com pendências (escolas que não têm nenhum mapa de ação postado)
      const escolasComMapas = new Set(
        cicloGestaoData.map((row) => parseInt(row.escola_id))
      );
      
      const pendenciasList: PendenciaPostagem[] = escolasData
        .filter((escola) => !escolasComMapas.has(escola.id))
        .map((escola) => ({
          regional: escola.regional,
          municipio: escola.municipio,
          escola: escola.nome,
        }));
      
      setPendencias(pendenciasList);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCicloGestaoCsv = async (): Promise<any[]> => {
    try {
      const response = await fetch("/ciclo-gestao.csv");
      const text = await response.text();
      const lines = text.trim().split("\n").filter((line) => line.trim());
      
      if (lines.length === 0) return [];
      
      const headers = lines[0].split(",").map((h) => h.trim());
      const data: any[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        
        data.push(row);
      }
      
      return data;
    } catch (error) {
      console.error("Erro ao carregar ciclo-gestao.csv:", error);
      return [];
    }
  };

  const getTitulo = () => {
    return (
      <div className="modal-header-custom">
        <i className="pi pi-exclamation-triangle" style={{ marginRight: "0.5rem", color: "#f57c00" }}></i>
        <span>Pendências de Postagem</span>
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={getTitulo()}
      className="planos-acao-modal"
      modal
      draggable={false}
      resizable={false}
      style={{ width: "95vw", maxWidth: "1200px", height: "90vh" }}
    >
      <div className="modal-conteudo">
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
            <p>Carregando dados...</p>
          </div>
        ) : (
          <>
            <Card className="modal-card">
              <div className="modal-card-content">
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
          </>
        )}
      </div>
    </Dialog>
  );
}

