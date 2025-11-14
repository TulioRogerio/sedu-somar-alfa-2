# Arquitetura e Componentes do SAAR

## Visão Geral

O módulo SAAR (Sistema de Acompanhamento e Avaliação de Resultados) é um sistema de dashboard que exibe indicadores educacionais através de gráficos interativos e filtros hierárquicos.

## Estrutura de Diretórios

```
src/SAAR/
├── components/          # Componentes reutilizáveis
│   ├── SAARCardIndicador.tsx
│   ├── SAARChartContainer.tsx
│   ├── SAARLegend.tsx
│   ├── SAARLoadingState.tsx
│   ├── SAAREmptyState.tsx
│   └── index.ts
├── abas/                # Componentes de cada aba do TabView
│   ├── SAAR.TabView.Eficiencia.tsx
│   ├── SAAR.TabView.AulasDadas.tsx
│   ├── SAAR.TabView.FrequenciaEstudantes.tsx
│   ├── SAAR.TabView.Tarefas.tsx
│   ├── SAAR.TabView.Produtos.tsx
│   └── SAAR.TabView.VisitasTecnicas.tsx
├── hooks/               # Custom hooks para dados
│   ├── useApexChart.ts
│   ├── useEficienciaData.ts
│   ├── useTarefasData.ts
│   └── ...
├── utils/               # Funções utilitárias
│   ├── filtrosUtils.ts        # NOVO: Normalização de filtros
│   ├── sharedCalculations.ts  # Funções compartilhadas
│   ├── *Calculations.ts       # Cálculos específicos
│   ├── *ChartConfig.ts        # Configurações de gráficos
│   └── *Parser.ts             # Parsers de CSV
├── types/               # Tipos TypeScript
│   ├── shared.types.ts        # Tipos compartilhados
│   └── *.types.ts             # Tipos específicos
├── constants/           # Constantes
│   ├── shared.constants.ts    # NOVO: Constantes compartilhadas
│   └── *.constants.ts
├── SAAR.tsx             # Componente principal
├── SAAR.Filtros.tsx     # Componente de filtros
└── SAAR.TabView.tsx     # Container de abas
```

## Componentes Reutilizáveis

### SAARCardIndicador

Card de indicador usado em múltiplas abas para exibir valores principais.

**Props:**

- `valor: string | number` - Valor principal (ex: percentual)
- `label: string` - Label do indicador
- `detalhes?: { numero: string | number; texto: string }` - Detalhes adicionais
- `tooltip?: string` - Tooltip opcional
- `className?: string` - Classe CSS adicional

**Exemplo:**

```tsx
<SAARCardIndicador
  valor={`${percentual}%`}
  label="Tarefas Concluídas"
  tooltip="Inclui Concluídas + Concluídas com Atraso"
  detalhes={{
    numero: formatarNumero(total),
    texto: `de ${formatarNumero(esperadas)} esperadas`,
  }}
/>
```

### SAARChartContainer

Container de gráfico que gerencia estados de loading, empty e exibição.

**Props:**

- `title: string` - Título do card
- `subTitle?: string` - Subtítulo opcional
- `options?: ApexOptions | null` - Opções do gráfico ApexCharts
- `series?: ApexAxisChartSeries | ApexNonAxisChartSeries` - Séries do gráfico
- `type?: "line" | "bar" | "radar" | "pie" | "donut" | "area"` - Tipo do gráfico
- `height?: number` - Altura do gráfico (padrão: 400)
- `loading?: boolean` - Estado de carregamento
- `emptyMessage?: string` - Mensagem quando não há dados
- `className?: string` - Classe CSS adicional
- `children?: React.ReactNode` - Conteúdo adicional (ex: legenda)

**Exemplo:**

```tsx
<SAARChartContainer
  title={tituloCard}
  subTitle="Distribuição de Status"
  options={opcoesGrafico}
  series={seriesGrafico}
  type="bar"
  height={400}
  loading={false}
>
  <SAARLegend items={legendItems} />
</SAARChartContainer>
```

### SAARLegend

Legenda customizada para gráficos.

**Props:**

- `items: LegendItem[]` - Array de itens da legenda
- `className?: string` - Classe CSS adicional
- `orientation?: "horizontal" | "vertical"` - Orientação (padrão: vertical)

**Exemplo:**

```tsx
<SAARLegend
  items={[
    { color: "#3b82f6", label: "Concluídas" },
    { color: "#f59e0b", label: "Em Andamento" },
  ]}
  orientation="vertical"
/>
```

### SAARLoadingState

Estado de carregamento padronizado.

**Props:**

- `message?: string` - Mensagem opcional
- `skeletonCount?: number` - Quantidade de skeletons (padrão: 2)

**Exemplo:**

```tsx
if (carregando) {
  return <SAARLoadingState />;
}
```

### SAAREmptyState

Estado vazio padronizado.

**Props:**

- `message?: string` - Mensagem a ser exibida (padrão: "Nenhum dado disponível")
- `className?: string` - Classe CSS adicional

**Exemplo:**

```tsx
if (!dados) {
  return <SAAREmptyState message="Nenhum dado encontrado" />;
}
```

## Padrões de Uso

### Estrutura de uma Aba

