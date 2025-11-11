# Prompt: Componente PlanosAcao

## Objetivo
Criar o componente principal que exibe 4 cards com informações do ciclo de gestão, cada um com link "Ver detalhes" que abre um modal.

## Estrutura do Componente

### Arquivo
- `src/components/PlanosAcao.tsx`
- `src/components/PlanosAcao.css`
- `src/components/DadosCicloGestao.css` (estilos compartilhados dos cards)

### Funcionalidades

1. **Card Principal**
   - Wrapper: Card do PrimeReact com classe `planos-acao-card-principal`
   - Fundo: cor suave (#f8f9fa) para diferenciar da página
   - Título: "Dados do Ciclo de Gestão" com ícone `pi-chart-line`

2. **Grid de Cards (4 cards - 2 por linha)**

   **Card 1 - Escolas e Profissionais**
   - Ícone: `pi-building`
   - Título: "Escolas e Profissionais"
   - Descrição: Dados dinâmicos carregados de `escolas.csv` (escolas, alunos, TCGP's, professores, pedagogos, coordenadores municipais)
   - Cor: gradiente azul/lavanda (#e3f2fd → #bbdefb)
   - Modal: `DadosCicloGestaoModal` com tipo `"numeros-totais"`

   **Card 2 - Escolas e Metas**
   - Ícone: `pi-map-marker`
   - Título: "Escolas e Metas"
   - Descrição: "Veja detalhes das metas pactuadas para o ano de 2026."
   - Cor: gradiente verde (#e8f5e9 → #c8e6c9)
   - Modal: `DadosCicloGestaoModal3`

   **Card 3 - Planos de Ação**
   - Ícone: `pi-users`
   - Título: "Planos de Ação"
   - Descrição: "Planos de Ação em 100% das escolas do CdG"
   - Cor: gradiente laranja/amarelo
   - Modal: `PlanosAcaoModal2` (Panorama Geral - inclui pendências de postagem)

   **Card 4 - TCGP's por Regional e Município**
   - Ícone: `pi-id-card`
   - Título: "TCGP's por Regional e Município"
   - Descrição: "Veja a distribuição dos 812 TCGPs."
   - Cor: gradiente roxo (#f3e5f5 → #e1bee7)
   - Modal: `DadosCicloGestaoModal2`

3. **Layout dos Cards**
   - Grid: 2 colunas (`grid-template-columns: repeat(2, 1fr)`)
   - Gap: 1.5rem entre cards
   - Cada card com estrutura: ícone | título | link "Ver detalhes"

### Dependências PrimeReact
- `primereact/card`

### Modais

**PlanosAcao.modal2.tsx** - Panorama Geral
- Abre quando clica em "Ver detalhes" no card "Planos de Ação"
- Navegação hierárquica: Espírito Santo → Regionais → Municípios → Escolas
- Card do Espírito Santo com métricas: Planos de Ação, Mapas de Ação, Validados pelo TCGP, Não validados pelo TCGP, Planos Inativos
- Tabelas com coluna "Possui Planos Inativos?" (badge Sim/Não)
- Card de "Pendências de Postagem" sempre no final (fundo amarelo suave)
- Tabela de "Planos de Ação Inativos" abaixo das tabelas principais
- Dados carregados de `ciclo-gestao.csv` e `escolas.csv`

**DadosCicloGestao.modal1.tsx** - Números Totais
- Abre quando clica em "Ver detalhes" no card "Escolas e Profissionais"
- Mostra dados agregados por Estado, Regionais, Municípios e Escolas

**DadosCicloGestao.modal2.tsx** - TCGP's por Regional e Município
- Abre quando clica em "Ver detalhes" no card "TCGP's por Regional e Município"
- Mostra distribuição de TCGP's

**DadosCicloGestao.modal3.tsx** - Escolas e Metas
- Abre quando clica em "Ver detalhes" no card "Escolas e Metas"
- Mostra dados de metas pactuadas

### Estado
- `modalDetalhesVisible`: boolean para controlar visibilidade do modal PlanosAcao
- `modalVisible`: boolean para controlar visibilidade do modal DadosCicloGestao (modal1)
- `modalTipo`: string | null para identificar qual tipo de modal abrir
- `modal2Visible`: boolean para controlar visibilidade do modal DadosCicloGestao (modal2)
- `modal3Visible`: boolean para controlar visibilidade do modal DadosCicloGestao (modal3)
- `dadosGerais`: dados agregados do estado (escolas, alunos, TCGP's, professores, pedagogos, coordenadores)
- `loading`: estado de carregamento dos dados

### Hooks
- `useState` para gerenciar estados dos modais e dados
- `useEffect` para carregar dados de `escolas.csv` ao montar o componente

### Funções Utilitárias
- `loadEscolasFromCsv()`: carrega dados de escolas.csv
- `calcularDadosEspiritoSanto()`: calcula dados agregados do estado

## Exemplo de Uso

```tsx
<PlanosAcao />
```

## Observações
- Título principal: "Dados do Ciclo de Gestão" (não mais "Planos de Ação")
- Cards em grid 2x2 (2 cards por linha)
- Dados do card "Escolas e Profissionais" são carregados dinamicamente dos CSVs
- Modal de Planos de Ação agora inclui pendências de postagem e planos inativos
- Componente consolidado: contém os 4 cards principais que antes estavam em DadosCicloGestao
