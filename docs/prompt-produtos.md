# Prompt: Componente Produtos

## Objetivo
Criar o componente que exibe informações sobre os produtos do ciclo de gestão, com 4 minicards mostrando a distribuição por faixas de conclusão.

## Estrutura do Componente

### Arquivo
- `src/components/Produtos.tsx`
- `src/components/Produtos.css`
- `src/components/Produtos.modal1.tsx` (Modal de detalhes)
- `src/components/Produtos.modal1.css` (Estilos do modal)

### Funcionalidades

1. **Card Principal**
   - Wrapper: Card do PrimeReact com classe `produtos-card-principal`
   - Fundo: cor suave (#f8f9fa) para diferenciar da página
   - Sombra: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)`
   - Borda: `1px solid #e9ecef`
   - Título: "Produtos"

2. **Título Principal**
   - Layout: Grid 3 colunas (ícone | título | link)
   - Ícone: `pi-box` (laranja #f57c00)
   - Título: "Produtos"
   - Link: "Ver detalhes" com ícone `pi-external-link` (abre modal)

3. **Grid de Minicards (4 minicards de faixas)**

   **Minicard 1 - 0 à 25% concluído**
   - Status: "0 à 25% concluído"
   - Percentual: calculado dinamicamente (ex: "14,06%")
   - Barra de progresso: vermelho `#dc2626`
   - Contagem: "X de Y produtos"

   **Minicard 2 - 26 a 50% concluído**
   - Status: "26 a 50% concluído"
   - Percentual: calculado dinamicamente
   - Barra de progresso: laranja escuro `#f57c00`
   - Contagem: "X de Y produtos"

   **Minicard 3 - 51 a 75% concluído**
   - Status: "51 a 75% concluído"
   - Percentual: calculado dinamicamente
   - Barra de progresso: laranja claro `#ff9800`
   - Contagem: "X de Y produtos"

   **Minicard 4 - 76 a 100% concluído**
   - Status: "76 a 100% concluído"
   - Percentual: calculado dinamicamente
   - Barra de progresso: verde `#16a34a`
   - Contagem: "X de Y produtos"

4. **Layout dos Minicards**

   **Linha 1:**
   - Status (negrito, `0.9rem`, cor escura)
   - Percentual (cinza claro, `0.85rem`)
   - Layout: flex space-between

   **Linha 2:**
   - Barra de progresso (6px de altura)
   - Cor específica por faixa

   **Linha 3:**
   - Contagem como legenda da barra (bem próxima)
   - Fonte: `0.75rem`, cor cinza `#6b7280`

### Layout CSS

- Container: `produtos-container`
- Card principal: `produtos-card-principal` (fundo #f8f9fa, sombra, borda)
- Grid de minicards: `produtos-cards` (grid 4 colunas `repeat(4, 1fr)`)
- Minicard: fundo `rgb(248, 250, 252)`, borda `rgb(229, 231, 235)`
- Barra de progresso: altura 6px, cores específicas por faixa

### Dependências PrimeReact
- `primereact/card`

### Dependências de Utilitários
- `../utils/cicloGestaoParser` - `loadCicloGestaoCsv`, `calcularDadosProdutos`
- `../types/CicloGestao` - `DadosProdutos`

### Estado
- `dadosProdutos`: `DadosProdutos | null` - Dados agregados de produtos carregados do CSV
- `loading`: `boolean` - Estado de carregamento dos dados
- `modalVisible`: `boolean` - Estado de visibilidade do modal

### Hooks
- `useState` para gerenciar estado dos dados, loading e modal
- `useEffect` para carregar dados na montagem do componente

### Carregamento de Dados
- Utiliza `loadCicloGestaoCsv()` para carregar dados do CSV
- Utiliza `calcularDadosProdutos()` para agregar dados de todos os produtos
- Calcula percentuais dinamicamente baseado nos dados do CSV
- Exibe estado de loading enquanto carrega os dados
- Processa o campo `produto_status` do CSV que contém valores em quartis (0-25, 26-50, 51-75, 76-100)

## Modal de Detalhes

### Funcionalidades do Modal

1. **Navegação Hierárquica**
   - Nível 1: Regionais (visão geral)
   - Nível 2: Municípios (ao clicar em uma regional)
   - Nível 3: Escolas (ao clicar em um município)
   - Botões de navegação para voltar entre níveis

2. **Card do Espírito Santo**
   - Total de produtos
   - Distribuição por faixas (0-25%, 26-50%, 51-75%, 76-100%)
   - Percentual médio geral

3. **Gráficos de Rosca (Doughnut)**
   - Cada card mostra um gráfico de rosca com distribuição por faixas
   - Cores: vermelho (0-25%), laranja escuro (26-50%), laranja claro (51-75%), verde (76-100%)
   - Labels com percentuais
   - Tooltips com informações detalhadas
   - Cards clicáveis para navegação (exceto no nível de escolas)

4. **Dependências do Modal**
   - `primereact/dialog` - Dialog do modal
   - `primereact/card` - Cards dos gráficos
   - `primereact/chart` - Gráficos Chart.js
   - `chart.js` e `chartjs-plugin-datalabels` - Biblioteca de gráficos

5. **Funções de Cálculo Utilizadas**
   - `calcularDadosProdutos()` - Dados do estado
   - `calcularDadosProdutosRegionais()` - Dados por regional
   - `calcularDadosProdutosMunicipios()` - Dados por município (com filtro opcional)
   - `calcularDadosProdutosEscolas()` - Dados por escola (com filtros opcionais)

6. **Estilos do Modal**
   - **`.modal-card-content`**: padding `0.5rem 1rem` (vertical compacto)
   - **`.modal-card-titulo`**: margin-bottom `0.5rem`, line-height `1.2`
   - **`.modal-tabela-dados-produtos`**: gap `0.75rem`, padding e margin `0`
   - **`.dado-item-produtos`**: padding `0.5rem 0.75rem`, gap `0.25rem`
   - **`.dado-item-produtos .dado-valor`**: line-height `1.1`, margin `0`
   - **`.dado-item-produtos .dado-label`**: line-height `1.2`, margin `0`
   - **Otimizações**: Altura automática, line-heights reduzidos, paddings harmoniosos

## Exemplo de Uso

```tsx
<Produtos />
```

## Observações
- Minicards compactos e pequenos
- Layout em 4 colunas (4 minicards em linha)
- Barra de progresso com legenda próxima
- Efeitos hover com elevação e sombra aumentada
- **Dados dinâmicos**: Todos os valores são calculados a partir do CSV `ciclo-gestao.csv`
- **Percentuais**: Calculados automaticamente baseados no total de produtos
- **Formatação**: Percentuais formatados com vírgula (ex: "14,06%")
- **Modal**: Navegação hierárquica similar ao modal de Tarefas
- **Cores semânticas**: Progressão de cores do vermelho (baixo) ao verde (alto progresso)
- **Espaçamentos harmoniosos**: Paddings e gaps ajustados para proporção equilibrada sem espaços desnecessários

