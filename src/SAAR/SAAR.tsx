import { useState } from 'react'
import Header from '../components/Header'
import SAARFiltros from './SAAR.Filtros'
import SAARTabView from './SAAR.TabView'
import type { Pagina } from '../types/Navegacao'
import './SAAR.css'

interface SAARProps {
  anoSelecionado?: number
  onAnoChange?: (ano: number) => void
  onNavegacao?: (pagina: Pagina) => void
}

interface FiltroContexto {
  estado?: { label: string; value: string }
  regional?: { label: string; value: string }
  municipio?: { label: string; value: string }
  escola?: { label: string; value: string }
  saar?: { label: string; value: string }
}

export default function SAAR({
  anoSelecionado = 2025,
  onAnoChange,
  onNavegacao,
}: SAARProps) {
  const [ano, setAno] = useState<number>(anoSelecionado)
  const [filtros, setFiltros] = useState<FiltroContexto>({
    estado: { label: "Espírito Santo", value: "espirito-santo" },
    saar: { label: "SAAR I", value: "saar-i" },
  })

  const handleAnoChange = (novoAno: number) => {
    setAno(novoAno)
    onAnoChange?.(novoAno)
  }

  return (
    <div className="saar-container">
      <Header 
        anoSelecionado={ano}
        onAnoChange={handleAnoChange}
        paginaAtual="saar"
        onNavegacao={onNavegacao}
      />
      <main className="saar-main-content">
        <SAARFiltros onFiltrosChange={setFiltros} />
        <SAARTabView filtros={filtros} />
      </main>
    </div>
  )
}

