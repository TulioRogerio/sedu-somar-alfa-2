# Prompt: Parser CSV e Funções de Cálculo

## Objetivo
Criar utilitários para ler, parsear e calcular dados agregados do arquivo CSV de escolas.

## Estrutura do Arquivo

### Arquivo
- `src/utils/csvParser.ts`

### Funções Principais

#### 1. `parseEscolasCsv(csvContent: string): Escola[]`
- Parseia conteúdo CSV em array de objetos Escola
- Trata valores booleanos, numéricos e strings
- Retorna array tipado

#### 2. `loadEscolasFromCsv(): Promise<Escola[]>`
- Carrega CSV via fetch de `/escolas.csv`
- Trata erros de rede
- Retorna Promise com array de escolas

#### 3. `calcularDadosEspiritoSanto(escolas: Escola[]): DadosEspiritoSanto`
- Calcula totais do estado
- Retorna: escolas, turmas, alunos, TCGPs, professores, pedagogos, coordenadores
- Coordenadores: valor fixo (78)

#### 4. `calcularDadosRegionais(escolas: Escola[]): DadosRegional[]`
- Agrupa dados por regional
- Soma: escolas, turmas, alunos, professores, pedagogos, TCGPs
- Ordena alfabeticamente por regional

#### 5. `calcularDadosMunicipios(escolas: Escola[]): DadosMunicipio[]`
- Agrupa dados por município (chave: municipio-regional)
- Soma: escolas, turmas, alunos, professores, pedagogos, TCGPs
- Ordena por regional, depois município

#### 6. `calcularDadosEscolaPorSerie(escolas: Escola[]): DadosEscolaPorSerie[]`
- Transforma dados das escolas em estrutura por série
- Para cada escola, cria turmas individuais por série
- Função auxiliar: `gerarTurmas(numTurmas, totalAlunos)`
  - Distribui alunos igualmente entre turmas
  - Nomeia: "Turma 1", "Turma 2", etc.
  - Se houver resto, primeiras turmas recebem +1 aluno
- Retorna array ordenado por nome da escola

#### 7. `calcularMetasEstado(escolas: Escola[]): DadosMetasEstado`
- Calcula médias das metas no nível estadual
- Retorna: meta_idebes_alfa_2024, idebes_alfa_2024, meta_idebes_alfa_2025
- Calcula média aritmética de todas as escolas com metas

#### 8. `calcularMetasRegionais(escolas: Escola[]): DadosMetasRegional[]`
- Calcula médias das metas por regional
- Agrupa escolas por regional
- Calcula média aritmética das metas por regional
- Retorna array ordenado alfabeticamente por regional

#### 9. `calcularMetasMunicipios(escolas: Escola[]): DadosMetasMunicipio[]`
- Calcula médias das metas por município
- Agrupa escolas por município (chave: municipio-regional)
- Calcula média aritmética das metas por município
- Retorna array ordenado por regional, depois município

#### 10. `calcularMetasEscolas(escolas: Escola[]): DadosMetasEscola[]`
- Retorna metas de cada escola individualmente
- Filtra apenas escolas com metas definidas
- Retorna: escola, meta_idebes_alfa_2024, idebes_alfa_2024, meta_idebes_alfa_2025
- Retorna array ordenado por nome da escola

#### 11. `calcularTCGPEscolas(escolas: Escola[]): DadosTCGPEscola[]`
- Retorna TCGP's de cada escola individualmente
- Filtra apenas escolas com TCGP's > 0
- Retorna: escola, tcgps, nome_tcgp, email_tcgp
- Retorna array ordenado por nome da escola

#### 12. `agruparEscolasPorTCGP(escolas: Escola[]): Map<string, DadosTCGPDetalhes>`
- Agrupa escolas por TCGP (nome_tcgp)
- Retorna um Map onde a chave é o nome da TCGP
- Cada entrada contém:
  - nome_tcgp: nome da TCGP
  - email_tcgp: e-mail da TCGP
  - escolas: array de EscolaTCGPInfo com nome e endereço completo de cada escola
- Ordena escolas alfabeticamente dentro de cada TCGP
- Filtra apenas escolas com nome_tcgp e email_tcgp definidos

### Função Auxiliar

#### `gerarTurmas(numTurmas: number, totalAlunos: number): TurmaInfo[]`
- Cria array de objetos TurmaInfo
- Distribui alunos igualmente
- Trata resto da divisão
- Retorna array com nome e alunos de cada turma

### Tipos Utilizados

```typescript
import {
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
  DadosTCGPDetalhes,
  EscolaTCGPInfo
} from '../types/Escola'
```

### Tratamento de Valores

Função `parseValue(value: string)`:
- `"true"` / `"false"` → boolean
- Números válidos → number
- Outros → string

### Estrutura do CSV

**Colunas Principais:**
- Identificação: id, codigo, nome
- Localização: municipio, codigo_municipio, regional, codigo_regional
- Endereço: endereco, numero, bairro, cep, telefone, email
- Características: tipo, modalidade, ensino_fundamental, ensino_medio, etc.
- Totais: total_alunos, total_professores, total_pedagogos, total_turmas, tcgps
- Séries: serie1_alunos, serie1_turmas, serie2_alunos, serie2_turmas, etc.
- **Metas:** meta_idebes_alfa_2024, idebes_alfa_2024, meta_idebes_alfa_2025
- **TCGP:** nome_tcgp, email_tcgp (cada escola tem tcgps=1 e um nome_tcgp/email_tcgp associado)

### Localização do CSV

- **Público:** `/public/escolas.csv` (acessível via fetch)
- **Fonte:** `/data/escolas.csv` (backup)

### Tratamento de Erros

- `loadEscolasFromCsv()` retorna array vazio em caso de erro
- Loga erro no console
- Não quebra a aplicação

## Exemplo de Uso

```typescript
// Carregar escolas
const escolas = await loadEscolasFromCsv()

// Calcular dados agregados (Modal 1)
const dadosES = calcularDadosEspiritoSanto(escolas)
const dadosRegionais = calcularDadosRegionais(escolas)
const dadosMunicipios = calcularDadosMunicipios(escolas)
const dadosPorSerie = calcularDadosEscolaPorSerie(escolas)

// Calcular dados de metas (Modal 3)
const metasEstado = calcularMetasEstado(escolas)
const metasRegionais = calcularMetasRegionais(escolas)
const metasMunicipios = calcularMetasMunicipios(escolas)
const metasEscolas = calcularMetasEscolas(escolas)

// Calcular dados de TCGP's (Modal 2)
const tcgpsEscolas = calcularTCGPEscolas(escolas)

// Agrupar escolas por TCGP (para modal de detalhes)
const tcgpsMap = agruparEscolasPorTCGP(escolas)
const detalhesTCGP = tcgpsMap.get('Ana Paula Silva') // Exemplo
```

## Observações

- Funções puras (não modificam dados originais)
- Ordenação alfabética consistente
- Tratamento de valores opcionais (|| 0)
- Cálculos eficientes com reduce e Map
- **TCGP's:** Cada escola tem tcgps=1, 1 TCGP pode atuar em até 5 escolas
- **Endereços:** `agruparEscolasPorTCGP` inclui endereço completo

