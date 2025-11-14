import { useState, useMemo } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import type { MenuItem } from 'primereact/menuitem'
import Header from '../components/Header'
import SAARFiltros from './SAAR.Filtros'
import SAARTabView from './SAAR.TabView'
import type { Pagina } from '../types/Navegacao'
import { ESTADO_PADRAO, SAAR_PADRAO, ANO_PADRAO } from './constants/shared.constants'
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
  anoSelecionado = ANO_PADRAO,
  onAnoChange,
  onNavegacao,
}: SAARProps) {
  const [ano, setAno] = useState<number>(anoSelecionado)
  const [filtros, setFiltros] = useState<FiltroContexto>({
    estado: ESTADO_PADRAO,
    saar: SAAR_PADRAO,
  })

  const handleAnoChange = (novoAno: number) => {
    setAno(novoAno)
    onAnoChange?.(novoAno)
  }

  const handleBreadcrumbClick = (
    nivel: "estado" | "regional" | "municipio" | "escola"
  ) => {
    switch (nivel) {
      case "estado":
        setFiltros({
          estado: ESTADO_PADRAO,
          regional: undefined,
          municipio: undefined,
          escola: undefined,
          saar: filtros.saar,
        });
        break;
      case "regional":
        setFiltros({
          ...filtros,
          regional: undefined,
          municipio: undefined,
          escola: undefined,
        });
        break;
      case "municipio":
        setFiltros({
          ...filtros,
          municipio: undefined,
          escola: undefined,
        });
        break;
      case "escola":
        setFiltros({
          ...filtros,
          escola: undefined,
        });
        break;
    }
  };

  const breadcrumbItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [];

    if (filtros.estado) {
      items.push({
        label: filtros.estado.label,
        command: () => handleBreadcrumbClick("estado"),
      });
    }

    const regionais = Array.isArray(filtros.regional) 
      ? filtros.regional 
      : filtros.regional 
      ? [filtros.regional] 
      : [];
    
    if (regionais.length > 0) {
      if (regionais.length === 1) {
        items.push({
          label: regionais[0].label,
          command: () => handleBreadcrumbClick("regional"),
        });
      } else {
        items.push({
          label: `${regionais.length} Regionais`,
          command: () => handleBreadcrumbClick("regional"),
        });
      }
    }

    const municipios = Array.isArray(filtros.municipio) 
      ? filtros.municipio 
      : filtros.municipio 
      ? [filtros.municipio] 
      : [];
    
    if (municipios.length > 0) {
      if (municipios.length === 1) {
        items.push({
          label: municipios[0].label,
          command: () => handleBreadcrumbClick("municipio"),
        });
      } else {
        items.push({
          label: `${municipios.length} Municípios`,
          command: () => handleBreadcrumbClick("municipio"),
        });
      }
    }

    const escolas = Array.isArray(filtros.escola) 
      ? filtros.escola 
      : filtros.escola 
      ? [filtros.escola] 
      : [];
    
    if (escolas.length > 0) {
      if (escolas.length === 1) {
        items.push({
          label: escolas[0].label,
          command: () => handleBreadcrumbClick("escola"),
        });
      } else {
        items.push({
          label: `${escolas.length} Escolas`,
          command: () => handleBreadcrumbClick("escola"),
        });
      }
    }

    return items;
  }, [filtros.estado, filtros.regional, filtros.municipio, filtros.escola]);

  return (
    <div className="saar-container">
      <Header 
        anoSelecionado={ano}
        onAnoChange={handleAnoChange}
        paginaAtual="saar"
        onNavegacao={onNavegacao}
      />
      <main className="saar-main-content">
        <div className="saar-filtros-wrapper">
          <SAARFiltros onFiltrosChange={setFiltros} />
          {breadcrumbItems.length > 0 && (
            <div className="saar-breadcrumb-container">
              <BreadCrumb model={breadcrumbItems} />
            </div>
          )}
        </div>
        <SAARTabView filtros={filtros} />
      </main>
    </div>
  )
}

