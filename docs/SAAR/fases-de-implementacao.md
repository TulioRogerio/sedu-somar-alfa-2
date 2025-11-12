# SAAR - Fases de Implementação

Este documento lista todas as fases e tarefas necessárias para completar a implementação da página SAAR. Use este arquivo como referência para não esquecer nenhuma funcionalidade.

## ⚠️ Contexto: Prototipagem para Validação

**Importante**: Este projeto está em fase de **prototipagem** para apresentação e validação com outras gerências. O foco é demonstrar a estrutura, layout e funcionalidades principais, não refinamentos avançados. As fases 6 e 7 foram simplificadas para refletir este contexto.

## Status Geral

- ✅ **Fase 1**: Estrutura base e componentes criados
- ✅ **Fase 2**: Navegação e integração (concluída)
- ✅ **Fase 2.5**: Refatoração e organização do código (concluída)
- 📋 **Sugestões Futuras**: Fases 3-7 movidas para seção de sugestões futuras

---

## Fase 1: Estrutura Base ✅

### Componentes Criados
- [x] `src/SAAR/SAAR.tsx` - Componente principal
- [x] `src/SAAR/SAAR.css` - Estilos do container
- [x] `src/SAAR/SAAR.Filtros.tsx` - Módulo de filtros
- [x] `src/SAAR/SAAR.Filtros.css` - Estilos dos filtros
- [x] `src/SAAR/SAAR.TabView.tsx` - Módulo TabView com 8 abas
- [x] `src/SAAR/SAAR.TabView.css` - Estilos do TabView

### Documentação Criada
- [x] `docs/SAAR/prompt-saar.md` - Documentação geral
- [x] `docs/SAAR/prompt-saar-principal.md` - Prompt do componente principal
- [x] `docs/SAAR/prompt-saar-filtros.md` - Prompt do módulo de filtros
- [x] `docs/SAAR/prompt-saar-tabview.md` - Prompt do TabView

---

## Fase 2: Navegação e Integração ✅

### 2.1 Sistema de Roteamento
- [x] Decidir estratégia de navegação (estado local escolhido)
- [x] Criar tipo `Pagina` em `src/types/Navegacao.ts`
- [x] Configurar páginas:
  - [x] `inicio` - Página inicial (dashboard atual)
  - [x] `saar` - Página SAAR
  - [x] `relatorio-unidade` - Relatório por Unidade (estrutura criada)

### 2.2 Integração do Menu
- [x] Implementar navegação no `Header.tsx`:
  - [x] Handler `handleMenuItemClick` navega para a página correta
  - [x] Item "Início" → Dashboard principal
  - [x] Item "SAAR" → Página SAAR
  - [x] Item "Relatório por Unidade" → (estrutura criada)

### 2.3 Breadcrumb Dinâmico
- [x] Atualizar breadcrumb no `Header.tsx` baseado na página atual:
  - [x] Dashboard: "Início"
  - [x] SAAR: "Início > SAAR" (clicável)
  - [x] Relatório por Unidade: "Início > Relatório por Unidade" (clicável)
- [x] Breadcrumb é clicável para navegação
- [x] Home do breadcrumb navega para início

### 2.4 Integração no App.tsx
- [x] Modificar `App.tsx` para suportar múltiplas páginas
- [x] Renderizar componente correto baseado no estado
- [x] Manter estado do ano selecionado entre páginas
- [x] Passar props de navegação para componentes filhos

---

## Fase 2.5: Refatoração e Organização do Código ✅

### 2.5.1 Análise e Identificação
- [x] Identificar arquivos com mais de 300 linhas
- [x] Identificar código duplicado
- [x] Identificar console.logs de debug
- [x] Mapear oportunidades de extração

### 2.5.2 Refatoração do Módulo Aulas Dadas
- [x] Criar arquivo de tipos (`AulasDadas.types.ts`)
- [x] Criar arquivo de constantes (`AulasDadas.constants.ts`)
- [x] Extrair utilitários de parsing (`aulasDadasParser.ts`)
- [x] Extrair utilitários de cálculo (`aulasDadasCalculations.ts`)
- [x] Extrair configuração de gráfico (`aulasDadasChartConfig.ts`)
- [x] Criar hook `useAulasDadasData`
- [x] Criar hook `useApexChart`
- [x] Refatorar componente principal (669 → 180 linhas)
- [x] Remover console.logs de debug (24 → 1)

### 2.5.3 Documentação
- [x] Criar documentação da refatoração (`refatoracao-aulas-dadas.md`)
- [x] Atualizar fases de implementação

**Resultado**: Componente principal reduzido de 669 para 180 linhas (-73%), código mais organizado e manutenível.

**Documentação**: Ver `docs/SAAR/refatoracao-aulas-dadas.md`

---

## 📋 Sugestões Futuras (Fases 3-7)

> **Nota**: As fases abaixo são sugestões para implementação futura, após a validação do protótipo. Focamos agora apenas na Fase 2 (Navegação).

---

## Fase 3: Carregamento de Dados (Futuro)

