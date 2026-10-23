import { useEffect, useRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { ChevronLeft, Heart, Home, Search, ShoppingBag, User } from 'lucide-react';
import { useProto, type ScreenId } from './store';
export const SW = 1.5;
export function Button({ variant = 'plain', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'plain' | 'primary' | 'outline' }) {
  return <button {...props} className={`${variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'min-h-11'} ${className}`} />;
}
export function StatusBar() {
  return <div className="relative flex h-[54px] shrink-0 items-center justify-between px-8 max-[759px]:hidden" aria-hidden>
    <span className="text-[17px] font-semibold tnum">9:41</span>
    <div className="absolute left-1/2 top-[11px] h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-ink" />
    <div className="flex items-center gap-1.5"><div className="flex items-end gap-[2px]">{[5,7,9,11].map(h => <span key={h} className="w-[3px] rounded-[1px] bg-ink" style={{height:h}} />)}</div><div className="ml-1 flex h-[12px] w-[24px] items-center rounded-[3px] border border-ink p-[1.5px]"><div className="h-full w-full rounded-[1.5px] bg-ink" /></div></div>
  </div>;
}
export function HomeIndicator() { return <div className="flex h-[30px] shrink-0 items-center justify-center max-[759px]:hidden" aria-hidden><div className="h-[5px] w-[134px] rounded-full bg-ink" /></div>; }
export function Header({ title, right, wordmark }: { title?: string; right?: ReactNode; wordmark?: boolean }) {
  const { back, stack } = useProto();
  return <header className="grid h-[52px] shrink-0 grid-cols-[52px_minmax(0,1fr)_52px] items-center border-b border-line">
    {stack.length > 1 ? <Button onClick={back} aria-label="Back" className="flex h-11 w-11 items-center justify-center pl-2"><ChevronLeft strokeWidth={SW} size={26}/></Button> : <span/>}
    {wordmark ? <span className="text-center text-[26px] font-extrabold lowercase leading-none">asos</span> : <h1 className="truncate text-center text-[17px] font-semibold">{title}</h1>}
    <div className="justify-self-end pr-2">{right}</div>
  </header>;
}
const TABS: {label:string;icon:typeof Home;to:ScreenId}[] = [{label:'Home',icon:Home,to:'listing'},{label:'Search',icon:Search,to:'listing'},{label:'Saved',icon:Heart,to:'listing'},{label:'Bag',icon:ShoppingBag,to:'bag'},{label:'Account',icon:User,to:'order'}];
export function TabBar({ active }: { active: string }) {
  const { go, set, ordered, toastMsg } = useProto();
  return <nav aria-label="Main" className="grid h-[56px] shrink-0 grid-cols-5 border-t border-line bg-background">{TABS.map(({label,icon:Icon,to}) => <Button key={label} aria-current={label === active ? 'page':undefined} aria-label={label === 'Bag' && !ordered ? 'Bag, 3 items':label}
    onClick={() => { if(label === 'Search') toastMsg('Search wedding dresses'); else if(label === 'Saved') { set({pdpId:'d1'}); go('listing'); } else go(to); }}
    className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${label === active ? 'text-ink':'text-ink-3'}`}>
    <span className="relative"><Icon size={22} strokeWidth={label === active ? 2 : SW} fill={label === active && label !== 'Search' ? 'currentColor':'none'}/>{label === 'Bag' && !ordered && <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-background tnum">3</span>}</span>{label}
  </Button>)}</nav>;
}
export function Screen({ header, children, footer, tab }: {header:ReactNode; children:ReactNode; footer?:ReactNode;tab?:string}) {
  return <>{header}<div className="min-h-0 flex-1 overflow-y-auto">{children}</div>{footer && <div className="shrink-0 border-t border-line bg-background px-4 py-3">{footer}</div>}{tab && <TabBar active={tab}/>}</>;
}
export function Photo({ src, alt, className = '' }: {src:string;alt:string;className?:string}) { return <div className={`aspect-[3/4] overflow-hidden bg-sunken ${className}`}><img src={src} alt={alt} className="size-full object-cover" loading="lazy"/></div>; }
export function Sheet({ label, children, footer, tall }: {label:string;children:ReactNode;footer?:ReactNode;tall?:boolean}) {
  const { closeSheet } = useProto(); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null; ref.current?.focus();
    const onKey = (e:KeyboardEvent) => {
      if(e.key === 'Escape') closeSheet();
      if(e.key !== 'Tab') return;
      const nodes = ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, [tabindex="0"]');
      if(!nodes?.length) return; const first = nodes[0]; const last = nodes[nodes.length-1];
      if(e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
      else if(!e.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { e.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown',onKey); return () => { window.removeEventListener('keydown',onKey); prev?.focus(); };
  }, [closeSheet]);
  return <div className="absolute inset-0 z-40 flex flex-col justify-end"><Button aria-label="Close" tabIndex={-1} onClick={closeSheet} className="anim-scrim absolute inset-0 bg-ink/40"/>
    <div ref={ref} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} className={`anim-sheet sheet-shadow relative flex flex-col rounded-t-[14px] bg-background outline-none ${tall?'max-h-[94%]':'max-h-[85%]'}`}>
      <div className="flex justify-center pb-1 pt-2.5" aria-hidden><div className="h-[5px] w-9 rounded-full bg-line"/></div><div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      {footer && <div className="shrink-0 border-t border-line px-4 pb-5 pt-3">{footer}</div>}<div className="h-[18px] max-[759px]:hidden"/>
    </div></div>;
}
export function Toast() { const {toast} = useProto(); return <div role="status" aria-live="polite" className="pointer-events-none absolute inset-x-4 bottom-[100px] z-50 flex justify-center">{toast && <div className="anim-scrim bg-ink px-4 py-3 text-[14px] text-background">{toast}</div>}</div>; }
export function Recommended() { return <span className="micro inline-block bg-go px-2 py-1 text-background">Recommended</span>; }
export function TextLink({ children, onClick, className = '' }: {children:ReactNode;onClick:()=>void;className?:string}) { return <Button onClick={onClick} className={`text-[14px] underline underline-offset-2 ${className}`}>{children}</Button>; }
export function RadioDot({ checked }: {checked:boolean}) { return <span aria-hidden className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border ${checked?'border-ink bg-ink':'border-line'}`}>{checked && <span className="h-2 w-2 rounded-full bg-background"/>}</span>; }
export function Success() { return <span className="anim-pop flex h-14 w-14 items-center justify-center rounded-full bg-go text-background" aria-hidden><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="m5 14 6 6L23 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>; }
