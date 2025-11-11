# Prompt: Tipos TypeScript

## Objetivo
Definir todas as interfaces TypeScript necessárias para tipagem dos dados da aplicação.

## Estrutura do Arquivo

### Arquivos
- `src/types/Escola.ts` - Interfaces relacionadas a escolas e dados agregados
- `src/types/CicloGestao.ts` - Interfaces relacionadas ao ciclo de gestão

### Interfaces Principais

#### 1. `Escola`
Interface principal para dados de uma escola.

```typescript
export interface Escola {
  // Identificação
  id: number
  codigo: string
  nome: string
  
  // Localização
  municipio: string
  codigo_municipio: string
  regional: string
  codigo_regional: string
  
  // Endereço
  endereco: string
  numero: string
  bairro: string
  cep: string
  telefone: string
  email: string
  
  // Características
  tipo: string
  modalidade: string
  ensino_fundamental: boolean
  ensino_medio: boolean
  educacao_infantil: boolean
  educacao_especial: boolean
  
  // Totais
  total_alunos: number
  total_professores: number
  total_pedagogos: number
  total_turmas: number
  tcgps: number
  
  // Dados por série (opcionais)
  serie1_alunos?: number
  serie1_turmas?: number
  serie2_alunos?: number
  serie2_turmas?: number
  serie3_alunos?: number
  serie3_turmas?: number
  serie4_alunos?: number
  serie4_turmas?: number
  serie5_alunos?: number
  serie5_turmas?: number
  
  // Metas (opcionais)
  meta_idebes_alfa_2024?: number
  idebes_alfa_2024?: number
  meta_idebes_alfa_2025?: number
  
  // TCGP (opcionais)
  nome_tcgp?: string
  email_tcgp?: string
  
  ativo: boolean
}
```

#### 2. `DadosEspiritoSanto`
Dados agregados do estado.

```typescript
export interface DadosEspiritoSanto {
  escolas: number
  turmas: number
  alunos: number
  tcgps: number
  professores: number
  pedagogos: number
  coordenadores: number
}
```

#### 3. `DadosRegional`
Dados agregados por regional.

```typescript
export interface DadosRegional {
  regional: string
  escolas: number
  turmas: number
  alunos: number
  professores: number
  pedagogos: number
  tcgps: number
}
```

#### 4. `DadosMunicipio`
Dados agregados por município.

```typescript
export interface DadosMunicipio {
  municipio: string
  regional: string
  escolas: number
  turmas: number
  alunos: number
  professores: number
  pedagogos: number
  tcgps: number
}
```

#### 5. `TurmaInfo`
Informações de uma turma individual.

```typescript
export interface TurmaInfo {
  nome: string
  alunos: number
}
```

#### 6. `DadosEscolaPorSerie`
Dados de uma escola organizados por série.

```typescript
export interface DadosEscolaPorSerie {
  escola: string
  serie1: TurmaInfo[]
  serie2: TurmaInfo[]
  serie3: TurmaInfo[]
  serie4: TurmaInfo[]
  serie5: TurmaInfo[]
  total_alunos: number
  total_turmas: number
}
```

#### 7. `DadosSerie` (Legado)
Interface antiga, mantida para compatibilidade.

```typescript
export interface DadosSerie {
  escola: string
  serie1_alunos: number
  serie1_turmas: number
  serie2_alunos: number
  serie2_turmas: number
  serie3_alunos: number
  serie3_turmas: number
  serie4_alunos: number
  serie4_turmas: number
  serie5_alunos: number
  serie5_turmas: number
  total_alunos: number
  total_turmas: number
}
```

#### 8. `DadosMetasEstado`
Dados agregados de metas no nível estadual.

```typescript
export interface DadosMetasEstado {
  meta_idebes_alfa_2024: number
  idebes_alfa_2024: number
  meta_idebes_alfa_2025: number
}
```

#### 9. `DadosMetasRegional`
Dados agregados de metas por regional.

```typescript
export interface DadosMetasRegional {
  regional: string
  meta_idebes_alfa_2024: number
  idebes_alfa_2024: number
  meta_idebes_alfa_2025: number
}
```

#### 10. `DadosMetasMunicipio`
Dados agregados de metas por município.

