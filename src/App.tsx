import Header from './components/Header'
import CicloGestao from './components/CicloGestao'
import DadosCicloGestao from './components/DadosCicloGestao'
import PlanosAcao from './components/PlanosAcao'
import Tarefas from './components/Tarefas'
import Produtos from './components/Produtos'
import VisitasTecnicas from './components/VisitasTecnicas'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <CicloGestao />
        <DadosCicloGestao />
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

export default App

