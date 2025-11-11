# Prompt: Modais DadosCicloGestao

## Estrutura Comum

### Arquivos
- **Modal 1**: `DadosCicloGestao.modal1.tsx` + `.modal1.css`
- **Modal 2**: `DadosCicloGestao.modal2.tsx` (usa `.modal1.css`)
- **Modal 3**: `DadosCicloGestao.modal3.tsx` (usa `.modal1.css`)

### Props Base
```typescript
interface ModalProps {
  visible: boolean
  onHide: () => void
}
// Modal 1 também recebe: tipo: string | null
```

### Dependências Comuns
- `primereact/dialog`, `primereact/card`, `primereact/datatable`, `primereact/column`
- `../utils/csvParser` (funções específicas por modal)
- `../types/Escola` (tipos específicos por modal)

### Navegação Hierárquica (Comum)

**Padrão:**
1. Card "Espírito Santo" (sempre visível nos modais 2 e 3)
2. Tabela de Regionais (clique → abre Municípios)
3. Tabela de Municípios (clique → abre Escolas)
4. Tabela de Escolas (navegação final)

**Estados comuns:**
- `tabelaAtiva`: controla qual tabela está visível
- `regionalSelecionada`: filtro por regional
- `municipioSelecionado`: filtro por município

**Funções comuns:**
- `loadData()`: Carrega dados do CSV
- `formatarNumero()`: Formata números em pt-BR
- `transicionarTabela()`: Muda tabela ativa
- Handlers de clique e navegação "voltar"

## Modal 1 - Números Totais

**Específico:**
- Props: `tipo: string | null` (aceita "numeros-totais")
- Navegação: Regional → Município → Escola → **Dados por Escola (turmas)**
- Card ES: 7 itens (escolas, turmas, alunos, TCGPs, professores, pedagogos, coordenadores)
- Colunas Regionais/Municípios: Regional/Município, Escolas, Turmas, Alunos, Professores, Pedagogos, TCGPs
- Colunas Escolas: Escola, Turmas, Alunos, Professores, Pedagogos
- **Único modal com nível de turmas** (Dados por Escola)
- Funções: `calcularDadosEspiritoSanto`, `calcularDadosRegionais`, `calcularDadosMunicipios`, `calcularDadosEscolaPorSerie`

## Modal 2 - TCGP's

**Específico:**
- Card ES: 1 item (TCGPs total)
- Colunas Regionais/Municípios: Regional/Município, TCGPs
- Colunas Escolas: Escola, **Nome da TCGP**, TCGPs
- **Clique em escola**: Abre modal de detalhes da TCGP
- Modal de detalhes mostra: nome, email e lista de escolas com endereços completos
- Funções: `calcularDadosEspiritoSanto`, `calcularDadosRegionais`, `calcularDadosMunicipios`, `calcularTCGPEscolas`, `agruparEscolasPorTCGP`
- Estados adicionais: `modalDetalhesVisible`, `detalhesTCGP`
- Dependência extra: `primereact/divider`

## Modal 3 - Escolas e Metas

**Específico:**
- Card ES: 3 itens (Meta IDEBES ALFA 2024, IDEBES ALFA 2024, Meta IDEBES ALFA 2025)
- Colunas Regionais/Municípios: Regional/Município, Meta IDEBES ALFA 2024, IDEBES ALFA 2024, Meta IDEBES ALFA 2025
- Colunas Escolas: Escola, Meta IDEBES ALFA 2024, IDEBES ALFA 2024, Meta IDEBES ALFA 2025
- **Não exibe coluna "Tipo"** na tabela de escolas
- Formatação: `formatarNumeroDecimal()` (1 casa decimal)
- Valores agregados: média aritmética (estado, regional, município)
- Valores individuais: valores diretos da escola
- Funções: `calcularMetasEstado`, `calcularMetasRegionais`, `calcularMetasMunicipios`, `calcularMetasEscolas`

## Estilos e Espaçamentos Comuns

