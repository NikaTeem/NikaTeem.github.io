// lang
function applyLang(l){const h=document.documentElement;if(l==='en'){h.classList.add('en');h.lang='en';h.dir='ltr'}else{h.classList.remove('en');h.lang='fa';h.dir='rtl'}localStorage.setItem('nika-lang',l);dispatchEvent(new CustomEvent('nika:lang',{detail:l}))}
function toggleTheme(ev){const h=document.documentElement,go=()=>{const cur=h.classList.contains('board')?'board':h.classList.contains('dark')?'dark':'light';const nxt=cur==='light'?'dark':cur==='dark'?'board':'light';h.classList.toggle('dark',nxt!=='light');h.classList.toggle('board',nxt==='board');localStorage.setItem('nika-theme',nxt)};window.nkSound&&nkSound('page');if(!document.startViewTransition||matchMedia('(prefers-reduced-motion:reduce)').matches)return go();document.startViewTransition(go)}
(()=>{const t=localStorage.getItem('nika-theme');if(t==='dark')document.documentElement.classList.add('dark');if(t==='board')document.documentElement.classList.add('dark','board')})();
function toggleLang(){applyLang(document.documentElement.classList.contains('en')?'fa':'en')}
applyLang(localStorage.getItem('nika-lang')||'fa');
// intro: curtain lifts once the face-draw SVG (the real intro) is ready
(()=>{const pre=document.getElementById('pre'),fw=document.getElementById('faceWrap');const seen=sessionStorage.getItem('nika-seen');const go=()=>{pre.classList.add('done');document.documentElement.classList.add('go');sessionStorage.setItem('nika-seen','1')};
  if(seen||!fw||matchMedia('(prefers-reduced-motion:reduce)').matches){if(seen)document.documentElement.classList.add('seen');fw&&fetch('assets/face-draw.svg').then(r=>r.text()).then(t=>{fw.innerHTML=t;document.dispatchEvent(new Event('face-ready'))}).catch(()=>{});return go()}
  const t0=performance.now();fetch('assets/face-draw.svg').then(r=>r.text()).then(t=>{fw.innerHTML=t;document.dispatchEvent(new Event('face-ready'));setTimeout(go,Math.max(0,500-(performance.now()-t0)))}).catch(go)})();
