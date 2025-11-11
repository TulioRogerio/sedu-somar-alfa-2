# Prompt: Componente VisitasTecnicas

## Objetivo
Criar o componente que exibe informações sobre as visitas técnicas realizadas no ciclo de gestão, com seleção de ciclo e modal detalhado com navegação hierárquica.

## Estrutura do Componente

### Arquivos
- `src/components/VisitasTecnicas.tsx`
- `src/components/VisitasTecnicas.css`
- `src/components/VisitasTecnicas.modal1.tsx` (Modal de detalhes)
- `src/components/VisitasTecnicas.modal1.css` (Estilos do modal)

### Funcionalidades do Card Principal

1. **Card Principal**
   - Wrapper: Card do PrimeReact com classe `visitas-tecnicas-card-principal`
   - Fundo: degradê rosa suave `#fef7ff` com borda `#f3e5f5`
   - Sombra: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)`
   - Borda: `1px solid #f3e5f5`
   - Título: "Visitas Técnicas"

2. **Título Principal**
   - Layout: Flex (ícone | título | link)
   - Ícone: `pi-briefcase` (roxo #7b1fa2)
   - Título: "Visitas Técnicas"
   - Link: "Ver detalhes" com ícone `pi-external-link` (abre modal)

3. **Seleção de Ciclo**
   - Botões: "Ciclo I", "Ciclo II", "Ciclo III"
   - Estado ativo: fundo rosa `#f3e5f5`, borda `#7b1fa2`, texto `#7b1fa2`
   - Estado inativo: fundo transparente, borda `#e1bee7`, texto `#7b1fa2`
   - Filtra as métricas conforme o ciclo selecionado

4. **Métricas (3 itens em grid)**
   - **Item 1**: Nº de Visitas Esperadas
     - Linha 1: Número formatado (ex: "312")
     - Linha 2: Label "Nº de Visitas Esperadas"
   - **Item 2**: N° de Atas Assinadas
     - Linha 1: Número formatado (ex: "298")
     - Linha 2: Label "N° de Atas Assinadas"
   - **Item 3**: Percentual de atas pendentes
     - Linha 1: Percentual formatado (ex: "4,49%")
     - Linha 2: Label "de atas pendentes"
   - Cards com destaque suave: `background-color: rgba(255, 255, 255, 0.8)`, borda `rgba(243, 229, 245, 0.6)`, sombra sutil

### Layout CSS

- Container: `visitas-tecnicas-container`
- Card principal: `visitas-tecnicas-card-principal` (fundo rosa, sombra, borda)
- Título principal: `visitas-tecnicas-titulo-principal` (flex)
- Seleção de ciclos: `card-ciclos-selecao` (flex, gap)
- Botões de ciclo: `ciclo-btn` (com estado `.ativo`)
- Métricas: `card-metricas` (grid 3 colunas)
- Item de métrica: `metrica-item` (com destaque suave)

### Dependências PrimeReact
- `primereact/card`
- `primereact/dialog` (para o modal)

### Dependências de Utilitários
- `../utils/visitasTecnicasParser` - `loadVisitasTecnicasCsv`, `calcularDadosVisitasTecnicas`
- `../types/VisitasTecnicas` - `DadosVisitasTecnicasAgregados`, `DadosVisitasTecnicasRegional`, `DadosVisitasTecnicasMunicipio`, `DadosVisitasTecnicasEscola`

### Estado
- `dadosVisitas`: `DadosVisitasTecnicasAgregados | null` - Dados agregados de visitas técnicas
- `loading`: `boolean` - Estado de carregamento dos dados
- `modalVisible`: `boolean` - Estado de visibilidade do modal
- `cicloSelecionado`: `1 | 2 | 3` - Ciclo selecionado para filtrar métricas

### Hooks
- `useState` para gerenciar estado dos dados, loading, modal e ciclo selecionado
- `useEffect` para carregar dados na montagem do componente

### Carregamento de Dados
- Utiliza `loadVisitasTecnicasCsv()` para carregar dados do CSV `visitas-tecnicas.csv`
- Utiliza `calcularDadosVisitasTecnicas()` para agregar dados de todas as visitas técnicas
- Calcula métricas dinamicamente baseado no ciclo selecionado
- Exibe estado de loading enquanto carrega os dados
- Percentual de atas pendentes: calculado como `((esperadas - atasAssinadas) / esperadas) * 100`

## Modal de Detalhes

### Funcionalidades do Modal

1. **TabView com 4 Abas**
   - **Aba Estado**: Dados do Espírito Santo (sempre visível)
   - **Aba Regionais**: Seleção múltipla de regionais
   - **Aba Municípios**: Seleção múltipla de regionais e municípios
   - **Aba Escolas**: Seleção múltipla de regionais, municípios e escolas
   - TabView em box com background `#f8f9fa`, padding, border-radius e sombra
   - Tabs com ícones: `pi-map-marker` (Estado), `pi-building` (Regionais), `pi-home` (Municípios), `pi-sitemap` (Escolas)
   - Tabs ativas em tons de cinza (#424242, #616161)

2. **MultiSelect para Seleção Múltipla**
   - Componente: `MultiSelect` do PrimeReact
   - Display: `chip` (mostra seleções como chips)
   - Filtro: Campo de busca integrado
   - Placeholder: "Selecione uma ou mais..."
   - Chips em tons de cinza: background `#e0e0e0`, texto `#424242`
   - Botão X (clear) alinhado corretamente à direita
   - Filtros em cascata: seleção de regional habilita municípios, seleção de município habilita escolas

3. **Layout dos Cards**
   - **Card de Métricas**: 1 card com 3 métricas (Visitas Esperadas, Atas Assinadas, % de atas pendentes)
   - **Cards de Gráficos**: 3 cards separados (Ciclo I, Ciclo II, Ciclo III)
   - Grid: 4 colunas (0.8fr para métricas, 1.07fr para cada gráfico)
   - Cards com margens: `margin: 1.5rem 0` para não colar nas bordas
   - Fundo: degradê azul suave `linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)`
   - Headers e content com background semi-transparente branco para manter o degradê visível

4. **Gráficos Combinados (Linha + Barras)**
   - Tipo: Chart.js combinado (line + bar)
   - Linha: "Visitas Previstas" (atrás, `order: 1`)
   - Barras: "Atas Assinadas" (na frente, `order: 2`)
   - Visual: Barras devem "tocar" a linha (indicando que devem alcançar as visitas previstas)
   - Cores dos gráficos mantêm identidade temática (azul para estado, rosa para regionais, verde para municípios, laranja para escolas)
   - Eixo X: Etapas do ciclo (rotacionadas 60°, fonte 11px, `autoSkip: false`)
   - Eixo Y: Valores numéricos (stepSize: 1, formato pt-BR)

5. **Múltiplas Seleções**
   - Quando múltiplas regionais/municípios/escolas são selecionadas, os cards são exibidos em **linhas** (um embaixo do outro)
   - Grid: `display: flex; flex-direction: column; gap: 1.5rem`
   - Cada card mantém o mesmo layout (métricas + 3 gráficos)

6. **Elementos em Tons de Cinza**
   - Tabs: cores em tons de cinza (#757575, #616161, #424242)
   - Filtros: ícones e labels em cinza (#757575, #616161)
   - MultiSelect: bordas e hovers em cinza (#bdbdbd, #9e9e9e)
   - Chips: background cinza (#e0e0e0) com texto escuro (#424242)
   - Headers dos cards: texto em cinza (#424242)
   - Métricas: valores em cinza (#424242)
   - Ícones: chevron e outros em cinza (#757575)
   - Apenas os gráficos mantêm cores temáticas

### Dependências do Modal
- `primereact/dialog` - Dialog do modal
- `primereact/card` - Cards dos dados
- `primereact/chart` - Gráficos Chart.js
- `primereact/tabview` - TabView para navegação
- `primereact/multiselect` - MultiSelect para seleção múltipla
- `chart.js` - Biblioteca de gráficos (CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

### Funções de Cálculo Utilizadas
- `calcularDadosVisitasTecnicas()` - Dados do estado
- `calcularDadosVisitasTecnicasRegionais()` - Dados por regional
- `calcularDadosVisitasTecnicasMunicipios()` - Dados por município (com filtro opcional de regional)
- `calcularDadosVisitasTecnicasEscolas()` - Dados por escola (com filtro opcional de município)

### Estados do Modal
- `escolas`: `Escola[]` - Lista de escolas carregadas
- `visitasData`: `VisitaTecnicaRow[]` - Dados brutos de visitas técnicas
- `dadosES`: `DadosVisitasTecnicasAgregados | null` - Dados do estado
- `dadosRegionais`: `DadosVisitasTecnicasRegional[]` - Dados por regional
- `regionaisSelecionadas`: `DadosVisitasTecnicasRegional[]` - Regionais selecionadas (múltipla seleção)
- `municipiosSelecionados`: `DadosVisitasTecnicasMunicipio[]` - Municípios selecionados (múltipla seleção)
- `escolasSelecionadas`: `DadosVisitasTecnicasEscola[]` - Escolas selecionadas (múltipla seleção)
- `loading`: `boolean` - Estado de carregamento

### Funções do Modal
- `prepararDadosGrafico()`: Prepara dados e opções para gráficos combinados (linha + barras)
- `renderCard()`: Função genérica para renderizar cards (recebe dados, título e tema)
- `handleRegionaisChange()`: Handler para mudança de seleção de regionais
- `handleMunicipiosChange()`: Handler para mudança de seleção de municípios
- `formatarNumero()`: Formata números em pt-BR
- `municipiosDisponiveis`: useMemo que calcula municípios baseado nas regionais selecionadas
- `escolasDisponiveis`: useMemo que calcula escolas baseado nos municípios selecionados

### Estrutura de Dados

#### DadosVisitasTecnicasAgregados
```typescript
{
  totalEsperadas: number;
  totalRealizadas: number;
  totalAtasAssinadas: number;
  percentualPendentes: number;
  porCiclo: DadosVisitasTecnicasPorCiclo[];
}
```

#### DadosVisitasTecnicasPorCiclo
```typescript
{
  ciclo: number;
  esperadas: number;
  realizadas: number;
  atasAssinadas: number;
  percentualRealizadas: number;
  percentualAtasAssinadas: number;
  porEtapa: DadosVisitasTecnicasPorEtapa[];
  porTematica: DadosVisitasTecnicasPorTematica[];
}
```

### Estilos do Modal

1. **TabView**
   - Container: background `#f8f9fa`, padding `1.5rem`, border-radius `8px`, sombra
   - Nav: background branco, borda `#e0e0e0`, border-radius `6px`, padding `0.5rem`
   - Tabs: padding `0.875rem 1.5rem`, border-radius `4px`, cores em cinza
   - Tab ativa: background `#f5f5f5`, cor `#424242`, borda inferior `#9e9e9e`

2. **Filtros**
   - Seção: background `#f5f5f5`, borda `#e0e0e0`, sombra sutil
   - Labels: uppercase, letter-spacing, cor `#616161`
   - Ícones: cor `#757575`

3. **Cards**
   - Margens: `1.5rem 0` (não colam nas bordas)
   - Fundo: degradê azul suave `linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)`
   - Borda: `1px solid #e0e0e0`
   - Sombra: `0 2px 8px rgba(0, 0, 0, 0.1)`
   - Header: background `rgba(255, 255, 255, 0.7)`, texto `#424242`
   - Content: background `rgba(255, 255, 255, 0.5)`
   - Métricas: background `rgba(255, 255, 255, 0.8)`, borda `#bdbdbd`
   - Gráficos: background `rgba(255, 255, 255, 0.95)`, borda `#bdbdbd`

4. **MultiSelect**
   - Compacto: min-height `36px`, padding reduzido
   - Borda: `1px solid #d0d0d0`
   - Hover: borda `#bdbdbd`
   - Focus: borda `#9e9e9e`, sombra `rgba(158, 158, 158, 0.15)`
   - Chips: background `#e0e0e0`, texto `#424242`
   - Botão X: alinhado à direita com `margin-left: auto`

5. **Empty State**
   - Background: `#fafafa`
   - Borda: `1px dashed #d0d0d0`
   - Ícone: `#bdbdbd`, tamanho `2.5rem`
   - Texto: `#757575`

## Exemplo de Uso

```tsx
<VisitasTecnicas />
```

## Observações

- **Dados dinâmicos**: Todos os valores são calculados a partir do CSV `visitas-tecnicas.csv`
- **Filtro por ciclo**: As métricas do card principal são filtradas conforme o ciclo selecionado
- **Percentuais baixos**: Percentual de atas pendentes configurado para mostrar valores entre 0-6%
- **Seleção múltipla**: Permite selecionar múltiplas regionais, municípios ou escolas para comparação
- **Layout em linhas**: Cards de múltiplas seleções são exibidos verticalmente (um embaixo do outro)
- **Tons de cinza**: Elementos não relacionados aos gráficos usam tons de cinza para melhor hierarquia visual
- **Degradê azul suave**: Cards com fundo em degradê azul suave para destaque sutil
- **Gráficos combinados**: Linha (visitas previstas) atrás e barras (atas assinadas) na frente
- **Navegação por TabView**: 4 abas para diferentes níveis hierárquicos
- **Filtros em cascata**: Seleção de regional habilita municípios, seleção de município habilita escolas
- **Formatação**: Números formatados em pt-BR, percentuais com vírgula (ex: "4,49%")
