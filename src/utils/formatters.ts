/**
 * Agricultural and Farmer-friendly formatters
 */

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString()}`;
  }
}

export function formatArea(acres: number): string {
  return `${acres.toFixed(1)} Acres`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getCropHealthBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'earth' {
  switch (status) {
    case 'optimal':
    case 'harvest-ready':
      return 'success';
    case 'attention':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'earth';
  }
}
