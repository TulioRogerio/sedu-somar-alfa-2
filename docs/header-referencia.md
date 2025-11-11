# Header - Referência de Implementação

## Estrutura do Header

O header da aplicação Somar Alfa 2 segue o seguinte layout:

### Barra Superior (header-top)

**Esquerda:**
- Ícone hamburger (menu de três linhas)
- Título "Somar Alfa 2" em negrito

**Centro:**
- Dropdown de seleção de ano (2025, 2024, 2023, etc.)
- Botão com borda preta e chevron para baixo

**Direita:**
- Botão "Inicio" com borda cinza
- Botão "SAAR" com borda cinza

### Breadcrumb (header-breadcrumb)

Abaixo da barra superior, separado por uma linha:
- Ícone de casa (home)
- Chevron `>`
- Texto `[Início]`
- Chevron `>`
- Texto `[SAAR]`

## Arquivos

- `src/components/Header.tsx` - Componente React
- `src/components/Header.css` - Estilos do componente

## Características

- Design limpo e minimalista
- Cores: preto para textos principais, cinza para bordas
- Layout responsivo com flexbox
- Dropdown centralizado usando position absolute
- Breadcrumb integrado usando PrimeReact

## Props do Componente

```typescript
interface HeaderProps {
  anoSelecionado?: number        // Ano padrão (2025)
  onAnoChange?: (ano: number) => void  // Callback ao mudar ano
  paginaAtual?: 'inicio' | 'saar'      // Página atual
}
```

## Funcionalidades

- Menu hamburger: preparado para abrir menu lateral (TODO)
- Dropdown de ano: funcional, permite selecionar ano
- Botões de navegação: preparados para navegação (TODO)
- Breadcrumb: mostra caminho atual na aplicação

