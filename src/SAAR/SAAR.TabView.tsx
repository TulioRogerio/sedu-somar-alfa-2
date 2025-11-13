import { TabView, TabPanel } from "primereact/tabview";
import SAARTabViewAulasDadas from "./abas/SAAR.TabView.AulasDadas";
import SAARTabViewFrequenciaEstudantes from "./abas/SAAR.TabView.FrequenciaEstudantes";
// import SAARTabViewProdutos from "./abas/SAAR.TabView.Produtos";
import "./SAAR.TabView.css";

interface SAARTabViewProps {
  filtros?: {
    estado?: { label: string; value: string };
    regional?: { label: string; value: string };
    municipio?: { label: string; value: string };
    escola?: { label: string; value: string };
    saar?: { label: string; value: string };
  };
}

export default function SAARTabView({ filtros }: SAARTabViewProps) {
  return (
    <div className="saar-tabview-container">
      <TabView className="saar-tabview">
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
            {/* TODO: Implementar conteúdo da aba Proficiência em Língua Portuguesa */}
            <p>Conteúdo da aba Proficiência em Língua Portuguesa</p>
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
            {/* TODO: Implementar conteúdo da aba Proficiência em Matemática */}
            <p>Conteúdo da aba Proficiência em Matemática</p>
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
            {/* TODO: Implementar conteúdo da aba Leitura */}
            <p>Conteúdo da aba Leitura</p>
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
            {/* TODO: Implementar conteúdo da aba Tarefas */}
            <p>Conteúdo da aba Tarefas</p>
          </div>
        </TabPanel>

        {/* Temporariamente oculto para commit */}
        {/* <TabPanel
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
        </TabPanel> */}
      </TabView>
    </div>
  );
}
