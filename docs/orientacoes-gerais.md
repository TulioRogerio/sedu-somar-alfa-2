# Orientações Gerais do Projeto

## Princípios e Regras

### Estrutura de Arquivos
- Um componente por arquivo
- Limite: **300 linhas por arquivo** (dividir se ultrapassar)
- Nomenclatura: `[nome].[modalN].[extensão]` para modais grandes (modal1, modal2, modal3)
- Componentes: PascalCase (ex: `Header.tsx`)
- Utilitários: camelCase (ex: `csvParser.ts`)

### Tecnologias
- **PrimeReact**: Biblioteca de componentes UI padrão
- **TypeScript**: Tipagem completa obrigatória
- **React**: Hooks padrão (useState, useEffect, useMemo)
- **Dados**: Apenas CSV (sem banco de dados nesta fase)

### Dados
- **Fonte principal**: Arquivo CSV (`/public/escolas.csv`)
- **Fonte secundária**: Arquivo CSV (`/public/ciclo-gestao.csv`) - dados do ciclo de gestão
- **Sem hardcoding**: Todos os dados vêm dos CSVs
- **Estrutura**: Ver `prompt-csv-parser.md` para colunas completas de escolas.csv
- **Ciclo de Gestão**: Ver `prompt-ciclo-gestao-csv.md` para estrutura de ciclo-gestao.csv

### Boas Práticas
- Código simples e claro (prioridade sobre otimizações)
- Evitar duplicação
- Nomes descritivos
- Comentários quando necessário

## Estrutura do Projeto

```
/
├── docs/                    # Documentação
├── public/                  # Arquivos estáticos
│   ├── escolas.csv          # CSV acessível via fetch
│   └── ciclo-gestao.csv    # CSV com dados do ciclo de gestão
├── src/
│   ├── components/         # Componentes React
│   │   ├── Header.tsx
│   │   ├── CicloGestao.tsx
│   │   ├── DadosCicloGestao.tsx
│   │   ├── PlanosAcao.tsx
│   │   ├── PlanosAcao.modal1.tsx
│   │   ├── PlanosAcao.modal2.tsx
│   │   ├── Tarefas.tsx
│   │   ├── Produtos.tsx
│   │   └── VisitasTecnicas.tsx
│   ├── utils/              # Funções utilitárias (csvParser.ts, cicloGestaoParser.ts)
│   ├── types/              # Interfaces TypeScript (Escola.ts, CicloGestao.ts)
│   └── App.tsx             # Componente principal
├── data/
│   └── escolas.csv         # Backup do CSV
└── package.json
```

## Ordem de Desenvolvimento

1. Tipos TypeScript (`prompt-tipos-typescript.md`)
2. CSV Parser (`prompt-csv-parser.md`)
3. Componentes básicos (Header, CicloGestao)
4. Componente principal (DadosCicloGestao)
5. Componentes secundários (PlanosAcao, Tarefas, Produtos, VisitasTecnicas)
6. Modais (DadosCicloGestao: Modal 1, 2, 3 | PlanosAcao: Modal 1, 2)
7. CSV ciclo-gestao.csv (dados estruturados do ciclo de gestão)

## Regras Específicas

- Modais separados por funcionalidade (modal1, modal2, modal3)
- Card do estado sempre visível nos modais 2 e 3
- Navegação hierárquica: Estado → Regional → Município → Escola
- Animações suaves entre tabelas
- Formatação: números em pt-BR, decimais com 1 casa

