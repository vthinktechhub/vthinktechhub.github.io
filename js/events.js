/* Builds the Events page from js/events-data.js: a featured banner, upcoming and past tiles, and a popup with details. */
(function(){
  var list=(window.VTHINK_EVENTS||[]).slice();
  var today=new Date(); today.setHours(0,0,0,0);
  var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Accepts "YYYY", "YYYY-MM" or "YYYY-MM-DD"; a partial date counts as the end of that month/year when deciding upcoming vs past.
  function parse(d){ if(!d) return null; var p=String(d).split('-'); var y=+p[0], m=p[1]?+p[1]-1:11, day=p[2]?+p[2]:new Date(y,m+1,0).getDate(); return new Date(y,m,day); }
  function fmt(d){
    if(!d) return 'Open now';
    var p=String(d).split('-'), x=parse(d);
    if(p.length===1) return p[0];
    if(p.length===2) return MONTHS[x.getMonth()]+' '+x.getFullYear();
    return x.getDate()+' '+MONTHS[x.getMonth()]+' '+x.getFullYear();
  }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function isUpcoming(e){ if(e.status) return e.status!=='past'; var x=parse(e.date); return !x || x>=today; }

  var upcoming=list.filter(isUpcoming).sort(function(a,b){
    var x=parse(a.date), y=parse(b.date);
    if(!x&&!y) return 0; if(!x) return 1; if(!y) return -1; return x-y;   // soonest first, undated (open calls) last
  });
  var past=list.filter(function(e){return !isUpcoming(e);}).sort(function(a,b){ return (parse(b.date)||0)-(parse(a.date)||0); });
  // Featured banner prefers the next dated event; open calls only when nothing is dated
  var dated=upcoming.filter(function(e){return parse(e.date);});

  var ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var MARK='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 3 L57 17.5 L57 46.5 L32 61 L7 46.5 L7 17.5 Z" fill="none" stroke="#E39B12" stroke-width="3" stroke-linejoin="round"/><path d="M17 20 L26 20 L35 45 L30 45 Z" fill="#F4F6FB"/><path d="M30 45 L35 45 L47 20 L38 20 Z" fill="#E39B12"/></svg>';

  /* A drawn VThink poster for events that have no image yet */
  function poster(e, big){
    if(e.poster) return '<img src="'+esc(e.poster)+'" alt="'+esc(e.title)+' poster" loading="lazy">';
    return '<div class="evart'+(big?' big':'')+'" aria-hidden="true">'+
      '<div class="evart-top">'+MARK+'<span>VThink Tech Hub</span></div>'+
      '<div class="evart-title">'+esc(e.title)+'</div>'+
      '<div class="evart-meta"><span>'+esc(fmt(e.date))+(e.time?' · '+esc(e.time):'')+'</span>'+(e.venue?'<span>'+esc(e.venue)+'</span>':'')+'</div>'+
    '</div>';
  }

  function tile(e){
    return '<article class="evtile">'+
      '<button type="button" class="evtile-btn" data-id="'+esc(e.id)+'" aria-haspopup="dialog">'+
        '<span class="evtile-img">'+poster(e)+'</span>'+
        '<span class="evtile-cap"><span class="evtile-txt"><span class="evtile-date">'+esc(fmt(e.date))+(e.type?' · '+esc(e.type):'')+'</span>'+
        '<span class="evtile-title">'+esc(e.title)+'</span></span>'+ARROW+'</span>'+
      '</button></article>';
  }

  function fill(id, items, secId, emptyMsg){
    var el=document.getElementById(id);
    if(!items.length){ el.innerHTML='<p class="pending">'+emptyMsg+'</p>'; return; }
    el.innerHTML=items.map(tile).join('');
  }

  // Featured banner (like the wide poster at the top of the GITAM VDC page)
  var feat=dated[0]||upcoming[0]||past[0];
  if(feat){
    document.getElementById('featured').innerHTML=
      '<button type="button" class="evfeat" data-id="'+esc(feat.id)+'" aria-haspopup="dialog">'+
        '<span class="evfeat-img">'+poster(feat,true)+'</span>'+
        '<span class="evfeat-bar"><span><span class="evfeat-tag">'+(isUpcoming(feat)?'Next event':'Latest event')+'</span>'+
        '<span class="evfeat-title">'+esc(feat.title)+'</span>'+
        '<span class="evfeat-meta">'+esc(fmt(feat.date))+(feat.time?' · '+esc(feat.time):'')+(feat.venue?' · '+esc(feat.venue):'')+'</span></span>'+
        '<span class="evfeat-go">View details '+ARROW+'</span></span>'+
      '</button>';
  }
  fill('upcoming', upcoming, 'upcoming-sec', 'No upcoming events right now. Check back soon.');
  fill('past', past, 'past-sec', 'Past events will appear here.');

  // Popup
  var dlg=document.getElementById('evmodal');
  var byId={}; list.forEach(function(e){ byId[e.id]=e; });

  /* Popup slider: the poster first, then every photo. Arrows, dots, keyboard ← → and swipe move between slides. */
  var track=document.getElementById('evs-track'), dots=document.getElementById('evs-dots'),
      prev=document.getElementById('evs-prev'), next=document.getElementById('evs-next'),
      count=document.getElementById('evs-count'), cur=0, total=0;
  function buildSlider(e){
    var slides=['<div class="evs-slide">'+poster(e,true)+'</div>'].concat((e.photos||[]).map(function(p,i){
      return '<div class="evs-slide"><img src="'+esc(p)+'" alt="'+esc(e.title)+' photo '+(i+1)+'" loading="lazy"></div>';
    }));
    total=slides.length; cur=0;
    track.innerHTML=slides.join('');
    dots.innerHTML=total>1? slides.map(function(_,i){ return '<button type="button" aria-label="Go to slide '+(i+1)+'"></button>'; }).join('') : '';
    document.getElementById('evm-slider').classList.toggle('single',total<2);
    go(0);
  }
  function go(i){
    if(!total) return;
    cur=(i+total)%total;
    track.style.transform='translateX('+(-100*cur)+'%)';
    [].forEach.call(dots.children,function(d,k){ d.setAttribute('aria-current',String(k===cur)); });
    [].forEach.call(track.children,function(s,k){ s.setAttribute('aria-hidden',String(k!==cur)); });
    count.textContent=total>1?(cur+1)+' / '+total:'';
  }
  prev.addEventListener('click',function(){ go(cur-1); });
  next.addEventListener('click',function(){ go(cur+1); });
  dots.addEventListener('click',function(ev){ var b=ev.target.closest('button'); if(b) go([].indexOf.call(dots.children,b)); });
  var sx=null;
  track.addEventListener('touchstart',function(ev){ sx=ev.touches[0].clientX; },{passive:true});
  track.addEventListener('touchend',function(ev){ if(sx===null) return; var dx=ev.changedTouches[0].clientX-sx; if(Math.abs(dx)>40) go(cur+(dx<0?1:-1)); sx=null; });

  function open(id, push){
    var e=byId[id]; if(!e) return;
    buildSlider(e);
    document.getElementById('evm-type').textContent=e.type||'Event';
    document.getElementById('evm-title').textContent=e.title;
    var meta='<div><dt>Date</dt><dd>'+esc(fmt(e.date))+'</dd></div>';
    if(e.time) meta+='<div><dt>Time</dt><dd>'+esc(e.time)+'</dd></div>';
    if(e.venue) meta+='<div><dt>Venue</dt><dd>'+esc(e.venue)+'</dd></div>';
    document.getElementById('evm-meta').innerHTML=meta;
    document.getElementById('evm-summary').textContent=e.summary||'';
    var act=(e.links||[]).map(function(l,i){
      var ext=/^https?:/.test(l.url);
      return '<a class="btn '+(i===0?'primary':'outline')+'" href="'+esc(l.url)+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+esc(l.label)+(ext?' ↗':'')+'</a>';
    }).join('');
    document.getElementById('evm-actions').innerHTML=act;
    if(typeof dlg.showModal==='function'){ if(!dlg.open) dlg.showModal(); } else { dlg.setAttribute('open',''); }
    if(push!==false){ try{ history.replaceState(null,'','#'+id); }catch(_){} }
  }
  function close(){ if(dlg.open) dlg.close(); else dlg.removeAttribute('open'); }

  document.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-id]'); if(b){ open(b.getAttribute('data-id')); }
  });
  dlg.querySelector('.evclose').addEventListener('click',close);
  dlg.addEventListener('click',function(ev){ if(ev.target===dlg) close(); });       // click on backdrop
  dlg.addEventListener('keydown',function(ev){
    if(total<2 || /^(A|BUTTON)$/.test(ev.target.tagName) && ev.target.closest('.evm-body')) return;
    if(ev.key==='ArrowLeft'){ go(cur-1); ev.preventDefault(); }
    if(ev.key==='ArrowRight'){ go(cur+1); ev.preventDefault(); }
  });
  dlg.addEventListener('close',function(){ try{ history.replaceState(null,'',location.pathname); }catch(_){} });

  // Deep link: events.html#event-id opens that event
  if(location.hash.length>1) open(decodeURIComponent(location.hash.slice(1)), false);
  window.addEventListener('hashchange',function(){ if(location.hash.length>1) open(decodeURIComponent(location.hash.slice(1)), false); });
})();
