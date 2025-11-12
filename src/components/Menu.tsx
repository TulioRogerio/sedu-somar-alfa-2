import { Sidebar } from 'primereact/sidebar'
import { MenuItem } from 'primereact/menuitem'
import { Menu as PrimeMenu } from 'primereact/menu'
import './Menu.css'

interface MenuProps {
  visible: boolean
  onHide: () => void
  onMenuItemClick?: (item: MenuItem) => void
}

export default function MenuComponent({
  visible,
  onHide,
  onMenuItemClick,
}: MenuProps) {
  const menuItems: MenuItem[] = [
    {
      label: 'Início',
      icon: 'pi pi-home',
      command: (e) => {
        onMenuItemClick?.(e.item as MenuItem)
        onHide()
      },
    },
    {
      label: 'SAAR',
      icon: 'pi pi-chart-bar',
      command: (e) => {
        onMenuItemClick?.(e.item as MenuItem)
        onHide()
      },
    },
    {
      label: 'Relatório por Unidade',
      icon: 'pi pi-file',
      command: (e) => {
        onMenuItemClick?.(e.item as MenuItem)
        onHide()
      },
    },
  ]

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="left"
      className="menu-sidebar"
    >
      <div className="menu-content">
        <h2 className="menu-title">Menu</h2>
        <PrimeMenu model={menuItems} className="menu-list" />
      </div>
    </Sidebar>
  )
}

