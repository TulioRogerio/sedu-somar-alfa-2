# Fases do Projeto - Somar Página Inicial

## Status Geral
🟡 **Fase Atual**: Prototipagem

---

## Fase 1: Prototipagem ⏳

### Objetivo
Criar uma versão simplificada da aplicação para validação de conceitos e estrutura.

### Status
- [x] Preparação do ambiente
- [x] Criação da estrutura de pastas
- [x] Configuração do PrimeReact
- [x] Criação do arquivo CSV com dados de escolas
- [x] Estrutura base da aplicação
- [x] Componentes principais (Header, CicloGestao, DadosCicloGestao)
- [x] Integração com dados do CSV
- [x] Interface básica funcional
- [x] Sistema de filtros hierárquico no modal
- [x] Documentação completa dos componentes

### Entregas Esperadas
- [x] Pasta `docs/` com orientações e prompts
- [x] Arquivo `fases.md` (este arquivo)
- [x] Estrutura básica do projeto React + TypeScript
- [x] Configuração do PrimeReact
- [x] Arquivo CSV com 20 escolas (6 municípios, 3 regionais)
- [x] Componentes básicos funcionando (Header, CicloGestao, DadosCicloGestao)
- [x] Interface renderizando dados do CSV
- [x] Modal com sistema de filtros hierárquico
- [x] Prompts detalhados para recriação dos componentes

### Critérios de Conclusão
- ✅ Ambiente preparado e configurado
- ✅ Dados de escolas disponíveis no CSV
- ✅ Componentes renderizando corretamente
- ✅ Dados sendo carregados do CSV
- ✅ Interface básica funcional
- ✅ Sistema de navegação hierárquica implementado
- ✅ Documentação completa para recriação

### Observações
- Foco em simplificação máxima
- Não usar banco de dados
- Todos os dados vêm do CSV
- Componentes com máximo de 300 linhas

---

## Fase 2: Desenvolvimento (Futuro)

### Objetivo
Expandir funcionalidades baseadas nos elementos da outra aplicação.

### Status
- [ ] Aguardando início

### Observações
- Será iniciada após validação da prototipagem
- Elementos da outra aplicação serão recodificados

---

## Fase 3: Refinamento (Futuro)

### Objetivo
Melhorias e otimizações.

### Status
- [ ] Aguardando início

---

## Notas de Desenvolvimento

### Decisões Técnicas
- **Framework**: React + TypeScript
- **UI Library**: PrimeReact
- **Dados**: CSV (sem banco de dados nesta fase)
- **Estrutura**: Componentes em arquivos separados (máx 300 linhas)

### Próximos Passos
1. ✅ Validar estrutura criada
2. ✅ Receber elementos da outra aplicação
3. ✅ Iniciar recodificação dos componentes
4. Integrar dados do CSV
5. Implementar menu lateral
6. Implementar navegação entre páginas

---

## Componentes Implementados

### Header
- **Arquivo**: `src/components/Header.tsx` (79 linhas)
- **Funcionalidades**:
  - Menu hambúrguer (TODO: implementar abertura)
  - Título "Somar Alfa 2"
  - Dropdown de seleção de ano (2020-2025)
  - Botões de navegação (Início, SAAR)
  - Breadcrumb simplificado (home + Início)

### CicloGestao
- **Arquivo**: `src/components/CicloGestao.tsx` (111 linhas)
- **Funcionalidades**:
  - Exibição do ciclo de gestão com ano
  - Indicação da etapa atual
  - Linha do tempo com 11 etapas usando PrimeReact Steps
  - Etapas completadas em azul com bolinha verde
  - Etapas futuras em cinza claro
  - Etapa atual destacada

### DadosCicloGestao
- **Arquivo**: `src/components/DadosCicloGestao.tsx` (153 linhas)
- **Funcionalidades**:
  - 4 cards com informações do ciclo de gestão
  - Card principal com fundo suave
  - Links "Ver detalhes" que abrem modal
  - Layout responsivo com grid

### DadosCicloGestao.modal1
- **Arquivo**: `src/components/DadosCicloGestao.modal1.tsx` (~567 linhas)
- **Funcionalidades**:
  - Modal com sistema de filtros hierárquico
  - Navegação: Regionais → Municípios → Escolas → Dados por Escola
  - 5 cards: ES, Regionais, Municípios, Escolas, Dados por Série
  - Animações de transição entre tabelas
  - Botões "Voltar" para navegação
  - Tabela de dados por escola com turmas individuais
  - Linha de total destacada

### csvParser
- **Arquivo**: `src/utils/csvParser.ts` (~207 linhas)
- **Funcionalidades**:
  - Parse de CSV para objetos tipados
  - Cálculo de dados agregados (ES, Regionais, Municípios)
  - Geração de turmas individuais por série
  - Distribuição de alunos entre turmas

### Tipos TypeScript
- **Arquivo**: `src/types/Escola.ts` (~109 linhas)
- **Interfaces**:
  - Escola (dados completos)
  - DadosEspiritoSanto
  - DadosRegional
  - DadosMunicipio
  - DadosEscolaPorSerie
  - TurmaInfo

---

**Última atualização**: 10/11/2025