```typescript
export interface DadosMetasMunicipio {
  municipio: string
  regional: string
  meta_idebes_alfa_2024: number
  idebes_alfa_2024: number
  meta_idebes_alfa_2025: number
}
```

#### 11. `DadosMetasEscola`
Dados de metas por escola.

```typescript
export interface DadosMetasEscola {
  escola: string
  meta_idebes_alfa_2024: number
  idebes_alfa_2024: number
  meta_idebes_alfa_2025: number
}
```

#### 12. `DadosTCGPEscola`
Dados de TCGP's por escola.

```typescript
export interface DadosTCGPEscola {
  escola: string
  tcgps: number
  nome_tcgp?: string
  email_tcgp?: string
}
```

#### 13. `EscolaTCGPInfo`
Informações completas de uma escola para exibição no modal de detalhes da TCGP.

```typescript
export interface EscolaTCGPInfo {
  nome: string
  endereco: string
  numero: string
  bairro: string
  municipio: string
}
```

#### 14. `DadosTCGPDetalhes`
Dados completos de uma TCGP para exibição no modal de detalhes.

```typescript
export interface DadosTCGPDetalhes {
  nome_tcgp: string
  email_tcgp: string
  escolas: EscolaTCGPInfo[]
}
```

#### 15. `DadosPorEscola` ⚠️ REMOVIDO
Interface antiga que foi removida do código. Mantida apenas no arquivo de tipos para referência histórica.

```typescript
// REMOVIDO - Função calcularDadosPorEscola foi removida
export interface DadosPorEscola {
  escola: string
  serie: string
  alunos: number
  turmas: number
}
```

## Uso das Interfaces

### Importação
```typescript
import type {
  Escola,
  DadosEspiritoSanto,
  DadosRegional,
  DadosMunicipio,
  DadosEscolaPorSerie,
  TurmaInfo,
  DadosMetasEstado,
  DadosMetasRegional,
  DadosMetasMunicipio,
  DadosMetasEscola,
  DadosTCGPEscola,
  EscolaTCGPInfo,
  DadosTCGPDetalhes
} from '../types/Escola'
```

### Exemplo de Uso
```typescript
const escola: Escola = {
  id: 1,
  codigo: "1001",
  nome: "EEEFM José Cupertino",
  // ... outros campos
}

const dadosES: DadosEspiritoSanto = {
  escolas: 20,
  turmas: 813,
  alunos: 9760,
  // ... outros campos
}
```

---

## Interfaces do Ciclo de Gestão

### Arquivo
- `src/types/CicloGestao.ts`

#### 16. `CicloGestaoRow`
Representa uma linha do CSV ciclo-gestao.csv (um mapa de ação).

```typescript
export interface CicloGestaoRow {
  escola_id: string
  plano_acao_id: string
  mapa_acao_id: string
  tipo_mapa: string
  problema: string
  desafio: string
  validado_tcgp: string // "true" ou "false"
  produto_status: string
  tarefas_total: string
  tarefas_previstas: string
  tarefas_nao_iniciadas: string
  tarefas_em_andamento: string
  tarefas_atrasadas: string
  tarefas_concluidas: string
  tarefas_concluidas_atraso: string
  visitas_tecnicas_total: string
  visitas_tecnicas_ciclo1: string
  visitas_tecnicas_ciclo2: string
  visitas_tecnicas_ciclo3: string
  visitas_tecnicas_esperadas: string
  visitas_tecnicas_atas_assinadas: string
}
```

#### 17. `DadosPlanosAcao`
Dados agregados de planos e mapas de ação.

```typescript
export interface DadosPlanosAcao {
  mapasAcao: number
  planosAcao: number
  mapasLP: number
  mapasMat: number
  mapasLeitura: number
  mapasOutros: number
  validados: number
  pendentes: number
}
```

#### 18. `DadosPlanosAcaoRegional`
Dados agregados de planos e mapas de ação por regional.

```typescript
export interface DadosPlanosAcaoRegional extends DadosPlanosAcao {
  regional: string
}
```

#### 19. `DadosPlanosAcaoMunicipio`
Dados agregados de planos e mapas de ação por município.

