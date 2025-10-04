import React,{useEffect,useMemo,useState}from"react";
const uid=()=>Math.random().toString(36).slice(2,10);
const pad=n=>n<10?`0${n}`:`${n}`;
const sd=(d,fb)=>{let x;if(d instanceof Date)x=new Date(d.getTime());else if(typeof d=="number"&&Number.isFinite(d))x=new Date(d);else if(typeof d=="string"){const s=d.trim();x=/^\d+$/.test(s)?new Date(parseInt(s,10)):new Date(s||Date.now())}else x=new Date(d??Date.now());if(isNaN(x.getTime()))x=fb instanceof Date?new Date(fb.getTime()):new Date();return x};
const dtl=(d=new Date())=>{const x=sd(d);return`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`};
const pdt=v=>v?new Date(v):new Date();
const atHM=(d,h=10,m=0)=>{const x=sd(d);if(isNaN(x.getTime())){const y=new Date();y.setHours(h,m,0,0);return y}x.setHours(h,m,0,0);return x};
const steps3=i=>{const b=sd(i);const t=b.getTime();const s1=atHM(new Date(t+86400000),10,0);const s2=atHM(new Date(s1.getTime()+3*86400000),10,0);const s3=atHM(new Date(s2.getTime()+5*86400000),10,0);return[s1,s2,s3]};
const escCSV=s=>{if(s==null)return"";const v=String(s);return/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
const KEY="fu_v12";
const RESP=["Timing Issue","Fees Issue","Distance Issue","Want Online Batch","Looking for Personal coach at office","Looking for personal coach at home","Looking for Afternoon Batch","Looking for Basic English Batch","Out of Surat","Shift work issue","Wrong number","Other"];
const SRC=["Social Media","Reference","Website"];
const YESNO=["Yes","No"];
const gDate=date=>{const d=sd(date,new Date(Date.now()+3600000));return`${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`};
const gLink=({title,details,start,end,location=""})=>{const base="https://calendar.google.com/calendar/render?action=TEMPLATE";const dates=`${gDate(start)}/${gDate(end)}`;const q=new URLSearchParams({text:title,details,dates,location}).toString();return`${base}&${q}`};
const icsEsc=s=>String(s||"").replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
const buildICS=events=>{const now=new Date();const a=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//FU//EN","CALSCALE:GREGORIAN"];for(const ev of events){a.push("BEGIN:VEVENT",`UID:${ev.uid}`,`DTSTAMP:${gDate(now)}`,`DTSTART:${gDate(ev.start)}`,`DTEND:${gDate(ev.end)}`,`SUMMARY:${icsEsc(ev.title)}`,`DESCRIPTION:${icsEsc(ev.details)}`,"END:VEVENT")}a.push("END:VCALENDAR");return a.join("\r\n")};
const dl=(name,content,mime)=>{try{const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);return true}catch{return false}};
const lg=k=>{try{return typeof window!="undefined"&&window.localStorage?window.localStorage.getItem(k):null}catch{return null}};
const ls=(k,v)=>{try{if(typeof window!="undefined"&&window.localStorage){window.localStorage.setItem(k,v);return true}return false}catch{return false}};
const lr=k=>{try{if(typeof window!="undefined"&&window.localStorage)window.localStorage.removeItem(k)}catch{}};
const defEmp={id:"self",name:"Me",role:"Senior",phone:"",email:"",passwordHash:null};
const load=()=>{try{const raw=lg(KEY);if(!raw)return{records:[],employees:[defEmp],auth:null};const p=JSON.parse(raw);const emps=(Array.isArray(p.employees)&&p.employees.length?p.employees:[defEmp]).map(e=>({role:"Senior",phone:"",email:"",passwordHash:null,...e}));const byName=Object.fromEntries(emps.map(e=>[e.name,e]));const records=(Array.isArray(p.records)?p.records:[]).map(r=>{let rec={...r};if(!(rec.assignedToId&&rec.assignedToName)){const m=rec.assignedTo&&byName[rec.assignedTo];rec=m?{...rec,assignedToId:m.id,assignedToName:m.name}:{...rec,assignedToId:"self",assignedToName:"Me"}}if(!("status"in rec))rec.status="open";if(rec.status==="closed"&&!rec.result)rec.result="lost";return rec});return{records,employees:emps,auth:p.auth||null}}catch{return{records:[],employees:[defEmp],auth:null}}};
const save=d=>{try{ls(KEY,JSON.stringify(d))}catch{}};
const cls={btn:"px-3 py-2 rounded-xl border text-sm",btnW:"bg-white text-slate-700 border-slate-200 hover:bg-slate-50",btnP:"bg-indigo-600 text-white hover:bg-indigo-700",card:"bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-6",input:"w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",badge:"inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700"};
const Badge=({children,className=""})=>(<span className={`${cls.badge} ${className}`}>{children}</span>);
const Pill=({active,onClick,children})=>(<button onClick={onClick} className={`${cls.btn} ${active?"bg-indigo-600 text-white border-indigo-600":"bg-white hover:bg-slate-50 border-slate-300 text-slate-700"}`}>{children}</button>);
const Modal=({open,onClose,children})=>open?(<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-8" onClick={onClose}><div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl sm:shadow-2xl max-h-[95vh] overflow-auto" onClick={e=>e.stopPropagation()}>{children}</div></div>):null;
const TextInput=({label,...props})=>(<label className="block"><span className="block text-xs text-slate-600 mb-1">{label}</span><input className={cls.input} {...props}/></label>);
const Select=({label,children,...props})=>(<label className="block"><span className="block text-xs text-slate-600 mb-1">{label}</span><select className={cls.input} {...props}>{children}</select></label>);
const TextArea=({label,...props})=>(<label className="block"><span className="block text-xs text-slate-600 mb-1">{label}</span><textarea className={cls.input} rows={4} {...props}/></label>);
const Section=({title,right,children})=>(<div className={cls.card}><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-slate-900">{title}</h3>{right}</div>{children}</div>);
function EmployeesTable({employees,onUpdate,onRemove}){return(<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-slate-600"><th className="py-2 pr-2">Name</th><th className="py-2 pr-2">Role</th><th className="py-2 pr-2">Mobile</th><th className="py-2 pr-2">Email</th><th className="py-2 pr-2">Password</th><th className="py-2 pr-2">Actions</th></tr></thead><tbody className="divide-y">{employees.map(e=>(<tr key={e.id} className="hover:bg-slate-50"><td className="py-2 pr-2"><input className="border border-slate-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" value={e.name} onChange={ev=>onUpdate(e.id,{name:ev.target.value})}/></td><td className="py-2 pr-2"><select className="border border-slate-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" value={e.role||"Junior"} onChange={ev=>onUpdate(e.id,{role:ev.target.value})}>{["Senior","Junior"].map(r=>(<option key={r} value={r}>{r}</option>))}</select></td><td className="py-2 pr-2"><input className="border border-slate-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" value={e.phone||""} onChange={ev=>onUpdate(e.id,{phone:ev.target.value})}/></td><td className="py-2 pr-2"><input className="border border-slate-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" value={e.email||""} onChange={ev=>onUpdate(e.id,{email:ev.target.value})}/></td><td className="py-2 pr-2"><div className="flex gap-2 items-center"><input type="password" className="border border-slate-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={e.passwordHash?"••••••":"set"} onChange={ev=>onUpdate(e.id,{passwordHash:btoa(unescape(encodeURIComponent(ev.target.value)))})}/><button onClick={()=>onUpdate(e.id,{passwordHash:null})} className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50">Clear</button></div></td><td className="py-2 pr-2"><button onClick={()=>onRemove(e.id)} className="px-3 py-1.5 rounded border border-red-200 bg-red-50 text-xs text-red-700 hover:bg-red-100">Delete</button></td></tr>))}</tbody></table></div>)}
function Login({onLogin,onCreate,hasAdmin}){const[email,setEmail]=useState("");const[password,setPassword]=useState("");return(<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4"><div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl"><h1 className="text-xl font-bold mb-1 text-slate-900">{hasAdmin?"Login":"Create Admin"}</h1><p className="text-xs text-slate-500 mb-4">{hasAdmin?"Enter your credentials to continue.":"Set admin email & password for this device."}</p><div className="space-y-3"><TextInput label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/><TextInput label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>{hasAdmin?(<button onClick={()=>onLogin(email,password)} className={`w/full py-2 rounded-xl ${cls.btnP} shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}>Login</button>):(<button onClick={()=>onCreate(email,password)} className={`w/full py-2 rounded-xl ${cls.btnP} shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}>Create Admin</button>)}</div></div></div>)}
const matches=(r,f)=>{const lc=s=>(""+(s??"")).toLowerCase();if(f.name&&!lc(r.name).includes(lc(f.name)))return false;if(f.phone&&!lc(r.phone).includes(lc(f.phone)))return false;if(f.email&&!lc(r.email).includes(lc(f.email)))return false;if(f.area&&!lc(r.area).includes(lc(f.area)))return false;if(f.city&&!lc(r.city).includes(lc(f.city)))return false;if(f.source&&r.source!==f.source)return false;if(f.assignedToId&&r.assignedToId!==f.assignedToId)return false;if(f.clientVisited&&r.clientVisited!==f.clientVisited)return false;if(f.response&&!(r.followups||[]).some(x=>x.response===f.response))return false;return true};
const toCSV=rows=>{const headers=["id","name","phone","email","area","city","source","assignedToName","assignedToId","clientVisited","f1","f1Response","f1Comment","f2","f2Response","f2Comment","f3","f3Response","f3Comment","status","result","resultAt","createdAt","updatedAt"];const body=rows.map(r=>{const f1=r.followups?.find(x=>x.step===1)||{};const f2=r.followups?.find(x=>x.step===2)||{};const f3=r.followups?.find(x=>x.step===3)||{};return[r.id,r.name,r.phone,r.email,r.area,r.city,r.source,r.assignedToName,r.assignedToId,r.clientVisited,f1.dueAt,f1.response,f1.comment,f2.dueAt,f2.response,f2.comment,f3.dueAt,f3.response,f3.comment,r.status||"open",r.result||"",r.resultAt||"",r.createdAt,r.updatedAt].map(escCSV).join(",")}).join("\n");return headers.join(",")+"\n"+body};
export default function App(){
  const[data,setData]=useState(()=>load());
  const[tab,setTab]=useState("followups");
  const[ftab,setFTab]=useState("today");
  const[q,setQ]=useState("");
  const[showForm,setShowForm]=useState(false);
  const[editing,setEditing]=useState(null);
  const[showEmp,setShowEmp]=useState(false);
  const[empDraft,setEmpDraft]=useState({name:"",role:"Junior",phone:"",email:"",password:""});
  const[filters,setFilters]=useState({name:"",phone:"",email:"",area:"",city:"",source:"",assignedToId:"",clientVisited:"",response:""});
  useEffect(()=>save(data),[data]);
  const hasAdmin=!!(data.auth&&data.auth.email&&data.auth.hash);
  const session0=(()=>{try{return JSON.parse(lg("_fu_session")||"null")}catch{return null}})();
  const[session,setSession]=useState(session0);
  const hash=s=>btoa(unescape(encodeURIComponent(s)));
  const login=(email,pw)=>{if(!email||!pw)return alert("Enter email & password");if(data.auth&&email.trim()===data.auth.email&&hash(pw)===data.auth.hash){const s={type:"admin",email:email.trim()};const ok=ls("_fu_session",JSON.stringify(s));setSession(s);if(!ok)alert("Storage is disabled; tab-only login.");return}const emp=(data.employees||[]).find(e=>e.email&&e.email.toLowerCase()===email.toLowerCase());if(emp&&emp.passwordHash&&hash(pw)===emp.passwordHash){const s={type:"employee",empId:emp.id,name:emp.name,role:emp.role};const ok=ls("_fu_session",JSON.stringify(s));setSession(s);if(!ok)alert("Storage is disabled; tab-only login.");return}alert("Invalid credentials")};
  const createAdmin=(email,pw)=>{const em=(email||"").trim();if(!em||!pw)return alert("Enter email & password");if(em.indexOf('@')<1||em.indexOf('.')===-1)return alert("Enter a valid email");setData(d=>({...d,auth:{email:em,hash:hash(pw),role:"admin"}}));const s={type:"admin",email:em};const ok=ls("_fu_session",JSON.stringify(s));setSession(s);if(!ok)alert("Storage is disabled; admin won't persist after refresh")};
  const logout=()=>{lr("_fu_session");setSession(null)};
  const isAdmin=session?.type==="admin";
  const addEmp=e=>setData(d=>({...d,employees:[{...e,id:uid()},...d.employees]}));
  const updEmp=(id,p)=>setData(d=>({...d,employees:d.employees.map(x=>x.id===id?{...x,...p}:x)}));
  const delEmp=id=>setData(d=>({...d,employees:d.employees.filter(x=>x.id!==id)}));
  const all=useMemo(()=>{if(!session)return[];return session.type==="employee"?data.records.filter(r=>r.assignedToId===session.empId):data.records},[data.records,session]);
  const sFilter=list=>{let out=[...list];if(q.trim()){const s=q.toLowerCase();out=out.filter(r=>[r.name,r.phone,r.email,r.area,r.city,r.source,(r.followups||[]).map(f=>f.comment).join(" ")].some(v=>String(v||"").toLowerCase().includes(s)))}return out.filter(r=>matches(r,filters))};
  const nextDue=(f=[])=>{const p=f.filter(x=>!x.done).sort((a,b)=>sd(a.dueAt).getTime()-sd(b.dueAt).getTime());return p.length?dtl(p[0].dueAt):""};
  const fList=useMemo(()=>{const S=new Date();S.setHours(0,0,0,0);const E=new Date();E.setHours(23,59,59,999);const W=new Date();const day=W.getDay();W.setDate(W.getDate()+(7-day));W.setHours(23,59,59,999);let list=all.filter(r=>r.status!=="closed").map(r=>({...r,nextDueAt:nextDue(r.followups)}));if(ftab==="overdue")list=list.filter(r=>r.nextDueAt&&sd(r.nextDueAt)<S);else if(ftab==="today")list=list.filter(r=>r.nextDueAt&&sd(r.nextDueAt)>=S&&sd(r.nextDueAt)<=E);else if(ftab==="week")list=list.filter(r=>r.nextDueAt&&sd(r.nextDueAt)>E&&sd(r.nextDueAt)<=W);list=sFilter(list);list.sort((a,b)=>{const ad=a.nextDueAt?sd(a.nextDueAt).getTime():Infinity;const bd=b.nextDueAt?sd(b.nextDueAt).getTime():Infinity;return ad-bd});return list},[all,ftab,q,filters]);
  const resList=useMemo(()=>{let list=all.filter(r=>r.status==="closed");list=sFilter(list);list.sort((a,b)=>sd(b.resultAt||0).getTime()-sd(a.resultAt||0).getTime());return list},[all,q,filters]);
  const[toasts,setToasts]=useState([]);
  const toast=m=>{const t={id:uid(),m};setToasts(x=>[...x,t]);setTimeout(()=>setToasts(x=>x.filter(y=>y.id!==t.id)),2500)};
  const [form,setForm]=useState({name:"",phone:"",email:"",area:"",city:"",source:SRC[0],assignedToId:(load().employees?.[0]?.id)||"self",assignedToName:(load().employees?.[0]?.name)||"Me",clientVisited:"No",followups:[],createdAt:new Date().toISOString(),status:"open"});
  const openAdd=()=>{const[s1,s2,s3]=steps3(new Date());const e0=data.employees?.[0]||defEmp;setForm({name:"",phone:"",email:"",area:"",city:"",source:SRC[0],assignedToId:e0.id,assignedToName:e0.name,clientVisited:"No",followups:[s1,s2,s3].map((d,i)=>({step:i+1,dueAt:d.toISOString(),comment:"",response:RESP[0],done:false})),createdAt:new Date().toISOString(),status:"open"});setEditing(null);setShowForm(true)};
  const openEdit=r=>{setForm({...r});setEditing(r.id);setShowForm(true)};
  const submit=e=>{e&&e.preventDefault&&e.preventDefault();const blank=![form.name,form.phone,form.email,form.area,form.city].some(v=>String(v||"").trim());if(!editing&&blank){alert("Please enter the data");return}const cleaned={...form,followups:(form.followups||[]).map(f=>({...f,dueAt:sd(f.dueAt).toISOString()}))};const emp=data.employees.find(x=>x.id===cleaned.assignedToId);cleaned.assignedToName=emp?.name||cleaned.assignedToName||"";if(editing){setData(d=>({...d,records:d.records.map(r=>r.id===editing?{...cleaned,id:editing,updatedAt:new Date().toISOString()}:r)}));toast("Updated")}else{const rec={...cleaned,id:uid(),updatedAt:new Date().toISOString()};setData(d=>({...d,records:[rec,...d.records]}));toast("Added")}setShowForm(false)};
  const quick=(rid,step,patch)=>setData(d=>({...d,records:d.records.map(r=>r.id===rid?{...r,followups:r.followups.map(f=>f.step===step?{...f,...(Object.prototype.hasOwnProperty.call(patch,"dueAt")?{dueAt:sd(patch.dueAt).toISOString()}:{}),...patch}:f),updatedAt:new Date().toISOString()}:r)}));
  const closeRec=(id,kind)=>setData(d=>({...d,records:d.records.map(r=>r.id===id?{...r,status:"closed",result:kind,resultAt:new Date().toISOString(),updatedAt:new Date().toISOString()}:r)}));
  const delRec=id=>{if(!confirm("Delete this record?"))return;setData(d=>({...d,records:d.records.filter(r=>r.id!==id)}));toast("Deleted")};
  const counts=useMemo(()=>{const S=new Date();S.setHours(0,0,0,0);const E=new Date();E.setHours(23,59,59,999);const W=new Date();const day=W.getDay();W.setDate(W.getDate()+(7-day));W.setHours(23,59,59,999);let overdue=0,today=0,week=0;data.records.forEach(r=>{if(r.status==="closed")return;const n=nextDue(r.followups);if(!n)return;const d=sd(n);if(d<S)overdue++;else if(d<=E)today++;else if(d<=W)week++});return{overdue,today,week,all:data.records.filter(r=>r.status!=="closed").length}},[data.records]);
  const openGCal=r=>{(r.followups||[]).forEach(f=>{if(f.done)return;const s=sd(f.dueAt);const e=new Date(s.getTime()+1800000);const url=gLink({title:`Follow-up ${f.step}: ${r.name}`,details:`Phone: ${r.phone||""}\nEmail: ${r.email||""}\nArea: ${r.area||""}, ${r.city||""}\nSource: ${r.source||""}\nAssigned To: ${r.assignedToName||""}`,start:s,end:e});window.open(url,"_blank")})};
  const bulkICS=()=>{const pend=data.records.flatMap(r=>r.status!=="closed"?(r.followups||[]).filter(f=>!f.done).map(f=>({r,f})):[]);if(!pend.length)return alert("No pending follow-ups.");const events=pend.map(({r,f})=>({uid:`${r.id}-${f.step}@fu`,title:`Follow-up ${f.step}: ${r.name}`,details:`Phone: ${r.phone||""}\nEmail: ${r.email||""}\nArea: ${r.area||""}, ${r.city||""}\nSource: ${r.source||""}\nAssigned To: ${r.assignedToName||""}`,start:sd(f.dueAt),end:new Date(sd(f.dueAt).getTime()+1800000)}));const ics=buildICS(events);const ok=dl(`followups_${new Date().toISOString().slice(0,10)}.ics`,ics,"text/calendar;charset=utf-8");if(ok)toast("ICS downloaded")};
  const exportCSV=()=>{const csv=toCSV(data.records);const ok=dl(`followups_${new Date().toISOString().slice(0,10)}.csv`,csv,"text/csv;charset=utf-8");if(!ok){try{navigator.clipboard.writeText(csv);toast("CSV copied")}catch{alert("Could not download or copy CSV.")}}};
  const sheet=useMemo(()=>{let list=sFilter(all);list.sort((a,b)=>sd(b.createdAt||0).getTime()-sd(a.createdAt||0).getTime());return list},[all,q,filters]);
  const Sheet=()=> (<div className="overflow-auto"><table className="min-w-[1200px] w-full text-xs border border-slate-200 rounded-lg overflow-hidden"><thead className="sticky top-0 bg-white/90 backdrop-blur"><tr className="text-left text-slate-600">{["Name","Phone","Email","Area","City","Source","Assigned To","Visited","S1 Due","S1 Resp","S1 Done","S1 Comment","S2 Due","S2 Resp","S2 Done","S2 Comment","S3 Due","S3 Resp","S3 Done","S3 Comment","Status","Result","Inquiry At","Closed At"].map(h=>(<th key={h} className="px-2 py-2 border-b border-slate-200 whitespace-nowrap">{h}</th>))}</tr></thead><tbody>{sheet.map(r=>{const f1=r.followups?.find(x=>x.step===1)||{};const f2=r.followups?.find(x=>x.step===2)||{};const f3=r.followups?.find(x=>x.step===3)||{};const fmt=v=>v?sd(v).toLocaleString():"";return(<tr key={r.id} className="odd:bg-white even:bg-slate-50 hover:bg-indigo-50/40"><td className="px-2 py-2 border-b border-slate-200">{r.name}</td><td className="px-2 py-2 border-b border-slate-200">{r.phone}</td><td className="px-2 py-2 border-b border-slate-200">{r.email}</td><td className="px-2 py-2 border-b border-slate-200">{r.area}</td><td className="px-2 py-2 border-b border-slate-200">{r.city}</td><td className="px-2 py-2 border-b border-slate-200">{r.source}</td><td className="px-2 py-2 border-b border-slate-200">{r.assignedToName}</td><td className="px-2 py-2 border-b border-slate-200">{r.clientVisited}</td><td className="px-2 py-2 border-b border-slate-200">{fmt(f1.dueAt)}</td><td className="px-2 py-2 border-b border-slate-200">{f1.response}</td><td className="px-2 py-2 border-b border-slate-200">{f1.done?"Yes":"No"}</td><td className="px-2 py-2 border-b border-slate-200">{f1.comment}</td><td className="px-2 py-2 border-b border-slate-200">{fmt(f2.dueAt)}</td><td className="px-2 py-2 border-b border-slate-200">{f2.response}</td><td className="px-2 py-2 border-b border-slate-200">{f2.done?"Yes":"No"}</td><td className="px-2 py-2 border-b border-slate-200">{f2.comment}</td><td className="px-2 py-2 border-b border-slate-200">{fmt(f3.dueAt)}</td><td className="px-2 py-2 border-b border-slate-200">{f3.response}</td><td className="px-2 py-2 border-b border-slate-200">{f3.done?"Yes":"No"}</td><td className="px-2 py-2 border-b border-slate-200">{f3.comment}</td><td className="px-2 py-2 border-b border-slate-200">{r.status}</td><td className="px-2 py-2 border-b border-slate-200">{r.result||""}</td><td className="px-2 py-2 border-b border-slate-200">{fmt(r.createdAt)}</td><td className="px-2 py-2 border-b border-slate-200">{fmt(r.resultAt)}</td></tr>)})}{sheet.length===0&&(<tr><td className="px-2 py-6 text-center text-slate-500" colSpan={24}>No data</td></tr>)}</tbody></table></div>);
  return(
    session?
    (<div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white text-slate-800">
      <header className="sticky top-0 z-40 border-b border-transparent">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-tight">Follow-Up System</h1>
              <p className="text-xs text-white/90">{`Logged in as: ${isAdmin?`Admin (${session.email})`:`${session.name} • ${session.role}`}`} · Offline-first.</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin&&(<button onClick={()=>setTab("employees")} className={`${cls.btn} ${tab==="employees"?"bg-white/20 text-white border-white/25":cls.btnW}`}>Employees</button>)}
              <button onClick={()=>setTab("followups")} className={`${cls.btn} ${tab==="followups"?"bg-white/20 text-white border-white/25":cls.btnW}`}>Follow-ups</button>
              <button onClick={()=>setTab("leads")} className={`${cls.btn} ${tab==="leads"?"bg-white/20 text-white border-white/25":cls.btnW}`}>All Leads</button>
              <button onClick={()=>setTab("result")} className={`${cls.btn} ${tab==="result"?"bg-white/20 text-white border-white/25":cls.btnW}`}>Result</button>
              <button onClick={logout} className={`${cls.btn} ${cls.btnW}`}>Logout</button>
              <button onClick={openAdd} className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${cls.btnW}`}>+ Add Lead</button>
            </div>
          </div>
        </div>
      </header>
      {tab==="employees"? (
        <main className="max-w-6xl mx-auto p-4 space-y-4">
          <Section title="Employees" right={isAdmin&&<button onClick={()=>setShowEmp(true)} className={`${cls.btn} ${cls.btnW}`}>+ Add</button>}>
            <EmployeesTable employees={data.employees} onUpdate={updEmp} onRemove={delEmp}/>
          </Section>
          <Modal open={showEmp} onClose={()=>setShowEmp(false)}>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">Add Employee</h3><button onClick={()=>setShowEmp(false)} className="text-slate-500 hover:text-slate-700">✕</button></div>
              <TextInput label="Name" value={empDraft.name} onChange={e=>setEmpDraft({...empDraft,name:e.target.value})}/>
              <Select label="Role" value={empDraft.role} onChange={e=>setEmpDraft({...empDraft,role:e.target.value})}>{["Senior","Junior"].map(r=>(<option key={r} value={r}>{r}</option>))}</Select>
              <TextInput label="Mobile" value={empDraft.phone} onChange={e=>setEmpDraft({...empDraft,phone:e.target.value})}/>
              <TextInput label="Email (login)" type="email" value={empDraft.email} onChange={e=>setEmpDraft({...empDraft,email:e.target.value})}/>
              <TextInput label="Set Password" type="password" value={empDraft.password} onChange={e=>setEmpDraft({...empDraft,password:e.target.value})}/>
              <div className="text-right pt-2"><button onClick={()=>{if(!empDraft.name)return alert("Name required");addEmp({name:empDraft.name,role:empDraft.role,phone:empDraft.phone,email:empDraft.email,passwordHash:empDraft.password?btoa(unescape(encodeURIComponent(empDraft.password))):null});setEmpDraft({name:"",role:"Junior",phone:"",email:"",password:""});setShowEmp(false)}} className={`px-4 py-2 rounded-xl ${cls.btnP}`}>Add</button></div>
            </div>
          </Modal>
        </main>
      ) : tab==="result" ? (
        <main className="max-w-6xl mx-auto p-4 space-y-4">
          <Section title="Result" right={<span className="text-xs text-slate-500">Closed leads. Green = Win Close, Red = Close</span>}>
            <Filters filters={filters} setFilters={setFilters} emps={data.employees}/>
            <div className="divide-y mt-4">
              {resList.length===0&&<div className="py-10 text-center text-slate-500">No results yet.</div>}
              {resList.map(r=>(
                <div key={r.id} className={`py-4 pl-3 border-l-4 ${r.result==='win'?'border-green-500':'border-red-500'} bg-white rounded-lg my-2 shadow-sm`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold truncate mr-1 text-slate-900">{r.name||"(No name)"}</span>
                    <Badge className={r.result==='win'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}>{r.result==='win'?'Win Close':'Closed'}</Badge>
                    {r.assignedToName&&<Badge className="bg-blue-100 text-blue-800">{r.assignedToName}</Badge>}
                    <Badge>{r.source}</Badge>
                    <Badge>{r.city||"—"}</Badge>
                    <Badge>{r.clientVisited==='Yes'?"Visited":"Not Visited"}</Badge>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                    {r.phone&&<span>📞 {r.phone}</span>}
                    {r.email&&<span>✉️ {r.email}</span>}
                    {r.area&&<span>📍 {r.area}{r.city?`, ${r.city}`:''}</span>}
                    {r.resultAt&&<span>🗓️ {sd(r.resultAt).toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </main>
      ) : tab==="leads" ? (
        <main className="max-w-7xl mx-auto p-4 space-y-4">
          <Section title="All Leads (Sheet view)" right={<div className="flex gap-2"><button onClick={exportCSV} className={`${cls.btn} ${cls.btnW}`}>Export CSV</button><button onClick={bulkICS} className={`${cls.btn} ${cls.btnW}`}>Add Pending to Calendar</button></div>}>
            <Filters filters={filters} setFilters={setFilters} emps={data.employees}/>
            <div className="mt-4"><Sheet/></div>
          </Section>
        </main>
      ) : (
        <>
          <div className="max-w-6xl mx-auto px-4 pt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Pill active={ftab==="overdue"} onClick={()=>setFTab("overdue")}>
                Overdue ({counts.overdue})
              </Pill>
              <Pill active={ftab==="today"} onClick={()=>setFTab("today")}>Today ({counts.today})</Pill>
              <Pill active={ftab==="week"} onClick={()=>setFTab("week")}>This Week ({counts.week})</Pill>
              <Pill active={ftab==="all"} onClick={()=>setFTab("all")}>All ({counts.all})</Pill>
            </div>
            <div className="flex items-center gap-2">
              <input placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} className={`${cls.input} w-full sm:w-64`}/>
              <button onClick={exportCSV} className={`${cls.btn} ${cls.btnW}`}>Export CSV</button>
              <button onClick={bulkICS} className={`${cls.btn} ${cls.btnW}`}>Add Pending to Calendar</button>
            </div>
          </div>
          <main className="max-w-6xl mx-auto p-4 space-y-4">
            <Section title="Filters" right={<span className="text-xs text-slate-500">Combine any filters</span>}>
              <Filters filters={filters} setFilters={setFilters} emps={data.employees}/>
            </Section>
            <Section title="Follow-ups" right={<span className="text-xs text-slate-500">Mark a step Done or Close</span>}>
              <div className="divide-y">
                {fList.length===0&&<div className="py-10 text-center text-slate-500">No records yet.</div>}
                {fList.map(r=>(
                  <div key={r.id} className="py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate mr-1 text-slate-900">{r.name||"(No name)"}</span>
                      {r.assignedToName&&<Badge className="bg-blue-100 text-blue-800">{r.assignedToName}</Badge>}
                      <Badge>{r.source}</Badge>
                      <Badge>{r.city||"—"}</Badge>
                      <Badge>{r.clientVisited==="Yes"?"Visited":"Not Visited"}</Badge>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                      {r.phone&&<span>📞 {r.phone}</span>}
                      {r.email&&<span>✉️ {r.email}</span>}
                      {r.area&&<span>📍 {r.area}{r.city?`, ${r.city}`:""}</span>}
                    </div>
                    <div className="mt-3 grid sm:grid-cols-3 gap-3">
                      {(r.followups||[]).map(f=>(
                        <div key={f.step} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-slate-900">Step {f.step}</div>
                            <label className="text-xs flex items-center gap-1 text-slate-700"><input type="checkbox" checked={!!f.done} onChange={e=>quick(r.id,f.step,{done:e.target.checked})}/> Done</label>
                          </div>
                          <label className="block text-xs text-slate-500">Due</label>
                          <input type="datetime-local" value={dtl(f.dueAt)} onChange={e=>quick(r.id,f.step,{dueAt:pdt(e.target.value)})} className={cls.input}/>
                          <Select label="Response from client" value={f.response||RESP[0]} onChange={e=>quick(r.id,f.step,{response:e.target.value})}>{RESP.map(o=>(<option key={o} value={o}>{o}</option>))}</Select>
                          <TextArea label="Comments" value={f.comment||""} onChange={e=>quick(r.id,f.step,{comment:e.target.value})}/>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <button onClick={()=>openEdit(r)} className={`${cls.btn} ${cls.btnW}`}>Edit</button>
                      <button onClick={()=>delRec(r.id)} className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 hover:bg-red-100">Delete</button>
                      <button onClick={()=>openGCal(r)} className={`${cls.btn} ${cls.btnW}`}>Add to Google Calendar</button>
                      <button onClick={()=>{closeRec(r.id,"win");toast("Win Close")}} className="px-3 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 shadow-sm">Win Close</button>
                      <button onClick={()=>{closeRec(r.id,"lost");toast("Closed")}} className="px-3 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 shadow-sm">Close</button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <div className="text-center text-xs text-slate-500 py-6"><div className="max-w-3xl mx-auto"><p>Data is stored locally. Export CSV for backup.</p></div></div>
          </main>
        </>
      )}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">{toasts.map(t=>(<div key={t.id} className="bg-slate-900/95 text-white text-sm px-4 py-2 rounded-full shadow-2xl border border-slate-700/50">{t.m}</div>))}</div>
      <Modal open={showForm} onClose={()=>setShowForm(false)}>
        <form onSubmit={submit} className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">{editing?"Edit":"Add"} Lead</h3><button type="button" onClick={()=>setShowForm(false)} className="text-slate-500 hover:text-slate-700">✕</button></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <TextInput label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            <TextInput label="Email ID" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            <TextInput label="Area" value={form.area} onChange={e=>setForm({...form,area:e.target.value})}/>
            <TextInput label="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/>
            <Select label="Inquiry came from" value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>{SRC.map(s=>(<option key={s} value={s}>{s}</option>))}</Select>
            <Select label="Assign to" value={form.assignedToId||""} onChange={e=>{const emp=data.employees.find(x=>x.id===e.target.value);setForm({...form,assignedToId:e.target.value,assignedToName:emp?.name||""})}}>
              <option value="">— Select —</option>
              {data.employees.map(emp=>(<option key={emp.id} value={emp.id}>{emp.name} ({emp.role||"Role"})</option>))}
            </Select>
            <Select label="Client visited our office" value={form.clientVisited} onChange={e=>setForm({...form,clientVisited:e.target.value})}>{YESNO.map(v=>(<option key={v} value={v}>{v}</option>))}</Select>
            <TextInput label="Inquiry Date (auto)" value={sd(form.createdAt).toLocaleString()} readOnly/>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {(form.followups||[]).map((f,idx)=>(
              <div key={f.step} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="text-sm font-semibold mb-2 text-slate-900">Follow-up Step {f.step}</div>
                <label className="block text-xs text-slate-500">Due</label>
                <input type="datetime-local" value={dtl(f.dueAt)} onChange={e=>{const v=e.target.value;const copy=[...form.followups];copy[idx]={...copy[idx],dueAt:sd(v).toISOString()};setForm({...form,followups:copy})}} className={cls.input}/>
                <Select label="Response from client" value={f.response} onChange={e=>{const copy=[...form.followups];copy[idx]={...copy[idx],response:e.target.value};setForm({...form,followups:copy})}}>{RESP.map(o=>(<option key={o} value={o}>{o}</option>))}</Select>
                <TextArea label="Comments" value={f.comment} onChange={e=>{const copy=[...form.followups];copy[idx]={...copy[idx],comment:e.target.value};setForm({...form,followups:copy})}}/>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={()=>setShowForm(false)} className={`${cls.btn} ${cls.btnW}`}>Cancel</button>
            <button type="submit" className={`px-4 py-2 rounded-xl ${cls.btnP}`}>{editing?"Save Changes":"Create"}</button>
          </div>
        </form>
      </Modal>
    </div>)
    :
    (<Login hasAdmin={hasAdmin} onCreate={createAdmin} onLogin={login}/>)
  );
}
function Filters({filters,setFilters,emps}){const clear=()=>setFilters({name:"",phone:"",email:"",area:"",city:"",source:"",assignedToId:"",clientVisited:"",response:""});return(<div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3"><TextInput label="Name" value={filters.name} onChange={e=>setFilters({...filters,name:e.target.value})}/><TextInput label="Phone" value={filters.phone} onChange={e=>setFilters({...filters,phone:e.target.value})}/><TextInput label="Email" value={filters.email} onChange={e=>setFilters({...filters,email:e.target.value})}/><TextInput label="Area" value={filters.area} onChange={e=>setFilters({...filters,area:e.target.value})}/><TextInput label="City" value={filters.city} onChange={e=>setFilters({...filters,city:e.target.value})}/><Select label="Source" value={filters.source} onChange={e=>setFilters({...filters,source:e.target.value})}><option value="">Any</option>{SRC.map(s=>(<option key={s} value={s}>{s}</option>))}</Select><Select label="Assign To" value={filters.assignedToId} onChange={e=>setFilters({...filters,assignedToId:e.target.value})}><option value="">Any</option>{emps.map(emp=>(<option key={emp.id} value={emp.id}>{emp.name}</option>))}</Select><Select label="Client Visited" value={filters.clientVisited} onChange={e=>setFilters({...filters,clientVisited:e.target.value})}><option value="">Any</option>{YESNO.map(v=>(<option key={v} value={v}>{v}</option>))}</Select><Select label="Response (any step)" value={filters.response} onChange={e=>setFilters({...filters,response:e.target.value})}><option value="">Any</option>{RESP.map(v=>(<option key={v} value={v}>{v}</option>))}</Select><div className="sm:col-span-3 lg:col-span-4 text-right"><button onClick={clear} className={`${cls.btn} ${cls.btnW}`}>Clear Filters</button></div></div>)}
if(typeof window!=="undefined"){const t0=steps3("2025-02-01T06:00:00Z");console.assert(t0.length===3,"steps3 3");console.assert(dtl(t0[0]).includes("T"),"dtl T");console.assert(!isNaN(sd("bad").getTime())===true,"sd fallback");console.assert(!isNaN(atHM("",10,0).getTime())===true,"atHM ok");console.assert(Array.isArray(steps3(undefined))&&steps3(undefined).length===3,"steps3 undef");const csv=toCSV([{id:"1",name:"A",phone:"123",email:"a@x.com",area:"Ar",city:"Ci",source:"Website",assignedToName:"Me",assignedToId:"self",clientVisited:"No",followups:[{step:1,dueAt:new Date().toISOString(),response:"Timing Issue",comment:"",done:false},{step:2,dueAt:new Date().toISOString(),response:"Timing Issue",comment:"",done:false},{step:3,dueAt:new Date().toISOString(),response:"Timing Issue",comment:"",done:false}],status:"open",result:"",resultAt:"",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}]);console.assert(csv.split("\n").length>=2,"CSV rows");const link=gLink({title:"t",details:"d",start:new Date(),end:new Date(Date.now()+600000)});console.assert(link.includes("calendar.google.com"),"gLink");const ics=buildICS([{uid:"u1@fu",title:"t1",details:"d1",start:new Date(),end:new Date(Date.now()+600000)}]);console.assert(ics.includes("BEGIN:VEVENT"),"ICS");}
