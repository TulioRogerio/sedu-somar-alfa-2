# Prompt: Utilitários de Parser CSV

## Objetivo
Criar utilitários para parsing de arquivos CSV que respeitam campos entre aspas, permitindo que campos contenham vírgulas sem quebrar o parsing.

## Estrutura do Arquivo

### Arquivo
- `src/utils/csvParserUtils.ts`

## Funções Principais

### 1. `parseCSVLine(line: string): string[]`
Parseia uma linha CSV respeitando campos entre aspas duplas.

**Parâmetros:**
- `line: string` - Linha do CSV a ser parseada

**Retorno:**
- `string[]` - Array de valores parseados

**Funcionalidade:**
- Respeita campos entre aspas duplas (`"`)
- Suporta aspas escapadas (`""` dentro de um campo representa uma aspas literal)
- Vírgulas dentro de campos entre aspas são tratadas como parte do conteúdo
- Remove espaços em branco no início e fim de cada campo

**Exemplo:**
```typescript
const line = '1,"Campo com vírgula, e aspas",3'
const result = parseCSVLine(line)
// Retorna: ['1', 'Campo com vírgula, e aspas', '3']
```

### 2. `parseCSV(csvContent: string): Record<string, string>[]`
Parseia um arquivo CSV completo.

**Parâmetros:**
- `csvContent: string` - Conteúdo completo do CSV

**Retorno:**
- `Record<string, string>[]` - Array de objetos, onde cada objeto representa uma linha

**Funcionalidade:**
- Primeira linha é tratada como cabeçalho
- Cada linha subsequente é parseada e mapeada para um objeto usando os cabeçalhos como chaves
- Campos vazios são retornados como strings vazias
- Remove linhas vazias automaticamente

**Exemplo:**
```typescript
const csv = `nome,idade,cidade
João,30,"São Paulo, SP"
Maria,25,"Rio de Janeiro, RJ"`

const result = parseCSV(csv)
// Retorna:
// [
//   { nome: 'João', idade: '30', cidade: 'São Paulo, SP' },
//   { nome: 'Maria', idade: '25', cidade: 'Rio de Janeiro, RJ' }
// ]
```

## Casos de Uso Especiais

### Aspas Escapadas
```typescript
const line = '1,"Campo com ""aspas"" dentro",3'
const result = parseCSVLine(line)
// Retorna: ['1', 'Campo com "aspas" dentro', '3']
```

### Vírgulas em Campos
```typescript
const line = '1,"Campo com, vírgula",3'
const result = parseCSVLine(line)
// Retorna: ['1', 'Campo com, vírgula', '3']
```

### Campos Sem Aspas
```typescript
const line = '1,Campo normal,3'
const result = parseCSVLine(line)
// Retorna: ['1', 'Campo normal', '3']
```

## Integração

### Uso em `cicloGestaoParser.ts`
```typescript
import { parseCSV } from "./csvParserUtils";

export async function loadCicloGestaoCsv(): Promise<CicloGestaoRow[]> {
  const response = await fetch("/ciclo-gestao.csv");
  const text = await response.text();
  const parsedData = parseCSV(text);
  return parsedData as CicloGestaoRow[];
}
```

### Uso em `csvParser.ts`
```typescript
import { parseCSV } from './csvParserUtils'

export function parseEscolasCsv(csvContent: string): Escola[] {
  const parsedData = parseCSV(csvContent)
  // ... processamento adicional
}
```

## Vantagens

1. **Robustez**: Lida corretamente com campos que contêm vírgulas
2. **Sem Dependências**: Implementação própria, sem bibliotecas externas
3. **Performance**: Leve e eficiente
4. **Compatibilidade**: Funciona com CSVs com ou sem aspas
5. **Manutenibilidade**: Código simples e fácil de entender

## Observações

- O parser segue o padrão RFC 4180 para CSV
- Campos entre aspas podem conter quebras de linha (não implementado, mas pode ser adicionado)
- Aspas duplas dentro de campos devem ser escapadas como `""`
- Espaços em branco ao redor de campos são removidos automaticamente

