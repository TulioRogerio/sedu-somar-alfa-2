# Página SAAR - Documentação Completa

## Visão Geral

A página SAAR é composta por 3 módulos principais:

1. **Módulo 1 - Header e Breadcrumb**: Header completo com menu, título, seletor de ano e breadcrumb
2. **Módulo 2 - Filtro de Contexto**: Box colapsável com filtros (Regional, Escola, SMAR)
3. **Módulo 3 - TabView com 8 Abas**: Box contendo 8 abas com diferentes visualizações de dados

## Estrutura de Arquivos

```
src/SAAR/
├── SAAR.tsx              # Componente principal que organiza os 3 módulos
├── SAAR.css              # Estilos do container principal
├── SAAR.Filtros.tsx      # Módulo 2 - Filtro de contexto
├── SAAR.Filtros.css      # Estilos do filtro
├── SAAR.TabView.tsx      # Módulo 3 - TabView com 8 abas
└── SAAR.TabView.css      # Estilos do TabView
```

## Módulo 1 - Header e Breadcrumb

### Descrição
Reutiliza o componente `Header` existente em `src/components/Header.tsx`. Este módulo inclui:
- Botão de menu (hamburger)
- Título "Somar Alfa 2"
- Seletor de ano (dropdown)
- Breadcrumb com "Início"

### Implementação
O Header é importado diretamente no componente principal `SAAR.tsx`:

```typescript
import Header from '../components/Header'

<Header 
  anoSelecionado={anoSelecionado}
  onAnoChange={setAnoSelecionado}
/>
```

### Estilização
Utiliza os estilos existentes em `src/components/Header.css`.

## Módulo 2 - Filtro de Contexto

### Descrição
Box colapsável contendo filtros para contextualizar os dados exibidos nas abas.

### Componentes
- **Título**: "Filtro de contexto"
- **Botão de colapsar/expandir**: "Ocultar filtro" / "Mostrar filtro" com ícone de seta
- **3 Campos de filtro**:
  1. **Selecionar regional**: Dropdown com lista de regionais
  2. **Selecionar escola**: Dropdown com lista de escolas
  3. **SMAR**: Input text com botão de limpar (X) e seta dropdown
- **2 Botões de ação**:
  - **Limpar**: Limpa todos os filtros (ícone: refresh)
  - **Filtrar**: Aplica os filtros selecionados (ícone: filter)

### Funcionalidades
- Estado de visibilidade (colapsado/expandido)
- Limpeza de filtros
- Aplicação de filtros (lógica a ser implementada)
- Filtros em cascata (seleção de regional habilita escolas relacionadas)

### Estilização
- Box branco com borda azul (`#2196f3`)
- Grid responsivo para os campos de filtro
- Botões estilizados (Limpar: branco, Filtrar: azul)
- Transições suaves para colapsar/expandir

### Dados
- **Regionais**: Carregar de CSV ou dados estáticos
- **Escolas**: Carregar de CSV, filtradas por regional selecionada
- **SMAR**: Input livre (validação a ser implementada)

## Módulo 3 - TabView com 8 Abas

### Descrição
Box contendo um TabView do PrimeReact com 8 abas diferentes, cada uma exibindo dados específicos do SAAR.

### Abas

1. **Aulas Dadas**
   - Ícone: `pi-calendar`
   - Conteúdo: Visualização de dados sobre aulas dadas

2. **Frequência dos estudantes**
   - Ícone: `pi-users`
   - Conteúdo: Visualização de dados sobre frequência dos estudantes

3. **Proficiência em Língua Portuguesa**
   - Ícone: `pi-book`
   - Conteúdo: Visualização de dados sobre proficiência em Língua Portuguesa

4. **Proficiência em Matemática**
   - Ícone: `pi-calculator`
   - Conteúdo: Visualização de dados sobre proficiência em Matemática

5. **Leitura**
   - Ícone: `pi-file-edit`
   - Conteúdo: Visualização de dados sobre leitura

6. **Tarefas**
   - Ícone: `pi-check-square`
   - Conteúdo: Visualização de dados sobre tarefas

7. **Produtos**
   - Ícone: `pi-box`
   - Conteúdo: Visualização de dados sobre produtos

### Estilização
- Box branco com sombra
- Tabs com fundo cinza claro (`#f5f5f5`)
- Tab ativa com fundo branco e borda inferior azul (`#2196f3`)
- Hover em tabs com fundo cinza mais escuro
- Conteúdo das abas com padding adequado

### Funcionalidades Futuras
Cada aba deve:
- Consumir dados dos CSVs
- Respeitar os filtros do Módulo 2
- Exibir visualizações apropriadas (gráficos, tabelas, cards)
- Ser responsiva

## Integração com o Menu

A página SAAR deve ser acessível através do menu lateral:
- Item "SAAR" no menu deve navegar para esta página
- Breadcrumb deve ser atualizado para mostrar "SAAR" ou "Início > SAAR"

## Próximos Passos

1. **Implementar navegação**: Conectar o menu à página SAAR
2. **Carregar dados reais**: Integrar com CSVs para regionais e escolas
3. **Implementar filtros em cascata**: Regional → Escola
4. **Desenvolver conteúdo das abas**: Criar componentes específicos para cada aba
5. **Adicionar visualizações**: Gráficos, tabelas e cards para cada tipo de dado
6. **Implementar responsividade**: Garantir funcionamento em diferentes tamanhos de tela

## Notas Técnicas

- Utiliza PrimeReact para componentes UI (Sidebar, TabView, Dropdown, Button, InputText)
- TypeScript para tipagem
- CSS modules para estilização
- Estado gerenciado localmente em cada componente
- Filtros podem ser compartilhados via Context API ou props drilling (a definir)

