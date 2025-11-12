import { useState } from 'react'
import Header from './components/Header'
import CicloGestao from './components/CicloGestao'
import PlanosAcao from './components/PlanosAcao'
import Tarefas from './components/Tarefas'
import Produtos from './components/Produtos'
import VisitasTecnicas from './components/VisitasTecnicas'
import SAAR from './SAAR/SAAR'
import type { Pagina } from './types/Navegacao'
import './App.css'

function App() {
  const [paginaAtual, setPaginaAtual] = useState<Pagina>('inicio')
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2025)

  const handleNavegacao = (pagina: Pagina) => {
    setPaginaAtual(pagina)
  }

  const renderizarConteudo = () => {
    switch (paginaAtual) {
      case 'saar':
        return (
          <SAAR
            anoSelecionado={anoSelecionado}
            onAnoChange={setAnoSelecionado}
            onNavegacao={handleNavegacao}
          />
        )
      case 'relatorio-unidade':
        return (
          <div className="app">
            <Header
              anoSelecionado={anoSelecionado}
              onAnoChange={setAnoSelecionado}
              paginaAtual={paginaAtual}
              onNavegacao={handleNavegacao}
            />
            <main className="main-content">
              {/* TODO: Implementar página Relatório por Unidade */}
            </main>
          </div>
        )
      case 'inicio':
      default:
        return (
          <div className="app">
            <Header
              anoSelecionado={anoSelecionado}
              onAnoChange={setAnoSelecionado}
              paginaAtual={paginaAtual}
              onNavegacao={handleNavegacao}
            />
            <main className="main-content">
              <CicloGestao />
              <div className="cards-grid-2x2">
                <PlanosAcao />
                <Tarefas />
                <Produtos />
                <VisitasTecnicas />
              </div>
            </main>
          </div>
        )
    }
  }

  return renderizarConteudo()
}

export default App

