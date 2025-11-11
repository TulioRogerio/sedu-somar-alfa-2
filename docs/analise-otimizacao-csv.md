# Análise e Otimização dos Arquivos CSV

## Data da Análise
Análise realizada para verificar se os arquivos CSV estão otimizados para o consumo atual da aplicação.

## Problemas Identificados

### 1. ⚠️ **PROBLEMA CRÍTICO: Parser CSV Vulnerável**

**Arquivo:** `ciclo-gestao.csv`

**Problema:**
O parser atual usa `split(',')` simples, mas os campos `problema` e `desafio` contêm textos longos que podem conter vírgulas. Isso pode quebrar o parsing e causar dados incorretos.

**Exemplo de linha problemática:**
```csv
1,1,1,Matemática,"Dificuldade com frações, decimais e porcentagens",Implementar metodologias,true,51-75,80,5,3,2,0,65,5,12,4,4,4,14,13
```

**Solução Recomendada:**
1. **Opção 1 (Recomendada):** Usar biblioteca de parsing CSV adequada (ex: PapaParse)
2. **Opção 2:** Implementar parser que respeite campos entre aspas
3. **Opção 3:** Escapar vírgulas nos textos ou usar delimitador alternativo

**Impacto:** 🔴 **ALTO** - Pode causar dados incorretos ou falhas no parsing

### 2. Campos Potencialmente Não Utilizados

#### `escolas.csv`

**Campos que podem não ser utilizados:**
- `codigo` - Não encontrado uso no código
- `codigo_municipio` - Apenas definido no tipo, não usado em cálculos
- `codigo_regional` - Apenas definido no tipo, não usado em cálculos
- `tipo` - Não encontrado uso direto
- `modalidade` - Não encontrado uso direto
- `ensino_fundamental`, `ensino_medio`, `educacao_infantil`, `educacao_especial` - Não encontrado uso direto
- `ativo` - Não encontrado uso para filtrar escolas ativas

**Campos usados apenas em casos específicos:**
- `endereco`, `numero`, `bairro` - Usados apenas no modal de TCGP (DadosCicloGestao.modal2.tsx)
- `telefone`, `email` - Não encontrado uso direto
- `cep` - Não encontrado uso

**Recomendação:**
- Se esses campos não forem necessários, podem ser removidos para reduzir o tamanho do arquivo
- Se forem necessários para futuras funcionalidades, manter

#### `ciclo-gestao.csv`

**Campos que podem não ser utilizados:**
- `problema` - Definido no tipo mas não encontrado uso direto nos componentes
- `desafio` - Definido no tipo mas não encontrado uso direto nos componentes
- `plano_acao_id` - Usado apenas para contagem de planos únicos
- `mapa_acao_id` - Usado apenas como identificador único

**Observação:**
- `problema` e `desafio` são mencionados no componente PlanosAcao mas não são exibidos diretamente

## Campos Utilizados

### `escolas.csv` - Campos Utilizados

**Identificação:**
- ✅ `id` - Usado para relacionamento com ciclo-gestao.csv
- ✅ `nome` - Usado em todos os componentes

**Localização:**
- ✅ `municipio` - Usado em agregações e filtros
- ✅ `regional` - Usado em agregações e filtros

**Totais:**
- ✅ `total_alunos` - Usado em cálculos agregados
- ✅ `total_professores` - Usado em cálculos agregados
- ✅ `total_pedagogos` - Usado em cálculos agregados
- ✅ `total_turmas` - Usado em cálculos agregados
- ✅ `tcgps` - Usado em cálculos agregados

**Séries:**
- ✅ `serie1_alunos`, `serie1_turmas` até `serie5_alunos`, `serie5_turmas` - Usados em DadosEscolaPorSerie

**Metas:**
- ✅ `meta_idebes_alfa_2024`, `idebes_alfa_2024`, `meta_idebes_alfa_2025` - Usados em cálculos de metas

**TCGP:**
- ✅ `nome_tcgp`, `email_tcgp` - Usados no modal de TCGP

### `ciclo-gestao.csv` - Campos Utilizados

**Identificação:**
- ✅ `escola_id` - Usado para relacionamento com escolas.csv
- ✅ `plano_acao_id` - Usado para contagem de planos únicos
- ✅ `mapa_acao_id` - Identificador único

