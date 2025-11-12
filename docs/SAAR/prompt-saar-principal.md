# SAAR - Componente Principal - Prompt de Criação

## Objetivo
Criar o componente principal da página SAAR que organiza os 3 módulos: Header, Filtros e TabView.

## Estrutura do Componente

### Arquivos
- `src/SAAR/SAAR.tsx`
- `src/SAAR/SAAR.css`

### Módulos

A página SAAR é composta por 3 módulos principais:

1. **Módulo 1 - Header e Breadcrumb**
   - Reutiliza o componente `Header` existente
   - Inclui menu, título, seletor de ano e breadcrumb
   - Breadcrumb deve mostrar "SAAR" ou "Início > SAAR"

2. **Módulo 2 - Filtro de Contexto**
   - Componente `SAARFiltros`
   - Box colapsável com filtros (Regional, Escola, SMAR)

3. **Módulo 3 - TabView com 8 Abas**
   - Componente `SAARTabView`
   - Box contendo 8 abas com diferentes visualizações

### Layout

```
┌─────────────────────────────────────────┐
│ Módulo 1: Header + Breadcrumb            │
├─────────────────────────────────────────┤
│ Módulo 2: Filtro de Contexto            │
├─────────────────────────────────────────┤
│ Módulo 3: TabView (8 abas)              │
│ ┌─────────────────────────────────────┐ │
│ │ [Tab1] [Tab2] [Tab3] ... [Tab8]    │ │
│ ├─────────────────────────────────────┤ │
│ │                                     │ │
│ │      Conteúdo da aba ativa          │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Funcionalidades

1. **Gerenciamento de Estado**
   - Ano selecionado (compartilhado com Header)
   - Filtros de contexto (compartilhado com Filtros e TabView)

2. **Comunicação entre Módulos**
   - Header → SAAR: Mudança de ano
   - Filtros → TabView: Aplicação de filtros
   - TabView → Filtros: (se necessário, para sincronização)

### Props

```typescript
// Por enquanto, sem props externas
// O componente é auto-suficiente
```

### Estado Interno

```typescript
const [anoSelecionado, setAnoSelecionado] = useState<number>(2025)
const [filtros, setFiltros] = useState<FiltroContexto>({
  regional: undefined,
  escola: undefined,
  smar: '',
})
```

### Estilização

- **Container**: Fundo cinza claro (`#f5f5f5`)
- **Layout**: Flexbox vertical
- **Espaçamento**: Gap de 1.5rem entre módulos
- **Padding**: 1.5rem no container principal

### Integração com Menu

- Quando o item "SAAR" for clicado no menu, deve navegar para esta página
- Breadcrumb deve ser atualizado para refletir a navegação

### Estrutura do Código

```typescript
import { useState } from 'react'
import Header from '../components/Header'
import SAARFiltros from './SAAR.Filtros'
import SAARTabView from './SAAR.TabView'
import './SAAR.css'

export default function SAAR() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2025)
  const [filtros, setFiltros] = useState<FiltroContexto>({
    regional: undefined,
    escola: undefined,
    smar: '',
  })

  return (
    <div className="saar-container">
      <Header 
        anoSelecionado={anoSelecionado}
        onAnoChange={setAnoSelecionado}
      />
      <main className="saar-main-content">
        <SAARFiltros 
          onFiltrosChange={setFiltros}
        />
        <SAARTabView 
          filtros={filtros}
          ano={anoSelecionado}
        />
      </main>
    </div>
  )
}
```

### Responsividade

- Layout deve se adaptar a diferentes tamanhos de tela
- Módulos devem empilhar verticalmente em mobile
- Filtros devem ser responsivos (grid adaptativo)

### Próximos Passos

1. Implementar navegação do menu para esta página
2. Adicionar roteamento (React Router, se necessário)
3. Integrar com dados reais dos CSVs
4. Implementar conteúdo específico de cada aba
5. Adicionar loading states
6. Implementar tratamento de erros

### Notas Técnicas

- Componente funcional com hooks
- TypeScript para tipagem
- CSS modules para estilização
- Reutiliza componentes existentes quando possível
- Mantém separação de responsabilidades entre módulos

