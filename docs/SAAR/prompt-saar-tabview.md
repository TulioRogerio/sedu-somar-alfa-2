# SAAR - Módulo TabView - Prompt de Criação

## Objetivo
Criar o componente TabView com 8 abas para exibir diferentes visualizações de dados do SAAR.

## Estrutura do Componente

### Arquivos
- `src/SAAR/SAAR.TabView.tsx`
- `src/SAAR/SAAR.TabView.css`

### Abas Requeridas

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

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ [Aulas] [Frequência] [LP] [Mat] [Leitura] [Tarefas] [Produtos] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              Conteúdo da aba selecionada                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Estilização

- **Container**: Box branco com sombra, border-radius 8px
- **Tabs**:
  - Fundo: Cinza claro (`#f5f5f5`)
  - Tab inativa: Texto cinza (`#757575`), sem borda
  - Tab ativa: Fundo branco, texto azul (`#2196f3`), borda inferior azul de 2px
  - Hover: Fundo cinza mais escuro (`#eeeeee`)
  - Padding: 0.875rem 1.25rem
  - Border-radius: 4px 4px 0 0 (apenas no topo)
- **Conteúdo**:
  - Fundo branco
  - Padding: 1.5rem
  - Min-height: 400px
  - Espaço para gráficos, tabelas, cards

### Componente TabView do PrimeReact

```typescript
import { TabView, TabPanel } from 'primereact/tabview'

<TabView className="saar-tabview">
  <TabPanel header="...">
    {/* Conteúdo */}
  </TabPanel>
  {/* Mais abas */}
</TabView>
```

### Header Personalizado

Cada aba deve ter um header personalizado com ícone e texto:

```typescript
<TabPanel
  header={
    <span className="saar-tab-header">
      <i className="pi pi-calendar" />
      Aulas Dadas
    </span>
  }
>
  {/* Conteúdo */}
</TabPanel>
```

### Props (se necessário)

```typescript
interface SAARTabViewProps {
  filtros?: FiltroContexto
  ano?: number
}
```

### Estado

- Aba ativa gerenciada pelo TabView do PrimeReact
- Cada aba pode ter seu próprio estado interno

### Conteúdo das Abas (Futuro)

Cada aba deve conter:
- Componentes específicos para exibir dados
- Gráficos (Chart.js ou similar)
- Tabelas (DataTable do PrimeReact)
- Cards com métricas
- Filtros específicos (se necessário)

### Integração com Filtros

- As abas devem reagir aos filtros aplicados no Módulo 2
- Dados devem ser filtrados por regional, escola e SMAR
- Atualização automática quando filtros mudarem

### Responsividade

- Tabs devem ser scrolláveis horizontalmente em telas pequenas
- Conteúdo deve se adaptar ao tamanho da tela
- Gráficos e tabelas devem ser responsivos

### Exemplo de Estrutura Completa

```typescript
export default function SAARTabView({ filtros, ano }: SAARTabViewProps) {
  return (
    <div className="saar-tabview-container">
      <TabView className="saar-tabview">
        <TabPanel header={<span className="saar-tab-header"><i className="pi pi-calendar" />Aulas Dadas</span>}>
          <div className="saar-tab-content">
            {/* Componente específico para Aulas Dadas */}
            <AulasDadas filtros={filtros} ano={ano} />
          </div>
        </TabPanel>
        {/* Mais abas... */}
      </TabView>
    </div>
  )
}
```

### Próximos Passos

1. Criar componentes específicos para cada aba
2. Integrar com dados dos CSVs
3. Adicionar visualizações (gráficos, tabelas)
4. Implementar filtros específicos por aba
5. Adicionar exportação de dados (se necessário)