// hand lettering: lazy, only when near viewport
(()=>{const slots=document.querySelectorAll('.lt-slot');if(!slots.length)return;const io=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const k=e.target.dataset.lt;fetch(`assets/letter/${k}.svg`).then(r=>r.text()).then(t=>{e.target.outerHTML=t})})},{rootMargin:'600px 0px'});slots.forEach(x=>io.observe(x))})();
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
// counters
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'',pre=el.dataset.prefix||'';let t0=null;const step=ts=>{if(!t0)t0=ts;const p=Math.min((ts-t0)/1400,1),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=pre+v+suf;if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step);co.unobserve(el)}),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));
// progress
const prog=document.getElementById('prog');
addEventListener('scroll',()=>{const d=document.documentElement;prog.style.width=(d.scrollTop/(d.scrollHeight-d.clientHeight)*100)+'%'},{passive:true});
// magnetic buttons
document.querySelectorAll('.mag').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;b.style.transform=`translate(${x*.18}px,${y*.28}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
// card tilt + spotlight
document.querySelectorAll('.tilt').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');c.style.transform=`translateY(-8px) rotateX(${(0.5-y)*8}deg) rotateY(${(x-0.5)*8}deg)`});c.addEventListener('mouseleave',()=>c.style.transform='')});
// hero frame 3D tilt
const fr=document.getElementById('frame');
// (tilt moved to v38 signature block)
// parallax illustrations
const px=[...document.querySelectorAll('.px')];
const canPx=()=>matchMedia('(min-width:900px) and (hover:hover)').matches;
addEventListener('scroll',()=>{if(!canPx())return;px.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;let c=(r.top+r.height/2-innerHeight/2)/innerHeight;c=Math.max(-1,Math.min(1,c));el.firstElementChild.style.transform=`translateY(${-c*el.dataset.depth*2.5}px) rotate(${c*1.2}deg)`})},{passive:true});
// ═══ feedback box ═══
const FB='https://nika-feedback.nikanetteem.workers.dev';
const isEn=()=>document.documentElement.classList.contains('en');
const fmtN=n=>n==null?'—':(isEn()?n.toLocaleString('en-US'):n.toLocaleString('fa-IR'));
const ago=ts=>{const d=Math.round((Date.now()-ts)/864e5);return isEn()?(d<1?'today':d===1?'yesterday':d+' days ago'):(d<1?'امروز':d===1?'دیروز':fmtN(d)+' روز پیش')};
const T={critique:['انتقاد','Critique'],idea:['پیشنهاد','Idea'],praise:['تشویق','Praise']};
const esc=t=>t.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
async function fbStats(){try{const d=await (await fetch(FB+'/api/stats')).json();document.querySelectorAll('#fbStats [data-k]').forEach(b=>{const k=b.dataset.k;const v=k==='avgScore'?(d[k]==null?'—':fmtN(d[k])+' / '+fmtN(5)):fmtN(d[k]);if(b.textContent!==v){b.textContent=v;b.classList.remove('tick');void b.offsetWidth;b.classList.add('tick')}});
const bt=d.byType||{};const tot=Math.max(1,(bt.critique||0)+(bt.idea||0)+(bt.praise||0));const mix=document.getElementById('fbMix');if(mix){['critique','idea','praise'].forEach(k=>{mix.querySelector('i.m-'+k).style.setProperty('--w',((bt[k]||0)/tot*100).toFixed(1)+'%');mix.querySelector('[data-m='+k+']').textContent=fmtN(bt[k]||0)})}}catch(e){}}
function card(e,i){const rot=((parseInt(e.id.slice(-2),36)%7)-3)*.6;return `<article class="fb-item t-${e.type} ${e.pinned?"pinned":""}" data-id="${e.id}" style="--rot:${rot}deg;--i:${i||0}"><span class="pin" aria-hidden="true"></span>${e.pinned?`<span class="fb-pinned">${isEn()?"pinned":"سنجاق‌شده"}</span>`:``}<header><span class="fb-type t-${e.type}">${isEn()?T[e.type][1]:T[e.type][0]}</span>${e.score?`<span class="fb-score">${'★'.repeat(e.score)}<i>${'★'.repeat(5-e.score)}</i></span>`:''}<time>${ago(e.ts)}</time></header><p>${esc(e.text)}</p>${e.reply?`<div class="fb-reply"><b>${isEn()?"Nika Net team":"تیم نیکا نت"}</b>${esc(e.reply)}</div>`:``}<footer><span class="fb-name">— ${e.name?esc(e.name):(isEn()?'anonymous':'ناشناس')}</span><button class="fb-vote" data-id="${e.id}" type="button" aria-label="upvote"><svg viewBox="0 0 24 24"><path d="M12 4l7 8h-4v8H9v-8H5z"/></svg><b>${fmtN(e.votes)}</b></button></footer></article>`}
async function fbList(){try{const L=await (await fetch(FB+'/api/feedback?limit=12')).json();const box=document.getElementById('fbList');if(L.length){box.innerHTML=L.map((e,i)=>card(e,i)).join('');const wn=document.getElementById('fbWallN');if(wn)wn.textContent=fmtN(L.length);box.querySelectorAll('.fb-vote').forEach(b=>b.onclick=()=>vote(b))}}catch(e){}}
async function vote(b){const voted=JSON.parse(localStorage.getItem('nika-voted')||'[]');if(voted.includes(b.dataset.id)){b.classList.add('done');return}
 try{const r=await (await fetch(FB+'/api/vote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:b.dataset.id})})).json();if(r.ok){b.querySelector('b').textContent=fmtN(r.votes);b.classList.add('done');voted.push(b.dataset.id);localStorage.setItem('nika-voted',JSON.stringify(voted));fbStats()}}catch(e){}}
async function fbFeatured(){try{const L=await (await fetch(FB+'/api/featured')).json();const ban=document.getElementById('fbBanner');if(!L.length){ban.hidden=true;return}
 const items=L.map(e=>`<div class="fb-chip"><span class="fb-type t-${e.type}">${isEn()?T[e.type][1]:T[e.type][0]}</span><q>${esc(e.text.length>140?e.text.slice(0,140)+'…':e.text)}</q><small>— ${e.name?esc(e.name):(isEn()?'anonymous':'ناشناس')} · ▲${fmtN(e.votes)}</small></div>`).join('');
 document.getElementById('fbTrack').innerHTML=items+items;ban.hidden=false;document.getElementById('fbTrack').style.animationDuration=Math.max(30,L.length*9)+'s'}catch(e){}}
// stars
let score=0;const stars=document.querySelectorAll('#stars i');stars.forEach(st=>{st.onclick=()=>{score=+st.dataset.v;stars.forEach(x=>x.classList.toggle('on',+x.dataset.v<=score))}});
// placeholders per language
function fbPh(){document.querySelectorAll('[data-fa-ph]').forEach(el=>el.placeholder=isEn()?el.dataset.enPh:el.dataset.faPh)}
fbPh();new MutationObserver(()=>{fbPh();fbList();fbFeatured();fbStats()}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
// submit
const form=document.getElementById('fbForm');if(form){form.onsubmit=async ev=>{ev.preventDefault();const msg=document.getElementById('fbMsg');const text=form.text.value.trim();if(text.length<8){msg.textContent=isEn()?'A little more, please (8+ chars).':'کمی بیشتر بنویس (حداقل ۸ حرف).';return}
 msg.textContent=isEn()?'Sending…':'در حال ارسال…';const btn=form.querySelector('button[type=submit]');btn.disabled=true;
 try{const r=await (await fetch(FB+'/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text,name:form.name.value,type:form.type.value,score,website:form.website.value,lang:isEn()?"en":"fa"})})).json();
  if(r.ok){msg.textContent=isEn()?'✔ In the box. Thank you — it appears after review.':'✔ در صندوق افتاد. ممنون — بعد از بازبینی منتشر می‌شود.';fbDrop();form.reset();score=0;stars.forEach(x=>x.classList.remove('on'));fbStats()}
  else msg.textContent=r.error==='rate limit'?(isEn()?'Too many notes for now — try later.':'فعلاً زیاد فرستادی — بعداً دوباره امتحان کن.'):(isEn()?'Something went wrong.':'مشکلی پیش آمد.')}catch(e){msg.textContent=isEn()?'Network error.':'خطای شبکه.'}
 btn.disabled=false}}
const fbSec=document.getElementById('feedback');if(fbSec){new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){fbStats();fbList();fbFeatured();o.disconnect()}},{rootMargin:'600px'}).observe(fbSec)}

// typewriter
(()=>{const el=document.getElementById('typer');if(!el)return;const W=['VLESS + WS + TLS','Trojan + TLS','WARP over Worker','clean-IP radar','one free Worker'];let i=0,j=0,del=false;const tick=()=>{const w=W[i];el.textContent=w.slice(0,j);if(!del&&j<w.length){j++;setTimeout(tick,70)}else if(!del){del=true;setTimeout(tick,1600)}else if(j>0){j--;setTimeout(tick,35)}else{del=false;i=(i+1)%W.length;setTimeout(tick,300)}};setTimeout(tick,1200)})();
// live wire (real data only)
(async()=>{const box=document.getElementById('wireItems');if(!box)return;const items=[];const add=(k,v)=>{if(v!=null&&v!=='')items.push(`<span><em>${k}</em>${v}</span>`)};
const rel=t=>{const s=(Date.now()-new Date(t))/1e3;if(s<3600)return Math.max(1,s/60|0)+' min ago';if(s<86400)return (s/3600|0)+' h ago';return (s/86400|0)+' d ago'};
const jobs=[fetch('/cdn-cgi/trace').then(r=>r.text()).then(t=>{const o=Object.fromEntries(t.trim().split('\n').map(l=>l.split('=')));add('edge',o.colo);add('you',o.ip);add('tls',o.tls)}).catch(()=>{}),
fetch('https://api.github.com/repos/NikaTeem/Nika-Net').then(r=>r.json()).then(d=>{if(d.pushed_at)add('last commit',rel(d.pushed_at));if(d.stargazers_count>0)add('stars',d.stargazers_count)}).catch(()=>{}),
fetch(FB+'/api/stats').then(r=>r.json()).then(s=>{add('box',(s.total||0)+' notes')}).catch(()=>{})];
await Promise.allSettled(jobs);add('license','MIT');add('cost','$0 / month');box.innerHTML=items.join('<i>—</i>');box.classList.add('on')})();
// chapter rail
(()=>{const rail=document.getElementById('rail');if(!rail)return;const links=[...rail.querySelectorAll('a')];const map={};links.forEach(a=>map[a.dataset.r]=a);const secs=links.map(a=>document.getElementById(a.dataset.r)).filter(Boolean);
const setA=id=>links.forEach(a=>a.classList.toggle('on',a.dataset.r===id));
const ro=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)setA(e.target.id)})},{rootMargin:'-40% 0px -55% 0px'});secs.forEach(s=>ro.observe(s));
addEventListener('scroll',()=>rail.classList.toggle('show',scrollY>innerHeight*.6),{passive:true})})();
// ---- logbook (GitHub, real)
(()=>{const box=document.getElementById('ledger');if(!box)return;const relT=t=>{const s=(Date.now()-new Date(t))/1e3,en=isEn();if(s<3600){const m=Math.max(1,s/60|0);return en?m+' min ago':fmtN(m)+' دقیقه پیش'}if(s<86400){const hh=s/3600|0;return en?hh+' h ago':fmtN(hh)+' ساعت پیش'}const d=s/86400|0;return en?d+' d ago':fmtN(d)+' روز پیش'};
let data=null;const render=()=>{if(!data)return;box.innerHTML=data.map((c,i)=>{const m=c.commit.message.split('\n')[0];const v=(m.match(/v?\d+\.\d+\.\d+/)||[])[0];const msg=esc(m.replace(/^[^\w\u0600-\u06FF]*/,'').replace(/^v?\d+\.\d+\.\d+:?\s*/,''));const rtl=/[\u0600-\u06FF]/.test(msg);return `<a class="lg-row" style="--i:${i}" href="${c.html_url}" target="_blank" rel="noopener"><span class="lg-sha">${c.sha.slice(0,7)}</span><span class="lg-msg" ${rtl?'dir="rtl"':''}>${msg}</span>${v?`<span class="lg-ver">${v}</span>`:''}<time class="lg-time">${relT(c.commit.author.date)}</time></a>`}).join('');const ver=document.getElementById('ledgerVer');const top=data.map(c=>(c.commit.message.match(/v?\d+\.\d+\.\d+/)||[])[0]).find(Boolean);if(top&&ver)ver.textContent='latest · '+top};
const io=new IntersectionObserver(es=>{if(!es.some(e=>e.isIntersecting))return;io.disconnect();fetch('https://api.github.com/repos/NikaTeem/Nika-Net/commits?per_page=7').then(r=>r.ok?r.json():Promise.reject()).then(d=>{data=d;render()}).catch(()=>{box.innerHTML=`<div class="ledger-empty">${isEn()?'GitHub is quiet right now — see the full history ↗':'الان دسترسی به GitHub نیست — تاریخچهٔ کامل را ببینید ↗'}</div>`})},{rootMargin:'200px'});io.observe(box);
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['class']})})();
// ---- copy buttons
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy)}catch(e){}b.classList.add('ok');setTimeout(()=>b.classList.remove('ok'),1600)}));
// ---- drawer menu
function toggleMenu(force){const l=document.getElementById('links'),b=document.getElementById('burger');const on=force===undefined?!l.classList.contains('open'):force;l.classList.toggle('open',on);document.documentElement.classList.toggle('menu-open',on);b.setAttribute('aria-expanded',on)}
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
(()=>{const v=document.getElementById('drVer'),src=document.getElementById('verEn');if(v&&src){const sync=()=>v.textContent=src.textContent;sync();new MutationObserver(sync).observe(src,{childList:true,characterData:true,subtree:true})}})();
// ---- mobile dock: hide while scrolling down, show on up / idle
(()=>{const d=document.getElementById('dock');if(!d)return;let last=scrollY,t;addEventListener('scroll',()=>{const y=scrollY;d.classList.toggle('hide',y>last&&y>300);last=y;clearTimeout(t);t=setTimeout(()=>d.classList.remove('hide'),900);d.classList.toggle('show',y>innerHeight*.6)},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{const a=d.querySelector(`a[href="#${e.target.id}"]`);if(a)a.classList.toggle('on',e.isIntersecting)}),{rootMargin:'-40% 0px -50% 0px'});['playground','start','toolkit'].forEach(id=>{const el=document.getElementById(id);if(el)io.observe(el)})})();
// ---- v38: signature moment
(()=>{
  const frame=document.getElementById('frame'),fw=document.getElementById('faceWrap');if(!frame||!fw)return;
  const boot=()=>{
  const paths=[...fw.querySelectorAll('path')];
  const pen=document.createElement('div');pen.className='pen';pen.innerHTML='<svg viewBox="0 0 32 32"><path d="M4 28l3-9L20 6l6 6-13 13-9 3z"/><path d="M7 19l6 6M17 9l6 6"/></svg>';frame.appendChild(pen);
  const seen=document.documentElement.classList.contains('seen');
  if(!seen&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    let t0=Infinity,raf;const total=2.6;const arm=()=>{t0=performance.now()+300};if(document.documentElement.classList.contains('go'))arm();else new MutationObserver((m,o)=>{if(document.documentElement.classList.contains('go')){arm();o.disconnect()}}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    const timeline=paths.map(p=>{const cs=getComputedStyle(p);return {p,d:parseFloat(cs.getPropertyValue('--d'))||0,t:parseFloat(cs.getPropertyValue('--t'))||.5,L:p.getTotalLength()}});
    const box=()=>fw.getBoundingClientRect();
    const tick=now=>{const e=(now-t0)/1000;if(!(e>=0)){raf=requestAnimationFrame(tick);return}
      let cur=null;for(const it of timeline){if(e>=it.d&&e<=it.d+it.t){cur=it;break}}
      if(cur){const k=(e-cur.d)/cur.t;const pt=cur.p.getPointAtLength(k*cur.L);const b=box();const fr=frame.getBoundingClientRect();pen.style.left=(b.left-fr.left+pt.x/100*b.width)+'px';pen.style.top=(b.top-fr.top+pt.y/100*b.height)+'px';pen.classList.add('on')}
      if(e<total+.4)raf=requestAnimationFrame(tick);else{pen.classList.remove('on');setTimeout(()=>frame.classList.add('drawn'),1200)}};
    raf=requestAnimationFrame(tick);
  }else{setTimeout(()=>frame.classList.add('drawn'),800)}
  };if(fw.querySelector('path'))boot();else document.addEventListener('face-ready',boot,{once:true});
  // depth parallax: mouse (desktop) / gyro (phone)
  const art=document.querySelector('.hero-art');let tx=0,ty=0,cx=0,cy=0,live=true;
  const apply=()=>{cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;frame.style.transform=`rotate(-1.5deg) rotateY(${cx*8}deg) rotateX(${-cy*8}deg) translateZ(0)`;if(live)requestAnimationFrame(apply)};
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){addEventListener('mousemove',e=>{const r=art.getBoundingClientRect();tx=Math.max(-1,Math.min(1,((e.clientX-(r.left+r.width/2))/r.width)));ty=Math.max(-1,Math.min(1,((e.clientY-(r.top+r.height/2))/r.height)))},{passive:true});requestAnimationFrame(apply)}
  else if('DeviceOrientationEvent' in window){const start=()=>{addEventListener('deviceorientation',e=>{if(e.gamma==null)return;tx=Math.max(-1,Math.min(1,e.gamma/30));ty=Math.max(-1,Math.min(1,(e.beta-45)/30))},{passive:true});requestAnimationFrame(apply)};
    if(typeof DeviceOrientationEvent.requestPermission==='function'){frame.addEventListener('click',()=>DeviceOrientationEvent.requestPermission().then(s=>s==='granted'&&start()).catch(()=>{}),{once:true})}else start()}
  new IntersectionObserver(es=>{live=es[0].isIntersecting;if(live)requestAnimationFrame(apply)}).observe(art);
})();
// ---- v38: pencil cursor + graphite dust
(()=>{
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const pc=document.getElementById('pcur'),cv=document.getElementById('dust');if(!pc||!cv)return;
  document.documentElement.classList.add('pencil-cursor');
  const ctx=cv.getContext('2d');let W,H;const rs=()=>{W=cv.width=innerWidth*devicePixelRatio;H=cv.height=innerHeight*devicePixelRatio};rs();addEventListener('resize',rs);
  const P=[];let mx=-100,my=-100,lx=-100,ly=-100,down=false;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;pc.style.transform=`translate(${mx-2}px,${my-28}px)${down?' rotate(-8deg)':''}`;pc.classList.add('on');
    const t=e.target.closest('a,button,summary,[role=tab],input,textarea,select,label');pc.classList.toggle('link',!!t);
    const d=Math.hypot(mx-lx,my-ly);if(d>2){const n=Math.min(4,d/6|0)+1;for(let i=0;i<n;i++)P.push({x:mx+(Math.random()-.5)*4,y:my+(Math.random()-.5)*4,vx:(Math.random()-.5)*.4,vy:Math.random()*.6+.2,a:.55,r:Math.random()*1.2+.4});lx=mx;ly=my}},{passive:true});
  addEventListener('mousedown',()=>{down=true;pc.classList.add('press');for(let i=0;i<14;i++)P.push({x:mx,y:my,vx:(Math.random()-.5)*2.4,vy:-Math.random()*1.6,a:.8,r:Math.random()*1.6+.6})});
  addEventListener('mouseup',()=>{down=false;pc.classList.remove('press')});
  addEventListener('mouseleave',()=>pc.classList.remove('on'));document.addEventListener('mouseleave',()=>pc.classList.remove('on'));
  const ink=()=>getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||'#171512';
  let col=ink();new MutationObserver(()=>col=ink()).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  const loop=()=>{ctx.clearRect(0,0,W,H);ctx.fillStyle=col;for(let i=P.length-1;i>=0;i--){const p=P[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.a-=.012;if(p.a<=0){P.splice(i,1);continue}ctx.globalAlpha=p.a;ctx.beginPath();ctx.arc(p.x*devicePixelRatio,p.y*devicePixelRatio,p.r*devicePixelRatio,0,7);ctx.fill()}ctx.globalAlpha=1;if(P.length>600)P.splice(0,P.length-600);requestAnimationFrame(loop)};loop();
})();
// ---- v38: draw card borders on reveal
document.querySelectorAll('.feat-grid .card').forEach(c=>c.classList.add('drawn-b'));

// ---- v39: figures from project data
(()=>{
  const g=document.getElementById('radarDots');if(g){
    fetch('https://raw.githubusercontent.com/NikaTeem/Nika-Net/main/ui/scan-ips.json').then(r=>r.json()).then(d=>{
      const ips=d.ips||[];document.getElementById('radarN').textContent=(d.count||ips.length).toLocaleString(document.documentElement.classList.contains('en')?'en':'fa');
      let h='';ips.slice(0,90).forEach((ip,i)=>{const o=ip.split('.').map(Number);const a=(o[2]*7+o[3])%360*Math.PI/180,r=8+(o[1]*13+o[3])%48;h+=`<circle cx="${(60+Math.cos(a)*r).toFixed(1)}" cy="${(60+Math.sin(a)*r).toFixed(1)}" r="${o[3]%3?.9:1.5}" style="--d:${(a/(2*Math.PI)*4).toFixed(2)}s"/>`});g.innerHTML=h}).catch(()=>{});
  }
  const gauge=document.querySelector('.fig-gauge');if(gauge){
    const run=()=>{const t=performance.now();fetch('https://cloudflare.com/cdn-cgi/trace',{mode:'no-cors',cache:'no-store'}).catch(()=>{}).finally(()=>{const ms=Math.round(performance.now()-t);gauge.style.setProperty('--g',Math.min(1,ms/400));const n=gauge.querySelector('.gauge-n');n.textContent=ms+' ms';gauge.querySelector('.n').textContent=ms<80?'fast':ms<200?'ok':'slow'})};
    new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){run();o.disconnect()}}).observe(gauge);
  }
})();
// ---- v39: pencil sounds (synthesized, no files) + haptics
(()=>{
  let ctx,noise;const on=()=>document.documentElement.classList.contains('snd');
  if(localStorage.getItem('nika-snd')==='1')document.documentElement.classList.add('snd');
  const ac=()=>{if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();const len=ctx.sampleRate*2,b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;noise=b}if(ctx.state==='suspended')ctx.resume();return ctx};
  const burst=(dur,f,q,gain,type='bandpass')=>{const c=ac(),s=c.createBufferSource();s.buffer=noise;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=c.createGain();g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(gain,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dur);s.connect(fl).connect(g).connect(c.destination);s.start();s.stop(c.currentTime+dur)};
  window.nkSound=k=>{if(!on())return;try{
    if(k==='scratch')burst(.12+Math.random()*.08,1800+Math.random()*800,1.2,.05);
    else if(k==='tap'){burst(.05,900,3,.12);burst(.03,300,1,.08,'lowpass')}
    else if(k==='stamp'){burst(.18,180,.8,.5,'lowpass');burst(.06,2500,1,.08)}
    else if(k==='page'){burst(.35,900,.5,.12,'highpass');setTimeout(()=>burst(.25,1400,.7,.08,'highpass'),120)}
  }catch(e){}};
  window.toggleSound=()=>{const h=document.documentElement;h.classList.toggle('snd');localStorage.setItem('nika-snd',h.classList.contains('snd')?'1':'0');if(h.classList.contains('snd'))nkSound('tap')};
  // hooks
  document.addEventListener('click',e=>{const t=e.target.closest('a,button,summary');if(t){nkSound('tap');navigator.vibrate&&navigator.vibrate(6)}},{passive:true});
  let acc=0;addEventListener('mousemove',e=>{acc+=Math.hypot(e.movementX,e.movementY);if(acc>140){acc=0;nkSound('scratch')}},{passive:true});
  const st=document.querySelector('.stamp-ok');if(st)new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){setTimeout(()=>{nkSound('stamp');navigator.vibrate&&navigator.vibrate([20,30,40])},650);o.disconnect()}}).observe(st);
  const wax=document.getElementById('sealWax');if(wax)new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){setTimeout(()=>{nkSound('stamp');navigator.vibrate&&navigator.vibrate([30,40,60])},3800);o.disconnect()}}).observe(wax);
  // palette entry
  if(window.PAL)PAL.push({k:'sound pencil audio صدا',fa:'صدای مداد: روشن/خاموش',en:'Pencil sounds: toggle',run:toggleSound});
})();

// ---- v39: live terminal replay
window.runTerm=async function(){const out=document.getElementById('termOut'),ty=document.getElementById('termTyped');if(!out||out.dataset.busy)return;out.dataset.busy=1;
  const steps=[['git clone https://github.com/NikaTeem/Nika-Net.git && cd Nika-Net',["Cloning into 'Nika-Net'...","remote: Enumerating objects: 1240, done.","Receiving objects: 100% (1240/1240), 2.1 MiB | 4.2 MiB/s, done."]],
    ['npm install',["added 212 packages in 6s"]],
    ['npm run build',["> nika-net@0.13.4 build","> esbuild src/worker.ts --bundle --outfile=dist/worker.js","","  dist/worker.js  1.2mb ⚠️","","⚡ Done in 412ms"]],
    ['npx wrangler login',["Attempting to login via OAuth...","Successfully logged in."]],
    ['npm run deploy',["Total Upload: 1180.44 KiB / gzip: 214.30 KiB","Uploaded nika-net (2.13 sec)","Published nika-net (0.71 sec)","  https://nika-net.<you>.workers.dev","Current Deployment ID: 3f9a1c2e-…"]],
    ['open https://nika-net.<you>.workers.dev/admin',["<span class='ok'>✔ Nika Net v0.13.4 — panel is live. Sign in and change the password.</span>"]]];
  out.innerHTML='';
  for(const [cmd,lines] of steps){const line=document.createElement('div');line.innerHTML='<span class="p">$</span> <span class="t"></span><span class="cursor"></span>';out.appendChild(line);const t=line.querySelector('.t');
    for(const ch of cmd){t.textContent+=ch;window.nkSound&&Math.random()<.3&&nkSound('tap');await new Promise(r=>setTimeout(r,18+Math.random()*40))}
    line.querySelector('.cursor').remove();await new Promise(r=>setTimeout(r,260));
    for(const l of lines){const d=document.createElement('div');d.className='o';d.innerHTML=l||'&nbsp;';out.appendChild(d);out.scrollTop=out.scrollHeight;await new Promise(r=>setTimeout(r,90+Math.random()*160))}
    await new Promise(r=>setTimeout(r,300))}
  const end=document.createElement('div');end.innerHTML='<span class="p">$</span> <span class="cursor"></span>';out.appendChild(end);out.scrollTop=out.scrollHeight;delete out.dataset.busy};

// ---- v40: Nika the guide
(()=>{const g=document.getElementById('guide'),bb=document.getElementById('gBubble');if(!g)return;const fa=()=>!document.documentElement.classList.contains('en');
  const say={
    act1:{pose:'think',fa:'قبل از هر چیز: چرا یک پنل دیگر؟ چون این یکی روی حساب خودت است.',en:'First things first: why another panel? Because this one runs on your own account.'},
    act2:{pose:'point',fa:'این مسیر را دنبال کن — هیچ سروری جز خودت وسط نیست.',en:'Follow this path — there is no server but yours in between.'},
    features:{pose:'smile',fa:'شکل‌ها زنده‌اند؛ رادار همین الان از مخزن خوانده شد.',en:'The figures are live; the radar was just read from the repo.'},
    act3:{pose:'smile',fa:'خجالت نکش، خرابش کن. دمو برای همین است.',en:'Go ahead, break it. That is what the demo is for.'},
    telegram:{pose:'point',fa:'اگر عجله داری، ربات همه‌چیز را انجام می‌دهد.',en:'In a hurry? The bot does everything.'},
    act4:{pose:'point',fa:'رمز پنل را همان اولین ورود عوض کن. با مداد قرمز نوشتم.',en:'Change the panel password on first login. I wrote it in red pencil.'},
    logbook:{pose:'think',fa:'هنوز داریم می‌کشیم — این دفتر هر روز طولانی‌تر می‌شود.',en:'Still drawing — this log grows every day.'},
    feedback:{pose:'smile',fa:'حرفی داری؟ بنداز توی صندوق. خودم می‌خوانم.',en:'Something to say? Drop it in the box. I read them.'},
    appendix:{pose:'think',fa:'بقیه را بایگانی کردم که سرت را شلوغ نکند.',en:'I filed the rest so it would not crowd you.'},
    act5:{pose:'wink',fa:'نامه تمام شد. ممنون که تا اینجا خواندی.',en:'The letter ends. Thanks for reading this far.'}};
  let cur=null,tmr;const show=id=>{if(id===cur||!say[id])return;cur=id;const d=say[id];g.dataset.pose=d.pose;bb.firstElementChild.textContent=fa()?d.fa:d.en;g.classList.add('on','talk');clearTimeout(tmr);tmr=setTimeout(()=>g.classList.remove('talk'),5200);window.nkSound&&nkSound('tap')};
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)show(e.target.id)})},{rootMargin:'-30% 0px -50% 0px'});
  Object.keys(say).forEach(id=>{const el=document.getElementById(id);el&&io.observe(el)});
  // blink + follow pointer with pupils
  setInterval(()=>{g.classList.add('blink');setTimeout(()=>g.classList.remove('blink'),160)},3800+Math.random()*2000);
  addEventListener('mousemove',e=>{const r=g.getBoundingClientRect();const dx=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/300)),dy=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/300));g.style.setProperty('--px',dx*1.6+'px');g.style.setProperty('--py',dy*1.2+'px')},{passive:true});
  g.addEventListener('click',()=>{g.classList.toggle('talk');g.setAttribute('aria-expanded',g.classList.contains('talk'));if(!g.classList.contains('talk'))return;clearTimeout(tmr);tmr=setTimeout(()=>g.classList.remove('talk'),5200)});
  // hide near the hero (portrait already there)
  const hero=document.querySelector('.hero');if(hero)new IntersectionObserver(es=>{g.classList.toggle('hide',es[0].isIntersecting&&es[0].intersectionRatio>.3)},{threshold:[0,.3,.6]}).observe(hero);
})();
// ---- v40: journey packet
(()=>{const j=document.getElementById('journey');if(!j)return;const lines=[...j.querySelectorAll('.j-line')],pkt=j.querySelector('.j-pkt');if(!lines.length)return;
  const segs=lines.map(l=>({l,L:l.getTotalLength()}));const total=segs.reduce((a,s)=>a+s.L,0);let t=0,raf,live=false;
  const step=()=>{t=(t+total/240)%total;let acc=0;for(const s of segs){if(t<=acc+s.L){const p=s.l.getPointAtLength(t-acc);pkt.setAttribute('transform',`translate(${p.x},${p.y})`);break}acc+=s.L}if(live)raf=requestAnimationFrame(step)};
  new IntersectionObserver(es=>{live=es[0].isIntersecting;j.classList.toggle('in',live);if(live)step();else cancelAnimationFrame(raf)}).observe(j);
})();
// ---- v40: presentation mode (P) + share card + lazy demo
(()=>{
  addEventListener('keydown',e=>{if(e.key.toLowerCase()==='p'&&!e.ctrlKey&&!e.metaKey&&!/input|textarea/i.test(document.activeElement.tagName)){document.documentElement.classList.toggle('present');window.nkSound&&nkSound('page')}
    if(document.documentElement.classList.contains('present')&&(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key===' ')){e.preventDefault();const acts=[...document.querySelectorAll('.act,#manifesto')];const y=scrollY+innerHeight*.4;const n=acts.find(a=>a.offsetTop>y);n&&n.scrollIntoView({behavior:'smooth'})}
    if(document.documentElement.classList.contains('present')&&(e.key==='ArrowUp'||e.key==='ArrowLeft')){e.preventDefault();const acts=[...document.querySelectorAll('.act,#manifesto')].reverse();const y=scrollY-10;const n=acts.find(a=>a.offsetTop<y);n&&n.scrollIntoView({behavior:'smooth'})}});
  if(window.PAL){PAL.push({k:'present presentation slides ارائه',fa:'حالت ارائه (P)',en:'Presentation mode (P)',run:()=>document.documentElement.classList.toggle('present')});PAL.push({k:'share card کارت اشتراک',fa:'کارت اشتراک را بساز',en:'Make a share card',run:()=>makeShareCard()})}
  window.makeShareCard=async function(){const v=(document.querySelector('[data-ver]')||{}).textContent||document.querySelector('.ver,.vtag')?.textContent||'';const c=document.createElement('canvas');c.width=1200;c.height=630;const x=c.getContext('2d');
    x.fillStyle='#d8d1c2';x.fillRect(0,0,1200,630);for(let i=0;i<9000;i++){x.fillStyle=`rgba(23,21,18,${Math.random()*.06})`;x.fillRect(Math.random()*1200,Math.random()*630,1.5,1.5)}
    x.strokeStyle='#171512';x.lineWidth=1.5;x.setLineDash([6,5]);x.strokeRect(34,34,1132,562);x.setLineDash([]);
    const img=new Image();img.src='assets/logo-512.webp?v=2';await img.decode().catch(()=>{});x.save();x.translate(230,315);x.rotate(-.04);x.fillStyle='#f3efe5';x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=24;x.shadowOffsetY=10;x.fillRect(-150,-170,300,340);x.restore();x.save();x.translate(230,315);x.rotate(-.04);x.drawImage(img,-130,-150,260,260);x.restore();
    x.fillStyle='#171512';x.textAlign='left';x.font='700 62px "Playfair Display",serif';x.fillText('NIKA NET',440,220);x.font='italic 400 30px "Playfair Display",serif';x.fillStyle='#4a453d';x.fillText('The internet, in your own handwriting.',440,272);
    x.font='400 20px "Special Elite",monospace';x.fillStyle='#8a8275';x.fillText('CONNECTING INTELLIGENCE  ·  EST. 2025  ·  MIT  ·  $0',440,320);
    x.font='400 22px monospace';x.fillStyle='#171512';x.fillText('nikanet.dpdns.org',440,420);
    x.save();x.translate(1010,470);x.rotate(-.35);x.strokeStyle='#a8322a';x.lineWidth=4;x.beginPath();x.arc(0,0,64,0,7);x.stroke();x.fillStyle='#a8322a';x.font='700 64px "Playfair Display",serif';x.textAlign='center';x.fillText('N',0,22);x.font='400 12px monospace';x.fillText('FREE FOREVER · '+(v||'v0.13'),0,48);x.restore();
    const a=document.createElement('a');a.download='nika-net-card.png';a.href=c.toDataURL('image/png');a.click();window.nkSound&&nkSound('stamp')};
})();

// ---- v40: instant mock panel
(()=>{const m=document.getElementById('mock');if(!m)return;
  m.querySelectorAll('.mk-side [data-mk]').forEach(b=>b.addEventListener('click',()=>{m.querySelectorAll('.mk-side [data-mk]').forEach(x=>x.classList.toggle('on',x===b));m.querySelectorAll('.mk-pane').forEach(p=>p.classList.toggle('on',p.dataset.mk===b.dataset.mk));window.nkSound&&nkSound('tap')}));
  m.querySelector('.mk-theme').addEventListener('click',()=>m.classList.toggle('slate'));
  const names=['nika','reza','maryam','ali','parisa','kian','sam'];let n=3;
  m.querySelector('.mk-add:not(.mk-scanbtn)').addEventListener('click',e=>{if(e.currentTarget.id)return;const nm=names[n%names.length];const q=(Math.random()*.8+.05).toFixed(2);const tr=document.createElement('tr');tr.innerHTML=`<td>${nm}</td><td><i style="--p:${q}"></i>${Math.round(q*50)}/50 GB</td><td>${[7,14,30,90][n%4]}d</td><td><span class="mk-lnk">/sub/•••</span></td>`;tr.classList.add('new');document.getElementById('mkRows').appendChild(tr);n++;document.getElementById('mkU').textContent=n;window.nkSound&&nkSound('stamp')});
  const cc=['DE','NL','US','FI','GB','FR','SG','SE','CH','JP'];let scanning=false;
  m.querySelector('.mk-scanbtn').addEventListener('click',async e=>{if(scanning)return;scanning=true;const b=e.currentTarget;b.classList.add('busy');const dots=document.getElementById('mkDots'),list=document.getElementById('mkList');dots.innerHTML='';[...list.querySelectorAll('div:not(.h)')].forEach(x=>x.remove());
    for(let i=0;i<24;i++){const a=Math.random()*6.28,r=10+Math.random()*46;const ms=Math.round(40+Math.random()*300);const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',60+Math.cos(a)*r);c.setAttribute('cy',60+Math.sin(a)*r);c.setAttribute('r',ms<120?1.8:1);if(ms<120)c.classList.add('good');dots.appendChild(c);
      if(ms<140){const d=document.createElement('div');d.innerHTML=`<span dir="ltr">104.${16+Math.floor(Math.random()*20)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}</span><span>${ms}</span><span>${cc[i%cc.length]}</span>`;list.appendChild(d);if(list.children.length>7)list.children[1].remove()}
      window.nkSound&&Math.random()<.4&&nkSound('tap');await new Promise(r=>setTimeout(r,90+Math.random()*120))}
    b.classList.remove('busy');scanning=false;window.nkSound&&nkSound('stamp')});
  const qr=document.getElementById('mkQr'),cfg=document.getElementById('mkCfg'),pr=document.getElementById('mkProto');
  const draw=()=>{const p=pr.value;cfg.textContent=p==='vless'?'vless://8f3a…@your-domain:443?security=tls&sni=your-domain&type=ws#Nika':p==='trojan'?'trojan://c2f1…@your-domain:443?security=tls&sni=your-domain#Nika':'warp://relay.your-domain:2408?key=…#Nika-WARP';
    let seed=[...p].reduce((a,c)=>a+c.charCodeAt(0),0);const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};let h='';for(let y=0;y<21;y++)for(let x=0;x<21;x++){const fin=(x<7&&y<7)||(x>13&&y<7)||(x<7&&y>13);const on=fin?((x%6===0||y%6===0||x%6===6||(x>1&&x<5&&y>1&&y<5))||(x>15&&x<19&&y>1&&y<5)||(x>1&&x<5&&y>15&&y<19)):rnd()>.5;if(fin&&((x===7||y===7||x===13&&y<7||y===13&&x<7)))continue;if(on)h+=`<i style="grid-area:${y+1}/${x+1}"></i>`}qr.innerHTML=h};
  pr.addEventListener('change',draw);draw();
  document.getElementById('mkCopy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(cfg.textContent).catch(()=>{});const b=document.getElementById('mkCopy');b.classList.add('done');setTimeout(()=>b.classList.remove('done'),1200)});
})();
// ---- back to top
(()=>{const t=document.getElementById('totop');addEventListener('scroll',()=>t.classList.toggle('show',scrollY>innerHeight*1.2),{passive:true});t.onclick=()=>scrollTo({top:0,behavior:'smooth'})})();
// ---- command palette
const PAL=[
 {k:'go',fa:'برو به: بالای صفحه',en:'Go to: Top',run:()=>scrollTo({top:0,behavior:'smooth'})},
 {k:'go showcase panel',fa:'برو به: نگاهی به داخل پنل',en:'Go to: Inside the panel',run:()=>location.hash='#showcase'},
 {k:'go playground demo try sandbox',fa:'برو به: دموی زنده',en:'Go to: Live demo',run:()=>location.hash='#playground'},
 {k:'go releases versions',fa:'برو به: نسخه‌ها',en:'Go to: Releases',run:()=>location.hash='#releases'},
 {k:'go compare comparison alternatives',fa:'برو به: مقایسه',en:'Go to: Comparison',run:()=>location.hash='#compare'},
 {k:'go clients apps v2rayng hiddify',fa:'برو به: کلاینت‌ها',en:'Go to: Clients',run:()=>location.hash='#clients'},
 {k:'trust privacy security audit data',fa:'اعتماد و حریم‌خصوصی',en:'Trust & privacy',run:()=>location.href='trust.html'},
 {k:'brand kit logo press card maker',fa:'کیت برند و کارت‌ساز',en:'Brand kit & card maker',run:()=>location.href='brand.html'},
 {k:'go telegram bot channel',fa:'برو به: تلگرام',en:'Go to: Telegram',run:()=>location.hash='#telegram'},
 {k:'go features',fa:'برو به: ویژگی‌ها',en:'Go to: Features',run:()=>location.hash='#features'},
 {k:'go protocols vless trojan warp',fa:'برو به: پروتکل‌ها',en:'Go to: Protocols',run:()=>location.hash='#protocols'},
 {k:'go blueprint how works route',fa:'برو به: نقشهٔ مسیر',en:'Go to: Blueprint',run:()=>location.hash='#blueprint'},
 {k:'go start deploy quick',fa:'برو به: شروع سریع',en:'Go to: Quick start',run:()=>location.hash='#start'},
 {k:'go toolkit tools check decode client',fa:'برو به: ابزارها',en:'Go to: Toolkit',run:()=>location.hash='#toolkit'},
 {k:'go logbook commits changelog',fa:'برو به: دفترچهٔ کار',en:'Go to: Logbook',run:()=>location.hash='#logbook'},
 {k:'go feedback box suggestion',fa:'برو به: صندوق انتقادات',en:'Go to: Suggestion box',run:()=>location.hash='#feedback'},
 {k:'go mirrors offline blocked backup',fa:'برو به: آینه‌ها / نسخهٔ آفلاین',en:'Go to: Mirrors / offline',run:()=>location.hash='#mirrors'},
 {k:'go faq questions',fa:'برو به: سؤال‌های پرتکرار',en:'Go to: FAQ',run:()=>location.hash='#faq'},
 {k:'shortcuts keys help ?',fa:'کلیدهای میانبر',en:'Keyboard shortcuts',run:()=>openKeys()},
 {k:'uuid generate id',fa:'ابزار: ساخت UUID',en:'Tool: generate UUID',run:()=>{location.hash='#toolkit';document.querySelector('[data-tk=gen]').click()}},
 {k:'qr code',fa:'ابزار: QR کانفیگ',en:'Tool: config QR',run:()=>{location.hash='#toolkit';document.querySelector('[data-tk=gen]').click()}},
 {k:'dns domain check',fa:'ابزار: بررسی دامنه',en:'Tool: domain check',run:()=>{location.hash='#toolkit';document.querySelector('[data-tk=dns]').click()}},
 {k:'theme dark light toggle',fa:'تم بعدی (روشن → تاریک → تخته‌سیاه)',en:'Next theme (light → dark → blackboard)',run:()=>toggleTheme()},
 {k:'theme blackboard chalk board',fa:'تم: تخته‌سیاه',en:'Theme: Blackboard',run:()=>{const h=document.documentElement;h.classList.add('dark','board');localStorage.setItem('nika-theme','board')}},
 {k:'language english farsi persian',fa:'Switch to English',en:'تغییر زبان به فارسی',run:()=>toggleLang()},
 {k:'github repo source',fa:'مخزن GitHub ↗',en:'GitHub repository ↗',run:()=>open('https://github.com/NikaTeem/Nika-Net','_blank')},
 {k:'changelog roadmap releases versions',fa:'تاریخچهٔ تغییرات و نقشهٔ راه',en:'Changelog & roadmap',run:()=>location.href='changelog.html'},
 {k:'docs documentation',fa:'مستندات',en:'Documentation',run:()=>location.href='docs.html'},
 {k:'telegram bot launcher',fa:'ربات تلگرام ↗',en:'Telegram bot ↗',run:()=>open('https://t.me/NikaNetLauncher_bot','_blank')},
 {k:'copy link url share',fa:'کپی لینک سایت',en:'Copy site link',run:()=>navigator.clipboard&&navigator.clipboard.writeText('https://nikanet.dpdns.org/')},
 {k:'copy deploy command clone',fa:'کپی دستورات نصب',en:'Copy install commands',run:()=>navigator.clipboard&&navigator.clipboard.writeText('git clone https://github.com/NikaTeem/Nika-Net.git && cd Nika-Net && npm install && npm run build && npx wrangler login && npm run deploy')},
];
const pal=document.getElementById('pal'),palIn=document.getElementById('palIn'),palList=document.getElementById('palList');let palSel=0,palItems=[];
function palRender(){const q=palIn.value.trim().toLowerCase();palItems=PAL.filter(c=>!q||c.k.includes(q)||c.fa.includes(q)||c.en.toLowerCase().includes(q));palSel=Math.min(palSel,Math.max(0,palItems.length-1));palList.innerHTML=palItems.map((c,i)=>`<li class="${i===palSel?'sel':''}" data-i="${i}"><span dir="auto">${isEn()?c.en:c.fa}</span><i>${c.k.split(' ')[0]}</i></li>`).join('')||`<li class="none">${isEn()?'nothing drawn for that':'چیزی پیدا نشد'}</li>`}
function openPal(){pal.hidden=false;palIn.value='';palSel=0;palRender();requestAnimationFrame(()=>{pal.classList.add('on');palIn.focus()})}
function closePal(){pal.classList.remove('on');setTimeout(()=>pal.hidden=true,220)}
function palRun(i){const c=palItems[i];if(!c)return;closePal();setTimeout(()=>c.run(),120)}
palIn.addEventListener('input',()=>{palSel=0;palRender()});
palIn.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){palSel=(palSel+1)%palItems.length;palRender();e.preventDefault()}else if(e.key==='ArrowUp'){palSel=(palSel-1+palItems.length)%palItems.length;palRender();e.preventDefault()}else if(e.key==='Enter'){palRun(palSel)}else if(e.key==='Escape'){closePal()}});
palList.addEventListener('click',e=>{const li=e.target.closest('li[data-i]');if(li)palRun(+li.dataset.i)});
palList.addEventListener('mousemove',e=>{const li=e.target.closest('li[data-i]');if(li&&+li.dataset.i!==palSel){palSel=+li.dataset.i;palRender()}});
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.hidden?openPal():closePal()}else if(e.key==='/'&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();openPal()}});
// ?lang=en support
if(new URLSearchParams(location.search).get('lang')==='en'&&!localStorage.getItem('nika-lang')){applyLang('en')}

// ---- blueprint interaction
(()=>{const bp=document.getElementById('bp');if(!bp)return;const nodes=bp.querySelectorAll('.bp-node'),cards=bp.querySelectorAll('.bp-card');const set=n=>{nodes.forEach(x=>x.classList.toggle('on',x.dataset.n===n));cards.forEach(x=>x.classList.toggle('on',x.dataset.n===n))};set('0');
nodes.forEach(x=>{x.addEventListener('mouseenter',()=>set(x.dataset.n));x.addEventListener('click',()=>set(x.dataset.n))});cards.forEach(x=>x.addEventListener('mouseenter',()=>set(x.dataset.n)));
let auto=setInterval(()=>{const cur=[...cards].findIndex(c=>c.classList.contains('on'));set(String((cur+1)%3))},4200);bp.addEventListener('mouseenter',()=>clearInterval(auto),{once:true});
const io=new IntersectionObserver(es=>es.forEach(e=>bp.classList.toggle('live',e.isIntersecting)),{threshold:.2});io.observe(bp)})();
// ---- easter egg: type "nika"
(()=>{let buf='';addEventListener('keydown',e=>{if(/input|textarea/i.test(document.activeElement.tagName))return;buf=(buf+e.key.toLowerCase()).slice(-4);if(buf==='nika'){buf='';document.documentElement.classList.add('doodle');setTimeout(()=>document.documentElement.classList.remove('doodle'),6000)}})})();

// ---- toolkit tabs
(()=>{const tabs=document.querySelectorAll('.tk-tabs button');tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.tk-panel').forEach(p=>p.hidden=p.id!=='tk-'+b.dataset.tk)})})();
// ---- 01 connection probe (real, via Cloudflare trace endpoints)
(()=>{const btn=document.getElementById('probeBtn'),out=document.getElementById('probeOut'),ver=document.getElementById('probeVerdict');if(!btn)return;const set=(k,v,cls)=>{const r=out.querySelector(`[data-k=${k}]`);r.querySelector('b').textContent=v;r.className='pr-row '+(cls||'')};
btn.onclick=async()=>{btn.disabled=true;['edge','colo','lat','tls','warp','ip'].forEach(k=>set(k,'…','wait'));ver.textContent='';
const t0=performance.now();let ok=false,o={};try{const r=await fetch('https://1.1.1.1/cdn-cgi/trace',{cache:'no-store'});const t=await r.text();o=Object.fromEntries(t.trim().split('\n').map(l=>l.split('=')));ok=true}catch(e){try{const r=await fetch('/cdn-cgi/trace',{cache:'no-store'});const t=await r.text();o=Object.fromEntries(t.trim().split('\n').map(l=>l.split('=')));ok=true}catch(e2){}}
const lat=Math.round(performance.now()-t0);
if(!ok){set('edge',isEn()?'blocked / unreachable':'مسدود / در دسترس نیست','bad');['colo','lat','tls','warp','ip'].forEach(k=>set(k,'—'));ver.textContent=isEn()?'Cloudflare edge is not reachable from this network right now. Nika Net relies on it — try another network or a clean IP.':'الان از این شبکه به لبهٔ Cloudflare نمی‌رسید. نیکا نت به آن متکی است — شبکهٔ دیگری یا آی‌پی تمیز امتحان کنید.';btn.disabled=false;return}
// second sample for latency
let l2=lat;try{const s=performance.now();await fetch('https://1.1.1.1/cdn-cgi/trace',{cache:'no-store'});l2=Math.round(performance.now()-s)}catch(e){}
const L=Math.min(lat,l2);
set('edge',isEn()?'yes':'بله','good');set('colo',o.colo||'—');set('lat',L+' ms',L<120?'good':L<300?'':'bad');set('tls',(o.tls||'—').toUpperCase());set('warp',o.warp==='on'?'on':o.warp==='plus'?'plus':'off',o.warp&&o.warp!=='off'?'good':'');set('ip',o.ip||'—');
ver.textContent=L<150?(isEn()?'Excellent. A Worker deployed today would feel snappy from here.':'عالی. یک Worker که امروز مستقر کنید، از این‌جا سریع خواهد بود.'):L<350?(isEn()?'Usable. Pick a clean IP from the in-panel scanner for best results.':'قابل استفاده. برای نتیجهٔ بهتر از اسکنر داخل پنل یک آی‌پی تمیز بردارید.'):(isEn()?'Slow path. Try the clean-IP scanner or a different network.':'مسیر کند است. اسکنر آی‌پی تمیز یا شبکهٔ دیگری را امتحان کنید.');btn.disabled=false}})();
// ---- 02 config reader (local only)
(()=>{const inp=document.getElementById('decIn'),out=document.getElementById('decOut');if(!inp)return;
const row=(k,v,warn)=>v?`<div class="pr-row ${warn?'bad':''}"><em>${k}</em><b>${esc(String(v))}</b></div>`:'';
const render=()=>{const s=inp.value.trim();if(!s){out.innerHTML=`<div class="tk-empty">${isEn()?'Waiting for a link…':'منتظر لینک…'}</div>`;return}
let u;try{u=new URL(s)}catch(e){out.innerHTML=`<div class="tk-empty bad">${isEn()?'That doesn’t parse as a URI.':'این یک لینک معتبر نیست.'}</div>`;return}
const proto=u.protocol.replace(':','');if(!['vless','trojan','vmess','ss'].includes(proto)){out.innerHTML=`<div class="tk-empty bad">${isEn()?'Unsupported scheme: ':'پروتکل پشتیبانی‌نشده: '}${esc(proto)}</div>`;return}
const q=Object.fromEntries(u.searchParams.entries());const name=decodeURIComponent(u.hash.slice(1)||'');const id=decodeURIComponent(u.username||'');const port=u.port||(q.security==='tls'?'443':'80');
const tls=(q.security||'none');const type=q.type||'tcp';const warnTls=tls==='none';const warnPort=port==='80';
const en=isEn();out.innerHTML=[
 row(en?'protocol':'پروتکل',proto.toUpperCase()),
 row(en?'name':'نام',name),
 row(en?'server':'سرور',u.hostname),
 row(en?'port':'پورت',port,warnPort),
 row(en?'transport':'انتقال',type+(q.path?' · path '+decodeURIComponent(q.path):'')),
 row(en?'security':'امنیت',tls,warnTls),
 row('sni',q.sni||q.host||''),
 row(en?'fingerprint':'اثر انگشت',q.fp||''),
 row(en?'flow':'flow',q.flow||''),
 row(en?'id':'شناسه',id?id.slice(0,8)+'…'+id.slice(-4):''),
 `<div class="pr-verdict">${warnTls?(en?'⚠ No TLS — traffic is readable on the wire. Nika Net always issues TLS configs.':'⚠ بدون TLS — ترافیک روی خط قابل خواندن است. نیکا نت همیشه کانفیگ TLS می‌دهد.'):(type==='ws'&&tls==='tls'?(en?'Looks like a Worker-style WebSocket+TLS config. Good.':'شبیه کانفیگ WebSocket+TLS روی Worker است. خوب است.'):(en?'Parsed. Nothing left the page.':'خوانده شد. هیچ‌چیز از صفحه خارج نشد.'))}</div>`].join('')};
inp.addEventListener('input',render);new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['class']})})();
// ---- 03 client picker
(()=>{const pick=document.getElementById('osPick'),out=document.getElementById('cliOut');if(!pick)return;
const C={android:[['v2rayNG','https://github.com/2dust/v2rayNG/releases','VLESS · Trojan','open source, most used'],['Hiddify','https://hiddify.com','VLESS · Trojan · WARP','one-tap subscription'],['NekoBox','https://github.com/MatsuriDayo/NekoBoxForAndroid/releases','VLESS · Trojan','sing-box core']],
ios:[['Streisand','https://apps.apple.com/app/streisand/id6450534064','VLESS · Trojan','free, xray core'],['Hiddify','https://apps.apple.com/app/hiddify-proxy-vpn/id6596777532','VLESS · Trojan · WARP','one-tap subscription'],['Shadowrocket','https://apps.apple.com/app/shadowrocket/id932747118','VLESS · Trojan','paid, very stable']],
windows:[['Hiddify','https://hiddify.com','VLESS · Trojan · WARP','simplest'],['v2rayN','https://github.com/2dust/v2rayN/releases','VLESS · Trojan','power users'],['Nekoray','https://github.com/MatsuriDayo/nekoray/releases','VLESS · Trojan','sing-box / xray']],
mac:[['Hiddify','https://hiddify.com','VLESS · Trojan · WARP','simplest'],['V2Box','https://apps.apple.com/app/v2box-v2ray-client/id6446814690','VLESS · Trojan','App Store'],['Clash Verge','https://github.com/clash-verge-rev/clash-verge-rev/releases','VLESS · Trojan','Clash configs']],
linux:[['Nekoray','https://github.com/MatsuriDayo/nekoray/releases','VLESS · Trojan','GUI'],['Hiddify','https://hiddify.com','VLESS · Trojan · WARP','AppImage'],['sing-box (CLI)','https://sing-box.sagernet.org','VLESS · Trojan · WARP','for servers & scripts']]};
const detect=()=>{const ua=navigator.userAgent;if(/android/i.test(ua))return'android';if(/iphone|ipad|ipod/i.test(ua))return'ios';if(/mac/i.test(ua))return'mac';if(/linux/i.test(ua))return'linux';return'windows'};
let cur=detect();const render=()=>{pick.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.os===cur));out.innerHTML=C[cur].map((c,i)=>`<a class="cli" href="${c[1]}" target="_blank" rel="noopener" style="--i:${i}"><span class="n">${c[0]}</span><span class="p">${c[2]}</span><span class="d">${c[3]}</span><span class="a">↗</span></a>`).join('')+`<div class="pr-verdict">${isEn()?'Paste your Nika Net subscription link into any of these.':'لینک اشتراک نیکا نت را در هرکدام از این‌ها بچسبانید.'}</div>`};
pick.addEventListener('click',e=>{const b=e.target.closest('button');if(b){cur=b.dataset.os;render()}});render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['class']})})();
// ---- 04 dns check
(()=>{const f=document.getElementById('dnsForm'),inp=document.getElementById('dnsIn'),out=document.getElementById('dnsOut');if(!f)return;
const cf=ip=>/^(104\.(1[6-9]|2\d|3[01])\.|172\.(6[4-9]|7[01])\.|188\.114\.|141\.101\.|162\.15[89]\.|173\.245\.|190\.93\.|197\.234\.|198\.41\.|103\.2[12]\.|103\.31\.)/.test(ip);
const gh=ip=>/^185\.199\.10[89]\.|^185\.199\.11[01]\./.test(ip);
const row=(k,v,c)=>`<div class="pr-row ${c||''}"><em>${k}</em><b>${esc(String(v))}</b></div>`;
const q=(n,t)=>fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(n)}&type=${t}`,{headers:{accept:'application/dns-json'}}).then(r=>r.json()).catch(()=>({}));
f.addEventListener('submit',async e=>{e.preventDefault();let d=inp.value.trim().replace(/^https?:\/\//,'').split('/')[0].toLowerCase();if(!d)return;const en=isEn();
out.innerHTML=row('domain',d)+row('status',en?'looking up…':'در حال جست‌وجو…','wait');
const [a,cn,ns,aaaa]=await Promise.all([q(d,'A'),q(d,'CNAME'),q(d,'NS'),q(d,'AAAA')]);
const A=(a.Answer||[]).filter(x=>x.type===1).map(x=>x.data),CN=(cn.Answer||[]).filter(x=>x.type===5).map(x=>x.data.replace(/\.$/,'')),NS=(ns.Answer||[]).filter(x=>x.type===2).map(x=>x.data.replace(/\.$/,'')),A6=(aaaa.Answer||[]).filter(x=>x.type===28).map(x=>x.data);
const onCF=A.length&&A.every(cf),cfNS=NS.some(n=>/cloudflare\.com$/.test(n)),isWorker=CN.some(c=>/workers\.dev$/.test(c)),isGH=A.some(gh);
let verdict;if(!A.length&&!CN.length)verdict=en?'No records found — the domain isn’t resolving yet (or is a typo).':'رکوردی پیدا نشد — دامنه هنوز resolve نمی‌شود (یا غلط تایپی است).';
else if(onCF)verdict=en?'✓ Traffic is proxied through Cloudflare (orange cloud). Ready for a Worker route.':'✓ ترافیک از پروکسی کلادفلر (ابر نارنجی) می‌گذرد. برای مسیر Worker آماده است.';
else if(isGH)verdict=en?'Points at GitHub Pages (DNS-only). Fine for a site; a Worker route needs the orange cloud on.':'به GitHub Pages اشاره می‌کند (فقط DNS). برای سایت خوب است؛ مسیر Worker ابر نارنجی می‌خواهد.';
else if(cfNS)verdict=en?'Nameservers are Cloudflare but the record is DNS-only. Flip the cloud to orange.':'نیم‌سرورها کلادفلر است اما رکورد فقط DNS است. ابر را نارنجی کنید.';
else verdict=en?'Not behind Cloudflare. Move the nameservers to Cloudflare first (free plan works).':'پشت کلادفلر نیست. اول نیم‌سرورها را به کلادفلر ببرید (پلن رایگان کافی است).';
out.innerHTML=[row('domain',d),row('A',A.join('  ')||'—',A.length?(onCF?'good':''):'bad'),A6.length?row('AAAA',A6.slice(0,2).join('  ')):'',CN.length?row('CNAME',CN.join('  '),isWorker?'good':''):'',row('NS',NS.slice(0,2).join('  ')||'—',cfNS?'good':''),row(en?'cloudflare proxy':'پروکسی کلادفلر',onCF?'on':'off',onCF?'good':'bad'),`<div class="pr-verdict">${verdict}</div>`].join('')});
inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();f.requestSubmit()}})})();
// ---- 05 uuid + qr
(()=>{const o=document.getElementById('uuidOut'),nb=document.getElementById('uuidNew'),cb=document.getElementById('uuidCopy'),qi=document.getElementById('qrIn'),qo=document.getElementById('qrOut');if(!o)return;
const mk=()=>{o.textContent=crypto.randomUUID();o.classList.remove('flash');void o.offsetWidth;o.classList.add('flash')};mk();nb.addEventListener('click',mk);
cb.addEventListener('click',()=>{navigator.clipboard.writeText(o.textContent).then(()=>{cb.classList.add('did');setTimeout(()=>cb.classList.remove('did'),1400)}).catch(()=>{})});
let lib;const load=()=>lib||(lib=new Promise((res,rej)=>{if(window.qrcode)return res(window.qrcode);const s=document.createElement('script');s.src='assets/qr.js';s.onload=()=>res(window.qrcode);s.onerror=rej;document.head.appendChild(s)}));
let t;const draw=()=>{const v=qi.value.trim();if(!v){qo.innerHTML=`<div class="tk-empty">${isEn()?'Your QR will appear here':'QR این‌جا ظاهر می‌شود'}</div>`;return}
load().then(Q=>{let q;try{q=Q(0,'M');q.addData(v,'Byte');q.make()}catch(e){qo.innerHTML=`<div class="tk-empty bad">${isEn()?'Too long for a QR (max ~2.9 KB).':'برای QR خیلی بلند است (حداکثر ~۲.۹ کیلوبایت).'}</div>`;return}
const n=q.getModuleCount(),cells=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))cells.push(`M${c} ${r}h1v1h-1z`);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 ${n+4} ${n+4}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n+4}" height="${n+4}" fill="#f4efe4"/><path d="${cells.join('')}" fill="#171512"/></svg>`;
const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
qo.innerHTML=`<div class="qr-wrap">${svg}</div><div class="qr-meta"><span>${n}×${n} · ${v.length} chars · ECC M</span><a class="btn" download="nika-qr.svg" href="${url}"><span data-fa>دانلود SVG</span><span data-en>Download SVG</span><span class="ic-t">↓</span></a></div>`}).catch(()=>{qo.innerHTML='<div class="tk-empty bad">QR engine failed to load.</div>'})};
qi.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(draw,200)});
const dec=document.getElementById('decIn');if(dec)dec.addEventListener('input',()=>{if(!qi.value.trim()||qi.dataset.auto==='1'){qi.value=dec.value;qi.dataset.auto='1';draw()}});
new MutationObserver(()=>{if(qi.value.trim())draw()}).observe(document.documentElement,{attributes:true,attributeFilter:['class']})})();
// ---- keyboard cheatsheet (?)
(()=>{const el=document.createElement('div');el.className='keys';el.id='keys';el.hidden=true;el.innerHTML=`<div class="keys-card"><div class="num">— Shortcuts</div><h3 data-fa>کلیدهای میانبر</h3><h3 data-en>Keyboard shortcuts</h3><dl>
<dt><kbd>⌘</kbd><kbd>K</kbd> / <kbd>/</kbd></dt><dd data-fa>پالت فرمان</dd><dd data-en>Command palette</dd>
<dt><kbd>?</kbd></dt><dd data-fa>همین راهنما</dd><dd data-en>This card</dd>
<dt><kbd>Esc</kbd></dt><dd data-fa>بستن هر پنجره</dd><dd data-en>Close any overlay</dd>
<dt><kbd>n</kbd><kbd>i</kbd><kbd>k</kbd><kbd>a</kbd></dt><dd data-fa>یک سورپرایز</dd><dd data-en>A little surprise</dd>
</dl><small data-fa>برای بستن Esc یا کلیک بیرون.</small><small data-en>Esc or click outside to close.</small></div>`;document.body.appendChild(el);
const open=()=>{el.hidden=false;requestAnimationFrame(()=>el.classList.add("on"))},close=()=>{el.classList.remove('on');setTimeout(()=>el.hidden=true,250)};
el.addEventListener('click',e=>{if(e.target===el)close()});
addEventListener('keydown',e=>{if(/input|textarea/i.test(document.activeElement.tagName))return;if(e.key==='?'){e.preventDefault();el.hidden?open():close()}else if(e.key==='Escape'&&!el.hidden)close()});
window.openKeys=open})();
// ---- v19 magnetic buttons + ink ripple
(()=>{if(matchMedia('(hover:none)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
document.querySelectorAll('.btn,.tk-tabs button,.os-pick button').forEach(b=>{b.classList.add('mag');
b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;b.style.setProperty('--mx',(x*.18).toFixed(1)+'px');b.style.setProperty('--my',(y*.28).toFixed(1)+'px')});
b.addEventListener('mouseleave',()=>{b.style.setProperty('--mx','0px');b.style.setProperty('--my','0px')});
b.addEventListener('pointerdown',e=>{const r=b.getBoundingClientRect(),d=document.createElement('i');d.className='rip';d.style.left=(e.clientX-r.left)+'px';d.style.top=(e.clientY-r.top)+'px';b.appendChild(d);setTimeout(()=>d.remove(),700)})})})();
// ---- v21 deploy ways
(()=>{const tabs=document.querySelectorAll('.ways button');if(!tabs.length)return;tabs.forEach(b=>b.addEventListener('click',()=>{tabs.forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.way-panel').forEach(p=>{p.hidden=p.id!=='way-'+b.dataset.way});b.setAttribute('aria-selected','true')}));})();
// ---- v21 toast
window.toast=(fa,en)=>{let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=isEn()?en:fa;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),1800)};
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>toast('کپی شد ✓','Copied ✓')));
const _uc=document.getElementById('uuidCopy');if(_uc)_uc.addEventListener('click',()=>toast('UUID کپی شد ✓','UUID copied ✓'));
// ---- v21 status strip
(()=>{const box=document.getElementById('status');if(!box)return;const set=(k,ok,ms)=>{const el=box.querySelector(`[data-st=${k}]`);el.classList.add(ok?'ok':'bad');if(ms!=null)el.dataset.ms=ms+'ms'};
const t=(k,f)=>{const s=performance.now();return f().then(ok=>set(k,ok,Math.round(performance.now()-s))).catch(()=>set(k,false))};
const io=new IntersectionObserver(es=>{if(!es.some(e=>e.isIntersecting))return;io.disconnect();
Promise.all([t('site',()=>fetch('manifest.json?'+Date.now(),{cache:'no-store'}).then(r=>r.ok)),
t('edge',()=>fetch('https://1.1.1.1/cdn-cgi/trace',{cache:'no-store'}).then(r=>r.ok)),
t('api',()=>fetch('https://nika-feedback.nikanetteem.workers.dev/stats').then(r=>r.ok)),
t('repo',()=>fetch('https://api.github.com/repos/NikaTeem/Nika-Net',{cache:'force-cache'}).then(r=>r.ok||r.status===403))]).then(()=>{document.getElementById('stTime').textContent=new Date().toLocaleTimeString(isEn()?'en-GB':'fa-IR',{hour:'2-digit',minute:'2-digit'})})},{rootMargin:'300px'});io.observe(box)})();
// ---- v21 word reveal on English display headings
(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;document.querySelectorAll('.sec-head h2.en').forEach(h=>{h.classList.add('wr');let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3&&c.textContent.trim()){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return}const s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.innerHTML='<span>'+w+'</span>';f.appendChild(s)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='SVG'&&!c.classList.contains('circ-svg'))walk(c)})};walk(h)});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.6});document.querySelectorAll('.wr').forEach(h=>io.observe(h))})();
// ---- v24 suggestion box: counter + drop animation
(()=>{const ta=document.getElementById('fbText'),c=document.getElementById('fbCount');if(!ta)return;const up=()=>{const n=ta.value.length;c.textContent=(isEn()?n:fmtN(n))+' / '+(isEn()?'400':fmtN(400));c.classList.toggle('warn',n>360);c.classList.toggle('low',n>0&&n<8)};ta.addEventListener('input',up);new MutationObserver(up).observe(document.documentElement,{attributes:true,attributeFilter:['class']});up();
window.fbDrop=()=>{const box=document.getElementById('fbBox'),form=document.getElementById('fbForm');if(!box)return;form.classList.add('sent');box.classList.remove('drop');void box.offsetWidth;box.classList.add('drop');setTimeout(()=>form.classList.remove('sent'),2600);setTimeout(()=>box.classList.remove('drop'),4200)};})();
// ---- v25 graphics layer: plate corners, marginalia, icon draw, scribble progress
(()=>{const secs=[...document.querySelectorAll('main section.wrap')].filter(s=>s.querySelector('.sec-head'));
secs.forEach((sec,i)=>{sec.classList.add('plate');const n=String(i+1).padStart(2,'0');const c=document.createElement('div');c.className='plate-marks';c.innerHTML=`<i></i><i></i><i></i><i></i><span class="plate-no">plate ${n}</span><span class="plate-scale">scale 1:1 · graphite on paper</span>`;sec.appendChild(c)});
// scribble progress: replace bar with jittery pencil line
const prog=document.getElementById('prog');if(prog){prog.classList.add('scribble');prog.innerHTML='<svg preserveAspectRatio="none" viewBox="0 0 1000 6"><path id="progPath" d="M0 3 Q 50 1 100 3 T 200 3 T 300 3 T 400 3 T 500 3 T 600 3 T 700 3 T 800 3 T 900 3 T 1000 3"/></svg>';const pp=document.getElementById('progPath');const upd=()=>{const h=document.documentElement;const r=h.scrollTop/(h.scrollHeight-h.clientHeight||1);pp.style.strokeDashoffset=1000-r*1000};pp.style.strokeDasharray=1000;addEventListener('scroll',upd,{passive:true});upd()}
})();
// ---- v27 mirrors + service worker
(()=>{const els=document.querySelectorAll('[data-mir]');els.forEach(a=>{if(a.hasAttribute('data-static')){a.classList.add('ok');return}const s=performance.now();fetch(a.dataset.ping+'?'+Date.now(),{mode:'no-cors',cache:'no-store'}).then(r=>{if(r.type!=='opaque'&&!r.ok)throw 0;a.classList.add('ok');a.querySelector('small').textContent=Math.round(performance.now()-s)+' ms'}).catch(()=>{a.classList.add('bad');a.querySelector('small').textContent=isEn()?'unreachable':'در دسترس نیست'})});
const cp=document.getElementById('mirCopy');if(cp)cp.addEventListener('click',()=>{const t=[...els].map(a=>a.href).join('\n');navigator.clipboard.writeText(t).then(()=>toast('آدرس‌ها کپی شد ✓','Addresses copied ✓')).catch(()=>{})});
const sw=document.getElementById('mirSw');const set=(cls,fa,en)=>{if(!sw)return;sw.className='mir-sw '+cls;sw.querySelector('[data-fa]').textContent=fa;sw.querySelector('[data-en]').textContent=en};
if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('/sw.js').then(reg=>{const ready=()=>set('ok','نسخهٔ آفلاین ذخیره شد — این صفحه بدون اینترنت هم باز می‌شود.','Offline copy saved — this page opens without internet.');if(reg.active)ready();else reg.addEventListener('updatefound',()=>{const w=reg.installing;w&&w.addEventListener('statechange',()=>{if(w.state==='activated')ready()})})}).catch(()=>set('bad','مرورگر اجازهٔ ذخیرهٔ آفلاین نداد.','Browser refused the offline copy.'))}else set('','نسخهٔ آفلاین فقط روی https فعال می‌شود.','Offline copy is only available over https.')})();

