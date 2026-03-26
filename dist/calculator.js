import{r as o,j as e,c as L}from"./client-DMp2t5-j.js";const b=[{id:"diagnostico",name:"Diagnóstico de manuscrito",base:19,unit:"por manuscrito",pagesIncluded:30,extraPageCost:.5,badge:"nuevo",tooltip:"Evaluación experta de tu manuscrito: calidad del texto, riesgo de desk-rejection, verificación de referencias y recomendación de revistas."},{id:"correccion",name:"Corrección y edición de estilo",base:3.5,unit:"por página",tooltip:"Corrección ortográfica, gramatical, de estilo académico y coherencia textual por experto + IA."},{id:"articulo",name:"Artículo científico (redacción asistida)",base:150,unit:"por artículo",pagesIncluded:25,extraPageCost:5,tooltip:"Redacción asistida con IA + revisión humana. Incluye estructura IMRyD, referencias y formato de revista."},{id:"capitulo",name:"Capítulo de libro académico",base:120,unit:"por capítulo",pagesIncluded:30,extraPageCost:3.5,tooltip:"Producción de capítulo académico con rigor científico, citas verificadas y formato editorial."},{id:"libro",name:"Libro académico completo (5 caps)",base:500,unit:"por libro",tooltip:"Producción integral de libro académico (5 capítulos). Pipeline EVOLUTION + revisión humana."},{id:"revision",name:"Revisión sistemática / metaanálisis",base:250,unit:"por manuscrito",pagesIncluded:40,extraPageCost:5,tooltip:"Revisión de literatura con protocolo PRISMA, búsqueda en bases indexadas, análisis y síntesis."},{id:"paquete",name:'Paquete "Paper a Publicación"',base:350,unit:"por manuscrito completo",pagesIncluded:30,extraPageCost:5,badge:"popular",tooltip:"Desde borrador hasta submission: redacción, formatting, cover letter y apoyo con reviewers."},{id:"traduccion",name:"Traducción académica español→inglés",base:5,unit:"por página",tooltip:"Traducción académica especializada por disciplina, no genérica. Incluye adaptación de estilo científico."}],P=[{id:"estandar",name:"Estándar",time:"10–15 días hábiles",label:"Sin recargo",mult:1},{id:"prioritario",name:"Prioritario",time:"5–7 días hábiles",label:"+25%",mult:1.25},{id:"urgente",name:"Urgente",time:"24–72 horas",label:"+50%",mult:1.5}];function w(r){return r.unit==="por página"}function k(r){return r.pagesIncluded!=null}function m(r){return r.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}const t={calculator:{fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",maxWidth:540,width:"100%",margin:"0 auto",background:"#ffffff",borderRadius:16,boxShadow:"0 4px 24px rgba(26, 35, 50, 0.10), 0 1px 4px rgba(26, 35, 50, 0.06)",overflow:"hidden",color:"#1f2937"},header:{background:"linear-gradient(135deg, #1a2332 0%, #243044 100%)",padding:"24px 28px",display:"flex",alignItems:"center",gap:12},headerIcon:{width:40,height:40,background:"rgba(13, 148, 136, 0.15)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},headerIconSvg:{width:22,height:22,color:"#0d9488"},headerTitle:{fontSize:"1.25rem",fontWeight:700,color:"#ffffff",margin:0,letterSpacing:"-0.01em"},headerSubtitle:{fontSize:"0.8rem",color:"rgba(255, 255, 255, 0.6)",margin:"2px 0 0"},body:{padding:"24px 28px 28px",display:"flex",flexDirection:"column",gap:24},section:{display:"flex",flexDirection:"column",gap:8},label:{fontSize:"0.75rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:"#6b7280"},stepNumber:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:"50%",background:"#0d9488",color:"#fff",fontSize:"0.65rem",fontWeight:700,marginRight:6,verticalAlign:"middle"},selectWrapper:{position:"relative"},select:{width:"100%",padding:"12px 40px 12px 14px",border:"1.5px solid #e5e7eb",borderRadius:10,fontSize:"0.9rem",fontFamily:"inherit",color:"#1f2937",background:"#fff",appearance:"none",WebkitAppearance:"none",MozAppearance:"none",cursor:"pointer",transition:"border-color 0.2s",outline:"none",boxSizing:"border-box"},selectArrow:{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#6b7280"},serviceInfo:{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#f8fafc",borderRadius:8,fontSize:"0.82rem",color:"#6b7280"},serviceInfoSvg:{flexShrink:0,color:"#0d9488"},tooltipTrigger:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:18,height:18,borderRadius:"50%",background:"#e5e7eb",color:"#6b7280",fontSize:"0.65rem",fontWeight:700,cursor:"help",border:"none",position:"relative",flexShrink:0,lineHeight:1},tooltipBox:{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",background:"#1a2332",color:"#fff",padding:"10px 14px",borderRadius:8,fontSize:"0.78rem",fontWeight:400,lineHeight:1.45,width:260,zIndex:50,pointerEvents:"none",boxShadow:"0 4px 12px rgba(0, 0, 0, 0.2)"},volumeInput:{display:"flex",alignItems:"center",gap:12},slider:{flex:1,WebkitAppearance:"none",appearance:"none",height:6,borderRadius:3,background:"#e5e7eb",outline:"none",cursor:"pointer"},numberInput:{width:72,padding:"8px 10px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:"0.9rem",fontFamily:"inherit",textAlign:"center",color:"#1f2937",outline:"none",transition:"border-color 0.2s"},volumeUnit:{fontSize:"0.8rem",color:"#6b7280",whiteSpace:"nowrap"},fixedPriceNote:{fontSize:"0.8rem",color:"#6b7280",padding:"10px 12px",background:"#f8fafc",borderRadius:8,lineHeight:1.5},fixedPriceNoteStrong:{color:"#1f2937",fontWeight:"bold"},urgencyGroup:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:8},urgencyPill:{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px 8px",border:"1.5px solid #e5e7eb",borderRadius:10,background:"#fff",cursor:"pointer",transition:"all 0.2s",textAlign:"center",fontFamily:"inherit"},urgencyPillActive:{borderColor:"#0d9488",background:"rgba(13, 148, 136, 0.06)",boxShadow:"0 0 0 3px rgba(13, 148, 136, 0.1)"},urgencyName:{fontSize:"0.82rem",fontWeight:600,color:"#1f2937"},urgencyNameActive:{color:"#0d9488"},urgencyTime:{fontSize:"0.7rem",color:"#6b7280"},urgencyBadge:{fontSize:"0.65rem",fontWeight:600,padding:"2px 6px",borderRadius:4,background:"#e5e7eb",color:"#6b7280"},urgencyBadgeActive:{background:"#0d9488",color:"#fff"},divider:{height:1,background:"#e5e7eb",margin:0,border:"none"},result:{display:"flex",flexDirection:"column",gap:12},resultRow:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.85rem"},resultLabel:{color:"#6b7280"},resultValue:{fontWeight:500,color:"#1f2937"},resultTotal:{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:16,background:"linear-gradient(135deg, #1a2332 0%, #243044 100%)",borderRadius:12},resultTotalLabel:{fontSize:"0.85rem",fontWeight:600,color:"rgba(255, 255, 255, 0.8)"},resultTotalValue:{fontSize:"1.75rem",fontWeight:700,color:"#ffffff",transition:"opacity 0.15s"},resultTotalCurrency:{fontSize:"1rem",fontWeight:500,marginRight:4,color:"rgba(255, 255, 255, 0.7)"},paymentInfo:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:"0.78rem",color:"#6b7280",padding:"8px 0 0"},paymentInfoSvg:{color:"#d4a853",flexShrink:0},cta:{display:"block",width:"100%",padding:"14px 24px",background:"#0d9488",color:"#fff",fontSize:"0.95rem",fontWeight:600,fontFamily:"inherit",border:"none",borderRadius:10,cursor:"pointer",textAlign:"center",textDecoration:"none",transition:"background 0.2s, transform 0.1s",boxSizing:"border-box"}},W=`
  .scripta-calc-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #0d9488;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(13, 148, 136, 0.3);
    transition: transform 0.15s;
  }
  .scripta-calc-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  .scripta-calc-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #0d9488;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(13, 148, 136, 0.3);
  }
  .scripta-calc-btn:hover {
    background: #0b7c72 !important;
  }
  .scripta-calc-btn:active {
    transform: scale(0.985) !important;
  }
  .scripta-calc-pill:hover {
    border-color: #0d9488 !important;
    background: rgba(13, 148, 136, 0.03) !important;
  }
  .scripta-calc-select:focus {
    border-color: #0d9488 !important;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1) !important;
  }
  .scripta-calc-number:focus {
    border-color: #0d9488 !important;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1) !important;
  }
  .scripta-calc-tooltip-box::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1a2332;
  }
  @media (max-width: 480px) {
    .scripta-calc-root {
      border-radius: 12px !important;
    }
    .scripta-calc-header {
      padding: 20px 20px !important;
    }
    .scripta-calc-body {
      padding: 20px 20px 24px !important;
    }
    .scripta-calc-header-title {
      font-size: 1.1rem !important;
    }
    .scripta-calc-urgency-group {
      grid-template-columns: 1fr !important;
      gap: 6px !important;
    }
    .scripta-calc-pill {
      flex-direction: row !important;
      justify-content: space-between !important;
      padding: 10px 14px !important;
    }
    .scripta-calc-total-value {
      font-size: 1.5rem !important;
    }
    .scripta-calc-tooltip-box {
      width: 220px !important;
      left: auto !important;
      right: -8px !important;
      transform: none !important;
    }
    .scripta-calc-tooltip-box::after {
      left: auto !important;
      right: 12px !important;
      transform: none !important;
    }
  }
