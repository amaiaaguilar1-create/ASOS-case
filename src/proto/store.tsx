import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { canUndo, cycleFirst, remainingDresses, shippedAtCheckout, UNDO_MESSAGE } from './rules';
export type ScreenId = 'listing' | 'pdp' | 'bag' | 'order' | 'notification' | 'arrived' | 'fit' | 'credit' | 'congrats' | 'next' | 'sent';
export type SheetId = null | 'why' | 'how' | 'decide' | 'keep' | 'date';
export type Flags = { lowStock: boolean; soonWedding: boolean; noTailor: boolean };
export const noFlags: Flags = { lowStock: false, soonWedding: false, noTailor: false };
type State = {
  stack: ScreenId[]; sheet: SheetId; pdpId: string; queue: string[]; plan: 'hold' | 'all'; flags: Flags;
  ordered: boolean; sentIds: string[]; currentId: string; nextId: string; previousId: string;
  compare: boolean; keptAt: number | null; weddingDate: string; toast: string | null;
};
export const initialState: State = {
  stack: ['listing'], sheet: null, pdpId: 'd1', queue: ['d1', 'd2', 'd3'], plan: 'hold', flags: noFlags,
  ordered: false, sentIds: [], currentId: 'd1', nextId: 'd2', previousId: 'd1', compare: false, keptAt: null, weddingDate: '', toast: null,
};
type Ctx = State & {
  screen: ScreenId; go: (s: ScreenId) => void; back: () => void; openSheet: (s: SheetId) => void; closeSheet: () => void;
  toastMsg: (m: string) => void; set: (p: Partial<State>) => void;
  jump: (stack: ScreenId[], sheet?: SheetId, extra?: Partial<State>) => void; reset: () => void;
  cycle: () => void; order: () => void; keep: (s: 'credit' | 'congrats') => void; undo: () => void; sendNext: () => void;
};
const C = createContext<Ctx | null>(null);
export function ProtoProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initialState);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const set = useCallback((p: Partial<State>) => setS(o => ({ ...o, ...p })), []);
  const toastMsg = useCallback((m: string) => {
    setS(o => ({ ...o, toast: m })); clearTimeout(timer.current);
    timer.current = setTimeout(() => setS(o => ({ ...o, toast: null })), 3200);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const closeSheet = useCallback(() => set({ sheet: null }), [set]);
  const value: Ctx = {
    ...s, screen: s.stack.at(-1) ?? 'listing', set, toastMsg, closeSheet,
    go: screen => setS(o => ({ ...o, stack: [...o.stack, screen], sheet: null })),
    back: () => setS(o => ({ ...o, stack: o.stack.length > 1 ? o.stack.slice(0, -1) : o.stack, sheet: null })),
    openSheet: sheet => set({ sheet }),
    jump: (stack, sheet = null, extra = {}) => setS({ ...initialState, stack, sheet, ...extra }),
    reset: () => { clearTimeout(timer.current); setS(initialState); },
    cycle: () => setS(o => ({ ...o, queue: cycleFirst(o.queue) })),
    order: () => setS(o => {
      const sentIds = shippedAtCheckout(o.queue, o.plan, o.flags.soonWedding, o.flags.lowStock);
      const currentId = o.queue[0] ?? 'd1';
      return { ...o, ordered: true, plan: o.flags.soonWedding ? 'all' : o.plan, sentIds, currentId,
        nextId: remainingDresses(o.queue, sentIds)[0] ?? o.queue[1] ?? 'd2', sheet: null, stack: ['listing', 'order'] };
    }),
    keep: screen => setS(o => ({ ...o, keptAt: Date.now(), sheet: null, stack: [...o.stack, screen] })),
    undo: () => { if (canUndo(s.keptAt, Date.now())) { set({ keptAt: null }); toastMsg(UNDO_MESSAGE); } },
    sendNext: () => setS(o => {
      const sentIds = [...new Set([...o.sentIds, o.nextId])];
      return { ...o, previousId: o.currentId, currentId: o.nextId, sentIds,
        nextId: remainingDresses(o.queue, sentIds)[0] ?? o.nextId, stack: [...o.stack, 'sent'], sheet: null };
    }),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
export function useProto() { const value = useContext(C); if (!value) throw new Error('useProto outside provider'); return value; }