// v28: playground + live version
(()=>{const f=document.getElementById('pgFrame'),c=document.getElementById('pgCover'),go=document.getElementById('pgGo'),rs=document.getElementById('pgReset');if(!f)return;
const URL_='https://nika-demo.nikanetteem.workers.dev/';let on=false;
function power(){if(on)return;on=true;c.classList.add('booting');f.src=URL_+'?lang='+(isEn()?'en':'fa');f.addEventListener('load',()=>{setTimeout(()=>{c.classList.add('off');document.querySelector('.pg-monitor').classList.add('on')},350)},{once:true});setTimeout(()=>{c.classList.add('off');document.querySelector('.pg-monitor').classList.add('on')},6000)}
go.addEventListener('click',power);
rs.addEventListener('click',()=>{if(!on){power();return}f.src='about:blank';setTimeout(()=>{f.src=URL_+'?reset='+Date.now()},80);toast('دمو ریست شد','Demo reset')});
fetch('https://raw.githubusercontent.com/NikaTeem/Nika-Net/main/version.json',{cache:'no-store'}).then(r=>r.json()).then(v=>{if(!v.version)return;const fa=v.version.replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]).replace(/\./g,'٫');document.getElementById('verFa').textContent=fa;document.getElementById('verEn').textContent='v'+v.version;document.querySelectorAll('[data-ver]').forEach(e=>e.textContent='v'+v.version)}).catch(()=>{});
})();

