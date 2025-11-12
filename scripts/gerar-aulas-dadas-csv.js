// Script para gerar CSV de aulas dadas
const fs = require('fs');
const path = require('path');

// Função para obter dias úteis de um mês
function getDiasUteis(ano, mes) {
  const dias = [];
  const ultimoDia = new Date(ano, mes, 0).getDate();
  
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();
    // 0 = Domingo, 6 = Sábado
    if (diaSemana > 0 && diaSemana < 6) {
      dias.push(data);
    }
  }
  
  return dias;
}

// Obter todos os dias úteis de fev, mar e abr 2025
const diasFev = getDiasUteis(2025, 2);
const diasMar = getDiasUteis(2025, 3);
const diasAbr = getDiasUteis(2025, 4);
const todosDias = [...diasFev, ...diasMar, ...diasAbr];

// Escolas do CSV (simplificado - apenas IDs e dados básicos)
const escolas = [
  { id: 1, nome: 'EEEFM José Cupertino', municipio: 'Afonso Cláudio', regional: 'SRE Afonso Cláudio', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 2, nome: 'EEEFM Ana Monteiro', municipio: 'Afonso Cláudio', regional: 'SRE Afonso Cláudio', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 3, nome: 'EEEFM Pedro Silva', municipio: 'Afonso Cláudio', regional: 'SRE Afonso Cláudio', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 4, nome: 'EEEFM Maria Santos', municipio: 'Afonso Cláudio', regional: 'SRE Afonso Cláudio', turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 5, nome: 'EEEFM Carlos Oliveira', municipio: 'Brejetuba', regional: 'SRE Afonso Cláudio', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 6, nome: 'EEEFM Julia Costa', municipio: 'Brejetuba', regional: 'SRE Afonso Cláudio', turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 7, nome: 'EEEFM Roberto Mendes', municipio: 'Brejetuba', regional: 'SRE Afonso Cláudio', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 8, nome: 'EEEFM Fernanda Lima', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 9, nome: 'EEEFM Lucas Pereira', municipio: 'Baixo Guandu', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 10, nome: 'EEEFM Beatriz Souza', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 11, nome: 'EEEFM Rafael Martins', municipio: 'Baixo Guandu', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 12, nome: 'EEEFM Camila Rodrigues', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 13, nome: 'EEEFM Gabriel Silva', municipio: 'Baixo Guandu', regional: 'SRE Colatina', turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 14, nome: 'EEEFM Larissa Costa', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 15, nome: 'EEEFM Thiago Oliveira', municipio: 'Baixo Guandu', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 16, nome: 'EEEFM Marina Santos', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 17, nome: 'EEEFM Bruno Mendes', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 18, nome: 'EEEFM Isabella Ferreira', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 19, nome: 'EEEFM Daniel Alves', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 20, nome: 'EEEFM Sofia Lima', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 22, nome: 'EEEFM Santa Rita', municipio: 'Brejetuba', regional: 'SRE Afonso Cláudio', turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 23, nome: 'EEEFM João Batista', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 24, nome: 'EEEFM Maria da Conceição', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 25, nome: 'EEEFM Antônio Carlos', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { id: 26, nome: 'EEEFM Paulo Freire', municipio: 'Colatina', regional: 'SRE Colatina', turmas: ['1ª Série', '2ª Série', '3ª Série', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
];

// Função para formatar data como YYYY-MM-DD
function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Gerar linhas do CSV
const linhas = ['escola_id,escola_nome,regional,municipio,turma,data,dia_letivo,aulas_dadas'];

let diaLetivoContador = 1;

escolas.forEach(escola => {
  escola.turmas.forEach(turma => {
    todosDias.forEach((data, index) => {
      // Atribuir dia letivo sequencial
      const diaLetivo = diaLetivoContador;
      diaLetivoContador++;
      
      // Gerar número aleatório de aulas dadas (entre 4 e 6 aulas por dia)
      const aulasDadas = Math.floor(Math.random() * 3) + 4; // 4, 5 ou 6
      
      const linha = [
        escola.id,
        escola.nome,
        escola.regional,
        escola.municipio,
        turma,
        formatarData(data),
        diaLetivo,
        aulasDadas
      ].join(',');
      
      linhas.push(linha);
    });
  });
});

// Resetar contador de dia letivo para cada escola/turma
// Na verdade, o dia letivo deve ser sequencial por turma
// Vou corrigir isso
const linhasCorrigidas = ['escola_id,escola_nome,regional,municipio,turma,data,dia_letivo,aulas_dadas'];

escolas.forEach(escola => {
  escola.turmas.forEach(turma => {
    let diaLetivoTurma = 1;
    todosDias.forEach((data) => {
      const aulasDadas = Math.floor(Math.random() * 3) + 4; // 4, 5 ou 6
      
      const linha = [
        escola.id,
        escola.nome,
        escola.regional,
        escola.municipio,
        turma,
        formatarData(data),
        diaLetivoTurma++,
        aulasDadas
      ].join(',');
      
      linhasCorrigidas.push(linha);
    });
  });
});

// Escrever arquivo
const csvContent = linhasCorrigidas.join('\n');
const publicPath = path.join(__dirname, '..', 'public', 'aulas-dadas.csv');
const dataPath = path.join(__dirname, '..', 'data', 'aulas-dadas.csv');

fs.writeFileSync(publicPath, csvContent, 'utf8');
fs.writeFileSync(dataPath, csvContent, 'utf8');

console.log(`CSV gerado com sucesso!`);
console.log(`Total de linhas: ${linhasCorrigidas.length - 1}`);
console.log(`Arquivos criados:`);
console.log(`  - ${publicPath}`);
console.log(`  - ${dataPath}`);

