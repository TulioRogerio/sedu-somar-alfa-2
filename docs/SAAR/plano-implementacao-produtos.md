# Plano de Implementação: Aba Produtos no SAAR

**Data**: 2025-01-12  
**Status**: 📋 Planejamento

## Objetivo

Implementar a aba "Produtos" no módulo SAAR, baseada no modal de produtos da página inicial, adaptando para usar ApexCharts e integrando com os filtros hierárquicos do SAAR.

## Análise do Modal Existente

### Estrutura Atual
- **Arquivo**: `src/components/Produtos.modal1.tsx`
- **Biblioteca de Gráficos**: Chart.js (doughnut charts)
- **Dados**: `ciclo-gestao.csv` (campo `produto_status`)
- **Navegação Hierárquica**: Espírito Santo → Regionais → Municípios → Escolas

### Funcionalidades
1. **Card do Espírito Santo**:
   - Total de Produtos
   - Distribuição por faixas (0-25%, 26-50%, 51-75%, 76-100%)
   - Percentual Médio

2. **Grid de Gráficos Regionais**:
   - Gráfico de rosca por regional
   - Clicável para navegar para municípios

3. **Grid de Gráficos Municipais**:
   - Gráfico de rosca por município (filtrado por regional)
   - Clicável para navegar para escolas
   - Botão "Voltar" para regionais

4. **Grid de Gráficos Escolares**:
   - Gráfico de rosca por escola (filtrado por município)
   - Botão "Voltar" para municípios

## Plano de Implementação

### Fase 1: Estrutura Base e Tipos

#### 1.1 Criar Tipos TypeScript
- **Arquivo**: `src/SAAR/types/Produtos.types.ts`
- **Interfaces**:
  - `ProdutosProps`: Props do componente (com filtros)
  - `DadosProdutos`: Dados agregados (total, faixas, percentual médio)
  - `DadosProdutosRegional`: Dados por regional
  - `DadosProdutosMunicipio`: Dados por município
  - `DadosProdutosEscola`: Dados por escola

#### 1.2 Criar Constantes
- **Arquivo**: `src/SAAR/constants/Produtos.constants.ts`
- **Constantes**:
  - `FAIXAS_PRODUTO`: Labels e cores das faixas
  - `CORES_FAIXAS`: Cores para cada faixa (vermelho, laranja escuro, laranja claro, verde)

### Fase 2: Utilitários e Cálculos

#### 2.1 Adaptar Parser de Dados
- **Arquivo**: `src/SAAR/utils/produtosParser.ts`
- **Funções**:
  - `carregarDadosProdutos()`: Carrega e parseia `ciclo-gestao.csv`
  - `aplicarFiltrosProdutos()`: Aplica filtros hierárquicos do SAAR
  - `parseRowToProduto()`: Converte linha CSV para objeto tipado

#### 2.2 Adaptar Funções de Cálculo
- **Arquivo**: `src/SAAR/utils/produtosCalculations.ts`
- **Funções** (adaptar de `cicloGestaoParser.ts`):
  - `calcularDadosProdutos()`: Agregação geral (Espírito Santo ou baseado em filtros)
  - `calcularDadosProdutosRegionais()`: Agregação por regional (filtrado por estado/SAAR)
  - `calcularDadosProdutosMunicipios()`: Agregação por município (filtrado por regional)
  - `calcularDadosProdutosEscolas()`: Agregação por escola (filtrado por município)
  - **Integração com filtros**: 
    - Receber filtros do SAAR como parâmetro
    - Aplicar filtros antes de calcular agregações
    - Considerar: estado, regional, município, escola, SAAR
  - **Formatação**: Função `formatarNumero()` para formatar números (ex: 1.250)

### Fase 3: Configuração de Gráficos ApexCharts

#### 3.1 Configuração do Gráfico de Rosca
- **Arquivo**: `src/SAAR/utils/produtosChartConfig.ts`
- **Funções**:
  - `criarOpcoesGraficoRosca()`: Configuração do gráfico donut do ApexCharts
  - `criarSeriesGraficoRosca()`: Séries de dados (valores das faixas)
  - **Características**:
    - Tipo: `donut`
    - Cores: Vermelho (0-25%), Laranja escuro (26-50%), Laranja claro (51-75%), Verde (76-100%)
    - Labels com percentuais
    - Tooltip com valores e percentuais

### Fase 4: Hook Customizado

#### 4.1 Hook de Dados
- **Arquivo**: `src/SAAR/hooks/useProdutosData.ts`
- **Funcionalidades**:
  - Carrega dados do `ciclo-gestao.csv`
  - Carrega dados do `escolas.csv` (para relacionamento)
  - Aplica filtros do SAAR automaticamente
  - Calcula dados agregados baseado nos filtros
  - Gerencia estado de carregamento

### Fase 5: Componente Principal

