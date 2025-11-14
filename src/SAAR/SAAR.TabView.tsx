import { TabView, TabPanel } from "primereact/tabview";
import SAARTabViewEficacia from "./abas/SAAR.TabView.Eficacia";
import SAARTabViewAulasDadas from "./abas/SAAR.TabView.AulasDadas";
import SAARTabViewFrequenciaEstudantes from "./abas/SAAR.TabView.FrequenciaEstudantes";
import SAARTabViewProficienciaLP from "./abas/SAAR.TabView.ProficienciaLP";
import SAARTabViewProficienciaMat from "./abas/SAAR.TabView.ProficienciaMat";
import SAARTabViewLeitura from "./abas/SAAR.TabView.Leitura";
import SAARTabViewTarefas from "./abas/SAAR.TabView.Tarefas";
import SAARTabViewProdutos from "./abas/SAAR.TabView.Produtos";
import SAARTabViewVisitasTecnicas from "./abas/SAAR.TabView.VisitasTecnicas";
import type { FiltroContexto } from "./types/shared.types";
import "./SAAR.TabView.css";

interface SAARTabViewProps {
  filtros?: FiltroContexto;
}

export default function SAARTabView({ filtros }: SAARTabViewProps) {
  return (
    <div className="saar-tabview-container">
      <TabView className="saar-tabview">
        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-chart-line" />
              Eficácia
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewEficacia filtros={filtros} />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-calendar" />
              Aulas Dadas
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewAulasDadas filtros={filtros} />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-users" />
              Frequência
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewFrequenciaEstudantes filtros={filtros} />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-book" />
              Prof. em L. Port.
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewProficienciaLP filtros={filtros} />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-calculator" />
              Prof. em Mat.
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewProficienciaMat filtros={filtros} />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-file-edit" />
              Leitura
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewLeitura filtros={filtros} />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-check-square" />
              Tarefas
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewTarefas filtros={filtros} />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-box" />
              Produtos
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewProdutos filtros={filtros} />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="saar-tab-header">
              <i className="pi pi-briefcase" />
              Visitas Técnicas
            </span>
          }
        >
          <div className="saar-tab-content">
            <SAARTabViewVisitasTecnicas filtros={filtros} />
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
}