**Mapa de Ação:**
- ✅ `tipo_mapa` - Usado para agrupar por tipo (Matemática, Português, Leitura, Outros)
- ✅ `validado_tcgp` - Usado para contar validados vs pendentes

**Produto:**
- ✅ `produto_status` - Usado em todos os cálculos de produtos

**Tarefas:**
- ✅ Todos os campos de tarefas são utilizados:
  - `tarefas_total`
  - `tarefas_previstas`
  - `tarefas_nao_iniciadas`
  - `tarefas_em_andamento`
  - `tarefas_atrasadas`
  - `tarefas_concluidas`
  - `tarefas_concluidas_atraso`

**Visitas Técnicas:**
- ✅ Todos os campos de visitas técnicas são utilizados:
  - `visitas_tecnicas_total`
  - `visitas_tecnicas_ciclo1`
  - `visitas_tecnicas_ciclo2`
  - `visitas_tecnicas_ciclo3`
  - `visitas_tecnicas_esperadas`
  - `visitas_tecnicas_atas_assinadas`

## Recomendações de Otimização

### 1. 🔴 **URGENTE: Corrigir Parser CSV**

**Implementar parser que respeite campos entre aspas:**

```typescript
// Exemplo de parser melhorado
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}
```

**OU usar biblioteca:**
```bash
npm install papaparse
```

```typescript
import Papa from 'papaparse'

export async function loadCicloGestaoCsv(): Promise<CicloGestaoRow[]> {
  const response = await fetch("/ciclo-gestao.csv")
  const text = await response.text()
  const result = Papa.parse<CicloGestaoRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim()
  })
  return result.data
}
```

### 2. 🟡 **Otimização: Remover Campos Não Utilizados**

Se confirmado que não serão usados, considerar remover:
- `codigo`, `codigo_municipio`, `codigo_regional` do `escolas.csv`
- Campos de endereço completo se não forem necessários (ou manter apenas para modal TCGP)

**Impacto:** Redução de ~10-15% no tamanho do arquivo

### 3. 🟢 **Otimização: Estrutura de Dados**

**Atual:**
- Cada linha do `ciclo-gestao.csv` = 1 mapa de ação
- Múltiplas linhas por escola (3-4 mapas por escola)

**Alternativa (se necessário):**
- Normalizar em estrutura JSON mais eficiente
- Mas CSV é mais simples para edição manual

**Recomendação:** Manter estrutura atual, é adequada para o uso

### 4. 🟢 **Validação de Dados**

Adicionar validação ao carregar CSVs:
- Verificar se campos obrigatórios estão presentes
- Validar tipos de dados
- Verificar consistência (ex: soma de tarefas = total)

## Resumo

### Status Atual
- ✅ **Parser corrigido** - Agora respeita campos entre aspas
- ✅ Estrutura geral adequada
- 🟡 Alguns campos não utilizados (mas podem ser necessários no futuro)

### Prioridades
1. ✅ **CONCLUÍDO:** Parser CSV corrigido para lidar com vírgulas em campos de texto
2. **🟡 MÉDIA:** Avaliar remoção de campos não utilizados (após confirmar que não serão necessários)
3. **🟢 BAIXA:** Adicionar validação de dados

### Implementação Realizada

**Arquivo criado:** `src/utils/csvParserUtils.ts`

**Funções implementadas:**
- `parseCSVLine()` - Parseia uma linha CSV respeitando campos entre aspas
- `parseCSV()` - Parseia um arquivo CSV completo

**Características:**
- ✅ Respeita campos entre aspas duplas
- ✅ Suporta aspas escapadas ("" dentro de um campo)
- ✅ Mantém compatibilidade com CSVs sem aspas
- ✅ Sem dependências externas

**Arquivos atualizados:**
- `src/utils/cicloGestaoParser.ts` - Agora usa `parseCSV()`
- `src/utils/csvParser.ts` - Agora usa `parseCSV()`

### Conclusão
Os CSVs estão **otimizados** para o consumo atual. O parser foi corrigido para lidar corretamente com campos que podem conter vírgulas. A estrutura de dados é adequada para o uso atual, e há espaço para otimização futura removendo campos não utilizados se necessário.

