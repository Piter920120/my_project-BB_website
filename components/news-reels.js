const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const state={all:[],filtered:[],filter:'all',type:'all',query:'',visible:6};
const normalize=v=>String(v??'').trim();
const stripHtml=v=>{const d=document.createElement('div');d.innerHTML=normalize(v);return(d.textContent||'').replace(/\s+/g,' ').trim()};
const esc=s=>normalize(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const imageUrl=v=>{const s=normalize(v);if(!s)return'../img/bb19start.jpg';if(/^https?:\/\//.test(s)||s.startsWith('../')||s.startsWith('/'))return s.startsWith('/')?'..'+s:s;return'../'+s.replace(/^\.\//,'')};
const tagList=n=>Array.isArray(n.tags)?n.tags.map(normalize).filter(Boolean):normalize(n.tags).split(',').map(x=>x.trim()).filter(Boolean);
const itemType=n=>normalize(n.type).toLowerCase()==='instagram'||normalize(n.instagramUrl)?'instagram':'article';
const validInstagramUrl=v=>{try{const u=new URL(normalize(v));return['instagram.com','www.instagram.com'].includes(u.hostname)&&/^\/(reel|reels|p)\//.test(u.pathname)?u.href:null}catch{return null}};
function setupShell(){const menu=$('.menu-btn'),nav=$('#nav');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});$$('#nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));addEventListener('scroll',()=>$('#topbar')?.classList.toggle('scrolled',scrollY>30),{passive:true});$('#year').textContent=new Date().getFullYear();const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(x=>io.observe(x))}
function excerpt(n,len=150){const t=stripHtml(n.text);return t.length>len?t.slice(0,len).trim()+'…':t}
function createFilters(){const box=$('#filters');[...new Set(state.all.flatMap(tagList).map(x=>x.toLowerCase()))].slice(0,10).forEach(tag=>{const b=document.createElement('button');b.type='button';b.dataset.filter=tag;b.textContent=tag;box.append(b)});$$('#filters button').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;state.visible=6;$$('#filters button').forEach(x=>x.classList.toggle('active',x===b));applyFilters()}));$$('[data-type]').forEach(b=>b.addEventListener('click',()=>{state.type=b.dataset.type;state.visible=6;$$('[data-type]').forEach(x=>x.classList.toggle('active',x===b));applyFilters()}))}
function applyFilters(){const q=state.query.toLowerCase();state.filtered=state.all.filter(n=>{const tags=tagList(n).map(x=>x.toLowerCase());const type=itemType(n);const tagOK=state.filter==='all'||tags.includes(state.filter);const typeOK=state.type==='all'||type===state.type;const hay=[n.title,n.text,n.date,n.instagramUrl,...tags].map(normalize).join(' ').toLowerCase();return tagOK&&typeOK&&hay.includes(q)});render()}
function render(){const list=state.filtered;$('#result-count').textContent=`${list.length} ${list.length===1?'materiał':'materiałów'}`;const featured=$('#featured-news'),grid=$('#news-grid');featured.replaceChildren();grid.replaceChildren();if(!list.length){grid.innerHTML='<div class="empty">Nie znaleziono materiałów.</div>';$('#load-more').hidden=true;return}featured.append(featuredCard(list[0]));list.slice(1,state.visible+1).forEach(n=>grid.append(newsCard(n)));$('#load-more').hidden=list.length<=state.visible+1}
function featuredCard(n){const reel=itemType(n)==='instagram',el=document.createElement('article');el.className='featured-card reveal visible'+(reel?' reel-featured':'');el.innerHTML=`<div class="featured-card__image" style="background-image:linear-gradient(0deg,#0008,#0001),url('${esc(imageUrl(n.image))}')"></div><div class="featured-card__copy"><span class="tag">${reel?'REEL':'Najnowsze'}</span><time class="date">${esc(n.date)}</time><h3>${esc(n.title)}</h3><p>${esc(excerpt(n,230))}</p><button type="button" class="read-more">${reel?'Odtwórz rolkę':'Czytaj więcej'} →</button></div>`;$('.read-more',el).addEventListener('click',()=>openItem(n));return el}
function newsCard(n){const reel=itemType(n)==='instagram',el=document.createElement('article');el.className='news-card'+(reel?' reel-card':'');const media=reel?`<div class="news-card__media"><span class="reel-badge">REEL</span><img class="news-card__image" src="${esc(imageUrl(n.image))}" alt="" loading="lazy"></div>`:`<img class="news-card__image" src="${esc(imageUrl(n.image))}" alt="" loading="lazy">`;el.innerHTML=`${media}<div class="news-card__copy"><div class="card-tags">${tagList(n).slice(0,3).map(t=>`<span>#${esc(t)}</span>`).join('')}</div><time class="date">${esc(n.date)}</time><h3>${esc(n.title)}</h3><p>${esc(excerpt(n))}</p><button type="button" class="read-more">${reel?'Odtwórz rolkę':'Czytaj więcej'} →</button></div>`;$('.read-more',el).addEventListener('click',()=>openItem(n));return el}
function openItem(n){itemType(n)==='instagram'?openReel(n):openArticle(n)}
function openArticle(n){const d=$('#news-dialog');$('#dialog-content').innerHTML=`<img class="dialog-image" src="${esc(imageUrl(n.image))}" alt=""><div class="dialog-copy"><div class="card-tags">${tagList(n).map(t=>`<span>#${esc(t)}</span>`).join('')}</div><time class="date">${esc(n.date)}</time><h2 id="dialog-title">${esc(n.title)}</h2><div class="dialog-body">${esc(stripHtml(n.text))}</div></div>`;d.showModal()}
function openReel(n){

    const url = n.instagramUrl;

    if(!url){

        alert(
            "Brak poprawnego linku do rolki Instagram."
        );

        return;
    }

    window.open(
        url,
        "_blank"
    );

}
//function loadInstagramEmbed(){if(window.instgrm?.Embeds){window.instgrm.Embeds.process();return}let s=document.querySelector('script[data-instagram-embed]');if(!s){s=document.createElement('script');s.async=true;s.src='https://www.instagram.com/embed.js';s.dataset.instagramEmbed='true';s.onload=()=>window.instgrm?.Embeds.process();document.body.append(s)}}

async function loadNews(){try{const r=await fetch('../news.json?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();if(!Array.isArray(data))throw Error('Nieprawidłowy format');state.all=data.filter(n=>n.published!==false);createFilters();applyFilters()}catch(e){$('#news-grid').innerHTML='<div class="empty">Nie udało się pobrać aktualności. Sprawdź news.json.</div>';$('#result-count').textContent='0 materiałów';console.error(e)}}
setupShell();$('#news-search').addEventListener('input',e=>{state.query=e.target.value.trim();state.visible=6;applyFilters()});$('#load-more').addEventListener('click',()=>{state.visible+=6;render()});$('.dialog-close').addEventListener('click',()=>$('#news-dialog').close());$('#news-dialog').addEventListener('click',e=>{if(e.target===$('#news-dialog'))$('#news-dialog').close()});$('#news-dialog').addEventListener('close',()=>{$('#dialog-content').replaceChildren()});loadNews();
