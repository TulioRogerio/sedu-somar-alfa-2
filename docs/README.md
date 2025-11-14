# Documentação do Projeto - Somar Página Inicial

## Estrutura da Documentação

### Arquivos Principais

1. **`orientacoes-gerais.md`** ⭐
   - Princípios, regras e estrutura do projeto
   - Tecnologias, boas práticas e ordem de desenvolvimento

2. **`prompt-tipos-typescript.md`**
   - Todas as interfaces TypeScript
   - Estrutura de dados e tipos

3. **`prompt-csv-parser.md`**
   - Funções de parse e cálculo de escolas.csv
   - Estrutura do CSV e algoritmos

4. **`prompt-ciclo-gestao-parser.md`**
   - Funções de parse e cálculo de ciclo-gestao.csv
   - Agregações por estado, regional, município e escola

5. **`prompt-header.md`**
   - Componente Header (cabeçalho da aplicação)

6. **`prompt-ciclo-gestao.md`**
   - Componente CicloGestao (timeline de etapas)

7. **`prompt-dados-ciclo-gestao.md`** ⚠️
   - Componente DadosCicloGestao (obsoleto - cards movidos para PlanosAcao)
   - Mantido apenas para referência histórica

8. **`prompt-planos-acao.md`**
   - Componente PlanosAcao (4 cards principais: Escolas e Profissionais, Escolas e Metas, Planos de Ação, TCGP's por Regional e Município)
   - Modal 2: Panorama Geral (PlanosAcao.modal2) - inclui pendências de postagem

9. **`prompt-tarefas.md`**
   - Componente Tarefas (card de progresso geral + 6 minicards de status)

10. **`prompt-produtos.md`**
    - Componente Produtos

11. **`prompt-visitas-tecnicas.md`**
    - Componente VisitasTecnicas (card com seleção de ciclo)
    - Modal de detalhes com TabView e MultiSelect
    - Gráficos combinados (linha + barras) por ciclo
    - Navegação hierárquica (Estado → Regionais → Municípios → Escolas)

12. **`prompt-layout-dashboard.md`**
    - Layout grid 2x2 para os 4 componentes secundários

13. **`prompt-ciclo-gestao-csv.md`**
    - Estrutura do CSV ciclo-gestao.csv
    - Dados de planos de ação, mapas de ação, tarefas, produtos e visitas técnicas

14. **`prompt-modais.md`** ⭐
    - **Estrutura comum** dos 3 modais do DadosCicloGestao
    - **Especificidades** de cada modal (1, 2, 3)
    - **Modal PlanosAcao 1**: Pendências de Postagem
    - **Modal PlanosAcao 2**: Panorama Geral (navegação hierárquica)

15. **`SAAR/`** 📊
    - **`README.md`**: Visão geral do módulo SAAR
    - **`arquitetura-componentes.md`**: Arquitetura, componentes reutilizáveis e padrões
    - **`fases-de-implementacao.md`**: Histórico de implementação
    - **`prompt-saar.md`**: Documentação original

## Ordem de Recriação

1. **Orientações Gerais** (`orientacoes-gerais.md`) - Leia primeiro
2. **Tipos TypeScript** (`prompt-tipos-typescript.md`)
3. **CSV Parser** (`prompt-csv-parser.md`) - Parser de escolas.csv
4. **Ciclo Gestão Parser** (`prompt-ciclo-gestao-parser.md`) - Parser de ciclo-gestao.csv
5. **Componentes Básicos**: Header, CicloGestao
6. **Componente Principal**: PlanosAcao (contém os 4 cards principais)
7. **Componentes Secundários**: Tarefas, Produtos, VisitasTecnicas
8. **Modais** (`prompt-modais.md`) - Estrutura comum + especificidades
   - DadosCicloGestao: Modal 1, 2, 3 (usados pelos cards dentro de PlanosAcao)
   - PlanosAcao: Modal 2 (Panorama Geral - inclui pendências de postagem)
   - VisitasTecnicas: Modal 1 (TabView com 4 abas, MultiSelect, gráficos combinados)
   - Produtos: Modal 1 (Navegação hierárquica com gráficos de rosca)
   - Tarefas: Modal 1 (Navegação hierárquica com gráficos de rosca)
9. **CSV ciclo-gestao.csv** (`prompt-ciclo-gestao-csv.md`) - Dados estruturados do ciclo de gestão

## Arquivo de Controle

- **`../fases.md`**: Controle de fases e status do projeto

## Notas Importantes

- Ver `orientacoes-gerais.md` para regras e princípios
- Modais: estrutura comum em `prompt-modais.md`
- Dados: apenas CSV (sem hardcoding)
- Limite: 300 linhas por arquivo

