export function formatBRL(cents: number): string {
  const reais = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(reais);
}

export function parseBRL(value: string): number {
  const numeric = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  const parsed = parseFloat(numeric);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
}

export function formatBRLInput(cents: number): string {
  const reais = cents / 100;
  return reais.toFixed(2).replace('.', ',');
}