```tsx
import { useMemo } from "react";
import { useModuloData } from "../hooks/useModuloData";
import { obterTituloCard } from "../utils/sharedCalculations";
import {
  criarOpcoesGrafico,
  criarSeriesGrafico,
} from "../utils/moduloChartConfig";
import {
  SAARCardIndicador,
  SAARChartContainer,
  SAARLegend,
  SAARLoadingState,
  SAAREmptyState,
} from "../components";

export default function SAARTabViewModulo({ filtros }: ModuloProps) {
  const { dadosAgregados, carregando } = useModuloData(filtros);
  const tituloCard = useMemo(() => obterTituloCard(filtros), [filtros]);

  const opcoesGrafico = useMemo(() => {
    if (!dadosAgregados) return null;
    return criarOpcoesGrafico(dadosAgregados);
  }, [dadosAgregados]);

  const seriesGrafico = useMemo(() => {
    if (!dadosAgregados) return [];
    return criarSeriesGrafico(dadosAgregados);
  }, [dadosAgregados]);

  if (carregando) return <SAARLoadingState />;
  if (!dadosAgregados) return <SAAREmptyState />;

  return (
    <div className="saar-modulo">
      <div className="saar-modulo-left">
        <SAARCardIndicador {...props} />
      </div>
      <div className="saar-modulo-center">
        <SAARChartContainer {...props}>
          <SAARLegend items={legendItems} />
        </SAARChartContainer>
      </div>
    </div>
  );
}
```

### Hooks de Dados

Todos os hooks seguem o padrão:

```tsx
export function useModuloData(filtros?: FiltroContexto) {
  const [dados, setDados] = useState<DadosModulo | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Lógica de carregamento
  }, [filtros]);

  return { dadosAgregados: dados, carregando };
}
```

### Configuração de Gráficos

As funções de configuração seguem o padrão:

```tsx
export function criarOpcoesGrafico(dados: DadosModulo): ApexOptions {
  return {
    chart: { type: "bar" as const, toolbar: { show: false } },
    plotOptions: { bar: { ... } },
    // ... outras opções
  };
}

export function criarSeriesGrafico(dados: DadosModulo): ApexAxisChartSeries {
  return [{ name: "Série", data: [...] }];
}
```

## Tipos Compartilhados

### FiltroContexto

```typescript
interface FiltroContexto {
  estado?: { label: string; value: string };
  regional?:
    | { label: string; value: string }
    | { label: string; value: string }[];
  municipio?:
    | { label: string; value: string }
    | { label: string; value: string }[];
  escola?:
    | { label: string; value: string }
    | { label: string; value: string }[];
  saar?: { label: string; value: string };
}
```

**Nota**: `regional`, `municipio` e `escola` podem ser arrays para suportar múltiplas seleções.

### SAARBaseProps

```typescript
interface SAARBaseProps {
  filtros?: FiltroContexto;
}
```

## Funções Utilitárias Compartilhadas

### Normalização de Filtros (`filtrosUtils.ts`)

Funções para normalizar e processar filtros de hierarquia:

```typescript
// Normaliza um filtro para array
function normalizarFiltroParaArray<T>(filtro: T | T[] | undefined): T[];

// Normaliza todos os filtros de hierarquia
function normalizarFiltrosHierarquia(filtros?: FiltroContexto): {
  regionais: string[];
  municipios: string[];
  escolas: string[];
};

// Verifica se uma escola corresponde aos filtros
function escolaCorrespondeFiltros(
  escola: { regional?: string; municipio?: string; nome?: string },
  filtrosNormalizados: ReturnType<typeof normalizarFiltrosHierarquia>
): boolean;
```

### obterTituloCard

Retorna o título do card baseado nos filtros aplicados (prioridade: escola > município > regional > estado).

```typescript
function obterTituloCard(filtros?: FiltroContexto): string;
```

### formatarNumero

Formata número com separador de milhares (pt-BR).

```typescript
function formatarNumero(numero: number): string;
```

### formatarPercentual

Formata percentual com casas decimais (pt-BR).

```typescript
function formatarPercentual(percentual: number, casasDecimais?: number): string;
```

## Boas Práticas

1. **Sempre use componentes reutilizáveis** quando possível
2. **Use `useMemo`** para cálculos pesados e preparação de dados
3. **Trate estados de loading e empty** usando `SAARLoadingState` e `SAAREmptyState`
4. **Centralize funções comuns** em `sharedCalculations.ts`
5. **Mantenha tipos compartilhados** em `shared.types.ts`
6. **Use hooks customizados** para lógica de dados
7. **Separe configurações de gráficos** em arquivos `*ChartConfig.ts`
8. **Mantenha arquivos com menos de 300 linhas** - divida quando necessário

## Ordem de Implementação de Nova Aba

1. Criar tipos em `types/Modulo.types.ts`
2. Criar constantes em `constants/Modulo.constants.ts`
3. Criar parser em `utils/moduloParser.ts`
4. Criar cálculos em `utils/moduloCalculations.ts`
5. Criar configuração de gráfico em `utils/moduloChartConfig.ts`
6. Criar hook em `hooks/useModuloData.ts`
7. Criar componente da aba em `abas/SAAR.TabView.Modulo.tsx`
8. Adicionar aba em `SAAR.TabView.tsx`
