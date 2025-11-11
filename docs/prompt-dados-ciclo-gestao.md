# Prompt: Componente DadosCicloGestao

## Objetivo
Criar o componente que exibe 4 cards com informações do ciclo de gestão, cada um com link "Ver detalhes" que abre um modal.

## Estrutura do Componente

### Arquivo
- `src/components/DadosCicloGestao.tsx`
- `src/components/DadosCicloGestao.css`

### Funcionalidades

1. **Card Principal**
   - Wrapper: Card do PrimeReact com classe `dados-ciclo-gestao-card-principal`
   - Fundo: cor suave (#f8f9fa) para diferenciar da página
   - Título: "Dados do Ciclo de Gestão"

2. **Grid de Cards (4 cards)**

   **Card 1 - Números totais**
   - Ícone: `pi-building`
   - Título: "Números totais"
   - Descrição: "412 escolas | 42.580 alunos | 812 TCGP's | 840 professores 930 pedagogos | 78 coordenadores municipais"
   - Cor: gradiente azul/lavanda (#e3f2fd → #bbdefb)
   - Tipo modal: `"numeros-totais"`

   **Card 2 - Escolas e Metas**
   - Ícone: `pi-map-marker`
   - Título: "Escolas e Metas"
   - Descrição: "Veja detalhes das metas pactuadas para o ano de 2026."
   - Cor: gradiente verde (#e8f5e9 → #c8e6c9)
   - Tipo modal: `"escolas-metas"`

   **Card 3 - Alunos por Regional e Município**
   - Ícone: `pi-users`
   - Título: "Alunos por Regional e Município"
   - Descrição: "Acompanhe o total de 42.580 estudantes."
   - Cor: gradiente laranja (#fff3e0 → #ffe0b2)
   - Tipo modal: `"alunos-regional"`

   **Card 4 - TCGP's por Regional e Município**
   - Ícone: `pi-id-card`
   - Título: "TCGP's por Regional e Município"
   - Descrição: "Veja a distribuição dos 812 TCGPs."
   - Cor: gradiente roxo (#f3e5f5 → #e1bee7)
   - Tipo modal: `"tcgps-regional"`

3. **Layout dos Cards**

   **Linha 1 (Grid 3 colunas):**
   - Coluna 1: Ícone (tamanho: 2rem)
   - Coluna 2: Título (flex: 1)
   - Coluna 3: Link "Ver detalhes" (com ícone `pi-external-link`)

   **Linha 2:**
   - Descrição/resumo do card

4. **Modais**
   - **Modal 1** (`DadosCicloGestaoModal`): Gerencia "Números totais"
     - Props: `visible`, `tipo`, `onHide`
     - Abre quando clica em "Ver detalhes" do card "Números totais"
   - **Modal 2** (`DadosCicloGestaoModal2`): Gerencia "TCGP's por Regional e Município"
     - Props: `visible`, `onHide`
     - Abre quando clica em "Ver detalhes" do card "TCGP's por Regional e Município"
   - **Modal 3** (`DadosCicloGestaoModal3`): Gerencia "Escolas e Metas"
     - Props: `visible`, `onHide`
     - Abre quando clica em "Ver detalhes" do card "Escolas e Metas"

### Layout CSS

- Container: `dados-ciclo-gestao-container`
- Card principal: `dados-ciclo-gestao-card-principal` (fundo #f8f9fa)
- Grid de cards: `dados-ciclo-gestao-cards` (grid responsivo)
- Linha 1: `card-linha-1` (grid 3 colunas: auto 1fr auto)
- Linha 2: `card-linha-2` (margem-top: auto)
- Ícone: `card-icon`
- Título: `card-titulo`
- Link: `card-link` (azul, hover com underline)
- Descrição: `card-descricao`

### Dependências PrimeReact
- `primereact/card`

### Estado
- `modalVisible`: boolean para controlar visibilidade do modal 1
- `modalTipo`: string | null para identificar qual tipo de conteúdo no modal 1
- `modal2Visible`: boolean para controlar visibilidade do modal 2 (TCGP's)
- `modal3Visible`: boolean para controlar visibilidade do modal 3 (Metas)

### Hooks
- `useState` para gerenciar estado do modal

## Exemplo de Uso

```tsx
<DadosCicloGestao />
```

## Observações
- Ver `orientacoes-gerais.md` e `prompt-modais.md`
- Cards com hover effect e gradientes específicos
- Layout responsivo (grid auto-fit)
- Cada card abre seu modal correspondente

