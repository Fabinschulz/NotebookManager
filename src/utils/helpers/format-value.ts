
export function formatPercentage(value: number | string | undefined, decimalPlaces: number = 2): string {
  if (isNaN(Number(value)) || value === undefined || value === null) return 'N/A';

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const adjustedValue = numericValue > 1 ? numericValue / 100 : numericValue;
  const hasDecimalPlaces = !Number.isInteger(numericValue);
  const resolvedDecimalPlaces = hasDecimalPlaces ? decimalPlaces : 0;

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: resolvedDecimalPlaces,
    maximumFractionDigits: resolvedDecimalPlaces
  });

  return formatter.format(adjustedValue);
}

export function formatCurrency(val: string | number | undefined) {
  if (typeof val === 'string' && val === 'None') return 'R$ 0,00';
  if (val === undefined || (typeof val !== 'string' && isNaN(val)) || !val) return 'R$ 0,00';

  return val?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