```typescript
export interface DadosPlanosAcaoMunicipio extends DadosPlanosAcao {
  municipio: string
  regional: string
}
```

#### 20. `DadosPlanosAcaoEscola`
Dados agregados de planos e mapas de ação por escola.

```typescript
export interface DadosPlanosAcaoEscola extends DadosPlanosAcao {
  escola: string
  municipio: string
  regional: string
}
```

#### 21. `DadosTarefas`
Dados agregados de tarefas para todo o estado.

```typescript
export interface DadosTarefas {
  total: number
  previstas: number
  naoIniciadas: number
  emAndamento: number
  atrasadas: number
  concluidas: number
  concluidasAtraso: number
}
```

**Campos:**
- `total`: Total de tarefas em todos os mapas de ação
- `previstas`: Tarefas no status "Previstas"
- `naoIniciadas`: Tarefas no status "Não Iniciadas"
- `emAndamento`: Tarefas no status "Em andamento"
- `atrasadas`: Tarefas no status "Atrasadas"
- `concluidas`: Tarefas no status "Concluídas"
- `concluidasAtraso`: Tarefas no status "Concluídas com atraso"

**Uso:**
- Usado pelo componente `Tarefas` para exibir métricas gerais
- Calculado pela função `calcularDadosTarefas()` do `cicloGestaoParser`

#### 22. `DadosTarefasRegional`
Dados agregados de tarefas por regional.

```typescript
export interface DadosTarefasRegional extends DadosTarefas {
  regional: string
}
```

#### 23. `DadosTarefasMunicipio`
Dados agregados de tarefas por município.

```typescript
export interface DadosTarefasMunicipio extends DadosTarefas {
  municipio: string
  regional: string
}
```

#### 24. `DadosTarefasEscola`
Dados agregados de tarefas por escola.

```typescript
export interface DadosTarefasEscola extends DadosTarefas {
  escola: string
  municipio: string
  regional: string
}
```

#### 25. `DadosProdutos`
Dados agregados de produtos para todo o estado.

```typescript
export interface DadosProdutos {
  total: number
  faixa0_25: number
  faixa26_50: number
  faixa51_75: number
  faixa76_100: number
  percentualMedio: number
}
```

**Campos:**
- `total`: Total de produtos com status definido
- `faixa0_25`: Produtos na faixa 0-25% de conclusão
- `faixa26_50`: Produtos na faixa 26-50% de conclusão
- `faixa51_75`: Produtos na faixa 51-75% de conclusão
- `faixa76_100`: Produtos na faixa 76-100% de conclusão
- `percentualMedio`: Percentual médio calculado baseado nas médias das faixas

**Uso:**
- Usado pelo componente `Produtos` para exibir métricas gerais
- Calculado pela função `calcularDadosProdutos()` do `cicloGestaoParser`

#### 26. `DadosProdutosRegional`
Dados agregados de produtos por regional.

```typescript
export interface DadosProdutosRegional extends DadosProdutos {
  regional: string
}
```

#### 27. `DadosProdutosMunicipio`
Dados agregados de produtos por município.

```typescript
export interface DadosProdutosMunicipio extends DadosProdutos {
  municipio: string
  regional: string
}
```

#### 28. `DadosProdutosEscola`
Dados agregados de produtos por escola.

```typescript
export interface DadosProdutosEscola extends DadosProdutos {
  escola: string
  municipio: string
  regional: string
}
```

### Importação das Interfaces do Ciclo de Gestão
```typescript
import type {
  CicloGestaoRow,
  DadosPlanosAcao,
  DadosPlanosAcaoRegional,
  DadosPlanosAcaoMunicipio,
  DadosPlanosAcaoEscola,
  DadosTarefas,
  DadosTarefasRegional,
  DadosTarefasMunicipio,
  DadosTarefasEscola,
  DadosProdutos,
  DadosProdutosRegional,
  DadosProdutosMunicipio,
  DadosProdutosEscola
} from '../types/CicloGestao'
```

## Observações

- Ver `orientacoes-gerais.md` para regras gerais
- Campos opcionais usam `?`
- Todas as interfaces exportadas
- Interfaces do ciclo de gestão estendem `DadosPlanosAcao` para dados agregados

