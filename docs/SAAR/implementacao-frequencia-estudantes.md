# Implementação: Frequência dos Estudantes

**Data**: 2025-01-12  
**Status**: ✅ Concluído

## Objetivo

Implementar a aba "Frequência" no módulo SAAR, exibindo dados de frequência dos estudantes com gráfico de linha temporal e filtros de período e séries.

## Funcionalidades Implementadas

### 1. Estrutura de Dados

#### Script de Geração de Dados
- **Arquivo**: `scripts/gerar-frequencia-estudantes.mjs`
- **CSV Gerado**: `public/frequencia-estudantes.csv`
- **Colunas**:
  - Regional, Município, Escola, Série, Turma, Aluno
  - Dias do mês, Presença/Falta (P ou F)
  - Data (YYYY-MM-DD), Dia Letivo (índice sequencial)
- **Características**:
  - 2 meses letivos (Fevereiro e Março de 2025)
  - 20-30 alunos por turma
  - Frequência média de 80% com maior dispersão (55-100%)
  - Nomes fictícios gerados automaticamente

### 2. Arquitetura do Componente

Seguindo o padrão de refatoração estabelecido, o módulo foi dividido em:

#### Tipos (`src/SAAR/types/FrequenciaEstudantes.types.ts`)
- `FrequenciaEstudantesProps`: Props do componente
- `FrequenciaEstudantesRow`: Interface para linha do CSV
- `DadosFrequenciaPorData`: Interface para dados agrupados por data

#### Utilitários

**Parser** (`src/SAAR/utils/frequenciaEstudantesParser.ts`)
- `parseCSVLine()`: Parse de linha CSV com campos entre aspas
- `aplicarFiltros()`: Aplicação de filtros hierárquicos
- `parseRowToFrequencia()`: Conversão de linha CSV para objeto tipado

**Cálculos** (`src/SAAR/utils/frequenciaEstudantesCalculations.ts`)
- `calcularIndicadorFrequencia()`: Calcula percentual de presenças
- `calcularTotalAlunos()`: Conta alunos únicos (escola + série + aluno)
- `agruparDadosPorData()`: Agrupa dados por data e calcula frequência percentual

**Configuração do Gráfico** (`src/SAAR/utils/frequenciaEstudantesChartConfig.ts`)
- `criarOpcoesGrafico()`: Configuração do ApexCharts (gráfico de linha)
- `criarSeriesGrafico()`: Séries de dados (frequência percentual)

#### Hooks Customizados

**`src/SAAR/hooks/useFrequenciaEstudantesData.ts`**
- Carrega dados do CSV
- Aplica filtros automaticamente
- Gerencia estado de carregamento

**`src/SAAR/hooks/useApexChart.ts`**
- Hook reutilizado para carregar ApexCharts dinamicamente

#### Componente Principal
- **Arquivo**: `src/SAAR/abas/SAAR.TabView.FrequenciaEstudantes.tsx`
- **Linhas**: ~297
- **Responsabilidades**: UI e orquestração

### 3. Interface do Usuário

#### Layout
- **Estrutura**: 1:11 colunas (indicador/filtros : gráfico)
- **Card de Indicadores**:
  - Frequência percentual (ex: 80.50%)
  - Total de alunos únicos (ex: 1.250)
- **Card de Filtros**:
  - **Slider de Período**: Range de dias letivos (1 até total)
  - **MultiSelect de Séries**: Seleção múltipla (padrão: apenas "2º Ano")
- **Gráfico**: Linha temporal mostrando frequência percentual ao longo do tempo

#### Características do Gráfico
- **Tipo**: Linha suave (smooth curve)
- **Eixo X**: Datas (formato DD/MM)
- **Eixo Y**: Frequência percentual (0-100%)
- **Visualização**: Evidencia períodos com mais faltas (quedas na linha)

### 4. Filtros Implementados

#### Filtro de Período (Slider)
- **Tipo**: Slider com range
- **Valores**: Dias letivos (1 até total de dias úteis)
- **Padrão**: Todos os dias (range completo)
- **Funcionalidade**: Filtra dados por intervalo de dias letivos
- **Label Dinâmico**: Mostra range selecionado (ex: "Período (Dias Letivos: 1 - 40)")

#### Filtro de Séries
- **Tipo**: MultiSelect com chips
- **Padrão**: Apenas "2º Ano" selecionado
- **Funcionalidade**: Permite adicionar outras séries conforme necessário
- **Validação**: Garante que pelo menos uma série esteja selecionada

### 5. Integração

- **Aba no TabView**: "Frequência" (anteriormente "Frequência dos estudantes")
- **Filtros Hierárquicos**: Integrado com `SAAR.Filtros.tsx`
- **Navegação**: Funciona com sistema de navegação existente

## Métricas

| Métrica | Valor |
|---------|-------|
| Arquivos criados | 7 |
| Linhas no componente principal | ~297 |
| Funções utilitárias | 5 |
| Hooks customizados | 1 (reutiliza 1 existente) |
| Console.logs removidos | 0 (apenas console.error para erros) |

## Estrutura de Arquivos

```
src/SAAR/
├── types/
│   └── FrequenciaEstudantes.types.ts          (~35 linhas)
├── utils/
│   ├── frequenciaEstudantesParser.ts          (~85 linhas)
│   ├── frequenciaEstudantesCalculations.ts    (~165 linhas)
│   └── frequenciaEstudantesChartConfig.ts     (~110 linhas)
├── hooks/
│   └── useFrequenciaEstudantesData.ts         (~87 linhas)
└── abas/
    ├── SAAR.TabView.FrequenciaEstudantes.tsx  (~297 linhas)
    └── SAAR.TabView.FrequenciaEstudantes.css  (~150 linhas)
```

## Dependências

- **PrimeReact**: `Slider`, `MultiSelect`
- **ApexCharts**: Gráfico de linha
- **React Hooks**: `useState`, `useEffect`, `useMemo`

## Melhorias Futuras

1. Adicionar mais opções de período (trimestres, semestres)
2. Exportar dados filtrados para CSV
3. Adicionar tooltips mais informativos no gráfico
4. Implementar zoom no gráfico para análise detalhada
5. Adicionar comparação entre períodos

## Notas Técnicas

- O slider usa dias letivos como unidade de medida
- A frequência é calculada como percentual de presenças sobre total de registros
- Alunos únicos são identificados por chave composta: `escola|série|aluno`
- O gráfico mostra frequência percentual, não valores absolutos
- Períodos com mais faltas aparecem como quedas na linha do gráfico

