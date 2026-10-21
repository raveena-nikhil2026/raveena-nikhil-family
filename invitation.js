// Unlock sound on the seal gesture; start the track only after the film ends.
window.weddingSound=(()=>{
 const audio=document.getElementById('weddingMusic');
 let context,bufferPromise,source,startedAt=0,offset=35,playing=false,ready=false;
 const Context=window.AudioContext||window.webkitAudioContext;
 function label(){}
 function unlock(){
  if(!Context)return;
  try{if(!context){context=new Context();bufferPromise=fetch(audio.src).then(r=>{if(!r.ok)throw Error('Audio unavailable');return r.arrayBuffer()}).then(data=>context.decodeAudioData(data));bufferPromise.catch(()=>{});}context.resume().catch(()=>{});}catch(e){context=null;}
 }
 async function play(){
  if(playing)return;
  if(context){try{await context.resume();if(context.state!=='running')throw Error('Sound needs a tap');const buffer=await bufferPromise;if(offset>=buffer.duration)offset=35;source=context.createBufferSource();source.buffer=buffer;source.connect(context.destination);source.onended=()=>{if(playing){playing=false;offset=35;label();}};startedAt=context.currentTime;source.start(0,offset);playing=true;label();return;}catch(e){}}
  try{if(audio.readyState<1)await new Promise((resolve,reject)=>{audio.addEventListener('loadedmetadata',resolve,{once:true});audio.addEventListener('error',reject,{once:true});audio.load();});audio.currentTime=offset;await audio.play();playing=true;}catch(e){playing=false;}label();
 }
 function pause(){if(source){offset+=context.currentTime-startedAt;source.onended=null;source.stop();source=null;}else{offset=audio.currentTime;audio.pause();}playing=false;label();}
 audio.addEventListener('ended',()=>{playing=false;offset=35;label();});
 document.addEventListener('pointerdown',()=>{if(ready&&!playing){unlock();play();}},{passive:true});
 return {unlock,start(){if(ready)return;ready=true;play();}};
})();
(()=>{const intro=document.getElementById('intro'),video=document.getElementById('film'),main=document.getElementById('main');let finished=false;document.body.style.overflow='hidden';function finish(){if(finished)return;finished=true;window.weddingSound.start();main.classList.add('visible');document.body.classList.add('opened');main.removeAttribute('inert');document.getElementById('invitationTitle').focus({preventScroll:true});intro.classList.add('hide');document.body.style.overflow='';window.scrollTo(0,0);setTimeout(()=>{video.pause();intro.remove()},900)}document.getElementById('startSeal').addEventListener('click',()=>{window.weddingSound.unlock();video.currentTime=0;const p=video.play();if(p&&p.then)p.then(()=>intro.classList.add('playing')).catch(()=>{intro.classList.remove('playing');document.querySelector('#intro .hint').textContent='TAP THE SEAL TO TRY AGAIN'});else intro.classList.add('playing')});video.addEventListener('ended',finish);video.addEventListener('error',()=>{intro.classList.remove('playing');const hint=intro.querySelector('.hint');if(hint)hint.textContent='VIDEO UNAVAILABLE — TAP TO VIEW INVITATION';document.getElementById('startSeal').onclick=finish})})();

(function(){
 const target=Date.parse('2026-11-12T21:36:00+05:30');
 const root=document.getElementById('muhurthamCountdown');
 if(!root)return;
 const ids=['countDays','countHours','countMinutes','countSeconds'];
 const fields=ids.map(id=>document.getElementById(id));
 function update(){
  const diff=Math.max(0,target-Date.now());
  if(diff===0){root.innerHTML='<div class="count-label">THE MOMENT IS HERE</div><div class="count-complete">Our forever begins today ✨</div>';return false;}
  const total=Math.floor(diff/1000);
  const vals=[Math.floor(total/86400),Math.floor(total%86400/3600),Math.floor(total%3600/60),total%60];
  fields.forEach((el,i)=>{if(el)el.textContent=String(vals[i]).padStart(2,'0')});
  return true;
 }
 if(update()){const interval=setInterval(()=>{if(!update())clearInterval(interval)},1000)}
})();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.08});document.body.classList.add('motion-ready');document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
const petalLayer=document.querySelector('.petals');for(let i=0;i<16;i++){const p=document.createElement('i');p.className='rose-petal';p.style.cssText=`left:${(i*37)%100}%;--duration:${12+i%7}s;--delay:${i*.9}s;--drift:${(i%2?1:-1)*(40+i*5)}px;width:${9+i%8}px;height:${15+i%9}px`;petalLayer.append(p)}
document.addEventListener('visibilitychange',()=>{document.querySelectorAll('.rose-petal').forEach(p=>p.style.animationPlayState=document.hidden?'paused':'');});

// Anchor the inset braid to the seal in the original 720 × 1280 artwork.
function alignSeal(){const layer=document.getElementById('intro'),seal=document.getElementById('startSeal');if(!layer||!seal)return;const w=layer.clientWidth,h=layer.clientHeight;const scale=w<=767?Math.max(w/720,h/1280):Math.min(w/720,h/1280);seal.style.left=((w-720*scale)/2+363*scale)+'px';seal.style.top=((h-1280*scale)/2+690*scale)+'px';seal.style.width=(112*scale)+'px';seal.style.height=(112*scale)+'px'}
alignSeal();window.addEventListener('resize',alignSeal);if(window.visualViewport)window.visualViewport.addEventListener('resize',alignSeal);
