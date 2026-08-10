export function formatDateBR(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTimeBR(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMonthYearBR(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}

export function groupByMonth(sessions: Array<{ finished_at: string }>): Record<string, typeof sessions> {
  const groups: Record<string, typeof sessions> = {};
  for (const session of sessions) {
    const key = formatMonthYearBR(session.finished_at);
    if (!groups[key]) groups[key] = [];
    groups[key].push(session);
  }
  return groups;
}

export function getMonthOrder(monthYear: string): number {
  const [month, year] = monthYear.split(' ');
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  const monthIndex = months.findIndex(m => m.startsWith(month.toLowerCase()));
  return monthIndex >= 0 ? parseInt(year) * 12 + monthIndex : 0;
}