// v29: releases timeline
(()=>{const box=document.getElementById('relLine');if(!box)return;const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const io=new IntersectionObserver(es=>{if(!es.some(e=>e.isIntersecting))return;io.disconnect();
fetch('https://api.github.com/repos/NikaTeem/Nika-Net/commits?per_page=100&path=version.json').then(r=>r.ok?r.json():Promise.reject()).then(d=>{
const seen=new Set();const items=[];for(const c of d){const m=c.commit.message.split('\n')[0];const v=(m.match(/v?(\d+\.\d+(?:\.\d+)?)/)||[])[1];if(!v||seen.has(v))continue;seen.add(v);const title=m.replace(/^[^\p{L}\p{N}]+/u,'').replace(/^v?\d+\.\d+(\.\d+)?\s*[:—–-]?\s*/,'').replace(/\s*[—–(-]\s*v?\d+\.\d+(\.\d+)?\)?\s*$/,'');items.push({v,title,date:c.commit.author.date,sha:c.sha,url:c.html_url,major:/\.0$/.test(v)})}
const byDay={};items.forEach(i=>{const k=i.date.slice(0,10);(byDay[k]=byDay[k]||[]).push(i)});
const fa=n=>String(n).replace(/\d/g,x=>'۰۱۲۳۴۵۶۷۸۹'[x]);
const dayFmt=k=>new Date(k).toLocaleDateString(isEn()?'en-GB':'fa-IR',{day:'numeric',month:'long'});
let html='';let first=true;for(const k of Object.keys(byDay)){html+=`<div class="rel-day"><div class="rel-date">${dayFmt(k)}<small>${isEn()?byDay[k].length+' releases':fa(byDay[k].length)+' نسخه'}</small></div><div class="rel-items">`+byDay[k].map(i=>{const L=first;first=false;return `<a class="rel ${i.major?'major':''} ${L?'latest':''}" href="${i.url}" target="_blank" rel="noopener"><b>v${i.v}</b><span dir="auto">${esc(i.title)}</span>${L?'<i>'+(isEn()?'latest':'آخرین')+'</i>':''}</a>`}).join('')+'</div></div>'}
box.innerHTML=html;const c=document.getElementById('relCount');const days=Object.keys(byDay).length;c.textContent=isEn()?`${items.length} releases in ${days} days`:`${fa(items.length)} نسخه در ${fa(days)} روز`;
}).catch(()=>{box.innerHTML=`<div class="ledger-empty">${isEn()?'GitHub is quiet right now ↗':'الان دسترسی به GitHub نیست ↗'}</div>`})},{rootMargin:'300px'});io.observe(box)})();

