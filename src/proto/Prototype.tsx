import { ProtoProvider, useProto, noFlags, type ScreenId, type SheetId, type Flags } from './store';
import { Button, HomeIndicator, StatusBar, Toast } from './ui';
import { Arrived, Bag, Congrats, Credit, Fit, Listing, NextDress, Notification, Order, Pdp, Sent } from './screens';
import { DateSheet, DecideSheet, HowSheet, KeepSheet, WhySheet } from './sheets';
const SCREENS: Record<ScreenId,()=>React.JSX.Element> = {listing:Listing,pdp:Pdp,bag:Bag,order:Order,notification:Notification,arrived:Arrived,fit:Fit,credit:Credit,congrats:Congrats,next:NextDress,sent:Sent};
const STEPS: {label:string;screen:ScreenId;sheet?:SheetId}[] = [
  {label:'Browse',screen:'listing'}, {label:'Product page',screen:'pdp'}, {label:'Bag',screen:'bag'},
  {label:'Checkout',screen:'bag',sheet:'decide'}, {label:'Order status',screen:'order'}, {label:'Lock-screen notification',screen:'notification'},
  {label:'Is it the one?',screen:'arrived'}, {label:'Keep-this-dress confirmation',screen:'arrived',sheet:'keep'},
  {label:"It's the one",screen:'congrats'}, {label:'Fix the fit',screen:'fit'}, {label:'Credit added',screen:'credit'},
  {label:'Which dress next?',screen:'next'}, {label:'Next dress sent',screen:'sent'},
];
const CASES: {label:string;screen:ScreenId;sheet?:SheetId;flags?:Partial<Flags>;plan?:'all'}[] = [
  {label:'Wedding in under 4 weeks',screen:'bag',sheet:'decide',flags:{soonWedding:true}},
  {label:"Size can't be kept",screen:'bag',sheet:'decide',flags:{lowStock:true}},
  {label:'No partner tailor nearby',screen:'fit',flags:{noTailor:true}},
  {label:'She chooses all 3 now',screen:'bag',sheet:'decide',plan:'all'},
];
function Presenter() {
  const {jump,reset,screen,sheet,flags,plan}=useProto();
  const preview = (s:ScreenId,sh:SheetId=null,extra={}) => jump(s==='listing'?['listing']:['listing',s],sh,{
    ordered:!['listing','pdp','bag'].includes(s),sentIds:s==='sent'?['d1','d2']:['d1'],
    currentId:s==='sent'?'d2':'d1',keptAt:['credit','congrats'].includes(s)?Date.now():null,...extra,
  });
  return <aside className="w-[300px] shrink-0 max-[759px]:hidden"><h1 className="text-[28px] font-bold">Hold &amp; Fit</h1><p className="mt-2 text-[14px] leading-5 text-ink-2">Lets brides keep their size in up to three wedding dresses and try them one at a time, instead of ordering and returning them all.</p><h2 className="micro mt-6 text-ink-3">Main path</h2><ol className="mt-2">{STEPS.map((s,i)=>{const on=screen===s.screen&&sheet===(s.sheet??null)&&!Object.values(flags).some(Boolean)&&plan==='hold';return <li key={s.label}><Button onClick={()=>preview(s.screen,s.sheet??null)} className={`flex min-h-9 w-full items-center gap-3 px-2 text-left text-[14px] hover:bg-background ${on?'bg-background font-semibold':''}`}><span className="w-5 text-ink-3 tnum">{i+1}</span>{s.label}</Button></li>;})}</ol><h2 className="micro mt-6 text-ink-3">Other cases</h2><ul className="mt-2">{CASES.map(c=><li key={c.label}><Button onClick={()=>preview(c.screen,c.sheet??null,{flags:{...noFlags,...c.flags},plan:c.plan??'hold'})} className="flex min-h-9 w-full items-center px-2 text-left text-[14px] hover:bg-background">{c.label}</Button></li>)}</ul><Button variant="outline" onClick={reset} className="mt-6 h-11">Reset demo</Button></aside>;
}
function Phone() { const {screen,sheet}=useProto();const S=SCREENS[screen];return <div className="device"><div className={`screen ${screen==='notification'?'notification-screen':''}`}><StatusBar/><main className="flex min-h-0 flex-1 flex-col" aria-label="Wedding dresses prototype"><S key={screen}/></main><HomeIndicator/>{sheet==='why'&&<WhySheet/>}{sheet==='how'&&<HowSheet/>}{sheet==='decide'&&<DecideSheet/>}{sheet==='keep'&&<KeepSheet/>}{sheet==='date'&&<DateSheet/>}<Toast/></div></div>; }
export function Prototype() {return <ProtoProvider><div className="flex min-h-screen items-start justify-center gap-16 px-8 py-10"><Presenter/><div className="flex flex-col items-center"><Phone/><p className="mt-4 max-w-[414px] text-center text-[12px] text-ink-3 max-[759px]:hidden">Concept prototype for an HBS exercise. Not affiliated with or endorsed by ASOS. Photos: Unsplash.</p></div></div></ProtoProvider>;}
