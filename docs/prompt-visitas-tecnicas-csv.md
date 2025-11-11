# Prompt: CSV visitas-tecnicas.csv

## Objetivo
Arquivo CSV dedicado para armazenar dados detalhados de visitas técnicas, permitindo distribuição por ciclo, etapa e temática.

## Estrutura do Arquivo

### Localização
- **Público**: `/public/visitas-tecnicas.csv` (acessível via fetch)
- **Backup**: `/data/visitas-tecnicas.csv`

### Estrutura de Dados

Cada linha do CSV representa uma **visita técnica** ou um **agrupamento de visitas técnicas** por temática.

**Hierarquia:**
- 1 Escola = até 14 Visitas Técnicas (conforme calendário)
- 1 Visita Técnica = 1 Ciclo + 1 Etapa + 1 Número de Visita + 1 Temática
- Cada visita pode ter status de execução e assinatura de ata

### Colunas do CSV

#### Identificação
- `escola_id`: ID da escola (relaciona com escolas.csv)
- `visita_id`: ID único da visita técnica (opcional, para rastreamento)

#### Ciclo e Etapa
- `ciclo`: Número do ciclo (1, 2 ou 3)
- `etapa`: Nome da etapa dentro do ciclo
  - Ciclo I: "Planejamento", "Execução I", "SAAR I", "Correção de Rotas I"
  - Ciclo II: "Execução II", "SAAR II", "Correção de Rotas II"
  - Ciclo III: "Execução III", "Balanço Final"
- `numero_visita`: Número da visita dentro da etapa (1, 2, 3 ou vazio se for única)

#### Temática
- `tematica`: Descrição da temática da visita técnica
  - Exemplos:
    - "Diagnóstico e identificação de desafios"
    - "Elaboração do Plano de Ação"
    - "Qualificação do Plano de Ação"
    - "Acompanhamento da execução do Plano de Ação"
    - "Reflexão sobre a incidência das ações"
    - "SAAR N1"
    - "Aprimoramento do Plano de Ação"
    - "Revisão do Plano de Ação"
    - "Balanço Final"

#### Status e Controle
- `realizada`: true/false - Se a visita foi realizada
- `ata_assinada`: true/false - Se a ata foi assinada
- `data_visita`: Data da visita (formato: YYYY-MM-DD ou vazio)
- `data_ata`: Data de assinatura da ata (formato: YYYY-MM-DD ou vazio)

### Estrutura Proposta

#### Opção 1: Uma linha por visita técnica individual
```csv
escola_id,ciclo,etapa,numero_visita,tematica,realizada,ata_assinada,data_visita,data_ata
1,1,Planejamento,1,Diagnóstico e identificação de desafios,true,true,2025-01-15,2025-01-16
1,1,Planejamento,2,Elaboração do Plano de Ação,true,true,2025-01-22,2025-01-23
1,1,Planejamento,3,Qualificação do Plano de Ação,true,true,2025-01-29,2025-01-30
1,1,Execução I,1,Acompanhamento da execução do Plano de Ação,true,true,2025-02-05,2025-02-06
1,1,Execução I,2,Reflexão sobre a incidência das ações,true,true,2025-02-12,2025-02-13
1,1,SAAR I,,SAAR N1,true,true,2025-02-19,2025-02-20
1,1,Correção de Rotas I,,Aprimoramento do Plano de Ação,true,true,2025-02-26,2025-02-27
1,2,Execução II,1,Acompanhamento da execução do Plano de Ação,true,true,2025-03-05,2025-03-06
1,2,Execução II,2,Reflexão sobre a incidência das ações,true,true,2025-03-12,2025-03-13
1,2,SAAR II,,SAAR N1,true,true,2025-03-19,2025-03-20
1,2,Correção de Rotas II,,Revisão do Plano de Ação,true,true,2025-03-26,2025-03-27
1,3,Execução III,,Reflexão sobre a incidência das ações,true,true,2025-04-02,2025-04-03
1,3,Balanço Final,,Balanço Final,true,true,2025-04-09,2025-04-10
```

#### Opção 2: Agrupamento por temática (mais compacto)
```csv
escola_id,ciclo,etapa,numero_visita,tematica,quantidade_esperada,quantidade_realizada,atas_assinadas
1,1,Planejamento,1,Diagnóstico e identificação de desafios,1,1,1
1,1,Planejamento,2,Elaboração do Plano de Ação,1,1,1
1,1,Planejamento,3,Qualificação do Plano de Ação,1,1,1
1,1,Execução I,1,Acompanhamento da execução do Plano de Ação,1,1,1
1,1,Execução I,2,Reflexão sobre a incidência das ações,1,1,1
1,1,SAAR I,,SAAR N1,1,1,1
1,1,Correção de Rotas I,,Aprimoramento do Plano de Ação,1,1,1
```

### Recomendação

**Opção 1 (Uma linha por visita)** é mais flexível e permite:
- Rastreamento individual de cada visita
- Datas específicas por visita
- Status individual
- Facilita análises temporais
- Permite adicionar mais campos no futuro (observações, participantes, etc.)

### Vantagens do CSV Dedicado

1. **Separação de responsabilidades**: Dados de visitas técnicas separados de mapas de ação
2. **Estrutura otimizada**: Campos específicos para ciclo, etapa e temática
3. **Facilita análises**: Agregações por ciclo, etapa, temática
4. **Escalabilidade**: Fácil adicionar novos campos (datas, observações, etc.)
5. **Manutenibilidade**: Mais fácil de entender e atualizar

### Relacionamento com outros CSVs

- `escola_id` relaciona com `id` do `escolas.csv`
- Pode coexistir com `ciclo-gestao.csv` (que pode manter apenas totais agregados)
- Ou `ciclo-gestao.csv` pode remover campos de visitas técnicas

### Uso no Código

```typescript
// Carregar dados de visitas técnicas
const response = await fetch("/visitas-tecnicas.csv");
const text = await response.text();
const visitas = parseCSV(text);

// Filtrar por ciclo
const visitasCiclo1 = visitas.filter(v => v.ciclo === "1");

// Agrupar por temática
const porTematica = visitas.reduce((acc, v) => {
  if (!acc[v.tematica]) acc[v.tematica] = 0;
  acc[v.tematica]++;
  return acc;
}, {});
```

### Observações

- Cada escola deve ter até 14 visitas técnicas (conforme calendário)
- Campos de data são opcionais (podem ser vazios se não realizadas)
- `numero_visita` pode ser vazio para visitas únicas na etapa
- Estrutura permite evoluir para incluir mais detalhes no futuro

