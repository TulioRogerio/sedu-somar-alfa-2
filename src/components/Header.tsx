import { useState, useMemo } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { BreadCrumb } from 'primereact/breadcrumb'
import type { MenuItem } from 'primereact/menuitem'
import './Header.css'

interface HeaderProps {
  anoSelecionado?: number
  onAnoChange?: (ano: number) => void
}

const ANOS_DISPONIVEIS = [
  { label: '2025', value: 2025 },
  { label: '2024', value: 2024 },
  { label: '2023', value: 2023 },
  { label: '2022', value: 2022 },
  { label: '2021', value: 2021 },
  { label: '2020', value: 2020 }
]

export default function Header({
  anoSelecionado = 2025,
  onAnoChange,
}: HeaderProps) {
  const [ano, setAno] = useState<number>(anoSelecionado)

  const handleAnoChange = (event: { value: number }) => {
    const novoAno = event.value
    setAno(novoAno)
    onAnoChange?.(novoAno)
  }

  const handleMenuClick = () => {
    // TODO: Implementar abertura do menu lateral
  }

  const breadcrumbItems: MenuItem[] = useMemo(() => [{ label: 'Início' }], [])

  const breadcrumbHome: MenuItem = useMemo(
    () => ({
      icon: 'pi pi-home',
      command: () => {
        // TODO: Implementar navegação para início
      }
    }),
    []
  )

  return (
    <div className="header-container">
      <div className="header-top">
        <div className="header-left">
          <Button
            icon="pi pi-bars"
            className="p-button-text p-button-plain menu-button"
            onClick={handleMenuClick}
            aria-label="Menu"
          />
          <h1 className="app-title">Somar Alfa 2</h1>
        </div>
        <div className="header-center">
          <Dropdown
            value={ano}
            options={ANOS_DISPONIVEIS}
            onChange={handleAnoChange}
            placeholder="Selecione o ano"
            className="ano-dropdown"
            showClear={false}
          />
        </div>
      </div>
      <div className="header-breadcrumb">
        <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />
      </div>
    </div>
  )
}
