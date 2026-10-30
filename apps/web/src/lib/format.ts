export function formatINR(amount: number, symbol = '₹') {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

export function photoById<T extends { id: number }>(photos: T[], id: number) {
  return photos.find((p) => p.id === id);
}
