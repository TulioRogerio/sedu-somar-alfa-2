import './CicloGestao.css'

interface CicloGestaoProps {
  ano?: number
  etapaAtual?: string
}

export default function CicloGestao({
  ano = 2025,
  etapaAtual = 'Correção de Rotas II'
}: CicloGestaoProps) {

  return (
    <div className="ciclo-gestao-container">
      <div className="ciclo-gestao-header">
        <h2 className="ciclo-gestao-titulo">Ciclo de Gestão - {ano}</h2>
        <p className="ciclo-gestao-subtitulo">
          Você está na etapa de <strong>{etapaAtual}</strong>
        </p>
      </div>
    </div>
  )
}

