/* SEO Pipeline: one renderer for the tracker panel and the hub page. Data: tracker.json seoPipeline + items. The hub passes opt.ctx for its private detail. */
(function(){
var CSS='.sp{background:#152038;border:1px solid #2a3b5c;border-left:4px solid #3dd6c6;border-radius:14px;padding:14px 16px;margin:10px 0;color:#e8eef8;font:14px/1.45 "Segoe UI",system-ui,-apple-system,sans-serif}'
+'.sp h2{margin:0;font-size:1.05rem}.sp .mu{color:#93a4c3;font-size:.8rem}.sp .hd{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:baseline}'
+'.sp .score{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0}.sp .sc{background:#0f1930;border:1px solid #2a3b5c;border-radius:10px;padding:6px 12px;font-weight:700}.sp .sc b{color:#3ecf8e;font-size:1.1rem}'
+'.sp .pips{display:inline-flex;gap:4px;vertical-align:middle;margin-left:6px}.sp .pip{width:14px;height:14px;border-radius:50%;border:2px solid #3ecf8e}.sp .pip.on{background:#3ecf8e}'
+'.sp .card{background:#0f1930;border:1px solid #2a3b5c;border-radius:10px;padding:10px 12px;margin:8px 0;cursor:pointer}.sp .card:hover{border-color:#5b8cff}.sp .t1{font-weight:700}'
+'.sp .trk{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:8px 0 4px}.sp .stp{text-align:center;font-size:.7rem;font-weight:700;padding:4px 2px;border-radius:999px;background:rgba(147,164,195,.12);color:#6b7a94}'
+'.sp .stp.past{background:rgba(62,207,142,.12);color:rgba(170,200,185,.8)}.sp .stp.cur{background:rgba(240,180,41,.22);color:#f0b429;outline:1px solid #f0b429}.sp .stp.cur.g{background:rgba(62,207,142,.25);color:#3ecf8e;outline-color:#3ecf8e}'
+'.sp .tag{display:inline-block;padding:1px 8px;border-radius:999px;font-size:.7rem;font-weight:700;border:1px solid #f0b429;color:#f0b429;margin-left:4px}'
+'.sp .ln{font-size:.84rem;margin:3px 0}.sp .ln b{color:#c7d2e6}.sp details{margin-top:4px}.sp summary{cursor:pointer;color:#8ec8ff;font-size:.8rem}'
+'.sp .bench{border-top:1px solid #2a3b5c;margin-top:10px;padding-top:8px}.sp .bi{font-size:.84rem;margin:4px 0;cursor:pointer}.sp .hist{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.sp .hw{font-size:.75rem;padding:2px 10px;border-radius:999px;border:1px solid #2a3b5c;background:#0f1930}'
+'@media(max-width:640px){.sp{padding:12px}.sp .stp{font-size:.62rem}.sp .trk{gap:3px}}';
var ST=['Queued','Randy working','Live (B Dub verify)','Green'];
function e(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function today(){var n=new Date(new Date().toLocaleString('en-US',{timeZone:'America/New_York'}));return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')}
function green(i){return /^completed$/i.test(i.status||'')}
function stage(i,monday){if(green(i))return 3;var p=i.parties||{};if(/^verify complete$/i.test(i.status||'')||p.randy=='done')return 2;if(p.randy=='working'||p.randy=='ongoing'||today()>=monday)return 1;return 0}
function pick(D){var P=D.seoPipeline,by={};D.items.forEach(function(i){by[String(i.id)]=i});var t=today(),W=P.weeks.slice().sort(function(a,b){return a.monday<b.monday?-1:1}),cur=W.filter(function(w){return w.monday<=t}).pop()||W[0];
var ids=cur.items.map(function(a){return String(a.id)}),open=cur.items.filter(function(a){return !(by[a.id]&&green(by[a.id]))}).length,promo=(P.bench||[]).filter(function(b){return ids.indexOf(String(b.id))<0&&!(by[b.id]&&green(by[b.id]))}).slice(0,Math.max(0,cur.items.length-open));
return {by:by,t:t,W:W,cur:cur,promo:promo}}
/* The three open Rob/Randy priorities: this week's picks not yet green, topped up from the bench in order (promote next on close). */
function active(D){if(!D.seoPipeline||!D.seoPipeline.weeks||!D.seoPipeline.weeks.length)return [];var k=pick(D);return k.cur.items.filter(function(a){return !(k.by[a.id]&&green(k.by[a.id]))}).concat(k.promo).map(function(a){return k.by[a.id]}).filter(Boolean)}
function underSteve(i){var p=i.parties||{};return p.steve=='open'||p.steve=='waiting'}
function render(el,D,opt){opt=opt||{};var P=D.seoPipeline,C=opt.ctx;if(!P||!P.weeks||!P.weeks.length){el.style.display='none';return}
if(!document.getElementById('spcss')){var s=document.createElement('style');s.id='spcss';s.textContent=CSS;document.head.appendChild(s)}
var K=pick(D),by=K.by,t=K.t,W=K.W,cur=K.cur,pr=K.promo.map(function(b){return String(b.id)});
var gc=function(w){return w.items.filter(function(a){return by[a.id]&&green(by[a.id])}).length};
var g=gc(cur),per=cur.items.length;
var pips='';for(var k=0;k<per;k++)pips+='<span class="pip'+(k<g?' on':'')+'"></span>';
var h='<div class="hd"><h2>'+e(P.title)+'</h2><span class="mu">'+e(cur.label)+'</span></div><div class="mu">'+e(P.subtitle)+'</div>';
h+='<div class="score"><span class="sc">This week: <b>'+g+' of '+per+'</b> green<span class="pips">'+pips+'</span></span>';
if(C){var mk=t.slice(0,7),mn=new Date(t+'T12:00:00').toLocaleString('en-US',{month:'long'}),mc=D.items.filter(function(i){return green(i)&&String(i.verified||'').slice(0,7)==mk}).length;
h+='<span class="sc" title="'+e(C.monthRule)+'">'+e(mn)+': <b>'+mc+' of '+(C.perMonth||12)+'</b> closed</span>'}
h+='</div>';if(C)h+='<div class="mu">'+e(C.monthRule)+'</div>';
h+=cur.items.concat(K.promo).map(function(a){var i=by[a.id]||{},s=stage(i,cur.monday),x=C&&C.items&&C.items[a.id];
return '<div class="card" data-j="'+e(a.id)+'"><div class="t1">SEO #'+e(a.id)+' · '+e(a.title)+(pr.indexOf(String(a.id))>=0?'<span class="tag">Promoted</span>':'')+(underSteve(i)?'<span class="tag">Under Steve</span>':'')+'</div>'
+'<div class="trk">'+ST.map(function(n,q){return '<span class="stp'+(q<s?' past':'')+(q==s?' cur'+(q==3?' g':''):'')+'">'+n+'</span>'}).join('')+'</div>'
+'<div class="ln"><b>Owner:</b> '+e(a.owner)+'</div>'
+(x?'<div class="ln"><b>Randy:</b> '+e(x.randy)+'</div><div class="ln"><b>Rob:</b> '+e(x.rob)+'</div><details><summary>Why this one, and what full green means</summary><div class="ln"><b>Why:</b> '+e(x.why)+'</div><div class="ln"><b>Full green when:</b> '+e(x.green)+'</div></details>':'')+'</div>'}).join('');
if(C&&C.bench&&C.bench.length)h+='<div class="bench"><span class="mu">Next up if we finish early</span>'+C.bench.filter(function(b){return pr.indexOf(String(b.id))<0&&!(by[b.id]&&green(by[b.id]))}).map(function(b){var i=by[b.id]||{};return '<div class="bi" data-j="'+e(b.id)+'">SEO #'+e(b.id)+' · '+e(b.title)+(underSteve(i)?'<span class="tag">Under Steve</span>':'')+' <span class="mu">'+e(b.why)+'</span></div>'}).join('')+'</div>';
if(C)h+='<div class="hist"><span class="mu">Week history:</span>'+W.map(function(w){return '<span class="hw">'+e(w.label)+': '+e(w.final||(gc(w)+'/'+w.items.length))+(w.monday>t?' (upcoming)':'')+'</span>'}).join('')+'</div>';
if(!/\bsp\b/.test(el.className))el.className=(el.className?el.className+' ':'')+'sp';el.style.display='';el.innerHTML=h;
el.querySelectorAll('[data-j]').forEach(function(y){y.onclick=function(ev){if(ev.target.tagName=='SUMMARY')return;opt.onItem?opt.onItem(y.dataset.j):(location.href='https://tellennium-seo-tracker.vercel.app/')}})}
window.SEOPipeline={render:render,stage:stage,active:active};
})();
