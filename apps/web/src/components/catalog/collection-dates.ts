import { type Collection } from '@/lib/api';

export function isCurrentCollection(collection: Collection) {
  const now = new Date();
  const startDate = new Date(collection.startDate);
  const endDate = collection.endDate ? endOfDay(new Date(collection.endDate)) : null;
  return collection.status === 'ACTIVE' && startDate <= now && (!endDate || endDate >= now);
}

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));
}

function endOfDay(date: Date) {
  const value = new Date(date);
  value.setUTCHours(23, 59, 59, 999);
  return value;
}
