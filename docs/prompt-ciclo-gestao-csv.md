# Prompt: CSV ciclo-gestao.csv

## Objetivo
Arquivo CSV estruturado com dados do ciclo de gestão, contendo informações sobre planos de ação, mapas de ação, tarefas, produtos e visitas técnicas para cada escola.

## Estrutura do Arquivo

### Localização
- **Público**: `/public/ciclo-gestao.csv` (acessível via fetch)
- **Backup**: `/data/ciclo-gestao.csv`

### Estrutura de Dados

Cada linha do CSV representa um **mapa de ação** de uma escola.

**Hierarquia:**
- 1 Escola = 1 Plano de Ação
- 1 Plano de Ação = 3 a 4 Mapas de Ação
  - Matemática (obrigatório)
  - Português (obrigatório)
  - Leitura (obrigatório)
  - Busca Ativa (opcional)
- 1 Mapa de Ação = 1 Problema + 1 Desafio + Tarefas + 1 Produto
- 1 Escola = até 14 Visitas Técnicas

### Colunas do CSV

#### Identificação
- `escola_id`: ID da escola (relaciona com escolas.csv)
- `plano_acao_id`: ID do plano de ação (1 por escola)
- `mapa_acao_id`: ID único do mapa de ação

#### Mapa de Ação
- `tipo_mapa`: Tipo do mapa (Matemática, Português, Leitura, Busca Ativa)
- `problema`: Descrição do problema identificado
- `desafio`: Descrição do desafio associado
- `validado_tcgp`: true/false (validação do TCGP)

#### Produto
- `produto_status`: Status em quartis (0-25, 26-50, 51-75, 76-100)

#### Tarefas (por status)
- `tarefas_total`: Total de tarefas do mapa
- `tarefas_previstas`: Tarefas previstas
- `tarefas_nao_iniciadas`: Tarefas não iniciadas
- `tarefas_em_andamento`: Tarefas em andamento
- `tarefas_atrasadas`: Tarefas atrasadas
- `tarefas_concluidas`: Tarefas concluídas
- `tarefas_concluidas_atraso`: Tarefas concluídas com atraso

#### Visitas Técnicas
- `visitas_tecnicas_total`: Total de visitas realizadas
- `visitas_tecnicas_ciclo1`: Visitas do ciclo 1
- `visitas_tecnicas_ciclo2`: Visitas do ciclo 2
- `visitas_tecnicas_ciclo3`: Visitas do ciclo 3
- `visitas_tecnicas_esperadas`: Total esperado (14)
- `visitas_tecnicas_atas_assinadas`: Número de atas assinadas

### Exemplo de Dados

```csv
escola_id,plano_acao_id,mapa_acao_id,tipo_mapa,problema,desafio,validado_tcgp,produto_status,tarefas_total,tarefas_previstas,tarefas_nao_iniciadas,tarefas_em_andamento,tarefas_atrasadas,tarefas_concluidas,tarefas_concluidas_atraso,visitas_tecnicas_total,visitas_tecnicas_ciclo1,visitas_tecnicas_ciclo2,visitas_tecnicas_ciclo3,visitas_tecnicas_esperadas,visitas_tecnicas_atas_assinadas
1,1,1,Matemática,Dificuldade dos alunos...,Implementar metodologias...,true,51-75,50,4,8,12,1,20,5,12,4,4,4,14,13
```

### Relacionamento com escolas.csv

- `escola_id` do ciclo-gestao.csv relaciona com `id` do escolas.csv
- Escolas sem entradas no ciclo-gestao.csv são consideradas com **pendências de postagem**

### Uso no Código

```typescript
// Carregar dados do ciclo-gestao.csv
const response = await fetch("/ciclo-gestao.csv");
const text = await response.text();
// Parsear CSV...

// Identificar escolas com pendências
const escolasComMapas = new Set(
  cicloGestaoData.map((row) => parseInt(row.escola_id))
);
const pendencias = escolasData.filter(
  (escola) => !escolasComMapas.has(escola.id)
);
```

### Observações

- Máximo de 30 escolas no CSV
- Cada escola tem 3-4 mapas de ação
- Dados fictícios para evitar hardcoding
- Estrutura permite agregações e cálculos estatísticos