`;function E(){return e.jsxs("svg",{style:t.headerIconSvg,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"4",y:"2",width:"16",height:"20",rx:"2"}),e.jsx("line",{x1:"8",y1:"6",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"10",x2:"8",y2:"10.01"}),e.jsx("line",{x1:"12",y1:"10",x2:"12",y2:"10.01"}),e.jsx("line",{x1:"16",y1:"10",x2:"16",y2:"10.01"}),e.jsx("line",{x1:"8",y1:"14",x2:"8",y2:"14.01"}),e.jsx("line",{x1:"12",y1:"14",x2:"12",y2:"14.01"}),e.jsx("line",{x1:"16",y1:"14",x2:"16",y2:"14.01"}),e.jsx("line",{x1:"8",y1:"18",x2:"16",y2:"18"})]})}function D({size:r=14}){return e.jsxs("svg",{style:t.serviceInfoSvg,width:r,height:r,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"16",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"8",x2:"12.01",y2:"8"})]})}function $({size:r=14}){return e.jsx("svg",{style:t.paymentInfoSvg,width:r,height:r,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})})}function M({size:r=16}){return e.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})}function U({text:r}){const[p,a]=o.useState(!1),s=o.useRef(null);return o.useEffect(()=>{if(!p)return;function l(u){s.current&&!s.current.contains(u.target)&&a(!1)}return document.addEventListener("pointerdown",l),()=>document.removeEventListener("pointerdown",l)},[p]),e.jsxs("span",{ref:s,style:t.tooltipTrigger,onMouseEnter:()=>a(!0),onMouseLeave:()=>a(!1),onClick:()=>a(l=>!l),"aria-label":"Más información",children:["?",p&&e.jsx("span",{className:"scripta-calc-tooltip-box",style:t.tooltipBox,children:r})]})}function F({value:r}){const[p,a]=o.useState(r),s=o.useRef(null),l=o.useRef(p),u=o.useRef(null);return o.useEffect(()=>{const i=l.current,c=r;if(i===c)return;const h=300;u.current=null;function y(g){u.current||(u.current=g);const f=Math.min((g-u.current)/h,1),v=1-Math.pow(1-f,3),x=i+(c-i)*v;a(x),f<1?s.current=requestAnimationFrame(y):l.current=c}return s.current=requestAnimationFrame(y),()=>{s.current&&cancelAnimationFrame(s.current),l.current=c}},[r]),e.jsxs("span",{className:"scripta-calc-total-value",style:t.resultTotalValue,children:[e.jsx("span",{style:t.resultTotalCurrency,children:"USD"}),m(p)]})}function B(){const[r,p]=o.useState(6),[a,s]=o.useState(1),[l,u]=o.useState("estandar"),i=b[r],c=P.find(n=>n.id===l),h=o.useRef(r);o.useEffect(()=>{h.current!==r&&(h.current=r,w(b[r])?s(1):k(b[r])&&s(b[r].pagesIncluded))},[r]);const{subtotal:y,extraCost:g,urgencyAmount:f,total:v}=o.useMemo(()=>{let n=i.base,d=0;w(i)?n=i.base*a:k(i)&&(d=Math.max(0,a-i.pagesIncluded)*i.extraPageCost);const I=n+d,T=c.mult,C=I*(T-1);return{subtotal:I,extraCost:d,urgencyAmount:C,total:I+C}},[i,a,c]),x=w(i),S=k(i);function j(n){const d=Math.max(1,Math.min(300,parseInt(n,10)||1));s(d)}const N=encodeURIComponent(`Solicitud: ${i.name}`),z=encodeURIComponent(`Hola, me interesa el servicio "${i.name}".

