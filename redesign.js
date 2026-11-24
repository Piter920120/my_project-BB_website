const schedule={fri:[['16:00','XTREMALNY: DESKOROLKA','Skatepark, ul. Biskupska 2','SPORT'],['20:00','BB BEFORE PARTY','Malinowy Rynek · DJ EXO','FREE'],['22:00','KONCERT donGURALesko','Biesiady Leśna · ul. Sienkiewicza 9','MUSIC']],sat:[['09:00','TURNIEJ 5×5 · START','Hala Sportowo-Widowiskowa','BASKET'],['09:00','BROKEN 3×3 JUNIOR','Boisko zewnętrzne SP1','JUNIOR'],['10:00','BROKEN FIT MARATON','Amfiteatr miejski','FIT'],['12:00','NBA 2K · TATTOO · KIDS','Hala Sportowo-Widowiskowa','STREFY'],['16:00','XTREMALNY: BMX','Skatepark, ul. Biskupska 2','SPORT'],['21:00','BB PARTY','Biesiady Leśna','PARTY']],sun:[['09:00','BROKEN JOGA','Boisko zewnętrzne SP3','FIT'],['11:00','WIELKI FINAŁ 5×5','Hala Sportowo-Widowiskowa','BASKET'],['11:00','TATTOO · GASTRO · RELAKS','Hala i teren przed halą','STREFY'],['13:00','XTREMALNY: HULAJNOGA','Skatepark, ul. Biskupska 2','SPORT']]};
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
function renderSchedule(day='fri'){const box=$('#schedule');box.replaceChildren(...schedule[day].map(([time,title,place,tag])=>{const row=document.createElement('article');row.className='schedule-item';row.innerHTML=`<time>${time}</time><div><h3>${title}</h3><p>${place}</p></div><b>${tag}</b>`;return row}))}
renderSchedule();
$$('[data-day]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-day]').forEach(x=>x.setAttribute('aria-selected','false'));btn.setAttribute('aria-selected','true');renderSchedule(btn.dataset.day)}));
const menu=$('.menu-btn'),nav=$('#nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});$$('#nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
addEventListener('scroll',()=>$('#topbar').classList.toggle('scrolled',scrollY>30),{passive:true});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.classList.contains('stat'))animateCount(e.target.querySelector('[data-count]'));io.unobserve(e.target)}}),{threshold:.16});$$('.reveal').forEach(el=>io.observe(el));
function animateCount(el){const end=+el.dataset.count,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){el.textContent=end;return}let start;function tick(t){start??=t;const p=Math.min((t-start)/850,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}
function strip(html){const d=document.createElement('div');d.innerHTML=html;return (d.textContent||'').replace(/\s+/g,' ').trim()}
fetch('/news.json?v='+Date.now()).then(r=>{if(!r.ok)throw Error();return r.json()}).then(items=>{const grid=$('#news-grid');grid.replaceChildren(...items.slice(0,3).map(n=>{const a=document.createElement('article');a.className='news-card reveal visible';const img=document.createElement('img');img.src=(n.image||'').replace(/^\.\.\//,'');img.alt='';img.loading='lazy';const copy=document.createElement('div');copy.className='news-copy';const time=document.createElement('time');time.textContent=n.date||'';const h=document.createElement('h3');h.textContent=n.title||'';const p=document.createElement('p');const clean=strip(n.text||'');p.textContent=clean.slice(0,155)+(clean.length>155?'…':'');copy.append(time,h,p);a.append(img,copy);return a}))}).catch(()=>{$('#news-grid').innerHTML='<p class="loading">Aktualności są chwilowo niedostępne.</p>'});
$('#year').textContent=new Date().getFullYear();
function updateCountdown(){

    const eventDate =
        new Date(
            "2027-06-18T00:00:00"
        );

    const now =
        new Date();

    const diff =
        eventDate - now;

    if(diff <= 0){

        const countdown =
            document.getElementById(
                "countdown"
            );

        if(countdown){

            countdown.innerHTML =
            `
            <div class="count-box">
                <strong>🔥</strong>
                <span>BROKEN BALL TRWA</span>
            </div>
            `;
        }

        return;
    }

    const days =
        Math.floor(
            diff /
            (1000*60*60*24)
        );

    const hours =
        Math.floor(
            (
                diff %
                (1000*60*60*24)
            ) /
            (1000*60*60)
        );

    const minutes =
        Math.floor(
            (
                diff %
                (1000*60*60)
            ) /
            (1000*60)
        );

    document.getElementById(
        "days"
    ).textContent = days;

    document.getElementById(
        "hours"
    ).textContent =
    String(hours)
        .padStart(2,"0");

    document.getElementById(
        "minutes"
    ).textContent =
    String(minutes)
        .padStart(2,"0");

}

updateCountdown();

setInterval(
    updateCountdown,
    60000
);