// v30: compare tabs + clients
(()=>{document.querySelectorAll('.cmp-tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.cmp-tabs button').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.cmp-pane').forEach(p=>p.hidden=p.id!=='cmp-'+b.dataset.cmp)}));
const C={
android:[{n:'v2rayNG',d:['ساده‌ترین؛ Base64 را می‌خورد','Simplest; takes the Base64 link'],u:'https://github.com/2dust/v2rayNG/releases',f:'base64',star:1},{n:'Hiddify',d:['رابط فارسی، Sing-box داخلش','Persian UI, Sing-box inside'],u:'https://github.com/hiddify/hiddify-app/releases',f:'singbox / base64',star:1},{n:'NekoBox',d:['برای کاربران حرفه‌ای','For power users'],u:'https://github.com/MatsuriDayo/NekoBoxForAndroid/releases',f:'base64'},{n:'Clash Meta',d:['قوانین مسیریابی پیشرفته','Advanced routing rules'],u:'https://github.com/MetaCubeX/ClashMetaForAndroid/releases',f:'clash yaml'},{n:'WireGuard',d:['فقط برای کانفیگ WARP','WARP config only'],u:'https://play.google.com/store/apps/details?id=com.wireguard.android',f:'wireguard'}],
ios:[{n:'Streisand',d:['رایگان، پرطرفدار در ایران','Free, popular in Iran'],u:'https://apps.apple.com/app/streisand/id6450534064',f:'base64',star:1},{n:'Hiddify',d:['رابط فارسی، رایگان','Persian UI, free'],u:'https://apps.apple.com/app/hiddify-proxy-vpn/id6596777532',f:'singbox / base64',star:1},{n:'V2Box',d:['رایگان، پایدار','Free, stable'],u:'https://apps.apple.com/app/v2box-v2ray-client/id6446814690',f:'base64'},{n:'Shadowrocket',d:['پولی، قدرتمند','Paid, powerful'],u:'https://apps.apple.com/app/shadowrocket/id932747118',f:'base64'},{n:'WireGuard',d:['فقط برای کانفیگ WARP','WARP config only'],u:'https://apps.apple.com/app/wireguard/id1441195209',f:'wireguard'}],
win:[{n:'v2rayN',d:['کلاسیک ویندوز','The Windows classic'],u:'https://github.com/2dust/v2rayN/releases',f:'base64',star:1},{n:'Hiddify',d:['ساده و فارسی','Simple, Persian'],u:'https://github.com/hiddify/hiddify-app/releases',f:'singbox / base64',star:1},{n:'Nekoray',d:['سبک، Sing-box','Light, Sing-box core'],u:'https://github.com/MatsuriDayo/nekoray/releases',f:'base64'},{n:'Clash Verge Rev',d:['قوانین مسیریابی','Routing rules'],u:'https://github.com/clash-verge-rev/clash-verge-rev/releases',f:'clash yaml'},{n:'WireGuard',d:['فقط برای کانفیگ WARP','WARP config only'],u:'https://www.wireguard.com/install/',f:'wireguard'}],
mac:[{n:'Hiddify',d:['ساده و فارسی','Simple, Persian'],u:'https://github.com/hiddify/hiddify-app/releases',f:'singbox / base64',star:1},{n:'V2Box',d:['از اپ‌استور','From the App Store'],u:'https://apps.apple.com/app/v2box-v2ray-client/id6446814690',f:'base64',star:1},{n:'Clash Verge Rev',d:['قوانین مسیریابی','Routing rules'],u:'https://github.com/clash-verge-rev/clash-verge-rev/releases',f:'clash yaml'},{n:'Streisand',d:['همان نسخهٔ iOS','Same as the iOS app'],u:'https://apps.apple.com/app/streisand/id6450534064',f:'base64'},{n:'WireGuard',d:['فقط برای کانفیگ WARP','WARP config only'],u:'https://apps.apple.com/app/wireguard/id1451685025',f:'wireguard'}],
linux:[{n:'Hiddify',d:['AppImage / deb','AppImage / deb'],u:'https://github.com/hiddify/hiddify-app/releases',f:'singbox / base64',star:1},{n:'Nekoray',d:['AppImage، Sing-box','AppImage, Sing-box core'],u:'https://github.com/MatsuriDayo/nekoray/releases',f:'base64',star:1},{n:'Clash Verge Rev',d:['deb / rpm / AppImage','deb / rpm / AppImage'],u:'https://github.com/clash-verge-rev/clash-verge-rev/releases',f:'clash yaml'},{n:'sing-box CLI',d:['برای ترمینال‌دوست‌ها','For terminal people'],u:'https://sing-box.sagernet.org/installation/package-manager/',f:'singbox json'},{n:'wg-quick',d:['فقط برای کانفیگ WARP','WARP config only'],u:'https://www.wireguard.com/install/',f:'wireguard'}]};
const g=document.getElementById('clGrid');if(!g)return;const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function draw(k){g.innerHTML=(C[k]||[]).map((c,i)=>`<a class="cl ${c.star?'star':''}" href="${c.u}" target="_blank" rel="noopener" style="--i:${i}"><div class="cl-n">${esc(c.n)}${c.star?'<i>'+(isEn()?'recommended':'پیشنهادی')+'</i>':''}</div><div class="cl-d">${esc(isEn()?c.d[1]:c.d[0])}</div><div class="cl-f" dir="ltr">↳ ${esc(c.f)}</div></a>`).join('')}
const ua=navigator.userAgent;let k=/Android/i.test(ua)?'android':/iPhone|iPad/i.test(ua)?'ios':/Mac/i.test(ua)?'mac':/Linux/i.test(ua)?'linux':'win';
document.querySelectorAll('.cl-tabs button').forEach(b=>{b.classList.toggle('on',b.dataset.cl===k);b.addEventListener('click',()=>{k=b.dataset.cl;document.querySelectorAll('.cl-tabs button').forEach(x=>x.classList.toggle('on',x===b));draw(k)})});
draw(k);let L=isEn();new MutationObserver(()=>{if(isEn()!==L){L=isEn();draw(k)}}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
// nav shrink
addEventListener('scroll',()=>document.getElementById('nav').style.boxShadow=scrollY>40?'0 8px 30px -18px rgba(0,0,0,.5)':'none',{passive:true});
document.querySelectorAll('#links a').forEach(a=>a.addEventListener('click',()=>document.getElementById('links').classList.remove('open')));
// ---- v44: story timeline (live repo stats)
(()=>{
  const sec=document.getElementById('story');if(!sec)return;
  const q=s=>sec.querySelectorAll(s);
  const set=(k,v)=>q('[data-n="'+k+'"]').forEach(e=>{e.textContent=v});
  const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
  const count=(el,to)=>{const t0=performance.now(),d=900;const step=t=>{const p=Math.min(1,(t-t0)/d),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=v;if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
  const born=new Date('2026-09-08T20:42:58Z');
  const days=Math.max(1,Math.round((Date.now()-born)/864e5));
  const now=new Date();q('[data-now]').forEach(e=>e.textContent=now.toISOString().slice(0,10));
  let done=false;
  const load=async()=>{if(done)return;done=true;
    set('days',days);
    try{const r=await fetch('https://api.github.com/repos/NikaTeem/Nika-Net');if(r.ok){const j=await r.json();q('[data-n="stars"]').forEach(e=>count(e,j.stargazers_count||0))}}catch(e){}
    try{const r=await fetch('https://api.github.com/repos/NikaTeem/Nika-Net/commits?per_page=1',{});const l=r.headers.get('Link')||'';const m=l.match(/page=(\d+)>; rel="last"/);if(m)q('[data-n="commits"]').forEach(e=>count(e,+m[1]))}catch(e){}
    try{const r=await fetch('https://api.github.com/repos/NikaTeem/Nika-Net/commits?per_page=100&path=version.json');if(r.ok){const j=await r.json();q('[data-n="bumps"]').forEach(e=>count(e,j.length))}}catch(e){}
    try{const r=await fetch('https://raw.githubusercontent.com/NikaTeem/Nika-Net/main/version.json?'+Date.now());if(r.ok){const j=await r.json();q('[data-ver]').forEach(e=>e.textContent='v'+j.version)}}catch(e){}
    q('[data-n]').forEach(e=>{if(e.textContent==='—')e.textContent='·'});
  };
  new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){load();sec.classList.add('sty-in');o.disconnect()}},{rootMargin:'200px'}).observe(sec);
})();

// ---- v44: Telegram bot conversation replay
(()=>{
  const log=document.getElementById('tgcLog');if(!log)return;
  const S={
    fa:[['u','/start'],['b','سلام! من لانچر نیکا نت هستم.\nبرایت روی حساب Cloudflare خودت پنل می‌سازم. آماده‌ای؟','🔑 لینک مستقیم توکن|🚀 ساخت پنل جدید'],['u','🔑 لینک مستقیم توکن'],['b','این لینک را باز کن — همهٔ دسترسی‌ها از قبل تیک خورده. فقط Create Token بزن و توکن را برایم بفرست.'],['u','cf_••••••••••••••••••••••7Yq2'],['b','توکن معتبر است ✓  ذخیره‌اش کنم؟ (با AES-GCM رمز می‌شود)','بله|نه'],['u','بله'],['u','🚀 ساخت پنل جدید'],['b','اسم پنل را بفرست (فقط حروف انگلیسی):'],['u','my-paper'],['b','در حال ساخت…\n▸ Worker ساخته شد\n▸ KV وصل شد\n▸ پنل مستقر شد','',1],['b','پنلت آماده است ✨\nhttps://my-paper.<you>.workers.dev/admin\nرمز اول را همان‌جا تعیین کن.','باز کردن پنل']],
    en:[['u','/start'],['b','Hi! I am the Nika Net Launcher.\nI build a panel on your own Cloudflare account. Ready?','🔑 Token link|🚀 New panel'],['u','🔑 Token link'],['b','Open this link — every permission is pre-ticked. Just hit Create Token and send it to me.'],['u','cf_••••••••••••••••••••••7Yq2'],['b','Token is valid ✓  Save it? (encrypted with AES-GCM)','Yes|No'],['u','Yes'],['u','🚀 New panel'],['b','Send a panel name (letters only):'],['u','my-paper'],['b','Building…\n▸ Worker created\n▸ KV bound\n▸ Panel deployed','',1],['b','Your panel is ready ✨\nhttps://my-paper.<you>.workers.dev/admin\nSet your first password there.','Open panel']]
  };
  let tm=[],run=0;
  const clear=()=>{tm.forEach(clearTimeout);tm=[];log.innerHTML=''};
  const bubble=(who,txt,kb)=>{const d=document.createElement('div');d.className='tgc-m '+who;d.innerHTML='<span>'+txt.replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</span>'+(kb?'<div class="tgc-kb">'+kb.split('|').map(k=>'<i>'+k+'</i>').join('')+'</div>':'');log.appendChild(d);log.scrollTop=log.scrollHeight;return d};
  window.tgcPlay=(force)=>{if(run&&!force)return;run=1;clear();
    const lang=document.documentElement.classList.contains('en')?'en':'fa';let t=300;
    S[lang].forEach(([who,txt,kb,slow])=>{
      if(who==='b'){tm.push(setTimeout(()=>{const ty=bubble('b typing','···');ty.dataset.t=1},t));t+=slow?1400:700;
        tm.push(setTimeout(()=>{const ty=log.querySelector('[data-t]');ty&&ty.remove();bubble('b',txt,kb);window.nkSound&&nkSound('tap')},t));t+=900}
      else{tm.push(setTimeout(()=>{bubble('u',txt);window.nkSound&&nkSound('tap')},t));t+=800}
    });
    tm.push(setTimeout(()=>{run=0},t));
  };
  new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){tgcPlay();o.disconnect()}},{threshold:.35}).observe(log);
  addEventListener('nika:lang',()=>{if(log.children.length)tgcPlay(true)});
})();

