/* Conceptual relationships, not a quantitative environmental simulation. */
(() => {
  document.querySelectorAll('[data-circulation]').forEach(root => {
    const stage=root.querySelector('.network-stage'), svg=root.querySelector('svg'), pathGroup=svg.querySelector('.flow-paths'), particleGroup=svg.querySelector('.flow-particles');
    const nodes=[...root.querySelectorAll('[data-cycle-node]')], story=root.querySelector('.cycle-story'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const original={water:[.5,.15],resources:[.81,.4],energy:[.69,.79],soil:[.31,.79],life:[.19,.4]};
    let positions=structuredClone(original), visited=new Set(), selected=null, mode='earth', edges=[], drag=null, suppress=null, raf=0, last=0, phase=0, visible=true, localPause=false, celebrationTimer;
    const data={
      earth:{
        water:['WATER / 水環境を守る','きれいな水が、\n暮らしを支える。','浄化槽の維持管理や排水処理を通じて、水環境を守る。暮らしから出る水を、次の環境へとつないでいく仕事です。',['暮らし','水環境','地域'],'services.html#water'],
        resources:['RESOURCES / 価値をつなぐ','役目の先に、\n新しい出番を。','集める、分ける、再資源化する。使い終えたものを見つめ直し、次の産業を支える資源へとつなげます。',['使用後の資源','再資源化','産業'],'services.html#resources'],
        energy:['ENERGY / 産業を支える','捨てられるものが、\n動かす力になる。','再資源化や燃料化を通じて、資源の価値を引き出す。ものを使い切る視点が、産業を支えるエネルギーへつながります。',['資源','燃料化','産業'],'services.html#resources'],
        soil:['SOIL & FOOD / 共創のテーマ','土へ。食へ。\n次のいのちへ。','食品残さなどの有機資源を、土づくりや農業へつなぐ可能性。地域の農業者や研究機関と、ともに育てたい共創テーマです。',['有機資源','土づくり','食'],'partners.html#themes'],
        life:['LIFE / 私たちの出発点','いつもの暮らしが、\n循環のはじまり。','水を使う。ものを選ぶ。食べる。ひとりひとりの日常と、地域を支える現場の仕事が、大きな循環につながっています。',['日常','地域の仕事','未来'],'people.html']
      },
      space:{
        water:['LONG-TERM CONCEPT / 長期研究構想','一滴を、\n何度でも生かす。','限られた水を浄化し、再び利用する。地上の水処理の知恵を、宇宙で人が暮らすための循環へつなぐ研究構想です。',['排水','浄化','再利用水'],'vision.html#space'],
        resources:['LONG-TERM CONCEPT / 長期研究構想','宇宙では、\nすべてが資源になる。','廃棄物をただ捨てるのではなく、必要な物質や栄養を回収する。限られた資源を生かし続ける可能性を探ります。',['廃棄物','回収','再利用'],'vision.html#space'],
        energy:['LONG-TERM CONCEPT / 長期研究構想','循環を動かす、\nもうひとつの力。','水の浄化や食料生産にはエネルギーが必要です。資源、水、エネルギーを一体で考えることも、未来の研究テーマです。',['エネルギー','浄化','食料生産'],'vision.html#space'],
        soil:['LONG-TERM CONCEPT / 長期研究構想','回収した栄養で、\n食を育てられるか。','資源から回収した栄養を、宇宙農業に生かす。安全性や栽培への適合性を確かめながら、研究していきたい未来の構想です。',['栄養回収','栽培','食料'],'vision.html#space'],
        life:['LONG-TERM CONCEPT / 長期研究構想','遠い未来も、\n人の幸せのために。','宇宙での生活を支える循環を考えることは、地球での暮らしを見つめ直すこと。未来の知恵を、地域にも還元する構想です。',['人の暮らし','閉鎖循環','地球へ還元'],'vision.html#space']
      }
    };
    const definitions={earth:[['life','water'],['water','life'],['life','resources'],['resources','energy'],['energy','life'],['life','soil'],['soil','life']],space:[['life','water'],['water','life'],['life','resources'],['resources','soil'],['soil','life'],['energy','water'],['energy','soil']]};
    const pauseButton=document.createElement('button');pauseButton.type='button';pauseButton.textContent='光を止める Ⅱ';pauseButton.setAttribute('aria-pressed','false');root.querySelector('.network-help').append(pauseButton);
    const paused=()=>localPause||reduced.matches||document.body.classList.contains('motion-paused');
    const make=(tag,attrs)=>{const el=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;};
    function buildEdges(){pathGroup.replaceChildren();particleGroup.replaceChildren();edges=definitions[mode].map(([a,b],i)=>{const path=make('path',{class:'flow-path'}),dots=[0,1].map(j=>make('circle',{class:'flow-particle',r:j?2:3}));pathGroup.append(path);particleGroup.append(...dots);return {a,b,path,dots,offset:i*.137};});layout();highlight();}
    function layout(){nodes.forEach(b=>{const p=positions[b.dataset.cycleNode];b.style.left=p[0]*100+'%';b.style.top=p[1]*100+'%';});edges.forEach(e=>{const a=positions[e.a],b=positions[e.b];e.p0=[a[0]*700,a[1]*550];e.p2=[b[0]*700,b[1]*550];const dx=e.p2[0]-e.p0[0],dy=e.p2[1]-e.p0[1];e.p1=[(e.p0[0]+e.p2[0])/2-dy*.23,(e.p0[1]+e.p2[1])/2+dx*.23];e.path.setAttribute('d',`M${e.p0} Q${e.p1} ${e.p2}`);});drawParticles();}
    function highlight(){edges.forEach(e=>{e.active=visited.size===5||e.a===selected||e.b===selected;e.path.classList.toggle('active',e.active);e.dots.forEach(d=>d.classList.toggle('active',e.active));});nodes.forEach(b=>{const key=b.dataset.cycleNode;b.classList.toggle('visited',visited.has(key));b.setAttribute('aria-pressed',String(key===selected));});root.classList.toggle('is-complete',visited.size===5);root.querySelector('.core-counter').innerHTML=visited.size+'<span>/5</span>';root.querySelector('.core-caption').textContent=visited.size===5?'ひとつの循環へ':'すべてをつなぐ ↗';root.querySelector('.cycle-progress').textContent=visited.size===5?'５つのつながりを発見。次は、あなたとつくる循環へ。':`${visited.size} / 5 のつながりを発見。気になる要素に触れてみよう。`;}
    function show(key){const d=data[mode][key];story.querySelector('.cycle-story-label').textContent=d[0];story.querySelector('h3').textContent=d[1];story.querySelector('h3').style.whiteSpace='pre-line';story.querySelector('p').textContent=d[2];const rel=story.querySelector('.cycle-relations');rel.replaceChildren();d[3].forEach((label,i)=>{if(i){const arrow=document.createElement('i');arrow.textContent='→';rel.append(arrow);}const span=document.createElement('span');span.textContent=label;rel.append(span);});const link=story.querySelector('a');link.href=d[4];link.textContent=mode==='space'?'未来の構想を読む ↗':'このつながりを、もっと知る ↗';}
    function celebrate(){clearTimeout(celebrationTimer);root.classList.remove('celebrate');if(!paused()){requestAnimationFrame(()=>root.classList.add('celebrate'));celebrationTimer=setTimeout(()=>root.classList.remove('celebrate'),3400);}}
    function choose(key){const complete=visited.size===5;selected=key;visited.add(key);show(key);highlight();if(!complete&&visited.size===5)celebrate();request();}
    function drawParticles(){edges.forEach(e=>e.dots.forEach((dot,j)=>{const t=(phase*.09+e.offset+j*.5)%1,u=1-t;dot.setAttribute('cx',u*u*e.p0[0]+2*u*t*e.p1[0]+t*t*e.p2[0]);dot.setAttribute('cy',u*u*e.p0[1]+2*u*t*e.p1[1]+t*t*e.p2[1]);}));}
    function request(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(frame);}
    function frame(time){raf=0;if(!visible||document.hidden)return;const dt=Math.min(time-last||16,40);last=time;if(!paused())phase+=dt/1000;drawParticles();if(!paused())request();}
    nodes.forEach(button=>{const key=button.dataset.cycleNode;
      button.addEventListener('click',()=>{if(suppress===key){suppress=null;return;}choose(key);});
      button.addEventListener('pointerdown',e=>{drag={id:e.pointerId,key,x:e.clientX,y:e.clientY,moved:false};button.setPointerCapture(e.pointerId);});
      button.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId||drag.key!==key)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6)drag.moved=true;if(!drag.moved)return;button.classList.add('dragging');const rect=stage.getBoundingClientRect();positions[key]=[Math.max(.13,Math.min(.87,(e.clientX-rect.left)/rect.width)),Math.max(.13,Math.min(.82,(e.clientY-rect.top)/rect.height))];layout();});
      button.addEventListener('pointerup',()=>{if(drag?.moved){suppress=key;choose(key);setTimeout(()=>{suppress=null;},0);}drag=null;button.classList.remove('dragging');});
      button.addEventListener('pointercancel',()=>{drag=null;button.classList.remove('dragging');});
      button.addEventListener('keydown',e=>{const delta={ArrowLeft:[-.025,0],ArrowRight:[.025,0],ArrowUp:[0,-.025],ArrowDown:[0,.025]}[e.key];if(!delta)return;e.preventDefault();positions[key]=positions[key].map((v,i)=>Math.max(.13,Math.min(i?.82:.87,v+delta[i])));layout();choose(key);});
      button.setAttribute('aria-label',button.querySelector('strong').textContent+'のつながりを見る。矢印キーで位置を動かせます。');
    });
    root.querySelectorAll('[data-cycle-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.cycleMode;root.dataset.mode=mode;root.querySelectorAll('[data-cycle-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));buildEdges();show(selected||'water');request();}));
    root.querySelector('[data-connect-all]').addEventListener('click',()=>{visited=new Set(Object.keys(original));selected=null;highlight();story.querySelector('.cycle-story-label').textContent=mode==='earth'?'ONE CIRCULATION. ONE FUTURE.':'LONG-TERM CONCEPT / 長期研究構想';story.querySelector('h3').textContent='つながるほど、\n未来は豊かになる。';story.querySelector('h3').style.whiteSpace='pre-line';story.querySelector('p').textContent=mode==='earth'?'水も資源も、食も暮らしも。それぞれの仕事がつながることで、循環の可能性は広がります。あなたの知恵や技術も、この輪に加えてみませんか。':'宇宙での水、資源、食料、エネルギーを一体で考える長期研究構想。実現に向けて、研究者や企業との対話から始めていきます。';story.querySelector('.cycle-relations').textContent='水 ↔ 資源 ↔ エネルギー ↔ 土と食 ↔ 暮らし';story.querySelector('a').href='partners.html#themes';story.querySelector('a').textContent='共創のテーマを探す ↗';celebrate();request();});
    root.querySelector('[data-cycle-reset]').addEventListener('click',()=>{visited.clear();selected=null;positions=structuredClone(original);root.classList.remove('celebrate');layout();highlight();show('water');request();});
    pauseButton.addEventListener('click',()=>{localPause=!localPause;pauseButton.setAttribute('aria-pressed',String(localPause));pauseButton.textContent=localPause?'光を動かす ▶':'光を止める Ⅱ';root.classList.remove('celebrate');request();});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;request();}).observe(stage);new MutationObserver(request).observe(document.body,{attributes:true,attributeFilter:['class']});reduced.addEventListener('change',request);document.addEventListener('visibilitychange',()=>{last=0;request();});
    buildEdges();request();
  });
})();
