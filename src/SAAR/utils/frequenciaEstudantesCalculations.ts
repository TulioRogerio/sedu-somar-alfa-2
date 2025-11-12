/**
 * Funções de cálculo e agregação para dados de Frequência dos Estudantes
 */

import type {
  FrequenciaEstudantesRow,
  DadosFrequenciaPorData,
} from "../types/FrequenciaEstudantes.types";

/**
 * Calcula o indicador de frequência (percentual de presenças)
 */
export function calcularIndicadorFrequencia(
  dados: FrequenciaEstudantesRow[]
): number {
  if (dados.length === 0) return 0;

  const totalPresencas = dados.filter((row) => row.presenca_falta === "P")
    .length;
  const total = dados.length;

  if (total === 0) return 0;

  const percentual = (totalPresencas / total) * 100;
  return Math.min(100, Math.max(0, percentual));
}

/**
 * Calcula o número total de alunos únicos
 */
export function calcularTotalAlunos(
  dados: FrequenciaEstudantesRow[]
): number {
  if (dados.length === 0) return 0;

  // Criar chave única para cada aluno (escola + série + aluno)
  const alunosUnicos = new Set<string>();
  
  dados.forEach((row) => {
    const chave = `${row.escola}|${row.serie}|${row.aluno}`;
    alunosUnicos.add(chave);
  });

  return alunosUnicos.size;
}

/**
 * Agrupa dados por data e calcula frequência acumulada
 * Cria uma sequência temporal baseada nos dias letivos (fevereiro e março de 2025)
 */
export function agruparDadosPorData(
  dados: FrequenciaEstudantesRow[],
  mesInicial: number = 2,
  ano: number = 2025
): DadosFrequenciaPorData[] {
  // Obter dias úteis de fevereiro e março de 2025
  const getDiasUteis = (ano: number, mes: number): Date[] => {
    const dias: Date[] = [];
    const ultimoDia = new Date(ano, mes, 0).getDate();
    
    for (let dia = 1; dia <= ultimoDia; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const diaSemana = data.getDay();
      if (diaSemana > 0 && diaSemana < 6) {
        dias.push(data);
      }
    }
    return dias;
  };

  const diasFev = getDiasUteis(ano, 2);
  const diasMar = getDiasUteis(ano, 3);
  const todosDias = [...diasFev, ...diasMar];

  // Criar mapa de datas usando índice sequencial do dia letivo
  const dadosPorData: Record<number, DadosFrequenciaPorData> = {};

  // Processar cada registro
  // Se temos dia_letivo no CSV, usar diretamente; senão, usar data ou mapear
  dados.forEach((row) => {
    let indiceDiaLetivo: number;
    
    // Prioridade 1: usar dia_letivo se disponível
    if (row.dia_letivo !== undefined && row.dia_letivo > 0) {
      indiceDiaLetivo = row.dia_letivo - 1; // Converter para índice (0-based)
    }
    // Prioridade 2: usar data se disponível
    else if (row.data) {
      const dataRow = new Date(row.data);
      const indiceEncontrado = todosDias.findIndex(
        (d) =>
          d.getFullYear() === dataRow.getFullYear() &&
          d.getMonth() === dataRow.getMonth() &&
          d.getDate() === dataRow.getDate()
      );
      indiceDiaLetivo = indiceEncontrado >= 0 ? indiceEncontrado : 0;
    }
    // Prioridade 3: mapear usando dia do mês
    else {
      const diaMes = row.dias_do_mes;
      // Criar mapa de dia do mês para índice
      const mapaDiaMesParaIndice: Record<string, number> = {};
      todosDias.forEach((data, indice) => {
        const mes = data.getMonth() + 1;
        const dia = data.getDate();
        const chave = `${mes}-${dia}`;
        if (!mapaDiaMesParaIndice[chave]) {
          mapaDiaMesParaIndice[chave] = indice;
        }
      });
      
      // Tentar fevereiro primeiro
      const chaveFev = `2-${diaMes}`;
      if (mapaDiaMesParaIndice[chaveFev] !== undefined) {
        indiceDiaLetivo = mapaDiaMesParaIndice[chaveFev];
      } else {
        // Tentar março
        const chaveMar = `3-${diaMes}`;
        indiceDiaLetivo = mapaDiaMesParaIndice[chaveMar] || 0;
      }
    }

    // Garantir que o índice está dentro do range
    indiceDiaLetivo = Math.max(0, Math.min(todosDias.length - 1, indiceDiaLetivo));

    if (!dadosPorData[indiceDiaLetivo]) {
      const data = todosDias[indiceDiaLetivo];
      const dataStr = `${ano}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
      
      dadosPorData[indiceDiaLetivo] = {
        data: dataStr,
        totalAlunos: 0,
        totalPresencas: 0,
        totalFaltas: 0,
        percentualPresenca: 0,
      };
    }

    dadosPorData[indiceDiaLetivo].totalAlunos++;
    if (row.presenca_falta === "P") {
      dadosPorData[indiceDiaLetivo].totalPresencas++;
    } else {
      dadosPorData[indiceDiaLetivo].totalFaltas++;
    }
  });

  // Calcular percentuais de frequência
  const dadosOrdenados = Object.keys(dadosPorData)
    .map(Number)
    .sort((a, b) => a - b)
    .map((indice) => dadosPorData[indice]);

  dadosOrdenados.forEach((dado) => {
    dado.percentualPresenca =
      dado.totalAlunos > 0
        ? Number(((dado.totalPresencas / dado.totalAlunos) * 100).toFixed(1))
        : 0;
  });

  return dadosOrdenados;
}