Detalles:
`+(x?`- Páginas: ${a}
`:"")+(S&&a>i.pagesIncluded?`- Páginas extra: ${a-i.pagesIncluded}
`:"")+`- Urgencia: ${c.name} (${c.time})
- Total estimado: USD $${m(v)}

Quedo atento/a a su respuesta.`),A=`mailto:info@scriptaacademic.com?subject=${N}&body=${z}`;return e.jsxs("div",{className:"scripta-calc-root",style:t.calculator,children:[e.jsx("style",{children:W}),e.jsxs("div",{className:"scripta-calc-header",style:t.header,children:[e.jsx("div",{style:t.headerIcon,children:e.jsx(E,{})}),e.jsxs("div",{children:[e.jsx("h2",{className:"scripta-calc-header-title",style:t.headerTitle,children:"Calcula tu inversión"}),e.jsx("p",{style:t.headerSubtitle,children:"Precios transparentes, sin sorpresas"})]})]}),e.jsxs("div",{className:"scripta-calc-body",style:t.body,children:[e.jsxs("div",{style:t.section,children:[e.jsxs("label",{style:t.label,children:[e.jsx("span",{style:t.stepNumber,children:"1"}),"Tipo de servicio"]}),e.jsxs("div",{style:t.selectWrapper,children:[e.jsx("select",{className:"scripta-calc-select",style:t.select,value:r,onChange:n=>p(Number(n.target.value)),children:b.map((n,d)=>e.jsxs("option",{value:d,children:[n.name,n.badge==="popular"?" ★ Más popular":"",n.badge==="nuevo"?" ● Nuevo":""," — $"+n.base+" "+n.unit]},n.id))}),e.jsx("span",{style:t.selectArrow,children:e.jsx(M,{})})]}),e.jsxs("div",{style:t.serviceInfo,children:[e.jsx(D,{size:16}),e.jsx("span",{children:i.tooltip}),e.jsx(U,{text:i.tooltip})]})]}),e.jsxs("div",{style:t.section,children:[e.jsxs("label",{style:t.label,children:[e.jsx("span",{style:t.stepNumber,children:"2"}),x?"Cantidad de páginas":"Volumen"]}),x&&e.jsxs("div",{style:t.volumeInput,children:[e.jsx("input",{type:"range",className:"scripta-calc-slider",style:t.slider,min:1,max:300,value:a,onChange:n=>j(n.target.value)}),e.jsx("input",{type:"number",className:"scripta-calc-number",style:t.numberInput,min:1,max:300,value:a,onChange:n=>j(n.target.value)}),e.jsx("span",{style:t.volumeUnit,children:"págs."})]}),!x&&!S&&e.jsxs("div",{style:t.fixedPriceNote,children:[e.jsx("span",{style:t.fixedPriceNoteStrong,children:"Precio fijo:"})," $",m(i.base)," USD ",i.unit]}),!x&&S&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:t.fixedPriceNote,children:[e.jsxs("span",{style:t.fixedPriceNoteStrong,children:["Precio base incluye hasta ",i.pagesIncluded," páginas."]}),e.jsx("br",{}),"Páginas adicionales: $",i.extraPageCost.toFixed(2)," c/u"]}),e.jsxs("div",{style:t.volumeInput,children:[e.jsx("input",{type:"range",className:"scripta-calc-slider",style:t.slider,min:1,max:300,value:a,onChange:n=>j(n.target.value)}),e.jsx("input",{type:"number",className:"scripta-calc-number",style:t.numberInput,min:1,max:300,value:a,onChange:n=>j(n.target.value)}),e.jsx("span",{style:t.volumeUnit,children:"págs. totales"})]})]})]}),e.jsxs("div",{style:t.section,children:[e.jsxs("label",{style:t.label,children:[e.jsx("span",{style:t.stepNumber,children:"3"}),"Nivel de urgencia"]}),e.jsx("div",{className:"scripta-calc-urgency-group",style:t.urgencyGroup,children:P.map(n=>{const d=l===n.id;return e.jsxs("button",{type:"button",className:"scripta-calc-pill",style:{...t.urgencyPill,...d?t.urgencyPillActive:{}},onClick:()=>u(n.id),children:[e.jsx("span",{style:{...t.urgencyName,...d?t.urgencyNameActive:{}},children:n.name}),e.jsx("span",{style:t.urgencyTime,children:n.time}),e.jsx("span",{style:{...t.urgencyBadge,...d?t.urgencyBadgeActive:{}},children:n.label})]},n.id)})})]}),e.jsx("hr",{style:t.divider}),e.jsxs("div",{style:t.result,children:[e.jsxs("div",{style:t.resultRow,children:[e.jsxs("span",{style:t.resultLabel,children:["Subtotal (",i.name.split("(")[0].trim(),")"]}),e.jsxs("span",{style:t.resultValue,children:["$",m(y-g)]})]}),g>0&&e.jsxs("div",{style:t.resultRow,children:[e.jsxs("span",{style:t.resultLabel,children:["Páginas extra (",a-i.pagesIncluded," × $",i.extraPageCost.toFixed(2),")"]}),e.jsxs("span",{style:t.resultValue,children:["+$",m(g)]})]}),f>0&&e.jsxs("div",{style:t.resultRow,children:[e.jsxs("span",{style:t.resultLabel,children:["Recargo ",c.name.toLowerCase()," (",c.label,")"]}),e.jsxs("span",{style:t.resultValue,children:["+$",m(f)]})]}),e.jsxs("div",{style:t.resultTotal,children:[e.jsx("span",{style:t.resultTotalLabel,children:"TOTAL"}),e.jsx(F,{value:v})]}),e.jsxs("div",{style:t.paymentInfo,children:[e.jsx($,{size:14}),e.jsx("span",{children:"50% al contratar · 50% al entregar"})]})]}),e.jsx("a",{href:A,className:"scripta-calc-btn",style:t.cta,children:"Solicitar este servicio"})]})]})}const R=document.getElementById("scripta-calculator");R&&L(R).render(e.jsx(B,{}));
