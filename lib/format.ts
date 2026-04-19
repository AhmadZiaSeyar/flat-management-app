export function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateLabel(input: string | Date) {
  const date = typeof input === 'string' ? new Date(input) : input;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatLongDateLabel(input: string | Date) {
  const date = typeof input === 'string' ? new Date(input) : input;

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatMonthLabel(month: number, year: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
}

export function getFirstName(name: string) {
  return name.split(' ')[0] ?? name;
}
