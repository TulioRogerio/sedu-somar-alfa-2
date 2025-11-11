# Prompt: Componente Tarefas

## Objetivo
Criar o componente que exibe informações sobre o acompanhamento de tarefas do ciclo de gestão, com um card de progresso geral e 6 minicards de status.

## Estrutura do Componente

### Arquivo
- `src/components/Tarefas.tsx`
- `src/components/Tarefas.css`

### Funcionalidades

1. **Card Principal**
   - Wrapper: Card do PrimeReact com classe `tarefas-card-principal`
   - Fundo: cor suave (#f8f9fa) para diferenciar da página
   - Sombra: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)`
   - Borda: `1px solid #e9ecef`
   - Título: "Tarefas"

2. **Título Principal**
   - Layout: Grid 3 colunas (ícone | título | link)
   - Ícone: `pi-check-square` (verde #388e3c)
   - Título: "Tarefas"
   - Link: "Ver detalhes" com ícone `pi-external-link`

3. **Card de Progresso Geral**
   - Fundo: verde claro `rgb(236, 253, 245)`
   - Borda: verde `rgb(187, 247, 208)`
   - **Linha 1**: "Progresso geral" (título)
   - **Linha 2**: Percentual em destaque (ex: "53.17%")
     - Fonte: `2rem`, peso `700`, cor verde `#16a34a`
   - **Linha 3**: Barra de progresso
     - Altura: `8px`
     - Cor: verde `#16a34a`
     - Fundo: verde claro `rgb(187, 247, 208)`
   - **Linha 4**: Contagem (ex: "67 de 126 tarefas concluídas")
     - Fonte: `0.85rem`, cor cinza `#6b7280`

4. **Grid de Minicards (6 minicards de status)**

   **Minicard 1 - Previstas**
   - Status: "Previstas"
   - Percentual: "0%"
   - Barra de progresso: roxa `#9333ea`
   - Contagem: "0 de 50 tarefas"

   **Minicard 2 - Não Iniciadas**
   - Status: "Não Iniciadas"
   - Percentual: "0%"
   - Barra de progresso: cinza escuro `#374151`
   - Contagem: "0 de 50 tarefas"

   **Minicard 3 - Em andamento**
   - Status: "Em andamento"
   - Percentual: "0%"
   - Barra de progresso: azul `#2563eb`
   - Contagem: "0 de 50 tarefas"

   **Minicard 4 - Atrasadas**
   - Status: "Atrasadas"
   - Percentual: "2%"
   - Barra de progresso: vermelho `#dc2626`
   - Contagem: "1 de 50 tarefas"

   **Minicard 5 - Concluídas**
   - Status: "Concluídas"
   - Percentual: "0%"
   - Barra de progresso: verde `#16a34a`
   - Contagem: "0 de 50 tarefas"

   **Minicard 6 - Concluídas com atraso**
   - Status: "Concluídas com atraso"
   - Percentual: "0%"
   - Barra de progresso: amarelo dourado `#ca8a04`
   - Contagem: "0 de 50 tarefas"

5. **Layout dos Minicards**

   **Linha 1:**
   - Status (negrito, `0.9rem`, cor escura)
   - Percentual (cinza claro, `0.85rem`)
   - Layout: flex space-between

   **Linha 2:**
   - Barra de progresso (6px de altura)
   - Cor específica por status

   **Linha 3:**
   - Contagem como legenda da barra (bem próxima)
   - Fonte: `0.75rem`, cor cinza `#6b7280`

### Layout CSS

- Container: `tarefas-container`
- Card principal: `tarefas-card-principal` (fundo #f8f9fa, sombra, borda)
- Grid de minicards: `tarefas-cards` (grid 3 colunas `repeat(3, 1fr)`)
- Minicard: fundo `rgb(248, 250, 252)`, borda `rgb(229, 231, 235)`
- Barra de progresso: altura 6px, cores específicas por status

### Dependências PrimeReact
- `primereact/card`

### Dependências de Utilitários
- `../utils/cicloGestaoParser` - `loadCicloGestaoCsv`, `calcularDadosTarefas`
- `../types/CicloGestao` - `DadosTarefas`

### Estado
- `dadosTarefas`: `DadosTarefas | null` - Dados agregados de tarefas carregados do CSV
- `loading`: `boolean` - Estado de carregamento dos dados

### Hooks
- `useState` para gerenciar estado dos dados e loading
- `useEffect` para carregar dados na montagem do componente

### Carregamento de Dados
- Utiliza `loadCicloGestaoCsv()` para carregar dados do CSV
- Utiliza `calcularDadosTarefas()` para agregar dados de todas as tarefas
- Calcula percentuais dinamicamente baseado nos dados do CSV
- Exibe estado de loading enquanto carrega os dados

## Modal de Detalhes

### Estilos do Modal
- **`.modal-card-content`**: padding `0.5rem 1rem` (vertical compacto)
- **`.modal-card-titulo`**: margin-bottom `0.5rem`, line-height `1.2`
- **`.modal-tabela-dados-tarefas`**: gap `0.75rem`, padding e margin `0`
- **`.dado-item-tarefas`**: padding `0.5rem 0.75rem`, gap `0.25rem`
- **`.dado-item-tarefas .dado-valor`**: line-height `1.1`, margin `0`
- **`.dado-item-tarefas .dado-label`**: line-height `1.2`, margin `0`
- **Otimizações**: Altura automática, line-heights reduzidos, paddings harmoniosos

## Exemplo de Uso

```tsx
<Tarefas />
```

## Observações
- Minicards compactos e pequenos
- Layout em 3 colunas (3 minicards por linha)
- Barra de progresso com legenda próxima
- Card de progresso geral destacado no topo
- Efeitos hover com elevação e sombra aumentada
- **Dados dinâmicos**: Todos os valores são calculados a partir do CSV `ciclo-gestao.csv`
- **Percentuais**: Calculados automaticamente baseados no total de tarefas
- **Progresso Geral**: Soma de tarefas concluídas + concluídas com atraso
- **Formatação**: Percentuais formatados com vírgula (ex: "53,17%")
- **Espaçamentos harmoniosos**: Paddings e gaps ajustados para proporção equilibrada sem espaços desnecessários

