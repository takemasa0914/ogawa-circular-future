'use strict';
document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (reducedMotion.matches) document.documentElement.classList.add('reduce-motion');
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  revealElements.forEach(el => observer.observe(el));
} else revealElements.forEach(el => el.classList.add('is-visible'));

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','メニューを開く');
  mobileNav.hidden = true; document.body.classList.remove('locked');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open ? 'メニューを閉じる' : 'メニューを開く');
  mobileNav.hidden = !open; document.body.classList.toggle('locked',open);
});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && !mobileNav.hidden){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width: 901px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

function setupDialog(id, triggers) {
  const dialog = document.getElementById(id);
  let opener;
  document.querySelectorAll(triggers).forEach(button=>button.addEventListener('click',()=>{
    opener=button;closeMenu();dialog.showModal();document.body.classList.add('locked');
  }));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{
    const bounds=dialog.getBoundingClientRect();
    if(e.target===dialog && (e.clientX<bounds.left || e.clientX>bounds.right || e.clientY<bounds.top || e.clientY>bounds.bottom))dialog.close();
  });
  dialog.addEventListener('close',()=>{document.body.classList.remove('locked');if(opener?.offsetParent!==null)opener?.focus();else menuButton.focus();});
}
setupDialog('contact-dialog','[data-contact]');setupDialog('about-dialog','[data-about]');

function setupTabs(selector, dataName, panelPrefix) {
  const tabs = [...document.querySelectorAll(selector)];
  if(!tabs.length)return;
  function activate(tab,focus=false) {
    tabs.forEach(item=>{
      const selected=item===tab;
      item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;
      document.getElementById(panelPrefix+item.dataset[dataName]).hidden=!selected;
    });
    if(focus)tab.focus();
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>activate(tab));
    tab.addEventListener('keydown',e=>{
      let next;
      if(['ArrowRight','ArrowDown'].includes(e.key))next=(i+1)%tabs.length;
      if(['ArrowLeft','ArrowUp'].includes(e.key))next=(i-1+tabs.length)%tabs.length;
      if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;
      if(next!==undefined){e.preventDefault();activate(tabs[next],true);}
    });
  });
}
setupTabs('[data-frontier]','frontier','panel-');setupTabs('[data-job]','job','job-panel-');

const motionButton=document.querySelector('.motion-toggle');
if(motionButton){
  let paused=reducedMotion.matches;
  function updateMotion(){document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.innerHTML=paused?'演出を再生する <span aria-hidden="true">▷</span>':'演出を止める <span aria-hidden="true">Ⅱ</span>';}
  motionButton.addEventListener('click',()=>{paused=!paused;updateMotion();});updateMotion();
}

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  let count=0;
  document.querySelectorAll('.theme-card').forEach(card=>{card.hidden=button.dataset.filter!=='all' && card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
  document.querySelector('.filter-count').textContent=count+'件のテーマを表示しています。';
}));
const themeSelect=document.getElementById('theme-select');
document.querySelectorAll('[data-theme]').forEach(button=>button.addEventListener('click',()=>{
  themeSelect.value=button.dataset.theme;
  document.getElementById('consultation').scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});
  document.getElementById('idea-text').focus({preventScroll:true});
}));
function toast(message){const el=document.querySelector('.toast');el.textContent=message;el.classList.add('visible');window.clearTimeout(toast.timer);toast.timer=window.setTimeout(()=>el.classList.remove('visible'),3500);}
const form=document.getElementById('consultation-form');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const idea=document.getElementById('idea-text').value.trim();
    if(!idea){document.getElementById('idea-text').setCustomValidity('相談したい内容をご記入ください。');document.getElementById('idea-text').reportValidity();return;}
    const text='オガワエコノス ご担当者様\n\n共創についてご相談したく、ご連絡いたします。\n\n【関心のあるテーマ】\n'+themeSelect.value+'\n\n【一緒に考えたいこと】\n'+idea+'\n\n可能性についてお話しできれば幸いです。どうぞよろしくお願いいたします。';
    document.getElementById('memo-text').textContent=text;
    document.getElementById('memo-output').hidden=false;
    document.getElementById('memo-output').scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'nearest'});
  });
  document.getElementById('idea-text').addEventListener('input',e=>e.target.setCustomValidity(''));
  document.getElementById('copy-memo').addEventListener('click',async()=>{
    const text=document.getElementById('memo-text').textContent;
    try{await navigator.clipboard.writeText(text);toast('相談メモをコピーしました。');}
    catch{
      const range=document.createRange();range.selectNodeContents(document.getElementById('memo-text'));
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      toast('メモを選択しました。コピー操作でお使いください。');
    }
  });
}
