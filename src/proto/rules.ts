import { dress } from './data';

export const KEEP_DAYS = 21;
export const UNDO_HOURS = 24;
export const CREDIT = 40;
export const REFUND_DAYS = 5;
export const UNDO_MESSAGE = 'Undone. Your size is kept in the other 2 dresses again.';
export function shippedAtCheckout(queue: string[], plan: 'hold' | 'all', soon: boolean, lowStock: boolean) {
  if (soon || plan === 'all') return [...queue];
  return queue.filter((id, index) => index === 0 || (lowStock && id === 'd3'));
}
export function paymentToday(queue: string[], plan: 'hold' | 'all', soon = false, lowStock = false) {
  return shippedAtCheckout(queue, plan, soon, lowStock).reduce((sum, id) => sum + dress(id).price, 0);
}
export function cycleFirst(queue: string[]) { return queue.length > 1 ? [...queue.slice(1), queue[0] ?? 'd1'] : queue; }
export function canUndo(keptAt: number | null, now: number) { return keptAt !== null && now - keptAt < UNDO_HOURS * 60 * 60 * 1000; }
export function remainingDresses(queue: string[], sent: string[]) { return queue.filter(id => !sent.includes(id)); }
export function heldDressCount(queue: string[], sent: string[], currentId: string, plan: 'hold' | 'all') {
  return plan === 'all' ? 0 : remainingDresses(queue, [...sent, currentId]).length;
}
