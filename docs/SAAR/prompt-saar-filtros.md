# SAAR - Módulo Filtros - Prompt de Criação

## Objetivo
Criar o componente de filtros de contexto para a página SAAR, permitindo filtrar dados por Regional, Escola e SMAR.

## Estrutura do Componente

### Arquivos
- `src/SAAR/SAAR.Filtros.tsx`
- `src/SAAR/SAAR.Filtros.css`

### Funcionalidades Requeridas

1. **Box Colapsável**
   - Título: "Filtro de contexto"
   - Botão para ocultar/mostrar filtro
   - Ícone de seta (chevron-up quando expandido, chevron-down quando colapsado)
   - Transição suave ao colapsar/expandir

2. **Campos de Filtro**
   - **Selecionar regional**: Dropdown do PrimeReact
     - Placeholder: "Selecionar regional"
     - Opções: Lista de regionais (carregar de CSV)
     - Botão de limpar (showClear)
   - **Selecionar escola**: Dropdown do PrimeReact
     - Placeholder: "Selecionar escola"
     - Opções: Lista de escolas (filtradas por regional selecionada)
     - Botão de limpar (showClear)
     - Desabilitado quando nenhuma regional estiver selecionada
   - **SMAR**: InputText do PrimeReact
     - Placeholder: "SMAR I"
     - Botão X para limpar (ícone pi-times)
     - Ícone de seta dropdown (pi-chevron-down) à direita
     - Campo de texto livre

3. **Botões de Ação**
   - **Limpar**: Botão branco com ícone de refresh (pi-refresh)
     - Limpa todos os filtros
   - **Filtrar**: Botão azul com ícone de filter (pi-filter)
     - Aplica os filtros selecionados
     - Chama callback para atualizar dados nas abas

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ Filtro de contexto              [Ocultar filtro ▲]      │
├─────────────────────────────────────────────────────────┤
│ [Selecionar regional ▼]  [Selecionar escola ▼]  [SMAR] │
│                                                          │
│                              [Limpar]  [Filtrar]         │
└─────────────────────────────────────────────────────────┘
```

### Estilização

- **Container**: Box branco com borda azul (`#2196f3`), border-radius 8px, sombra
- **Header**: Flexbox com espaço entre título e botão toggle
- **Campos**: Grid responsivo (3 colunas em desktop, empilhado em mobile)
- **Botões**: Alinhados à direita, com espaçamento adequado
- **Cores**:
  - Botão Limpar: Branco com borda cinza
  - Botão Filtrar: Azul (`#2196f3`) com texto branco
  - Hover: Cores mais escuras

### Estado

```typescript
interface FiltroContexto {
  regional?: { label: string; value: string }
  escola?: { label: string; value: string }
  smar?: string
}
```

### Props (se necessário)

```typescript
interface SAARFiltrosProps {
  onFiltrosChange?: (filtros: FiltroContexto) => void
  regionais?: Array<{ label: string; value: string }>
  escolas?: Array<{ label: string; value: string }>
}
```

### Comportamento

1. Ao selecionar uma regional, o dropdown de escolas deve ser habilitado e mostrar apenas escolas daquela regional
2. Ao limpar a regional, a escola selecionada também deve ser limpa
3. Ao clicar em "Limpar", todos os campos devem ser resetados
4. Ao clicar em "Filtrar", os filtros devem ser aplicados (callback para atualizar dados)
5. O box pode ser colapsado para economizar espaço

### Integração com Dados

- Carregar regionais de `escolas.csv` (coluna `regional`)
- Carregar escolas de `escolas.csv`, filtradas por regional
- Validar SMAR (se necessário)

### Exemplo de Uso

```typescript
<SAARFiltros 
  onFiltrosChange={(filtros) => {
    console.log('Filtros aplicados:', filtros)
    // Atualizar dados nas abas
  }}
/>
```

