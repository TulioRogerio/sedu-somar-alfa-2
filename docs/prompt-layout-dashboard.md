# Prompt: Layout Dashboard - Grid 2x2

## Objetivo
Organizar os 4 componentes secundários em um layout de dashboard em grid 2x2 na página principal.

## Estrutura

### Arquivo
- `src/App.tsx` (atualização)
- `src/App.css` (atualização)

### Componentes no Grid

Os seguintes componentes são organizados em um grid 2x2:

1. **PlanosAcao** (`src/components/PlanosAcao.tsx`)
2. **AcompanhamentoTarefas** (`src/components/AcompanhamentoTarefas.tsx`)
3. **Produtos** (`src/components/Produtos.tsx`)
4. **VisitasTecnicas** (`src/components/VisitasTecnicas.tsx`)

### Layout CSS

```css
.cards-grid-2x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 0;
}
```

### Responsividade

```css
@media (max-width: 768px) {
  .cards-grid-2x2 {
    grid-template-columns: 1fr;
  }
}
```

### Estrutura no App.tsx

```tsx
<div className="cards-grid-2x2">
  <PlanosAcao />
  <AcompanhamentoTarefas />
  <Produtos />
  <VisitasTecnicas />
</div>
```

## Características

- **Grid 2 colunas**: Em telas maiores, os 4 cards são exibidos em 2 colunas
- **Grid 1 coluna**: Em telas menores (< 768px), os cards empilham verticalmente
- **Espaçamento**: `gap: 1.5rem` entre os cards
- **Cantos arredondados**: Cada card tem `border-radius: 8px`
- **Sombras**: Cada card tem `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)`

## Observações

- Cada componente mantém sua independência visual
- Cards com espaçamento adequado para visualização de dashboard
- Layout responsivo para diferentes tamanhos de tela

