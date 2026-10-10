import{jsx as _jsx,jsxs as _jsxs}from"react/jsx-runtime";import{useEffect,useRef}from"react";
import{addPropertyControls,ControlType,useIsStaticRenderer}from"./framer-shim";const AR_MAP={"16:9":"16 / 9","9:16":"9 / 16","1:1":"1 / 1","4:3":"4 / 3","4:5":"4 / 5","3:2":"3 / 2","21:9":"21 / 9"};/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */export default function VideoPlayerV8(props){const{sourceType="upload",videoFile,videoUrl,aspectRatio="custom",fit="contain",cropX=50,cropY=50,cornerRadius=14,progressColor="#ffffff",autoplay=false,autoMute=true,loop=false,hideUI=false,posterUrl,style}=props;const rootRef=useRef(null);const layoutRef=useRef(null);const settingsRef=useRef({fit,cropX,cropY});settingsRef.current={fit,cropX,cropY};// True on the Framer canvas AND during export / thumbnail rendering.
// In these static contexts we must not run animations, timers, video
// playback or any continuous effect — we render a still preview instead.
const isStatic=useIsStaticRenderer();const source=(sourceType==="link"?(videoUrl||"").trim():videoFile)||"";useEffect(()=>{if(isStatic)return;const root=rootRef.current;if(!root)return;const $=sel=>root.querySelector(sel);const $$=sel=>Array.from(root.querySelectorAll(sel));const media=$(".media");const video=$(".video-el");const clickCatch=$(".click-catch");const dropOverlay=$(".drop-overlay");const controls=$(".controls");const speedBtn=$(".speed-btn");const speedPanel=$(".speed-panel");const muteBtn=$(".mute-btn");const muteIcon=muteBtn.querySelector("svg");const fullscreenBtn=$(".fullscreen-btn");const progressWrap=$(".progress-wrap");const progressTrack=$(".progress-track");const progressFill=$(".progress-fill");const timeDisplay=$(".time-display");const seekIndicator=$(".seek-indicator");const seekIcon=$(".seek-icon");const seekLabel=$(".seek-label");const edgeLeft=$(".edge-left");const edgeRight=$(".edge-right");const framePreview=$(".frame-preview");const frameCanvas=$(".frame-canvas");const frameTimeLbl=$(".frame-time-label");const toast=$(".toast");const videoInput=$(".video-input");const pw=$(".player-wrap");const ppFlashEl=$(".playpause-flash");const ppIcon=$(".pp-icon");const holdBadge=$(".hold-badge");const fsIcon=$(".fs-icon");const miniPlay=$(".mini-play");const miniPlayIcon=miniPlay.querySelector("svg");const miniMute=$(".mini-mute");const miniMuteIcon=miniMute.querySelector("svg");const replayBtn=$(".replay-btn");const replayIcon=replayBtn.querySelector("svg");video.style.display="none";const ARR_L=`<polyline points="10,4 6,8 10,12"/>`;const ARR_R=`<polyline points="6,4 10,8 6,12"/>`;const MINI_PLAY=`<path d="M8 5.6v12.8l10.5-6.4z" fill="currentColor" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;const MINI_PAUSE=`<rect x="7" y="5.5" width="3.6" height="13" rx="1.8" fill="currentColor"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1.8" fill="currentColor"/>`;const ICON_PLAY=MINI_PLAY;const ICON_PAUSE=MINI_PAUSE;const REPLAY=`<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></g>`;const VOL_ON=`<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a4 4 0 010 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`;const VOL_OFF=`<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`;const speeds=[.5,.75,1,1.25,1.5,1.75,2];let currentSpeed=1;let controlsTimeout,toastTimer,seekTimer,ppTimer;let singleTapTimer=null;let lastTouchEnd=0// guards against emulated mouse events after a tap
;let isDragging=false;let holdTimer=null,isHolding=false,didHold=false;let mc=null;let destroyed=false;let token=0;let canScrub=false;let curPaused=true;let curVol=1;let curMuted=autoMute;let inView=false;const objectUrls=[];const scrubVid=document.createElement("video");scrubVid.muted=true;scrubVid.preload="auto";scrubVid.playsInline=true;const offscreen=document.createElement("canvas");offscreen.width=160;offscreen.height=90;const offCtx=offscreen.getContext("2d");let lastScrubTime=-1;const SEEK_THRESH=.4;const onScrubSeeked=()=>{try{offCtx.drawImage(scrubVid,0,0,160,90);const ctx=frameCanvas.getContext("2d");frameCanvas.width=160;frameCanvas.height=90;ctx.drawImage(offscreen,0,0);}catch{canScrub=false;framePreview.classList.remove("show");}};scrubVid.addEventListener("seeked",onScrubSeeked);function seekScrubTo(t){if(!scrubVid.src||isNaN(scrubVid.duration))return;if(Math.abs(t-lastScrubTime)<SEEK_THRESH)return;lastScrubTime=t;scrubVid.currentTime=t;}function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),1600);}function fmt(s){if(isNaN(s)||s==null)return"0:00";const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=Math.floor(s%60);return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`;}function setAR(w,h){if(w&&h)media.style.setProperty("--ar",w+" / "+h);}function pushTime(t,d){if(!isDragging){const pct=d?t/d*100:0;progressFill.style.width=pct+"%";}timeDisplay.textContent=fmt(t)+" / "+fmt(d);}function updatePlayIcons(){miniPlayIcon.innerHTML=curPaused?MINI_PLAY:MINI_PAUSE;}function showReplay(b){replayBtn.classList.toggle("show",b);}function onEnded(){if(!loop){setPaused(true);showReplay(true);}}function setPaused(p){curPaused=p;updatePlayIcons();}function updateMuteIcons(){muteIcon.innerHTML=curMuted?VOL_OFF:VOL_ON;miniMuteIcon.innerHTML=curMuted?VOL_OFF:VOL_ON;}function applyMute(m){curMuted=m;if(mc)mc.setMuted(m);updateMuteIcons();}function flashEdge(side){const el=side==="left"?edgeLeft:edgeRight;el.classList.remove("flash-in");void el.offsetWidth;el.classList.add("flash-in");el.addEventListener("animationend",()=>el.classList.remove("flash-in"),{once:true});}function flashSeek(dir){seekIcon.innerHTML=dir==="back"?ARR_L:ARR_R;seekLabel.textContent=dir==="back"?"−10s":"+10s";seekIndicator.style.left=dir==="back"?"22%":"auto";seekIndicator.style.right=dir==="back"?"auto":"22%";seekIndicator.style.transform="translateY(-50%)";seekIndicator.classList.add("show");clearTimeout(seekTimer);seekTimer=setTimeout(()=>seekIndicator.classList.remove("show"),720);}function flashPlayPause(isPlay){if(root.classList.contains("minimal"))return;ppIcon.innerHTML=isPlay?ICON_PLAY:ICON_PAUSE;ppFlashEl.classList.remove("show");void ppFlashEl.offsetWidth;ppFlashEl.classList.add("show");clearTimeout(ppTimer);ppTimer=setTimeout(()=>ppFlashEl.classList.remove("show"),1100);}function togglePlay(){if(!mc)return;if(mc.isPaused()){mc.play();setPaused(false);showReplay(false);flashPlayPause(true);}else{mc.pause();setPaused(true);flashPlayPause(false);}}function seekAndAnimate(targetTime){if(!mc)return;const dur=mc.getDuration();targetTime=Math.max(0,Math.min(dur||0,targetTime));mc.setTime(targetTime);progressFill.classList.add("no-transition");const pct=dur?targetTime/dur*100:0;progressFill.style.width=pct+"%";}function parseYouTube(u){const m=u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/);return m?m[1]:null;}function parseVimeo(u){const m=u.match(/vimeo\.com\/(?:video\/)?(\d+)/);return m?m[1]:null;}// NOTE: YouTube and Vimeo used to be driven by their official SDKs
// (youtube.com/iframe_api and player.vimeo.com/api/player.js), which
// injected third-party executable scripts into the host page. Those
// SDKs have been removed. We now embed a plain sandboxed <iframe> and
// talk to it purely through the browser-native postMessage API that
// each player already exposes — no external code is added to the page.
function layoutOne(h){const s=settingsRef.current;const cw=media.clientWidth;const ch=media.clientHeight;if(!cw||!ch)return;if(s.fit==="cover"){const R=16/9;let iw=cw;let ih=cw/R;if(ih<ch){ih=ch;iw=ch*R;}h.style.width=iw+"px";h.style.height=ih+"px";h.style.left=(cw-iw)*(s.cropX/100)+"px";h.style.top=(ch-ih)*(s.cropY/100)+"px";h.style.inset="auto";}else{h.style.width="100%";h.style.height="100%";h.style.left="0px";h.style.top="0px";h.style.inset="0px";}}function layoutEmbeds(){$$(".media .embed-holder").forEach(h=>layoutOne(h));}layoutRef.current=layoutEmbeds;function hideNativeVideo(){try{video.pause();video.removeAttribute("src");video.load();}catch{}video.style.display="none";}function clearEmbeds(){$$(".media .embed-holder").forEach(n=>n.remove());}function destroyMc(){if(mc){try{mc.destroy();}catch{}mc=null;}clearEmbeds();}function makeNative(url){hideNativeVideo();video.style.display="block";if(posterUrl){video.poster=posterUrl;}else{video.removeAttribute("poster");}video.src=url;video.muted=curMuted;video.volume=curVol;video.loop=loop;video.load();canScrub=true;scrubVid.src=url;scrubVid.load();lastScrubTime=-1;const onTime=()=>pushTime(video.currentTime,video.duration||0);const onMeta=()=>{setAR(video.videoWidth,video.videoHeight);pushTime(video.currentTime,video.duration||0);};const onPlay=()=>setPaused(false);const onPause=()=>setPaused(true);video.addEventListener("timeupdate",onTime);video.addEventListener("loadedmetadata",onMeta);video.addEventListener("play",onPlay);video.addEventListener("pause",onPause);video.addEventListener("ended",onEnded);mc={play:()=>video.play().catch(()=>{}),pause:()=>video.pause(),isPaused:()=>video.paused,getTime:()=>video.currentTime,setTime:t=>{video.currentTime=t;},getDuration:()=>video.duration||0,setRate:r=>{video.playbackRate=r;},setVolume:v=>{video.volume=v;},setMuted:m=>{video.muted=m;},destroy:()=>{video.removeEventListener("timeupdate",onTime);video.removeEventListener("loadedmetadata",onMeta);video.removeEventListener("play",onPlay);video.removeEventListener("pause",onPause);video.removeEventListener("ended",onEnded);video.loop=false;hideNativeVideo();canScrub=false;}};maybeAutoplay();}// YouTube — plain iframe embed controlled via the built-in
// postMessage command API (enablejsapi=1). No SDK script is loaded.
function makeYouTube(id,myToken){hideNativeVideo();canScrub=false;setAR(16,9);const holder=document.createElement("div");holder.className="embed-holder";media.appendChild(holder);layoutOne(holder);const iframe=document.createElement("iframe");iframe.setAttribute("allow","autoplay; encrypted-media; picture-in-picture; fullscreen");iframe.setAttribute("allowfullscreen","");iframe.setAttribute("frameborder","0");iframe.setAttribute("title","YouTube video player");const origin=encodeURIComponent(window.location.origin);iframe.src=`https://www.youtube.com/embed/${id}`+`?enablejsapi=1&controls=0&modestbranding=1&rel=0`+`&playsinline=1&disablekb=1&iv_load_policy=3&fs=0&origin=${origin}`;holder.appendChild(iframe);const YT_ORIGIN="https://www.youtube.com";let dur=0,cur=0,ready=false;const post=(func,args)=>{const win=iframe.contentWindow;if(!win)return;try{win.postMessage(JSON.stringify({event:"command",func,args:args||[]}),YT_ORIGIN);}catch{}};const applyState=s=>{if(s==null)return;if(s===1){setPaused(false);showReplay(false);}else if(s===0){if(loop){post("seekTo",[0,true]);post("playVideo");}else{onEnded();}}else if(s===2||s===5||s===-1){setPaused(true);}// 3 = buffering: leave the play/pause state unchanged
};const onMsg=e=>{if(e.source!==iframe.contentWindow)return;if(destroyed||myToken!==token)return;let data;try{data=typeof e.data==="string"?JSON.parse(e.data):e.data;}catch{return;}if(!data)return;const info=data.info;if(data.event==="onReady"||data.event==="initialDelivery"){ready=true;if(info){if(info.duration)dur=info.duration;if(typeof info.currentTime==="number")cur=info.currentTime;}post("setVolume",[curVol*100]);post(curMuted?"mute":"unMute");pushTime(cur,dur);layoutEmbeds();maybeAutoplay();}else if(data.event==="infoDelivery"&&info){if(typeof info.duration==="number"&&info.duration)dur=info.duration;if(typeof info.currentTime==="number")cur=info.currentTime;if(typeof info.playerState==="number")applyState(info.playerState);pushTime(cur,dur);}else if(data.event==="onStateChange"){applyState(typeof info==="number"?info:info&&info.playerState);}};window.addEventListener("message",onMsg);// Handshake — tell the player we're listening so it emits events.
let tries=0;const hs=setInterval(()=>{if(destroyed||myToken!==token){clearInterval(hs);return;}const win=iframe.contentWindow;if(win){try{win.postMessage(JSON.stringify({event:"listening",id:myToken,channel:"widget"}),YT_ORIGIN);}catch{}}if(ready||++tries>40)clearInterval(hs);},250);mc={play:()=>post("playVideo"),pause:()=>post("pauseVideo"),isPaused:()=>curPaused,getTime:()=>cur,setTime:t=>{post("seekTo",[t,true]);cur=t;pushTime(cur,dur);},getDuration:()=>dur,setRate:r=>post("setPlaybackRate",[r]),setVolume:v=>post("setVolume",[v*100]),setMuted:m=>post(m?"mute":"unMute"),destroy:()=>{clearInterval(hs);window.removeEventListener("message",onMsg);holder.remove();}};}// Vimeo — plain iframe embed controlled via the player's built-in
// postMessage API. No SDK script is loaded.
function makeVimeo(id,myToken){hideNativeVideo();canScrub=false;setAR(16,9);const holder=document.createElement("div");holder.className="embed-holder";media.appendChild(holder);layoutOne(holder);const iframe=document.createElement("iframe");iframe.setAttribute("allow","autoplay; fullscreen; picture-in-picture");iframe.setAttribute("allowfullscreen","");iframe.setAttribute("frameborder","0");iframe.setAttribute("title","Vimeo video player");iframe.src=`https://player.vimeo.com/video/${id}`+`?controls=0&playsinline=1&dnt=1&transparent=0`;holder.appendChild(iframe);const VM_ORIGIN="https://player.vimeo.com";let dur=0,cur=0;const post=(method,value)=>{const win=iframe.contentWindow;if(!win)return;const msg={method};if(value!==undefined)msg.value=value;try{win.postMessage(JSON.stringify(msg),VM_ORIGIN);}catch{}};const onMsg=e=>{if(e.source!==iframe.contentWindow)return;if(destroyed||myToken!==token)return;let data;try{data=typeof e.data==="string"?JSON.parse(e.data):e.data;}catch{return;}if(!data)return;if(data.event==="ready"){// Subscribe to the events we need, then prime state.
post("addEventListener","play");post("addEventListener","pause");post("addEventListener","ended");post("addEventListener","finish");post("addEventListener","timeupdate");post("addEventListener","playProgress");post("getDuration");post("setVolume",curMuted?0:curVol);if(loop)post("setLoop",true);layoutEmbeds();maybeAutoplay();}else if(data.method==="getDuration"){if(typeof data.value==="number"){dur=data.value;pushTime(cur,dur);}}else if(data.event==="timeupdate"||data.event==="playProgress"){const d=data.data||{};if(typeof d.seconds==="number")cur=d.seconds;if(typeof d.duration==="number"&&d.duration)dur=d.duration;pushTime(cur,dur);}else if(data.event==="play"){setPaused(false);showReplay(false);}else if(data.event==="pause"){setPaused(true);}else if(data.event==="ended"||data.event==="finish"){if(loop){post("setCurrentTime",0);post("play");}else{onEnded();}}};window.addEventListener("message",onMsg);mc={play:()=>post("play"),pause:()=>post("pause"),isPaused:()=>curPaused,getTime:()=>cur,setTime:t=>{post("setCurrentTime",t);cur=t;pushTime(cur,dur);},getDuration:()=>dur,setRate:r=>post("setPlaybackRate",r),setVolume:v=>post("setVolume",v),setMuted:m=>post("setVolume",m?0:curVol),destroy:()=>{window.removeEventListener("message",onMsg);holder.remove();}};}function autoStart(){if(!mc)return;applyMute(autoMute);mc.play();setPaused(false);if(!autoMute){setTimeout(()=>{if(mc&&mc.isPaused()){applyMute(true);mc.play();}},350);}}function maybeAutoplay(){if(autoplay&&inView&&mc)autoStart();}function showOverlay(show){dropOverlay.classList.toggle("hidden",!show);}function mountSource(src){token++;const myToken=token;destroyMc();media.style.removeProperty("--ar");setPaused(true);showReplay(false);progressFill.style.width="0%";timeDisplay.textContent="0:00 / 0:00";if(!src){showOverlay(true);controls.classList.add("hidden");return;}showOverlay(false);controls.classList.remove("hidden");const yt=parseYouTube(src);const vm=parseVimeo(src);if(yt)makeYouTube(yt,myToken);else if(vm)makeVimeo(vm,myToken);else makeNative(src);}function loadVideo(file){const url=URL.createObjectURL(file);objectUrls.push(url);mountSource(url);if(mc)mc.play();showToast(file.name);}function getPct(clientX){const rect=progressTrack.getBoundingClientRect();return Math.max(0,Math.min(1,(clientX-rect.left)/rect.width));}function showFrameAt(pct,clientX){if(!canScrub)return;const dur=mc?mc.getDuration():0;if(!dur)return;const t=pct*dur;const trackRect=progressTrack.getBoundingClientRect();const relX=clientX-trackRect.left;const halfW=80;const clamped=Math.max(halfW,Math.min(trackRect.width-halfW,relX));framePreview.style.left=clamped+"px";frameTimeLbl.textContent=fmt(t);framePreview.classList.add("show");seekScrubTo(t);}const onWrapEnter=()=>{if(canScrub)framePreview.classList.add("show");};const onWrapLeave=()=>{if(!isDragging)framePreview.classList.remove("show");};const onWrapMove=e=>{if(!mc)return;const dur=mc.getDuration();if(!dur)return;const pct=getPct(e.clientX);if(isDragging){progressFill.classList.add("no-transition");progressFill.style.width=pct*100+"%";mc.setTime(pct*dur);}showFrameAt(pct,e.clientX);};const onWrapDown=e=>{e.stopPropagation();if(!mc||!mc.getDuration())return;isDragging=true;progressWrap.classList.add("dragging");progressFill.classList.add("no-transition");const pct=getPct(e.clientX);progressFill.style.width=pct*100+"%";mc.setTime(pct*mc.getDuration());};progressWrap.addEventListener("mouseenter",onWrapEnter);progressWrap.addEventListener("mouseleave",onWrapLeave);progressWrap.addEventListener("mousemove",onWrapMove);progressWrap.addEventListener("mousedown",onWrapDown);const onWinUp=()=>{if(isDragging){isDragging=false;progressWrap.classList.remove("dragging");framePreview.classList.remove("show");}};const onWinMove=e=>{if(isDragging&&mc&&mc.getDuration()){const pct=getPct(e.clientX);progressFill.style.width=pct*100+"%";mc.setTime(pct*mc.getDuration());showFrameAt(pct,e.clientX);}};window.addEventListener("mouseup",onWinUp);window.addEventListener("mousemove",onWinMove);const onWrapTouchStart=e=>{e.stopPropagation();if(!mc||!mc.getDuration())return;isDragging=true;progressWrap.classList.add("dragging");progressFill.classList.add("no-transition");const pct=getPct(e.touches[0].clientX);progressFill.style.width=pct*100+"%";mc.setTime(pct*mc.getDuration());};const onWrapTouchMove=e=>{if(!isDragging||!mc||!mc.getDuration())return;const pct=getPct(e.touches[0].clientX);progressFill.style.width=pct*100+"%";mc.setTime(pct*mc.getDuration());};const onWrapTouchEnd=e=>{// Kill the synthetic mouse events so the emulated mousedown can't
// re-enter drag mode and leave the slider stuck after you lift off.
e.preventDefault();isDragging=false;progressWrap.classList.remove("dragging");framePreview.classList.remove("show");};progressWrap.addEventListener("touchstart",onWrapTouchStart,{passive:true});progressWrap.addEventListener("touchmove",onWrapTouchMove,{passive:true});progressWrap.addEventListener("touchend",onWrapTouchEnd);const onCatchClick=()=>{if(Date.now()-lastTouchEnd<600)return;// emulated from a tap
if(didHold){didHold=false;return;}togglePlay();};const onCatchMouseDown=e=>{if(Date.now()-lastTouchEnd<600)return;// emulated from a tap
e.stopPropagation();didHold=false;holdTimer=setTimeout(()=>{didHold=true;isHolding=true;if(mc)mc.setRate(2);holdBadge.classList.add("show");},400);};clickCatch.addEventListener("click",onCatchClick);clickCatch.addEventListener("mousedown",onCatchMouseDown);const onWinMouseUp=()=>{if(holdTimer){clearTimeout(holdTimer);holdTimer=null;}if(isHolding){isHolding=false;if(mc)mc.setRate(currentSpeed);holdBadge.classList.remove("show");}};window.addEventListener("mouseup",onWinMouseUp);// ---- Touch gestures on the video: single tap = play/pause,
// double tap on the left/right third = -10s / +10s, long press = 2x.
// We fully own the gesture and call preventDefault() on touchend so the
// browser does NOT synthesize the emulated mousedown/click that would
// otherwise fire togglePlay a SECOND time and cancel out every tap. ----
const DOUBLE_TAP_MS=300;const MOVE_TOL=12;let lastTapT=0;let lastTapSide="";let tStartX=0;let tStartY=0;let tMoved=false;function seekSide(dir){if(!mc||!mc.getDuration())return;seekAndAnimate(mc.getTime()+(dir==="back"?-10:10));flashSeek(dir);flashEdge(dir==="back"?"left":"right");showCtrls();}function tapSide(clientX){const r=clickCatch.getBoundingClientRect();const f=r.width?(clientX-r.left)/r.width:.5;if(f<.35)return"left";if(f>.65)return"right";return"center";}const onCatchTouchStart=e=>{const t=e.touches[0];tStartX=t.clientX;tStartY=t.clientY;tMoved=false;didHold=false;holdTimer=setTimeout(()=>{didHold=true;isHolding=true;if(mc)mc.setRate(2);holdBadge.classList.add("show");},400);};const onCatchTouchMove=e=>{const t=e.touches[0];if(Math.abs(t.clientX-tStartX)>MOVE_TOL||Math.abs(t.clientY-tStartY)>MOVE_TOL){tMoved=true;if(holdTimer){clearTimeout(holdTimer);holdTimer=null;}}};const onCatchTouchEnd=e=>{// Suppress the emulated mouse/click events that follow a tap —
// without this every tap toggles play twice and nothing happens.
e.preventDefault();lastTouchEnd=Date.now();if(holdTimer){clearTimeout(holdTimer);holdTimer=null;}if(isHolding){isHolding=false;if(mc)mc.setRate(currentSpeed);holdBadge.classList.remove("show");didHold=false;return;}didHold=false;if(tMoved)return;const touch=e.changedTouches[0];const side=tapSide(touch.clientX);const now=Date.now();const isDouble=now-lastTapT<DOUBLE_TAP_MS&&side===lastTapSide&&side!=="center";if(isDouble){// Second tap on a side turns into a seek — cancel the pending
// single-tap play/pause it would have triggered.
if(singleTapTimer){clearTimeout(singleTapTimer);singleTapTimer=null;}seekSide(side==="left"?"back":"fwd");lastTapT=now// keep accumulating on further taps
;lastTapSide=side;return;}lastTapT=now;lastTapSide=side;if(side==="center"){// Play/pause is the common action — respond instantly, and
// drop any pending side-tap so we never double-toggle.
if(singleTapTimer){clearTimeout(singleTapTimer);singleTapTimer=null;}togglePlay();}else{// Wait briefly to see if a second tap turns this into a seek.
if(singleTapTimer)clearTimeout(singleTapTimer);singleTapTimer=setTimeout(()=>{singleTapTimer=null;togglePlay();},DOUBLE_TAP_MS);}};clickCatch.addEventListener("touchstart",onCatchTouchStart,{passive:true});clickCatch.addEventListener("touchmove",onCatchTouchMove,{passive:true});clickCatch.addEventListener("touchend",onCatchTouchEnd);const onMiniPlay=e=>{e.stopPropagation();togglePlay();};const onMuteToggle=e=>{e.stopPropagation();applyMute(!curMuted);};const onReplay=e=>{e.stopPropagation();if(!mc)return;showReplay(false);mc.setTime(0);mc.play();setPaused(false);};miniPlay.addEventListener("click",onMiniPlay);miniMute.addEventListener("click",onMuteToggle);muteBtn.addEventListener("click",onMuteToggle);replayBtn.addEventListener("click",onReplay);const onDropClick=()=>videoInput.click();dropOverlay.addEventListener("click",onDropClick);function positionSpeedPanel(){const btnRect=speedBtn.getBoundingClientRect();const ctrlRect=controls.getBoundingClientRect();const panelW=speedPanel.offsetWidth||80;const btnCenterX=btnRect.left+btnRect.width/2-ctrlRect.left;speedPanel.style.right="auto";speedPanel.style.left=btnCenterX-panelW/2+"px";}function openSpeed(){speedPanel.classList.remove("hidden");speedPanel.classList.add("visible");positionSpeedPanel();}function closeSpeed(){speedPanel.classList.remove("visible");speedPanel.classList.add("hidden");}const onSpeedBtn=e=>{e.stopPropagation();speedPanel.classList.contains("visible")?closeSpeed():openSpeed();};speedBtn.addEventListener("click",onSpeedBtn);function applySpeed(s){currentSpeed=s;if(mc)mc.setRate(s);speedBtn.textContent=s+"\xd7";$$(".speed-opt").forEach(o=>o.classList.toggle("active",parseFloat(o.dataset.speed)===s));showToast("Speed "+s+"\xd7");}const speedOptHandlers=[];$$(".speed-opt").forEach(opt=>{const h=e=>{e.stopPropagation();applySpeed(parseFloat(opt.dataset.speed));closeSpeed();};opt.addEventListener("click",h);speedOptHandlers.push([opt,h]);});const onDocClick=()=>closeSpeed();document.addEventListener("click",onDocClick);function requestFS(el){return(el.requestFullscreen||el.webkitRequestFullscreen||el.mozRequestFullScreen||el.msRequestFullscreen||function(){}).call(el);}function exitFS(){(document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen||function(){}).call(document);}function isFS(){return!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);}function toggleFullscreen(){closeSpeed();if(!isFS()){pw.classList.add("going-fullscreen");setTimeout(()=>{Promise.resolve(requestFS(pw)).catch(()=>{});setTimeout(()=>pw.classList.remove("going-fullscreen"),600);},80);}else{exitFS();}}const onFsBtn=e=>{e.stopPropagation();toggleFullscreen();};fullscreenBtn.addEventListener("click",onFsBtn);const fsEvents=["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"];const onFsChange=()=>{closeSpeed();fsIcon.innerHTML=isFS()?`<path d="M4.5 1H1.5v3M9.5 1h3v3M12 8.5v3h-3M4.5 12H1.5v-3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>`:`<path d="M1 4.5V1.5h3M9 1.5h3v3M12 8.5v3h-3M4 11.5H1v-3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;layoutEmbeds();};fsEvents.forEach(evt=>document.addEventListener(evt,onFsChange));function showCtrls(){controls.classList.add("reveal");pw.classList.remove("hide-cursor");clearTimeout(controlsTimeout);controlsTimeout=setTimeout(()=>{controls.classList.remove("reveal");if(mc)pw.classList.add("hide-cursor");},2600);}const onPwMove=()=>showCtrls();const onPwLeave=()=>{clearTimeout(controlsTimeout);controls.classList.remove("reveal");pw.classList.remove("hide-cursor");};const onPwTouchStart=e=>{if(e.target===clickCatch||e.target===pw)showCtrls();};pw.addEventListener("mousemove",onPwMove);pw.addEventListener("mouseleave",onPwLeave);pw.addEventListener("touchstart",onPwTouchStart,{passive:true});const onVideoInput=e=>{const f=e.target.files?.[0];if(f)loadVideo(f);};videoInput.addEventListener("change",onVideoInput);const onDragOver=ev=>{ev.preventDefault();dropOverlay.classList.remove("hidden");dropOverlay.classList.add("drag-active");};const onDragLeave=ev=>{ev.preventDefault();dropOverlay.classList.remove("drag-active");};const onDrop=e=>{e.preventDefault();dropOverlay.classList.remove("drag-active");const f=e.dataTransfer?.files[0];if(f&&f.type.startsWith("video/"))loadVideo(f);};pw.addEventListener("dragenter",onDragOver);pw.addEventListener("dragover",onDragOver);pw.addEventListener("dragleave",onDragLeave);pw.addEventListener("drop",onDrop);const onKeyDown=e=>{const tag=document.activeElement?.tagName;if(tag==="INPUT"||tag==="TEXTAREA")return;if(!mc)return;switch(e.key){case" ":case"k":e.preventDefault();togglePlay();break;case"ArrowLeft":seekAndAnimate(mc.getTime()-10);flashSeek("back");flashEdge("left");showCtrls();break;case"ArrowRight":seekAndAnimate(mc.getTime()+10);flashSeek("fwd");flashEdge("right");showCtrls();break;case"ArrowUp":e.preventDefault();curVol=Math.min(1,curVol+.05);mc.setVolume(curVol);showToast(Math.round(curVol*100)+"%");break;case"ArrowDown":e.preventDefault();curVol=Math.max(0,curVol-.05);mc.setVolume(curVol);showToast(Math.round(curVol*100)+"%");break;case"m":case"M":applyMute(!curMuted);showToast(curMuted?"Muted":"Unmuted");break;case"f":case"F":toggleFullscreen();break;case">":case".":{const i=speeds.indexOf(currentSpeed);if(i<speeds.length-1)applySpeed(speeds[i+1]);break;}case"<":case",":{const i=speeds.indexOf(currentSpeed);if(i>0)applySpeed(speeds[i-1]);break;}}};document.addEventListener("keydown",onKeyDown);const io=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(autoplay&&mc){if(inView){autoStart();}else{mc.pause();setPaused(true);}}},{threshold:.25});io.observe(pw);const ro=new ResizeObserver(()=>layoutEmbeds());ro.observe(media);replayIcon.innerHTML=REPLAY;updatePlayIcons();updateMuteIcons();mountSource(source);return()=>{destroyed=true;clearTimeout(controlsTimeout);clearTimeout(toastTimer);clearTimeout(seekTimer);clearTimeout(ppTimer);if(holdTimer)clearTimeout(holdTimer);if(singleTapTimer)clearTimeout(singleTapTimer);io.disconnect();ro.disconnect();layoutRef.current=null;destroyMc();scrubVid.removeEventListener("seeked",onScrubSeeked);window.removeEventListener("mouseup",onWinUp);window.removeEventListener("mousemove",onWinMove);window.removeEventListener("mouseup",onWinMouseUp);document.removeEventListener("click",onDocClick);document.removeEventListener("keydown",onKeyDown);fsEvents.forEach(evt=>document.removeEventListener(evt,onFsChange));speedOptHandlers.forEach(([el,h])=>el.removeEventListener("click",h));objectUrls.forEach(u=>URL.revokeObjectURL(u));try{scrubVid.removeAttribute("src");}catch{}};},[source,isStatic,autoplay,autoMute,loop]);useEffect(()=>{layoutRef.current&&layoutRef.current();},[fit,cropX,cropY,aspectRatio]);if(isStatic){// ---- Static preview (canvas / export / thumbnail) ----
// No timers, playback or animation — just a still frame so the
// component shows what the video is and how big it is on the canvas.
const arFixed=aspectRatio!=="custom"&&AR_MAP[aspectRatio]?AR_MAP[aspectRatio]:"16 / 9";const ytMatch=source.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/);const ytId=ytMatch?ytMatch[1]:null;const isVimeo=/vimeo\.com/.test(source);const objPos=`${cropX}% ${cropY}%`;const boxStyle={position:"relative",width:"100%",maxWidth:900,margin:"0 auto",aspectRatio:arFixed,borderRadius:cornerRadius,overflow:"hidden",background:"#000",display:"flex",alignItems:"center",justifyContent:"center"};const mediaStyle={width:"100%",height:"100%",objectFit:fit,objectPosition:objPos,display:"block",background:"#000"};let inner;if(!source){inner=/*#__PURE__*/_jsxs("div",{style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,background:"#0e0e0e",color:"rgba(255,255,255,0.55)",fontFamily:"Inter, system-ui, sans-serif"},children:[/*#__PURE__*/_jsx("div",{style:{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",display:"flex",alignItems:"center",justifyContent:"center"},children:/*#__PURE__*/_jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#fff",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",style:{opacity:.8},children:/*#__PURE__*/_jsx("polygon",{points:"9 7 17 12 9 17 9 7"})})}),/*#__PURE__*/_jsx("div",{style:{fontSize:13,fontWeight:500,color:"#f0f0f0"},children:"Open a video"}),/*#__PURE__*/_jsx("div",{style:{fontSize:11,color:"rgba(255,255,255,0.4)"},children:"Set a file or URL"})]});}else if(ytId){inner=/*#__PURE__*/_jsx("img",{src:`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,alt:"",style:mediaStyle,draggable:false});}else if(isVimeo){inner=/*#__PURE__*/_jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#12161a 0%,#0a0d10 100%)",color:"rgba(255,255,255,0.5)",fontFamily:"Inter, system-ui, sans-serif",fontSize:12,letterSpacing:"0.04em"},children:"Vimeo video"});}else{// Native file / direct URL: #t hint nudges the browser to paint
// an actual frame rather than a black poster.
inner=/*#__PURE__*/_jsx("video",{src:source+"#t=0.1",preload:"metadata",muted:true,playsInline:true,style:mediaStyle});}// Subtle static play glyph so the thumbnail reads as a video.
const showGlyph=!!source&&!isVimeo;return /*#__PURE__*/_jsx("div",{ref:rootRef,style:{width:"100%",...style},children:/*#__PURE__*/_jsxs("div",{style:boxStyle,children:[inner,showGlyph&&/*#__PURE__*/_jsx("div",{style:{position:"absolute",width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,0.18)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"},children:/*#__PURE__*/_jsx("svg",{width:"22",height:"22",viewBox:"0 0 24 24",children:/*#__PURE__*/_jsx("path",{d:"M8 5.6v12.8l10.5-6.4z",fill:"#fff",stroke:"#fff",strokeWidth:"2.6",strokeLinejoin:"round",strokeLinecap:"round"})})})]})});}const rootStyle={width:"100%","--radius":cornerRadius+"px","--progress-color":progressColor,"--fit":fit,"--pos":`${cropX}% ${cropY}%`,...aspectRatio!=="custom"&&AR_MAP[aspectRatio]?{"--ar-fixed":AR_MAP[aspectRatio]}:{},...style};return /*#__PURE__*/_jsxs("div",{ref:rootRef,className:"framer-vp"+(hideUI?" minimal":""),style:rootStyle,children:[/*#__PURE__*/_jsx("style",{children:CSS}),/*#__PURE__*/_jsx("div",{className:"app",children:/*#__PURE__*/_jsxs("div",{className:"player-wrap",children:[/*#__PURE__*/_jsx("div",{className:"media",children:/*#__PURE__*/_jsx("video",{className:"video-el",poster:posterUrl||undefined,preload:"metadata"})}),/*#__PURE__*/_jsx("div",{className:"click-catch"}),/*#__PURE__*/_jsxs("div",{className:"drop-overlay",children:[/*#__PURE__*/_jsx("div",{className:"drop-icon",children:/*#__PURE__*/_jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[/*#__PURE__*/_jsx("path",{d:"M10 3v10M10 3L7 6M10 3l3 3",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),/*#__PURE__*/_jsx("path",{d:"M3 14v1.5A1.5 1.5 0 004.5 17h11a1.5 1.5 0 001.5-1.5V14",strokeWidth:"1.5",strokeLinecap:"round"})]})}),/*#__PURE__*/_jsx("h2",{children:"Open a video"}),/*#__PURE__*/_jsx("p",{children:"Drop a file, click to browse, or set a URL"})]}),/*#__PURE__*/_jsx("div",{className:"edge-flash edge-left"}),/*#__PURE__*/_jsx("div",{className:"edge-flash edge-right"}),/*#__PURE__*/_jsx("div",{className:"playpause-flash",children:/*#__PURE__*/_jsx("svg",{className:"pp-icon",width:"26",height:"26",viewBox:"0 0 24 24",fill:"currentColor"})}),/*#__PURE__*/_jsx("button",{className:"replay-btn",title:"Replay",children:/*#__PURE__*/_jsx("svg",{width:"30",height:"30",viewBox:"0 0 24 24"})}),/*#__PURE__*/_jsx("div",{className:"hold-badge",children:"2\xd7 Speed"}),/*#__PURE__*/_jsxs("div",{className:"seek-indicator",children:[/*#__PURE__*/_jsx("svg",{className:"seek-icon",width:"15",height:"15",viewBox:"0 0 16 16",fill:"none",stroke:"white",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",children:/*#__PURE__*/_jsx("polyline",{points:"10,4 6,8 10,12"})}),/*#__PURE__*/_jsx("span",{className:"seek-label",children:"−10s"})]}),/*#__PURE__*/_jsxs("div",{className:"speed-panel hidden",children:[/*#__PURE__*/_jsx("div",{className:"speed-opt","data-speed":"0.5",children:"0.5\xd7"}),/*#__PURE__*/_jsx("div",{className:"speed-opt","data-speed":"0.75",children:"0.75\xd7"}),/*#__PURE__*/_jsx("div",{className:"speed-opt active","data-speed":"1",children:"1\xd7"}),/*#__PURE__*/_jsx("div",{className:"speed-opt","data-speed":"1.25",children:"1.25\xd7"}),/*#__PURE__*/_jsx("div",{className:"speed-opt","data-speed":"1.5",children:"1.5\xd7"}),/*#__PURE__*/_jsx("div",{className:"speed-opt","data-speed":"1.75",children:"1.75\xd7"}),/*#__PURE__*/_jsx("div",{className:"speed-opt","data-speed":"2",children:"2\xd7"})]}),/*#__PURE__*/_jsxs("div",{className:"mini-controls",children:[/*#__PURE__*/_jsx("button",{className:"mini-btn mini-play",title:"Play / Pause",children:/*#__PURE__*/_jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24"})}),/*#__PURE__*/_jsx("button",{className:"mini-btn mini-mute",title:"Mute",children:/*#__PURE__*/_jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24"})})]}),/*#__PURE__*/_jsxs("div",{className:"controls",children:[/*#__PURE__*/_jsxs("div",{className:"progress-wrap",children:[/*#__PURE__*/_jsx("div",{className:"progress-track",children:/*#__PURE__*/_jsx("div",{className:"progress-fill",children:/*#__PURE__*/_jsx("div",{className:"progress-thumb"})})}),/*#__PURE__*/_jsxs("div",{className:"frame-preview",children:[/*#__PURE__*/_jsx("div",{className:"frame-canvas-wrap",children:/*#__PURE__*/_jsx("canvas",{className:"frame-canvas"})}),/*#__PURE__*/_jsx("span",{className:"frame-time-label"})]})]}),/*#__PURE__*/_jsxs("div",{className:"ctrl-row",children:[/*#__PURE__*/_jsx("span",{className:"time-display",children:"0:00 / 0:00"}),/*#__PURE__*/_jsx("button",{className:"ctrl-btn mute-btn",title:"Mute (M)",children:/*#__PURE__*/_jsx("svg",{width:"17",height:"17",viewBox:"0 0 24 24"})}),/*#__PURE__*/_jsx("button",{className:"ctrl-btn speed-btn",title:"Playback speed",children:"1\xd7"}),/*#__PURE__*/_jsx("button",{className:"ctrl-btn fullscreen-btn",title:"Fullscreen (F)",children:/*#__PURE__*/_jsx("svg",{className:"fs-icon",width:"13",height:"13",viewBox:"0 0 13 13",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",children:/*#__PURE__*/_jsx("path",{d:"M1 4.5V1.5h3M9 1.5h3v3M12 8.5v3h-3M4 11.5H1v-3"})})})]})]}),/*#__PURE__*/_jsx("div",{className:"toast"})]})}),/*#__PURE__*/_jsx("input",{type:"file",className:"video-input",accept:"video/*"})]});}addPropertyControls(VideoPlayerV8,{sourceType:{type:ControlType.Enum,title:"Video",options:["upload","link"],optionTitles:["Upload","Link"],displaySegmentedControl:true,defaultValue:"upload"},videoFile:{type:ControlType.File,title:"File",allowedFileTypes:["mp4","webm","mov","m4v","ogg"],hidden:p=>p.sourceType==="link"},videoUrl:{type:ControlType.String,title:"Link",placeholder:"YouTube / Vimeo / .mp4 link",defaultValue:"",hidden:p=>p.sourceType!=="link"},aspectRatio:{type:ControlType.Enum,title:"Aspect",options:["16:9","9:16","1:1","custom"],optionTitles:["16:9","9:16","1:1","Custom"],displaySegmentedControl:true,defaultValue:"custom"},fit:{type:ControlType.Enum,title:"Crop",options:["contain","cover"],optionTitles:["Fit","Crop"],displaySegmentedControl:true,defaultValue:"contain"},cropX:{type:ControlType.Number,title:"Crop X",min:0,max:100,step:1,unit:"%",defaultValue:50,hidden:p=>p.fit!=="cover"},cropY:{type:ControlType.Number,title:"Crop Y",min:0,max:100,step:1,unit:"%",defaultValue:50,hidden:p=>p.fit!=="cover"},cornerRadius:{type:ControlType.Number,title:"Radius",min:0,max:80,step:1,unit:"px",defaultValue:14},progressColor:{type:ControlType.Color,title:"Progress",defaultValue:"#ffffff"},autoplay:{type:ControlType.Boolean,title:"Autoplay",enabledTitle:"On",disabledTitle:"Off",defaultValue:false},autoMute:{type:ControlType.Boolean,title:"Auto Mute",enabledTitle:"On",disabledTitle:"Off",defaultValue:true},loop:{type:ControlType.Boolean,title:"Loop",enabledTitle:"On",disabledTitle:"Off",defaultValue:false},hideUI:{type:ControlType.Boolean,title:"Minimal UI",enabledTitle:"On",disabledTitle:"Off",defaultValue:false}});const CSS=`
.framer-vp {
  --border: rgba(0,0,0,0.08);
  --text: #1a1a1a;
  --muted: rgba(0,0,0,0.38);
  --spring: cubic-bezier(0.34,1.56,0.64,1);
  --spring-soft: cubic-bezier(0.22,1.4,0.36,1);
  --ease-out: cubic-bezier(0.16,1,0.3,1);
  background: transparent;
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}
.framer-vp *, .framer-vp *::before, .framer-vp *::after {
  box-sizing: border-box; margin: 0; padding: 0;
  -webkit-tap-highlight-color: transparent; outline: none;
}
.framer-vp svg { display: block; }
.framer-vp input[type="file"] { display: none; }

.framer-vp .app { width: 100%; display: flex; justify-content: center; }

.framer-vp .player-wrap {
  width: 100%; max-width: 900px; position: relative;
  border-radius: var(--radius, 14px); overflow: hidden;
  background: transparent; transform: translateZ(0);
  transition: border-radius 0.45s var(--ease-out);
}
.framer-vp .player-wrap.going-fullscreen { border-radius: 0; }
.framer-vp .player-wrap:-webkit-full-screen { width:100vw;height:100vh;max-width:none;border-radius:0;display:flex;align-items:center;justify-content:center;background:#000; }
.framer-vp .player-wrap:-moz-full-screen { width:100vw;height:100vh;max-width:none;border-radius:0;display:flex;align-items:center;justify-content:center;background:#000; }
.framer-vp .player-wrap:fullscreen { width:100vw;height:100vh;max-width:none;border-radius:0;display:flex;align-items:center;justify-content:center;background:#000; }

.framer-vp .media {
  position: relative; width: 100%;
  aspect-ratio: var(--ar-fixed, var(--ar, 16 / 9));
  background: #000; overflow: hidden; border-radius: inherit;
}
.framer-vp .media .video-el {
  position: absolute; inset: 0; width: 100%; height: 100%;
  border: 0; background: #000;
  object-fit: var(--fit, contain); object-position: var(--pos, center);
}
.framer-vp .media .embed-holder { position: absolute; inset: 0; }
.framer-vp .media .embed-holder iframe {
  position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block;
}
.framer-vp .player-wrap:fullscreen .media,
.framer-vp .player-wrap:-webkit-full-screen .media,
.framer-vp .player-wrap:-moz-full-screen .media { width: 100vw; height: 100vh; aspect-ratio: auto; border-radius: 0; }

.framer-vp .click-catch { position: absolute; inset: 0; z-index: 5; cursor: pointer; touch-action: manipulation; }

.framer-vp .drop-overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 10px;
  background: #0e0e0e; cursor: pointer; transition: background 0.15s; z-index: 20;
}
.framer-vp .drop-overlay:hover { background: #141414; }
.framer-vp .drop-overlay.hidden { opacity: 0; pointer-events: none; }
.framer-vp .drop-overlay.drag-active { background: #1c1c1c; }
.framer-vp .drop-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14);
  display: flex; align-items: center; justify-content: center;
}
.framer-vp .drop-icon svg path { stroke: #fff; opacity: 0.75; }
.framer-vp .drop-overlay h2 { font-size: 14px; font-weight: 500; color: #f0f0f0; }
.framer-vp .drop-overlay p { font-size: 11px; color: rgba(255,255,255,0.4); }

.framer-vp .edge-flash { position: absolute; top: 0; bottom: 0; width: 5.5%; pointer-events: none; z-index: 18; opacity: 0; }
.framer-vp .edge-left { left: 0; }
.framer-vp .edge-right { right: 0; }
.framer-vp .edge-flash::before {
  content: ''; position: absolute; inset: 0;
  backdrop-filter: blur(18px) saturate(2.2) brightness(1.05) contrast(1.1);
  -webkit-backdrop-filter: blur(18px) saturate(2.2) brightness(1.05) contrast(1.1);
}
.framer-vp .edge-left::before {
  mask-image: linear-gradient(to right, black 0%, black 25%, rgba(0,0,0,0.5) 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 0%, black 25%, rgba(0,0,0,0.5) 60%, transparent 100%);
}
.framer-vp .edge-right::before {
  mask-image: linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.5) 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.5) 60%, transparent 100%);
}
.framer-vp .edge-flash.flash-in { animation: vpEdge 0.6s var(--ease-out) forwards; }
@keyframes vpEdge { 0% { opacity: 0; } 8% { opacity: 1; } 100% { opacity: 0; } }

.framer-vp .playpause-flash {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  pointer-events: none; z-index: 26; opacity: 0;
  width: 72px; height: 72px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  background: rgba(255,255,255,0.15);
}
.framer-vp .playpause-flash svg { color: #fff; }
.framer-vp .replay-btn {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 72px; height: 72px; border-radius: 50%;
  display: none; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 0; color: #fff; cursor: pointer; z-index: 27;
  transition: background 0.12s, transform 0.1s var(--spring);
}
.framer-vp .replay-btn.show { display: flex; }
.framer-vp .replay-btn:hover { background: rgba(255,255,255,0.24); }
.framer-vp .replay-btn:active { transform: translate(-50%, -50%) scale(0.9); }
.framer-vp .playpause-flash.show { animation: vpPp 1.1s var(--ease-out) forwards; }
@keyframes vpPp {
  0% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); }
  12% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  72% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(1); }
}

.framer-vp .controls {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 56px 16px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  opacity: 0; pointer-events: none; transform: translateY(10px);
  transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
  z-index: 15;
}
/* Container never eats clicks — so tapping the gradient area (above the
   progress bar) passes through to the click-catch layer and toggles play.
   Only the real controls below re-enable pointer events. */
.framer-vp .controls { pointer-events: none; }
.framer-vp .controls.reveal { opacity: 1; transform: none; }
.framer-vp .controls.reveal .progress-wrap,
.framer-vp .controls.reveal .ctrl-row { pointer-events: auto; }
.framer-vp .controls.hidden { opacity: 0 !important; }
.framer-vp.minimal .controls { display: none !important; }
.framer-vp .player-wrap.hide-cursor,
.framer-vp .player-wrap.hide-cursor * { cursor: none !important; }

.framer-vp .mini-controls {
  position: absolute; bottom: 14px; left: 14px;
  display: none; gap: 8px; z-index: 16;
}
.framer-vp.minimal .mini-controls { display: flex; }
.framer-vp .mini-btn {
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(255,255,255,0.16);
  backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 0; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.12s, transform 0.08s;
}
.framer-vp .mini-btn:hover { background: rgba(255,255,255,0.26); }
.framer-vp .mini-btn:active { transform: scale(0.92); }

.framer-vp .seek-indicator {
  position: absolute; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center; gap: 9px;
  background: rgba(255,255,255,0.13);
  backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 14px; padding: 10px 22px;
  color: #fff; font-size: 13px; font-weight: 500;
  pointer-events: none; z-index: 25; opacity: 0; transition: opacity 0.15s;
}
.framer-vp .seek-indicator.show { opacity: 1; }

.framer-vp .progress-wrap {
  width: 100%; height: 48px; display: flex; align-items: center;
  cursor: pointer; margin-bottom: 10px; position: relative; touch-action: none;
}
.framer-vp .progress-track {
  width: 100%; height: 5px; border-radius: 99px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(12px) saturate(1.5); -webkit-backdrop-filter: blur(12px) saturate(1.5);
  border: 1px solid rgba(255,255,255,0.14);
  position: relative; overflow: visible;
  transition: height 0.2s var(--spring);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.08);
}
.framer-vp .progress-wrap:hover .progress-track,
.framer-vp .progress-wrap.dragging .progress-track { height: 7px; }
.framer-vp .progress-fill { height: 100%; background: var(--progress-color, rgba(255,255,255,0.92)); border-radius: 99px; pointer-events: none; position: relative; }
.framer-vp .progress-fill.no-transition { transition: none; }
.framer-vp .progress-thumb {
  position: absolute; right: -10px; top: 50%; transform: translateY(-50%) scale(0);
  width: 20px; height: 12px; border-radius: 99px; background: #fff; opacity: 0;
  transition: opacity 0.18s, width 0.32s var(--spring), height 0.32s var(--spring), transform 0.32s var(--spring), right 0.32s var(--spring);
  pointer-events: none; box-shadow: 0 1px 6px rgba(0,0,0,0.4);
}
.framer-vp .progress-wrap:hover .progress-thumb,
.framer-vp .progress-wrap.dragging .progress-thumb { opacity: 1; transform: translateY(-50%) scale(1); width: 28px; height: 14px; right: -14px; }
.framer-vp .progress-wrap.dragging .progress-thumb { animation: vpPill 0.35s var(--spring) infinite alternate; }
@keyframes vpPill { 0% { width: 28px; height: 14px; } 100% { width: 34px; height: 10px; } }

.framer-vp .frame-preview {
  position: absolute; bottom: 60px; left: 0; transform: translateX(-50%);
  opacity: 0; pointer-events: none; transition: opacity 0.15s; z-index: 30;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.framer-vp .frame-preview.show { opacity: 1; }
.framer-vp .frame-canvas-wrap {
  width: 160px; height: 90px; border-radius: 9px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 8px 28px rgba(0,0,0,0.6); background: #111;
}
.framer-vp .frame-canvas { width: 100%; height: 100%; display: block; }
.framer-vp .frame-time-label {
  font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.85);
  white-space: nowrap; letter-spacing: 0.04em; background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  padding: 3px 10px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.14);
}

.framer-vp .ctrl-row { display: flex; align-items: center; gap: 5px; }
.framer-vp .ctrl-btn {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(16px) saturate(1.4); -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.92);
  border-radius: 8px; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.12s, transform 0.08s; flex-shrink: 0;
}
.framer-vp .ctrl-btn:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.3); }
.framer-vp .ctrl-btn:active { transform: scale(0.92); }
.framer-vp .time-display {
  font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.7);
  letter-spacing: 0.02em; flex: 1; padding-left: 6px; font-variant-numeric: tabular-nums;
}