### Card do Espírito Santo
- **`.modal-card .p-card-body`**: padding `0 !important` (remove padding padrão do PrimeReact)
- **`.modal-card-content`**: padding `0.5rem 1rem !important` (vertical compacto, horizontal padrão)
- **`.modal-card-titulo`**: margin-bottom `0.5rem !important`, line-height `1.2 !important`
- **`.modal-tabela-dados`**: gap `0.75rem !important`, padding e margin `0 !important`
- **`.dado-item`**: padding `0.5rem 0.75rem !important`, gap `0.25rem !important`
- **`.dado-valor`**: line-height `1.1`, margin e padding `0`
- **`.dado-label`**: line-height `1.2`, margin e padding `0`

### Otimizações Aplicadas
- Uso de `!important` para sobrescrever estilos padrão do PrimeReact Card
- `box-sizing: border-box` em todos os elementos para cálculos corretos
- Altura automática (`height: auto`, `min-height: auto`, `max-height: none`)
- Line-heights reduzidos para evitar espaços verticais desnecessários
- Paddings e margins zerados onde não são necessários

## Observações Comuns

- Reset ao abrir: navegação volta ao estado inicial
- Animações: transições suaves entre tabelas (classes `aberta`/`fechada`)
- Filtros automáticos baseados na seleção anterior
- Tabelas clicáveis: classe `tabela-clickable` (hover azul claro)
- Botão "Voltar" em tabelas de municípios e escolas
- **Espaçamentos harmoniosos**: Paddings e gaps ajustados para proporção equilibrada sem espaços desnecessários

---

## Modal PlanosAcao - Pendências de Postagem (Modal 1)

**Arquivo:**
- `src/components/PlanosAcao.modal1.tsx`
- `src/components/PlanosAcao.modal1.css`

**Props:**
```typescript
interface PlanosAcaoModalProps {
  visible: boolean
  onHide: () => void
}
```

**Funcionalidades:**
- Carrega dados de `escolas.csv` e `ciclo-gestao.csv`
- Identifica escolas que não postaram mapas de ação (escolas sem entradas no ciclo-gestao.csv)
- Exibe tabela com colunas: Regional, Município, Escola
- Mostra total de pendências no rodapé
- Mensagem quando não há pendências

**Dependências:**
- `primereact/dialog`, `primereact/datatable`, `primereact/column`
- `../utils/csvParser` (loadEscolasFromCsv)
- Função customizada para carregar ciclo-gestao.csv (loadCicloGestaoCsv)

**Abertura:**
- Clicar em "Ver detalhes" no título principal (primeiro modal, depois abre o modal 2 automaticamente)
- Clicar no minicard "Mapas de Ação" (minicard-2) - abre apenas este modal

**Estados:**
- `escolas`: lista de escolas do CSV
- `pendencias`: lista de escolas com pendências
- `loading`: estado de carregamento

**Lógica:**
1. Carrega todas as escolas de `escolas.csv`
2. Carrega todos os mapas de ação de `ciclo-gestao.csv`
3. Identifica escolas que não têm nenhum mapa de ação postado
4. Exibe essas escolas em uma tabela ordenável e paginável

