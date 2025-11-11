# Prompt: Componente Header

## Objetivo
Criar o componente Header que exibe o cabeçalho da aplicação com menu hambúrguer, título, seletor de ano e breadcrumb.

## Estrutura do Componente

### Arquivo
- `src/components/Header.tsx`
- `src/components/Header.css`

### Props
```typescript
interface HeaderProps {
  anoSelecionado?: number
  onAnoChange?: (ano: number) => void
}
```

### Funcionalidades

1. **Menu Hambúrguer**
   - Botão com ícone `pi pi-bars`
   - Classe: `p-button-text p-button-plain menu-button`
   - TODO: Implementar abertura do menu lateral

2. **Título da Aplicação**
   - Texto: "Somar Alfa 2"
   - Tag: `<h1>` com classe `app-title`

3. **Seletor de Ano**
   - Componente: `Dropdown` do PrimeReact
   - Anos disponíveis: 2020, 2021, 2022, 2023, 2024, 2025
   - Valor padrão: 2025
   - Classe: `ano-dropdown`
   - Não permite limpar seleção (`showClear={false}`)

4. **Botões de Navegação**
   - Botão "Inicio" (TODO: implementar navegação)
   - Botão "SAAR" (TODO: implementar navegação)
   - Classe: `nav-button`

5. **Breadcrumb**
   - Componente: `BreadCrumb` do PrimeReact
   - Home: ícone `pi pi-home` (TODO: implementar navegação)
   - Item: "Início"
   - Simplificado: apenas home + Início

### Layout CSS

- Container principal: `header-container`
- Topo: `header-top` com flexbox
  - Esquerda: `header-left` (menu + título)
  - Centro: `header-center` (dropdown de ano)
  - Direita: `header-right` (botões de navegação)
- Breadcrumb: `header-breadcrumb` abaixo do topo

### Dependências PrimeReact
- `primereact/button`
- `primereact/dropdown`
- `primereact/breadcrumb`
- `primereact/menuitem` (tipo)

### Estado
- `ano`: estado local para o ano selecionado (padrão: 2025)

### Hooks
- `useState` para gerenciar o ano
- `useMemo` para otimizar breadcrumb items

## Exemplo de Uso

```tsx
<Header 
  anoSelecionado={2025}
  onAnoChange={(ano) => console.log('Ano alterado:', ano)}
/>
```

## Observações
- Ver `orientacoes-gerais.md` para regras e princípios gerais

