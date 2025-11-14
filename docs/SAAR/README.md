# Documentação do Módulo SAAR

## Índice

1. [Arquitetura e Componentes](./arquitetura-componentes.md) - Estrutura, componentes reutilizáveis e padrões
2. [Otimizações e Refatoração](./otimizacoes-refatoracao.md) - Melhorias de código e redução de redundâncias
3. [Fases de Implementação](./fases-de-implementacao.md) - Histórico de implementação
4. [Cálculos de Indicadores](./calculos-indicadores.md) - Fórmulas e cálculos utilizados
5. [Prompts de Desenvolvimento](./prompt-saar.md) - Documentação original

## Visão Geral

O módulo SAAR (Sistema de Acompanhamento e Avaliação de Resultados) é um dashboard interativo que exibe indicadores educacionais através de gráficos e filtros hierárquicos.

## Componentes Principais

- **SAAR.tsx**: Componente principal que orquestra filtros e visualizações
- **SAAR.Filtros.tsx**: Sistema de filtros hierárquicos (Estado → Regional → Município → Escola)
- **SAAR.TabView.tsx**: Container de abas com diferentes visualizações

## Abas Disponíveis

1. **Eficácia**: Gráfico radar com indicadores consolidados (Aulas Dadas, Frequência, Tarefas, Produtos, Visitas Técnicas) e proficiências
2. **Aulas Dadas**: Distribuição de aulas por disciplina e turma
3. **Frequência**: Frequência de estudantes ao longo do tempo
4. **Prof. em L. Port.**: Proficiência em Língua Portuguesa (preparado)
5. **Prof. em Mat.**: Proficiência em Matemática (preparado)
6. **Leitura**: Proficiência em Leitura (preparado)
7. **Tarefas**: Status de tarefas (Previstas, Não Iniciadas, Em Andamento, etc.)
8. **Produtos**: Distribuição de produtos por faixas de conclusão
9. **Visitas Técnicas**: Visitas esperadas vs atas assinadas por ciclo

## Tecnologias

- **React** + **TypeScript**
- **PrimeReact**: Componentes UI (Card, TabView, Dropdown, etc.)
- **ApexCharts**: Gráficos interativos
- **CSV**: Fonte de dados (escolas.csv, ciclo-gestao.csv)

## Estrutura de Dados

Os dados são carregados de arquivos CSV e processados através de parsers específicos. Cada módulo tem seu próprio parser, cálculos e configurações de gráfico.

## Componentes Reutilizáveis

O módulo possui uma biblioteca de componentes reutilizáveis em `src/SAAR/components/`:

- `SAARCardIndicador`: Card de indicador padronizado
- `SAARChartContainer`: Container de gráfico com estados
- `SAARLegend`: Legenda customizada
- `SAARLoadingState`: Estado de carregamento
- `SAAREmptyState`: Estado vazio

Ver [Arquitetura e Componentes](./arquitetura-componentes.md) para detalhes.

## Otimizações Recentes

O código foi otimizado para reduzir redundâncias, remover hardcoding e melhorar a componentização:
- Função utilitária para normalização de filtros (`filtrosUtils.ts`)
- Constantes compartilhadas (`shared.constants.ts`)
- Uso consistente de componentes reutilizáveis
- Suporte a múltiplas seleções nos filtros

Ver [Otimizações e Refatoração](./otimizacoes-refatoracao.md) para detalhes.

## Próximos Passos

Para adicionar uma nova aba ou funcionalidade, consulte:
- [Arquitetura e Componentes](./arquitetura-componentes.md) - Padrões e estrutura
- [Otimizações e Refatoração](./otimizacoes-refatoracao.md) - Melhorias aplicadas
- [Fases de Implementação](./fases-de-implementacao.md) - Histórico e exemplos

