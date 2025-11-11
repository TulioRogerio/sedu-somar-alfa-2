# Prompt: Utilitário cicloGestaoParser

## Objetivo
Funções utilitárias para carregar e processar dados do CSV ciclo-gestao.csv, calculando agregações por estado, regional, município e escola.

## Estrutura do Arquivo

### Arquivo
- `src/utils/cicloGestaoParser.ts`

## Funções Principais

### 1. `loadCicloGestaoCsv()`
Carrega e parseia o arquivo ciclo-gestao.csv.

**Retorno:**
- `Promise<CicloGestaoRow[]>`

**Funcionalidade:**
- Faz fetch do arquivo `/ciclo-gestao.csv`
- Parseia o CSV linha por linha
- Retorna array de objetos `CicloGestaoRow`
- Trata erros e retorna array vazio em caso de falha

### 2. `calcularDadosPlanosAcaoEstado()`
Calcula dados agregados do estado (Espírito Santo).

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]` - Dados do CSV
- `escolasData: Escola[]` - Lista de escolas

**Retorno:**
- `DadosPlanosAcao`

**Métricas calculadas:**
- `mapasAcao`: Total de mapas de ação
- `planosAcao`: Total de planos de ação únicos (contagem por escola-plano)
- `mapasLP`: Mapas de Língua Portuguesa
- `mapasMat`: Mapas de Matemática
- `mapasLeitura`: Mapas de Leitura
- `mapasOutros`: Outros tipos de mapas (ex: Busca Ativa)
- `validados`: Mapas validados pelo TCGP (`validado_tcgp === "true"`)
- `pendentes`: Mapas não validados pelo TCGP (`validado_tcgp === "false"`)

### 3. `calcularDadosPlanosAcaoRegionais()`
Calcula dados agregados por regional.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]`
- `escolasData: Escola[]`

**Retorno:**
- `DadosPlanosAcaoRegional[]` (ordenado por nome da regional)

**Funcionalidade:**
- Agrupa escolas por regional
- Calcula métricas para cada regional
- Retorna array ordenado alfabeticamente

### 4. `calcularDadosPlanosAcaoMunicipios()`
Calcula dados agregados por município.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]`
- `escolasData: Escola[]`
- `regional?: string` - Filtro opcional por regional

**Retorno:**
- `DadosPlanosAcaoMunicipio[]` (ordenado por nome do município)

**Funcionalidade:**
- Filtra escolas por regional (se fornecida)
- Agrupa escolas por município
- Calcula métricas para cada município
- Retorna array ordenado alfabeticamente

### 5. `calcularDadosPlanosAcaoEscolas()`
Calcula dados agregados por escola.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]`
- `escolasData: Escola[]`
- `municipio?: string` - Filtro opcional por município
- `regional?: string` - Filtro opcional por regional

**Retorno:**
- `DadosPlanosAcaoEscola[]` (ordenado por nome da escola)

**Funcionalidade:**
- Filtra escolas por município e/ou regional (se fornecidos)
- Calcula métricas para cada escola individualmente
- Retorna array ordenado alfabeticamente

### 6. `calcularDadosTarefas()`
Calcula dados agregados de tarefas para todo o estado.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]` - Dados do CSV

**Retorno:**
- `DadosTarefas`

**Métricas calculadas:**
- `total`: Soma de todas as tarefas (`tarefas_total`)
- `previstas`: Soma de tarefas previstas (`tarefas_previstas`)
- `naoIniciadas`: Soma de tarefas não iniciadas (`tarefas_nao_iniciadas`)
- `emAndamento`: Soma de tarefas em andamento (`tarefas_em_andamento`)
- `atrasadas`: Soma de tarefas atrasadas (`tarefas_atrasadas`)
- `concluidas`: Soma de tarefas concluídas (`tarefas_concluidas`)
- `concluidasAtraso`: Soma de tarefas concluídas com atraso (`tarefas_concluidas_atraso`)

**Funcionalidade:**
- Itera sobre todos os registros do CSV
- Soma os valores de cada coluna de tarefas
- Retorna objeto com totais agregados
- Usado pelo componente Tarefas para exibir métricas gerais

### 7. `calcularDadosProdutos()`
Calcula dados agregados de produtos para todo o estado.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]` - Dados do CSV

**Retorno:**
- `DadosProdutos`

**Métricas calculadas:**
- `total`: Total de produtos com status definido
- `faixa0_25`: Produtos na faixa 0-25% de conclusão
- `faixa26_50`: Produtos na faixa 26-50% de conclusão
- `faixa51_75`: Produtos na faixa 51-75% de conclusão
- `faixa76_100`: Produtos na faixa 76-100% de conclusão
- `percentualMedio`: Percentual médio calculado baseado nas médias das faixas

**Funcionalidade:**
- Itera sobre todos os registros do CSV
- Processa o campo `produto_status` que contém valores em quartis (0-25, 26-50, 51-75, 76-100)
- Normaliza formatos (aceita tanto "0-25" quanto "0 – 25")
- Calcula percentual médio usando a média de cada faixa (12.5, 38, 63, 88)
- Retorna objeto com distribuição por faixas e percentual médio