### 3.1 Parser para Dados SAAR
- [ ] Criar `src/utils/saarParser.ts` (se necessário)
- [ ] Analisar estrutura de dados necessária para SAAR
- [ ] Definir interfaces TypeScript para dados SAAR
- [ ] Criar funções de parsing de CSV (se houver CSV específico)

### 3.2 Integração com CSVs Existentes
- [ ] Carregar regionais de `escolas.csv`:
  - [ ] Extrair lista única de regionais
  - [ ] Formatar para dropdown: `{ label: string, value: string }`
- [ ] Carregar escolas de `escolas.csv`:
  - [ ] Filtrar por regional selecionada
  - [ ] Formatar para dropdown
- [ ] Validar estrutura dos CSVs

### 3.3 Estado Compartilhado de Filtros
- [ ] Implementar compartilhamento de filtros entre componentes:
  - [ ] Opção 1: Context API (`SAARContext.tsx`)
  - [ ] Opção 2: Props drilling (atual)
  - [ ] Opção 3: Estado no componente principal `SAAR.tsx`
- [ ] Atualizar `SAAR.Filtros.tsx` para receber dados reais
- [ ] Atualizar `SAAR.TabView.tsx` para receber filtros como props

### 3.4 Filtros em Cascata
- [ ] Implementar lógica de filtros em cascata:
  - [ ] Ao selecionar regional → habilitar dropdown de escolas
  - [ ] Ao selecionar regional → filtrar escolas por regional
  - [ ] Ao limpar regional → limpar escola selecionada
  - [ ] Ao limpar escola → manter regional selecionada

---

## Fase 4: Implementação das Abas ⏳

### 4.1 Estrutura Base das Abas
- [ ] Criar componentes individuais para cada aba:
  - [ ] `src/SAAR/abas/SAAR.AulasDadas.tsx`
  - [ ] `src/SAAR/abas/SAAR.Frequencia.tsx`
  - [ ] `src/SAAR/abas/SAAR.ProficienciaLP.tsx`
  - [ ] `src/SAAR/abas/SAAR.ProficienciaMat.tsx`
  - [ ] `src/SAAR/abas/SAAR.Leitura.tsx`
  - [ ] `src/SAAR/abas/SAAR.Tarefas.tsx`
  - [ ] `src/SAAR/abas/SAAR.Produtos.tsx`

### 4.2 Aba: Aulas Dadas
- [ ] Definir estrutura de dados necessária
- [ ] Criar componente com layout básico
- [ ] Implementar visualizações (gráficos/tabelas)
- [ ] Integrar com filtros (regional, escola, SMAR)
- [ ] Adicionar métricas principais (cards)
- [ ] Implementar responsividade

### 4.3 Aba: Frequência dos Estudantes
- [ ] Definir estrutura de dados necessária
- [ ] Criar componente com layout básico
- [ ] Implementar visualizações (gráficos/tabelas)
- [ ] Integrar com filtros
- [ ] Adicionar métricas principais
- [ ] Implementar responsividade

### 4.4 Aba: Proficiência em Língua Portuguesa
- [ ] Definir estrutura de dados necessária
- [ ] Criar componente com layout básico
- [ ] Implementar visualizações (gráficos/tabelas)
- [ ] Integrar com filtros
- [ ] Adicionar métricas principais
- [ ] Implementar responsividade

### 4.5 Aba: Proficiência em Matemática
- [ ] Definir estrutura de dados necessária
- [ ] Criar componente com layout básico
- [ ] Implementar visualizações (gráficos/tabelas)
- [ ] Integrar com filtros
- [ ] Adicionar métricas principais
- [ ] Implementar responsividade

### 4.6 Aba: Leitura
- [ ] Definir estrutura de dados necessária
- [ ] Criar componente com layout básico
- [ ] Implementar visualizações (gráficos/tabelas)
- [ ] Integrar com filtros
- [ ] Adicionar métricas principais
- [ ] Implementar responsividade

### 4.7 Aba: Tarefas
- [ ] Definir estrutura de dados necessária
- [ ] Criar componente com layout básico
- [ ] Implementar visualizações (gráficos/tabelas)
- [ ] Integrar com filtros
- [ ] Adicionar métricas principais
- [ ] Implementar responsividade

### 4.8 Aba: Produtos
- [ ] Definir estrutura de dados necessária
- [ ] Criar componente com layout básico
- [ ] Implementar visualizações (gráficos/tabelas)
- [ ] Integrar com filtros
- [ ] Adicionar métricas principais
- [ ] Implementar responsividade

---

## Fase 5: Visualizações e Gráficos ⏳

### 5.1 Biblioteca de Gráficos
- [ ] Decidir biblioteca (Chart.js, Recharts, Victory, etc.)
- [ ] Instalar dependências
- [ ] Criar componentes wrapper reutilizáveis

### 5.2 Tipos de Visualizações
- [ ] Gráficos de linha (evolução temporal)
- [ ] Gráficos de barras (comparações)
- [ ] Gráficos de pizza/rosca (distribuições)
- [ ] Tabelas de dados (DataTable do PrimeReact)
- [ ] Cards de métricas (KPIs)
- [ ] Mapas (se necessário)