#### 5.1 Estrutura do Componente
- **Arquivo**: `src/SAAR/abas/SAAR.TabView.Produtos.tsx`
- **Layout**:
  - **Card Superior**: Indicadores agregados (baseado nos filtros)
    - **Título**: Nome do nível (Espírito Santo, Regional, Município ou Escola)
    - **Grid de Indicadores**:
      - Total de Produtos (número formatado)
      - 0 à 25% concluído (número formatado)
      - 26 a 50% concluído (número formatado)
      - 51 a 75% concluído (número formatado)
      - 76 a 100% concluído (número formatado)
      - Percentual Médio (número inteiro com %)
  - **Grid de Gráficos**: Cards com gráficos de rosca
    - **Nível 1**: Regionais (se nenhum filtro específico)
    - **Nível 2**: Municípios (se regional selecionada)
    - **Nível 3**: Escolas (se município selecionado)
    - **Sem grid**: Se escola selecionada (apenas card da escola)

#### 5.2 Navegação Hierárquica
- **Comportamento**:
  - **Sem filtros específicos**: 
    - Card: "Espírito Santo" (dados agregados)
    - Grid: Todas as regionais (clicáveis no modal original, mas no SAAR usa filtros)
  - **Com filtro de Regional**:
    - Card: Nome da regional (dados agregados da regional)
    - Grid: Municípios da regional
  - **Com filtro de Município**:
    - Card: Nome do município (dados agregados do município)
    - Grid: Escolas do município
  - **Com filtro de Escola**:
    - Card: Nome da escola (dados agregados da escola)
    - Grid: Não exibe (apenas dados da escola)
- **Breadcrumb**: Usar breadcrumb do SAAR para navegação (já implementado)
- **Nota**: A navegação é feita através dos filtros do SAAR, não clicando nos gráficos

#### 5.3 Integração com Filtros
- **Filtros do SAAR**:
  - `estado`: Filtrar por estado (padrão: Espírito Santo)
  - `regional`: Filtrar e mostrar apenas municípios da regional
  - `municipio`: Filtrar e mostrar apenas escolas do município
  - `escola`: Filtrar e mostrar apenas a escola selecionada
  - `saar`: Filtrar por SAAR (se aplicável aos dados)

### Fase 6: Estilos

#### 6.1 CSS do Componente
- **Arquivo**: `src/SAAR/abas/SAAR.TabView.Produtos.css`
- **Estilos**:
  - Grid responsivo para cards de gráficos
  - Estilos para card de indicadores
  - Estilos para gráficos de rosca
  - Botões de navegação (se necessário)

### Fase 7: Integração

#### 7.1 Integrar no TabView
- **Arquivo**: `src/SAAR/SAAR.TabView.tsx`
- **Ação**: Substituir conteúdo placeholder da aba "Produtos" pelo componente

## Estrutura de Arquivos Proposta

```
src/SAAR/
├── types/
│   └── Produtos.types.ts                    (~50 linhas)
├── constants/
│   └── Produtos.constants.ts                (~30 linhas)
├── utils/
│   ├── produtosParser.ts                    (~80 linhas)
│   ├── produtosCalculations.ts              (~200 linhas)
│   └── produtosChartConfig.ts              (~100 linhas)
├── hooks/
│   └── useProdutosData.ts                   (~100 linhas)
└── abas/
    ├── SAAR.TabView.Produtos.tsx            (~300 linhas)
    └── SAAR.TabView.Produtos.css            (~150 linhas)
```

## Diferenças do Modal Original

### 1. Biblioteca de Gráficos
- **Antes**: Chart.js (doughnut)
- **Depois**: ApexCharts (donut)

### 2. Filtros
- **Antes**: Navegação interna (cliques nos gráficos)
- **Depois**: Filtros hierárquicos do SAAR (estado, regional, município, escola)

### 3. Estrutura
- **Antes**: Modal (Dialog)
- **Depois**: Aba no TabView

### 4. Navegação
- **Antes**: Botões "Voltar" internos
- **Depois**: Breadcrumb do SAAR para navegação

## Checklist de Implementação

### Preparação
- [ ] Analisar estrutura do `ciclo-gestao.csv`
- [ ] Verificar funções de cálculo existentes em `cicloGestaoParser.ts`
- [ ] Mapear relacionamento entre `ciclo-gestao.csv` e `escolas.csv`

### Implementação
- [ ] Criar tipos TypeScript
- [ ] Criar constantes
- [ ] Adaptar parser de dados
- [ ] Adaptar funções de cálculo (com integração de filtros)
- [ ] Criar configuração de gráficos ApexCharts
- [ ] Criar hook customizado
- [ ] Criar componente principal
- [ ] Criar estilos CSS
- [ ] Integrar no TabView

### Testes
- [ ] Testar com filtro de estado (Espírito Santo)
- [ ] Testar com filtro de regional
- [ ] Testar com filtro de município
- [ ] Testar com filtro de escola
- [ ] Testar com filtro de SAAR
- [ ] Verificar navegação hierárquica
- [ ] Verificar gráficos de rosca (ApexCharts)

### Documentação
- [ ] Documentar implementação
- [ ] Atualizar fases de implementação

## Observações Importantes