### 8. `calcularDadosProdutosRegionais()`
Calcula dados agregados de produtos por regional.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]`
- `escolasData: Escola[]`

**Retorno:**
- `DadosProdutosRegional[]` (ordenado por nome da regional)

**Funcionalidade:**
- Agrupa escolas por regional
- Calcula métricas de produtos para cada regional
- Retorna array ordenado alfabeticamente

### 9. `calcularDadosProdutosMunicipios()`
Calcula dados agregados de produtos por município.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]`
- `escolasData: Escola[]`
- `regional?: string` - Filtro opcional por regional

**Retorno:**
- `DadosProdutosMunicipio[]` (ordenado por nome do município)

**Funcionalidade:**
- Filtra escolas por regional (se fornecida)
- Agrupa escolas por município
- Calcula métricas de produtos para cada município
- Retorna array ordenado alfabeticamente

### 10. `calcularDadosProdutosEscolas()`
Calcula dados agregados de produtos por escola.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]`
- `escolasData: Escola[]`
- `municipio?: string` - Filtro opcional por município
- `regional?: string` - Filtro opcional por regional

**Retorno:**
- `DadosProdutosEscola[]` (ordenado por nome da escola)

**Funcionalidade:**
- Filtra escolas por município e/ou regional (se fornecidos)
- Calcula métricas de produtos para cada escola individualmente
- Retorna array ordenado alfabeticamente

## Funções Auxiliares Internas

### `calcularDadosPlanosAcao()`
Função auxiliar que calcula métricas para um conjunto de escolas filtradas.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]`
- `escolasData: Escola[]`
- `filtro?: (escola: Escola) => boolean` - Função de filtro opcional

**Retorno:**
- `DadosPlanosAcao`

**Lógica:**
1. Filtra dados do ciclo-gestao.csv baseado nos IDs das escolas filtradas
2. Conta planos de ação únicos (usando Set com chave `escola_id-plano_acao_id`)
3. Conta mapas de ação por tipo
4. Conta mapas validados e pendentes

### `calcularDadosProdutosFiltrado()`
Função auxiliar que calcula métricas de produtos para um conjunto de escolas filtradas.

**Parâmetros:**
- `cicloGestaoData: CicloGestaoRow[]`
- `escolasData: Escola[]`
- `filtro?: (escola: Escola) => boolean` - Função de filtro opcional

**Retorno:**
- `DadosProdutos`

**Lógica:**
1. Filtra dados do ciclo-gestao.csv baseado nos IDs das escolas filtradas
2. Processa o campo `produto_status` de cada registro
3. Agrupa produtos por faixas de conclusão (0-25%, 26-50%, 51-75%, 76-100%)
4. Calcula percentual médio baseado nas médias das faixas

## Dependências

### Tipos
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
  DadosProdutosEscola,
} from "../types/CicloGestao"
import type { Escola } from "../types/Escola"
```

## Exemplo de Uso

```typescript
// Carregar dados
const cicloData = await loadCicloGestaoCsv()
const escolasData = await loadEscolasFromCsv()

// Calcular dados do estado
const dadosES = calcularDadosPlanosAcaoEstado(cicloData, escolasData)

// Calcular dados por regional
const dadosRegionais = calcularDadosPlanosAcaoRegionais(cicloData, escolasData)

// Calcular dados por município (filtrado por regional)
const dadosMunicipios = calcularDadosPlanosAcaoMunicipios(
  cicloData,
  escolasData,
  "SRE Colatina"
)

// Calcular dados por escola (filtrado por município e regional)
const dadosEscolas = calcularDadosPlanosAcaoEscolas(
  cicloData,
  escolasData,
  "Colatina",
  "SRE Colatina"
)

// Calcular dados agregados de tarefas
const dadosTarefas = calcularDadosTarefas(cicloData)
// Retorna: { total, previstas, naoIniciadas, emAndamento, atrasadas, concluidas, concluidasAtraso }

// Calcular dados agregados de produtos
const dadosProdutos = calcularDadosProdutos(cicloData)
// Retorna: { total, faixa0_25, faixa26_50, faixa51_75, faixa76_100, percentualMedio }

// Calcular dados de produtos por regional
const dadosProdutosRegionais = calcularDadosProdutosRegionais(cicloData, escolasData)

// Calcular dados de produtos por município (filtrado por regional)
const dadosProdutosMunicipios = calcularDadosProdutosMunicipios(
  cicloData,
  escolasData,
  "SRE Colatina"
)

// Calcular dados de produtos por escola (filtrado por município e regional)
const dadosProdutosEscolas = calcularDadosProdutosEscolas(
  cicloData,
  escolasData,
  "Colatina",
  "SRE Colatina"
)
```

## Observações

- Todas as funções são puras (não modificam os dados de entrada)
- Ordenação alfabética aplicada nos resultados
- Filtros opcionais permitem navegação hierárquica
- Cálculo de planos de ação usa Set para garantir unicidade
- Tratamento de erros em `loadCicloGestaoCsv` retorna array vazio
- `calcularDadosTarefas` agrega dados de todas as escolas sem filtros
- `calcularDadosProdutos` processa o campo `produto_status` que contém valores em quartis
- Normalização de formatos: aceita tanto "0-25" quanto "0 – 25" (com diferentes tipos de hífen)
- Percentual médio de produtos calculado usando médias das faixas (12.5, 38, 63, 88)
- Valores numéricos são convertidos com `parseInt()` e tratados com `|| 0` para valores inválidos

