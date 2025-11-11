import { useMemo } from 'react'
import { Steps } from 'primereact/steps'
import type { MenuItem } from 'primereact/menuitem'
import './CicloGestao.css'

interface CicloGestaoProps {
  ano?: number
  etapaAtual?: string
}

const ETAPAS = [
  {
    label: 'Planejamento',
    dataInicio: '05/02',
    dataFim: '20/02'
  },
  {
    label: 'Execução I',
    dataInicio: '31/03',
    dataFim: '04/04'
  },
  {
    label: 'SAAR I',
    dataInicio: '12/05',
    dataFim: '11/06'
  },
  {
    label: 'Correção de Rotas I',
    dataInicio: '16/06',
    dataFim: '20/06'
  },
  {
    label: 'Execução II',
    dataInicio: '16/07',
    dataFim: '18/07'
  },
  {
    label: 'SAAR II',
    dataInicio: '01/09',
    dataFim: '03/10'
  },
  {
    label: 'Correção de Rotas II',
    dataInicio: '08/10',
    dataFim: '10/10'
  },
  {
    label: 'Execução III',
    dataInicio: '27/10',
    dataFim: '31/10'
  },
  {
    label: 'Balanço Final',
    dataInicio: '01/12',
    dataFim: '17/12'
  }
]

export default function CicloGestao({
  ano = 2025,
  etapaAtual = 'Correção de Rotas II'
}: CicloGestaoProps) {
  const activeIndex = useMemo(() => {
    return ETAPAS.findIndex(etapa => etapa.label === etapaAtual)
  }, [etapaAtual])

  const items: MenuItem[] = useMemo(() => {
    return ETAPAS.map((etapa) => ({
      label: (
        <div className="etapa-item">
          <div className="etapa-nome">{etapa.label}</div>
          {etapa.dataInicio && etapa.dataFim && (
            <div className="etapa-datas">
              {etapa.dataInicio} a {etapa.dataFim}
            </div>
          )}
        </div>
      ) as any
    }))
  }, [])

  return (
    <div className="ciclo-gestao-container">
      <div className="ciclo-gestao-header">
        <h2 className="ciclo-gestao-titulo">Ciclo de Gestão - {ano}</h2>
        <p className="ciclo-gestao-subtitulo">
          Você está na etapa de <strong>{etapaAtual}</strong>
        </p>
      </div>
      
      <Steps
        model={items}
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        readOnly={false}
        className="ciclo-gestao-steps"
      />
    </div>
  )
}

