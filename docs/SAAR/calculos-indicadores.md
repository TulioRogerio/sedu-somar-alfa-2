# Cálculos dos Indicadores SAAR

Este documento descreve os cálculos utilizados para cada indicador exibido no sistema SAAR.

## 1. Indicador de Aulas Dadas

### Fórmula
```
Indicador = (Total de Aulas Dadas / Total de Aulas Previstas) × 100
```

### Detalhamento
- **Total de Aulas Previstas**: Soma de todas as aulas previstas de todas as disciplinas (LP, Mat, Ciências, História, Geografia) de todos os registros
- **Total de Aulas Dadas**: Soma de todas as aulas dadas de todas as disciplinas de todos os registros
- **Resultado**: Percentual entre 0% e 100% (limitado)

### Cálculo por Disciplina
Para cada disciplina individual:
```
Percentual_Disciplina = (Aulas Dadas_Disciplina / Aulas Previstas_Disciplina) × 100
```

### Implementação
- Arquivo: `src/SAAR/utils/aulasDadasCalculations.ts`
- Função: `calcularIndicadorAula(dados: AulasDadasRow[]): number`

---

## 2. Indicador de Frequência dos Estudantes

### Fórmula
```
Indicador = (Total de Presenças / Total de Registros) × 100
```

### Detalhamento
- **Total de Presenças**: Contagem de registros onde `presenca_falta === "P"`
- **Total de Registros**: Total de registros no conjunto de dados
- **Resultado**: Percentual entre 0% e 100% (limitado)

### Observações
- Cada registro representa uma presença/falta de um aluno em um dia específico
- O cálculo considera todos os registros, independente de série ou escola

### Implementação
- Arquivo: `src/SAAR/utils/frequenciaEstudantesCalculations.ts`
- Função: `calcularIndicadorFrequencia(dados: FrequenciaEstudantesRow[]): number`

---

## 3. Indicador de Tarefas (Progresso)

### Fórmula
```
Indicador = ((Tarefas Concluídas + Tarefas Concluídas com Atraso) / Total de Tarefas) × 100
```

### Detalhamento
- **Tarefas Concluídas**: Soma de `tarefas_concluidas` de todos os registros
- **Tarefas Concluídas com Atraso**: Soma de `tarefas_concluidas_atraso` de todos os registros
- **Total de Tarefas**: Soma de `tarefas_total` de todos os registros
- **Resultado**: Percentual entre 0% e 100% (limitado)

### Observações
- O indicador considera tanto tarefas concluídas no prazo quanto com atraso
- Representa o percentual de conclusão geral do conjunto de tarefas

### Implementação
- Arquivo: `src/SAAR/utils/tarefasCalculations.ts`
- Função: `calcularPercentualProgresso(dados: DadosTarefas): number`

---

## 4. Indicador de Produtos (Percentual Médio)

### Fórmula
```
Indicador = Soma dos Percentuais Médios das Faixas / Total de Produtos
```

### Detalhamento
Cada produto é classificado em uma faixa de conclusão:
- **0-25%**: Percentual médio = 12.5%
- **26-50%**: Percentual médio = 38%
- **51-75%**: Percentual médio = 63%
- **76-100%**: Percentual médio = 88%

### Cálculo
1. Para cada produto, identificar a faixa (`produto_status`)
2. Atribuir o percentual médio correspondente à faixa
3. Somar todos os percentuais médios
4. Dividir pelo total de produtos

```
Percentual Médio = Σ(Percentual Médio da Faixa) / Total de Produtos
```

### Resultado
- Valor entre 0% e 100%
- Representa a média ponderada do percentual de conclusão dos produtos

### Implementação
- Arquivo: `src/SAAR/utils/produtosCalculations.ts`
- Função: `calcularDadosProdutosFiltrado()` (retorna `percentualMedio`)

---

## 5. Indicador de Visitas Técnicas (Atas Assinadas)

### Fórmula
```
Indicador = (Total de Atas Assinadas / Total de Visitas Esperadas) × 100
```

### Detalhamento
- **Total de Atas Assinadas**: Contagem de visitas onde `ata_assinada === "true"`
- **Total de Visitas Esperadas**: Contagem total de visitas técnicas (todas são consideradas esperadas)
- **Resultado**: Percentual entre 0% e 100%

### Observações
- Cada visita técnica é contada como esperada
- O indicador mede a proporção de visitas que tiveram suas atas assinadas
- Pode ser calculado por ciclo, etapa ou temática

### Implementação
- Arquivo: `src/SAAR/utils/visitasTecnicasCalculations.ts`
- Função: `calcularDadosVisitasTecnicas()` (retorna `percentualAtasAssinadas`)

---

## Formatação dos Resultados

Todos os indicadores são formatados com:
- **1 casa decimal** para exibição (ex: `94.82%` → `94,8%`)
- **Limitação** entre 0% e 100% para evitar valores inválidos
- **Tratamento de erros** retornando 0 quando não há dados ou ocorre erro no cálculo

### Formatação no Componente
- Arquivo: `src/SAAR/components/SAARCardIndicador.tsx`
- A formatação converte strings com `%` para número e formata com 1 decimal
- Usa vírgula como separador decimal (pt-BR)

---

## Agregação por Níveis

Todos os indicadores podem ser calculados em diferentes níveis de agregação:
- **Estado**: Todos os dados
- **Regional**: Filtrado por regional
- **Município**: Filtrado por município
- **Escola**: Filtrado por escola específica

Os cálculos são aplicados aos dados filtrados conforme o nível selecionado.

---

## Notas Técnicas

1. **Validação de Dados**: Todos os cálculos verificam se os dados são válidos antes de processar
2. **Tratamento de Nulos**: Valores nulos ou indefinidos são tratados como 0
3. **Precisão**: Os cálculos usam números de ponto flutuante, com arredondamento apenas na formatação final
4. **Performance**: Os cálculos são otimizados usando `reduce` e `filter` para eficiência

