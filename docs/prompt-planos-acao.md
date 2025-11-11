# Prompt: Componente PlanosAcao

## Objetivo
Criar o componente que exibe informações sobre Planos de Ação com 7 minicards detalhados, cada um mostrando métricas específicas.

## Estrutura do Componente

### Arquivo
- `src/components/PlanosAcao.tsx`
- `src/components/PlanosAcao.css`

### Funcionalidades

1. **Card Principal**
   - Wrapper: Card do PrimeReact com classe `planos-acao-card-principal`
   - Fundo: cor suave (#f8f9fa) para diferenciar da página
   - Sombra: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)`
   - Borda: `1px solid #e9ecef`
   - Título: "Planos de Ação"

2. **Título Principal**
   - Layout: Grid 3 colunas (ícone | título | link)
   - Ícone: `pi-map` (azul #0277bd)
   - Título: "Planos de Ação"
   - Link: "Ver detalhes" com ícone `pi-external-link`

3. **Grid de Minicards (7 minicards)**

   **Minicard 1 - Planos de Ação**
   - Número: 412 (em destaque)
   - Descrição: "Planos de Ação em 100% das escolas do CdG"
   - Cor: gradiente azul (#e3f2fd → #bbdefb)
   - Número: azul (#1976d2)

   **Minicard 2 - Mapas de Ação**
   - Número: 1.248 (em destaque)
   - Descrição: "Mapas de Ação. Uma média: 3,4 por escola"
   - Cor: gradiente verde (#e8f5e9 → #c8e6c9)
   - Número: verde (#388e3c)

   **Minicard 3 - Teste de Consistência**
   - Número: 100% (em destaque)
   - Descrição: "De testes de consistência validados pelos TCGPs"
   - Cor: gradiente roxo (#f3e5f5 → #e1bee7)
   - Número: roxo (#7b1fa2)

   **Minicard 4 - Matemática**
   - Número: 416 (em destaque)
   - Descrição: "Mapas de ação de Matemática"
   - Cor: gradiente vermelho (#ffebee → #ffcdd2)
   - Número: vermelho (#c62828)

   **Minicard 5 - Língua Portuguesa**
   - Número: 482 (em destaque)
   - Descrição: "Mapas de ação de Língua Portuguesa"
   - Cor: gradiente laranja (#fff3e0 → #ffe0b2)
   - Número: laranja (#e65100)

   **Minicard 6 - Problemas e Desafios**
   - Números: 482 e 472 (em destaque, lado a lado)
   - Conector: "e" (sem destaque)
   - Descrição: "Problemas e Desafios cadastrados"
   - Cor: gradiente cinza (#f5f5f5 → #e0e0e0)
   - Números: cinza (#424242)

   **Minicard 7 - Leitura**
   - Número: 350 (em destaque)
   - Descrição: "Mapas de ação de Leitura"
   - Cor: gradiente verde (#e8f5e9 → #c8e6c9)
   - Número: verde (#2e7d32)

4. **Layout dos Minicards**

   **Linha 1:**
   - Número em destaque (centralizado)
   - Tamanho: `font-size: 3rem`
   - Peso: `font-weight: 700`
   - Para números duplos: `font-size: 2.5rem` cada

   **Linha 2:**
   - Descrição com informações detalhadas
   - Texto em cor específica do minicard

### Layout CSS

- Container: `planos-acao-container`
- Card principal: `planos-acao-card-principal` (fundo #f8f9fa, sombra, borda)
- Grid de minicards: `planos-acao-cards` (grid responsivo `repeat(auto-fit, minmax(200px, 1fr))`)
- Linha 1: `card-linha-1` (flex center para números)
- Linha 2: `card-linha-2` (margem-top: auto)
- Número: `card-numero` (3rem, bold, cor específica)
- Números duplos: `card-numeros-duplos` (flex row, gap 1rem)
- Conector: `card-conector` (opacity 0.7, sem destaque)
- Descrição: `card-descricao` (cor específica do minicard)

### Dependências PrimeReact
- `primereact/card`

### Modais

**PlanosAcao.modal1.tsx** - Pendências de Postagem
- Abre quando clica em "Ver detalhes" no título principal (primeiro modal) ou no minicard "Mapas de Ação"
- Mostra escolas que não postaram seus Mapas de Ação
- Tabela com colunas: Regional, Município, Escola
- Exibe total de pendências
- Dados carregados de `escolas.csv` e `ciclo-gestao.csv`
- Ao fechar, abre automaticamente o Modal 2 (Panorama Geral) se foi aberto via "Ver detalhes"

**PlanosAcao.modal2.tsx** - Panorama Geral
- Abre quando clica no minicard "Planos de Ação" (minicard-1) ou automaticamente após fechar o Modal 1
- Navegação hierárquica: Espírito Santo → Regionais → Municípios → Escolas
- Card do Espírito Santo com 8 métricas em boxes arredondados:
  - Planos de Ação, Mapas de Ação, Mapas de Língua Portuguesa, Mapas de Matemática
  - Mapas de Leitura, Outros mapas, Validados pelo TCGP, Não validados pelo TCGP
- Tabelas com colunas condensadas e quebras de linha nos cabeçalhos longos
- Dados carregados de `ciclo-gestao.csv` e `escolas.csv`

### Estado
- `modalPendenciasVisible`: boolean para controlar visibilidade do modal 1
- `modalDetalhesVisible`: boolean para controlar visibilidade do modal 2
- `deveAbrirPanorama`: flag para controlar abertura automática do modal 2 após fechar o modal 1

### Hooks
- `useState` para gerenciar estados dos modais

## Exemplo de Uso

```tsx
<PlanosAcao />
```

## Observações
- Números em destaque na primeira linha (sem ícones)
- Gradientes suaves sem bordas duras
- Layout responsivo (grid auto-fit)
- Cada minicard com cor e gradiente específico
- Efeitos hover com elevação e sombra aumentada