### 5.3 Componentes Reutilizáveis
- [ ] `src/SAAR/components/SAARCard.tsx` - Card de métrica
- [ ] `src/SAAR/components/SAARChart.tsx` - Wrapper de gráfico
- [ ] `src/SAAR/components/SAARTable.tsx` - Tabela de dados
- [ ] `src/SAAR/components/SAAREmptyState.tsx` - Estado vazio

### 5.4 Estilização de Visualizações
- [ ] Criar `src/SAAR/SAAR.Visualizacoes.css`
- [ ] Definir paleta de cores consistente
- [ ] Estilizar gráficos e tabelas
- [ ] Implementar temas (claro/escuro, se necessário)

---

## Fase 6: Validações Básicas (Protótipo) 🔄

> **Nota**: Esta fase foi simplificada para o contexto de prototipagem. Foco em garantir que o protótipo funcione para apresentação e validação.

### 6.1 Validações Funcionais Básicas
- [ ] Navegação entre páginas funciona
- [ ] Filtros aplicam corretamente nas abas
- [ ] Filtros em cascata (Regional → Escola) funcionam
- [ ] Limpeza de filtros funciona
- [ ] Colapsar/expandir filtros funciona

### 6.2 Validações de Dados
- [ ] CSVs carregam sem erros
- [ ] Dados são exibidos corretamente nas abas
- [ ] Filtros funcionam com dados reais

### 6.3 Validações Visuais
- [ ] Layout não quebra em desktop
- [ ] Componentes são visíveis e legíveis
- [ ] Gráficos e tabelas renderizam corretamente
- [ ] Estados vazios são tratados (mensagem simples)

### 6.4 Ajustes Mínimos para Apresentação
- [ ] Adicionar mensagens de "Em desenvolvimento" onde necessário
- [ ] Garantir que não há erros no console
- [ ] Verificar que todas as abas têm conteúdo (mesmo que placeholder)

---

## Fase 7: Funcionalidades Futuras (Pós-Validação) 📋

> **Nota**: Estas funcionalidades serão implementadas após a validação do protótipo, conforme feedback das gerências.

### 7.1 Exportação de Dados
- [ ] Botão de exportar para CSV
- [ ] Botão de exportar para PDF (se necessário)
- [ ] Botão de exportar para Excel (se necessário)

### 7.2 Filtros Avançados
- [ ] Filtro por período (data inicial/final)
- [ ] Filtro por série/ano escolar
- [ ] Filtro por disciplina (se aplicável)

### 7.3 Performance e Otimizações
- [ ] Implementar lazy loading das abas
- [ ] Otimizar carregamento de dados grandes
- [ ] Implementar cache de dados
- [ ] Debounce em filtros de busca

### 7.4 Acessibilidade e Refinamentos
- [ ] Adicionar labels ARIA
- [ ] Implementar navegação por teclado
- [ ] Adicionar estados de loading mais elaborados
- [ ] Melhorar feedback visual
- [ ] Ajustar animações e transições

### 7.5 Testes Completos
- [ ] Testes de responsividade (desktop, tablet, mobile)
- [ ] Testes com diferentes volumes de dados
- [ ] Testes de acessibilidade
- [ ] Testes de performance

---

## Notas Importantes

### Dependências Externas
- PrimeReact já instalado ✅
- Verificar necessidade de biblioteca de gráficos
- Verificar necessidade de React Router

### Decisões Pendentes
- [ ] Estratégia de navegação (Router vs Estado)
- [ ] Biblioteca de gráficos
- [ ] Estrutura de dados SAAR (CSVs específicos?)
- [ ] Gerenciamento de estado (Context vs Props)

### Prioridades (Protótipo)
1. **Crítica**: Navegação e integração (Fase 2) - Essencial para apresentação
2. **Futuro**: Todas as demais fases (3-7) serão implementadas após validação

---

## Checklist Rápido (Protótipo)

Use este checklist para validar se o protótipo está pronto para apresentação:

### Essenciais para Apresentação
- [ ] Navegação funcionando (menu → páginas)
- [ ] Filtros carregando dados reais dos CSVs
- [ ] Filtros em cascata implementados (Regional → Escola)
- [ ] Todas as 7 abas criadas e acessíveis
- [ ] Conteúdo visual em todas as abas (gráficos/tabelas/cards)
- [ ] Filtros aplicam corretamente nas abas
- [ ] Sem erros no console do navegador
- [ ] Layout não quebra em desktop

### Desejáveis (mas não bloqueantes)
- [ ] Layout responsivo básico

### Pós-Validação
- [ ] Refinamentos de UI/UX
- [ ] Funcionalidades avançadas
- [ ] Testes completos
- [ ] Otimizações de performance

---

**Última atualização**: 2025-01-12  
**Status**: Fase 1, Fase 2 e Fase 2.5 concluídas  
**Contexto**: Prototipagem para validação  
**Refatoração**: Módulo Aulas Dadas refatorado e documentado