// ---- v44: chalkboard interactions + page-turn sound between acts
(()=>{
  const h=document.documentElement;
  // chalk dust puff on click (board theme only)
  document.addEventListener('pointerdown',e=>{
    if(!h.classList.contains('board')||e.pointerType==='touch'&&false)return;
    for(let i=0;i<7;i++){const p=document.createElement('i');p.className='chalk-p';const a=Math.random()*Math.PI*2,r=14+Math.random()*26;p.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r+18}px;--s:${.6+Math.random()}`;document.body.appendChild(p);setTimeout(()=>p.remove(),900)}
    if(window.nkSound)nkSound('chalk');
  },{passive:true});
  // extend sound palette
  const prev=window.nkSound;
  if(prev){window.nkSound=k=>{if(k==='chalk'){prev('scratch');setTimeout(()=>prev('scratch'),40);return}prev(k)}}
  // page-turn when a new act enters (throttled)
  let last=0;const acts=document.querySelectorAll('.act');
  if(acts.length&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>{es.forEach(x=>{if(x.isIntersecting&&Date.now()-last>1500){last=Date.now();if(h.classList.contains('snd')&&window.nkSound)nkSound('page')}})},{threshold:.6});acts.forEach(a=>io.observe(a))}
  // eraser smudge trail on board: pointer moves leave brief chalk haze
  let acc=0;addEventListener('pointermove',e=>{if(!h.classList.contains('board')||e.pointerType==='touch')return;acc+=Math.hypot(e.movementX||0,e.movementY||0);if(acc<60)return;acc=0;const s=document.createElement('i');s.className='chalk-s';s.style.cssText=`left:${e.clientX}px;top:${e.clientY}px`;document.body.appendChild(s);setTimeout(()=>s.remove(),1200)},{passive:true});
})();