**Estilo:**
- Header com fundo vermelho claro (#fef2f2) e ícone de alerta
- Tabela com linhas alternadas (zebrado)
- Rodapé com total de pendências

---

## Modal PlanosAcao - Panorama Geral (Modal 2)

**Arquivo:**
- `src/components/PlanosAcao.modal2.tsx`
- `src/components/PlanosAcao.modal1.css` (compartilha estilos)

**Props:**
```typescript
interface PlanosAcaoModal2Props {
  visible: boolean
  onHide: () => void
}
```

**Funcionalidades:**
- Navegação hierárquica: Espírito Santo → Regionais → Municípios → Escolas
- Card do Espírito Santo com 8 métricas em boxes arredondados
- Tabelas com dados agregados por nível hierárquico
- Colunas condensadas com quebras de linha nos cabeçalhos longos

**Dependências:**
- `primereact/dialog`, `primereact/card`, `primereact/datatable`, `primereact/column`
- `../utils/csvParser` (loadEscolasFromCsv)
- `../utils/cicloGestaoParser` (loadCicloGestaoCsv, calcularDadosPlanosAcaoEstado, etc.)
- `../types/CicloGestao` (DadosPlanosAcao, DadosPlanosAcaoRegional, etc.)

**Abertura:**
- Clicar no minicard "Planos de Ação" (minicard-1) - abre diretamente
- Automaticamente após fechar o Modal 1 (se foi aberto via "Ver detalhes")

**Estados:**
- `escolas`: lista de escolas do CSV
- `cicloGestaoData`: dados do ciclo-gestao.csv
- `dadosES`: dados agregados do Espírito Santo
- `dadosRegionais`: dados agregados por regional
- `dadosMunicipios`: calculados dinamicamente quando uma regional é selecionada
- `dadosEscolas`: calculados dinamicamente quando um município é selecionado
- `tabelaAtiva`: controla qual tabela está visível ("regionais" | "municipios" | "escolas")
- `regionalSelecionada`: filtro por regional
- `municipioSelecionado`: filtro por município
- `loading`: estado de carregamento

**Card do Espírito Santo:**
- Layout: Grid responsivo com boxes arredondados
- Ordem: Número primeiro, legenda depois
- Métricas: Planos de Ação, Mapas de Ação, Mapas de Língua Portuguesa, Mapas de Matemática, Mapas de Leitura, Outros mapas, Validados pelo TCGP, Não validados pelo TCGP
- Estilo: Boxes com `border-radius: 8px`, fundo `#f8f9fa`, borda `#e9ecef`

**Tabelas:**
- **Regionais**: Colunas com quebras de linha nos cabeçalhos longos
- **Municípios**: Filtrados por regional selecionada
- **Escolas**: Filtradas por município selecionado
- Colunas condensadas: larguras entre 70px e 140px
- Padding reduzido: `0.5rem 0.4rem`
- Fonte dos cabeçalhos: `0.75rem`
- Texto centralizado nas colunas numéricas

**Navegação:**
- Clique em regional → abre tabela de municípios
- Clique em município → abre tabela de escolas
- Botão "Voltar" para retornar ao nível anterior
- Animações de transição entre tabelas

**Lógica de Cálculo:**
- `calcularDadosPlanosAcaoEstado`: agrega dados de todo o estado
- `calcularDadosPlanosAcaoRegionais`: agrega por regional
- `calcularDadosPlanosAcaoMunicipios`: agrega por município (com filtro opcional de regional)
- `calcularDadosPlanosAcaoEscolas`: agrega por escola (com filtros opcionais)

---

## Modal VisitasTecnicas - Detalhes (Modal 1)

**Arquivo:**
- `src/components/VisitasTecnicas.modal1.tsx`
- `src/components/VisitasTecnicas.modal1.css`

**Props:**
```typescript
interface VisitasTecnicasModalProps {
  visible: boolean
  onHide: () => void
}
```

**Específico:**
- **TabView com 4 abas**: Estado, Regionais, Municípios, Escolas
- **MultiSelect**: Seleção múltipla de regionais, municípios e escolas
- **Gráficos combinados**: Linha (Visitas Previstas) + Barras (Atas Assinadas) por ciclo
- **Layout**: Card de métricas + 3 cards de gráficos (Ciclo I, II, III) em grid 4 colunas
- **Fundo**: Degradê azul suave `linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)`
- **Tons de cinza**: Elementos não relacionados aos gráficos em tons de cinza
- **Múltiplas seleções**: Cards exibidos em linhas (vertical) quando múltiplos itens selecionados
- **Filtros em cascata**: Seleção de regional habilita municípios, seleção de município habilita escolas
- **Card Estado**: Sempre visível na aba Estado
- **Funções**: `calcularDadosVisitasTecnicas`, `calcularDadosVisitasTecnicasRegionais`, `calcularDadosVisitasTecnicasMunicipios`, `calcularDadosVisitasTecnicasEscolas`
- **Dependências**: `primereact/tabview`, `primereact/multiselect`, `primereact/chart`, `chart.js`
- **Estados**: `regionaisSelecionadas[]`, `municipiosSelecionados[]`, `escolasSelecionadas[]` (arrays para múltipla seleção)

