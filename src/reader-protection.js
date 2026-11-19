function protectChapter() {
  if (window.__jm2ProtectedReader) return;
  window.__jm2ProtectedReader=true;
  const style=document.createElement('style');
  style.textContent='.ad-body, .thewayhome:not(:has([id^="album_photo_"])),[data-jm2-ad],iframe,ins{display:none!important;pointer-events:none!important}';
  function mark(node) {
    if(node.nodeType!==1)return;
    function markLink(a) {
      if(a.querySelector('img,video,canvas,picture') && !a.querySelector('[id^="album_photo_"],[id^="page_"]'))a.setAttribute('data-jm2-ad','');
    }
    if(node.matches('a[href]'))markLink(node);
    else {const link=node.closest('a[href]');if(link)markLink(link);}
    node.querySelectorAll('a[href]').forEach(markLink);
  }
  function start() {
    if(!style.isConnected)(document.head||document.documentElement).appendChild(style);
    mark(document.documentElement);
    new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(mark))).observe(document.documentElement,{subtree:true,childList:true});
  }
  function block(ev){
    const target=ev.target && ev.target.closest ? ev.target.closest('.ad-body,.thewayhome,[data-jm2-ad],a[href],area[href],iframe,ins'):null;
    if(!target)return;
    if(target.matches('a,area') && target.hash && target.origin===location.origin && target.pathname===location.pathname && target.search===location.search)return;
    ev.preventDefault();ev.stopImmediatePropagation();
  }
  ['click','auxclick','pointerdown','pointerup','touchstart','touchend'].forEach(name=>window.addEventListener(name,block,{capture:true,passive:false}));
  window.open=function(){return null;};
  if(document.documentElement)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
}