.framer-vp .speed-btn { font-size: 10px; font-weight: 500; letter-spacing: 0.03em; min-width: 38px; }
.framer-vp .speed-panel {
  position: absolute; bottom: 64px;
  background: rgba(255,255,255,0.84);
  backdrop-filter: blur(28px) saturate(1.8); -webkit-backdrop-filter: blur(28px) saturate(1.8);
  border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 5px; z-index: 30;
  box-shadow: 0 10px 36px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.8) inset;
  min-width: 80px; transform-origin: bottom center;
}
.framer-vp .speed-panel.hidden { opacity: 0; pointer-events: none; transform: scaleY(0.5) translateY(8px); transition: opacity 0.08s ease, transform 0.1s ease; }
.framer-vp .speed-panel.visible { opacity: 1; pointer-events: auto; transform: scaleY(1) translateY(0); transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1); }
.framer-vp .speed-opt {
  font-size: 12px; font-weight: 400; padding: 8px 14px; border-radius: 7px; cursor: pointer;
  color: rgba(0,0,0,0.65); text-align: center; transition: background 0.1s, color 0.1s; font-variant-numeric: tabular-nums;
}
.framer-vp .speed-opt:hover { background: rgba(0,0,0,0.06); color: #000; }
.framer-vp .speed-opt.active { color: #000; font-weight: 500; background: rgba(0,0,0,0.07); }

.framer-vp .toast {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%) translateY(-50px);
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border); border-radius: 8px;
  padding: 7px 16px; font-size: 11.5px; font-weight: 500; color: var(--text);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: transform 0.28s var(--spring);
  z-index: 40; white-space: nowrap; pointer-events: none;
}
.framer-vp .toast.show { transform: translateX(-50%) translateY(0); }

.framer-vp .hold-badge {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%) translateY(-40px);
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 99px; padding: 5px 14px;
  color: rgba(255,255,255,0.95); font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
  pointer-events: none; z-index: 28; opacity: 0; transition: opacity 0.2s, transform 0.28s var(--spring);
}
.framer-vp .hold-badge.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`;
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"VideoPlayerV8","slots":[],"annotations":{"framerContractVersion":"1","framerSupportedLayoutHeight":"any-prefer-fixed","framerSupportedLayoutWidth":"any-prefer-fixed"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./Video_player.map