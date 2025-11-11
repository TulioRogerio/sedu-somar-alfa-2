# Prompt: Componente CicloGestao

## Objetivo
Criar o componente que exibe o ciclo de gestão com timeline de etapas usando PrimeReact Steps.

## Estrutura do Componente

### Arquivo
- `src/components/CicloGestao.tsx`
- `src/components/CicloGestao.css`

### Props
```typescript
interface CicloGestaoProps {
  ano?: number
  etapaAtual?: string
}
```

### Dados das Etapas

Array `ETAPAS` com 11 etapas:

1. Planejamento: 05/02 a 20/02
2. Execução I: 31/03 a 04/04
3. SAAR I: 12/05 a 11/06
4. Compart. de Práticas I: 09/06 a 13/06
5. Correção de Rotas I: 16/06 a 20/06
6. Execução II: 16/07 a 18/07
7. SAAR II: 01/09 a 03/10
8. Compart. de Práticas II: 29/09 a 03/10
9. Correção de Rotas II: 08/10 a 10/10
10. Execução III: 27/10 a 31/10
11. Balanço Final: 01/12 a 17/12

### Funcionalidades

1. **Título e Subtítulo**
   - Título: "Ciclo de Gestão - {ano}" (centralizado)
   - Subtítulo: "Você está na etapa de {etapaAtual}" (centralizado)
   - Ambos centralizados no container

2. **Timeline com Steps**
   - Componente: `Steps` do PrimeReact
   - Cada etapa mostra:
     - Nome da etapa
     - Datas (início a fim) centralizadas em relação ao número
   - `activeIndex`: índice da etapa atual
   - `readOnly={false}`

3. **Estilização das Etapas**

   **Etapas Completadas:**
   - Cor do texto: azul (#0d6efd)
   - Bolinha do número: verde (#198754)
   - Classe: `.p-highlight:not(.p-steps-current)`

   **Etapas Futuras:**
   - Cor do texto: cinza claro (#adb5bd)
   - Bolinha do número: cinza claro (#f8f9fa)
   - Borda: cinza (#dee2e6)

   **Etapa Atual:**
   - Destacada pelo PrimeReact (estado padrão)

4. **Tamanho de Fonte**
   - Nome da etapa: `0.9rem`
   - Datas: `0.85rem`
   - Título: `1.25rem`
   - Subtítulo: `0.95rem`

### Layout CSS

- Container: `ciclo-gestao-container`
- Header: `ciclo-gestao-header` (centralizado)
- Título: `ciclo-gestao-titulo` (centralizado)
- Subtítulo: `ciclo-gestao-subtitulo` (centralizado)
- Steps: `ciclo-gestao-steps`
- Item da etapa: `etapa-item` (flex column, centralizado)
- Nome da etapa: `etapa-nome`
- Datas: `etapa-datas` (centralizadas)

### Dependências PrimeReact
- `primereact/steps`
- `primereact/menuitem` (tipo)

### Estado
- `activeIndex`: calculado via `useMemo` baseado na `etapaAtual`

### Hooks
- `useMemo` para calcular `activeIndex` e `items`

## Exemplo de Uso

```tsx
<CicloGestao 
  ano={2025}
  etapaAtual="Correção de Rotas II"
/>
```

## Observações
- Ver `orientacoes-gerais.md` para regras gerais
- Cores específicas: etapas completadas (azul + bolinha verde), futuras (cinza claro)
- Título, subtítulo e datas centralizados