1. **Dados**: Os dados vêm do `ciclo-gestao.csv` que já existe no projeto
2. **Filtros**: Os filtros do SAAR devem ser aplicados automaticamente
3. **Navegação**: A navegação hierárquica deve seguir os filtros selecionados
4. **Gráficos**: Usar ApexCharts donut charts (não Chart.js)
5. **Performance**: Considerar memoização dos cálculos e gráficos

## Próximos Passos

1. Iniciar pela Fase 1 (Tipos e Constantes)
2. Adaptar funções de cálculo existentes
3. Criar configuração de gráficos ApexCharts
4. Implementar componente principal
5. Integrar e testar

## Observações Adicionais

### Integração com Filtros do SAAR

A navegação hierárquica deve seguir os filtros selecionados:

1. **Sem filtros específicos**:
   - Mostra card do Espírito Santo (agregado geral)
   - Mostra grid de regionais

2. **Com filtro de Regional**:
   - Mostra card da regional selecionada
   - Mostra grid de municípios da regional

3. **Com filtro de Município**:
   - Mostra card do município selecionado
   - Mostra grid de escolas do município

4. **Com filtro de Escola**:
   - Mostra apenas card da escola selecionada
   - Não mostra grid (apenas dados da escola)

### Filtro de SAAR

Se o filtro de SAAR estiver disponível e aplicável aos dados:
- Filtrar produtos por SAAR selecionada
- Considerar apenas produtos do ciclo/SAAR correspondente

### Reutilização de Código

- As funções de cálculo já existem em `cicloGestaoParser.ts`
- Podem ser reutilizadas ou adaptadas para trabalhar com filtros do SAAR
- Não é necessário recriar toda a lógica, apenas adaptar

### Layout Responsivo

- Grid de gráficos deve ser responsivo
- Cards devem se ajustar ao tamanho da tela
- Gráficos devem manter proporção adequada

### Detalhes de Implementação

#### Card de Indicadores
- **Título Dinâmico**: 
  - Sem filtros: "Espírito Santo"
  - Com regional: Nome da regional
  - Com município: Nome do município
  - Com escola: Nome da escola
- **Grid de Dados**: 6 colunas (Total, 4 faixas, Percentual Médio)
- **Formatação**: Números com separador de milhares (pt-BR)

#### Gráficos de Rosca (Donut)
- **Tipo**: ApexCharts `donut`
- **Cores**:
  - 0-25%: Vermelho (#dc2626)
  - 26-50%: Laranja escuro (#f57c00)
  - 51-75%: Laranja claro (#ff9800)
  - 76-100%: Verde (#16a34a)
- **Labels**: Mostrar percentuais nas fatias (se >= 5% do total)
- **Tooltip**: Mostrar valor absoluto e percentual
- **Legenda**: Na parte inferior do gráfico

#### Grid de Gráficos
- **Layout**: Grid responsivo (3-4 colunas em desktop, 2 em tablet, 1 em mobile)
- **Card de Gráfico**:
  - Título: Nome da regional/município/escola
  - Subtítulo: "Distribuição por Faixas"
  - Total: Número formatado
  - Gráfico: Donut chart do ApexCharts
- **Interatividade**: 
  - No modal original: Cards eram clicáveis
  - No SAAR: Navegação via filtros (não precisa ser clicável)

### Funções Auxiliares Necessárias

1. **Formatação de Números**:
   ```typescript
   function formatarNumero(numero: number): string {
     return numero.toLocaleString("pt-BR");
   }
   ```

2. **Determinar Nível de Agregação**:
   - Baseado nos filtros selecionados, determinar qual nível mostrar
   - Lógica: escola > município > regional > estado

3. **Título Dinâmico**:
   - Extrair nome do nível baseado nos filtros
   - Fallback: "Espírito Santo" se nenhum filtro específico

4. **Lógica de Decisão de Nível**:
   ```typescript
   function determinarNivel(filtros: ProdutosProps["filtros"]): "estado" | "regional" | "municipio" | "escola" {
     if (filtros?.escola) return "escola";
     if (filtros?.municipio) return "municipio";
     if (filtros?.regional) return "regional";
     return "estado";
   }
   ```

5. **Determinar o que Exibir**:
   - **Nível "estado"**: Card do Espírito Santo + Grid de regionais
   - **Nível "regional"**: Card da regional + Grid de municípios
   - **Nível "municipio"**: Card do município + Grid de escolas
   - **Nível "escola"**: Apenas card da escola (sem grid)

### Dependências Externas

- **CSV**: `ciclo-gestao.csv` (já existe)
- **CSV**: `escolas.csv` (já existe, para relacionamento)
- **Biblioteca**: ApexCharts (já instalada)
- **Hooks**: `useApexChart` (já existe, reutilizar)

### Considerações de Performance

1. **Memoização**: Usar `useMemo` para cálculos pesados
2. **Lazy Loading**: Carregar dados apenas quando necessário
3. **Cache**: Considerar cache dos dados do CSV (se aplicável)
4. **Otimização de Gráficos**: Renderizar gráficos apenas quando visíveis

