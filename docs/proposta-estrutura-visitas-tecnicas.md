# Proposta: Nova Estrutura CSV para Visitas Técnicas

## Análise da Situação Atual

### Problemas com a Estrutura Atual

1. **Dados agregados demais**: O `ciclo-gestao.csv` tem apenas totais por ciclo, sem detalhamento
2. **Sem distribuição por temática**: Não é possível saber quantas visitas de cada temática foram realizadas
3. **Sem distribuição por etapa**: Não é possível analisar por etapa (Planejamento, Execução, SAAR, etc.)
4. **Dificuldade de análise**: Agregações complexas para obter informações detalhadas

### Estrutura Proposta

#### CSV: `visitas-tecnicas.csv`

**Campos principais:**
- `escola_id` - ID da escola
- `ciclo` - Ciclo (1, 2 ou 3)
- `etapa` - Etapa dentro do ciclo
- `numero_visita` - Número da visita na etapa (1, 2, 3 ou vazio)
- `tematica` - Temática da visita
- `realizada` - true/false
- `ata_assinada` - true/false
- `data_visita` - Data da visita (opcional)
- `data_ata` - Data da assinatura da ata (opcional)

### Exemplo de Dados

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

### Benefícios

1. ✅ **Análise por ciclo**: Fácil filtrar e agregar por ciclo
2. ✅ **Análise por etapa**: Pode ver quantas visitas em cada etapa
3. ✅ **Análise por temática**: Pode ver distribuição de temáticas
4. ✅ **Rastreamento individual**: Cada visita é um registro
5. ✅ **Datas específicas**: Permite análises temporais
6. ✅ **Status detalhado**: Realizada vs não realizada, ata assinada vs pendente

### Próximos Passos

1. Criar o arquivo `visitas-tecnicas.csv` com a estrutura proposta
2. Criar parser específico para visitas técnicas
3. Atualizar funções de cálculo para usar o novo CSV
4. Atualizar componente VisitasTecnicas para usar dados detalhados
5. Remover campos de visitas técnicas do `ciclo-gestao.csv` (opcional)

