/* A small native WebGL globe. All coordinates are approximate regional markers. */
(() => {
  const root = document.querySelector('[data-globe]');
  if (!root) return;
  const canvas = root.querySelector('.planet-canvas'), overlay = root.querySelector('.planet-overlay');
  const ctx = overlay.getContext('2d'), stage = root.querySelector('.globe-stage');
  const status = root.querySelector('.globe-load-status'), reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const places = {
    fuchu: {lat:34.57,lon:133.23,zoom:1.02,status:'現在の事業',title:'すべては、この街から。',text:'水環境を守り、資源をつなぐ。府中で培った経験が、未来への出発点です。',href:'vision.html#roots'},
    vietnam: {lat:16.05,lon:108.2,zoom:1.1,status:'海外展開の方針',title:'海を越えて、ともにつくる。',text:'地域で培った循環の知恵を、ベトナムへ。現地の暮らしと産業に寄り添う展開を目指します。',href:'vision.html#world'},
    world: {lat:12,lon:20,zoom:.91,status:'これからのビジョン',title:'ひとつの地球で、生きている。',text:'地域の課題も、地球の未来もつながっている。国境を越えた共創で、美しい循環を広げていきます。',href:'vision.html'},
    space: {lat:20,lon:120,zoom:.62,status:'長期研究構想',title:'循環は、宇宙の暮らしへ。',text:'水の浄化、資源の再生、農業への栄養循環。地上の知恵を宇宙の暮らしへつなぐ、未来の研究構想です。',href:'vision.html#space'}
  };
  const rad = Math.PI/180, clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  let yaw=-117*rad,pitch=23*rad,zoom=.98,ty=yaw,tp=pitch,tz=zoom,velocity=0;
  let width=1,height=1,dpr=1,raf=0,last=0,phase=0,visible=true,ready=false,drag=null,selected='fuchu',auto=true;
  const paused=()=>reduced.matches || document.body.classList.contains('motion-paused');
  const point = p=>{const a=p.lat*rad,b=p.lon*rad;return [Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b)];};
  const project=(v,e=1)=>{const c=Math.cos(yaw),s=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);const x=c*v[0]+s*v[2],z=-s*v[0]+c*v[2],y=cp*v[1]-sp*z;return {x:width/2+x*Math.min(width,height)*.405*zoom*e,y:height/2-y*Math.min(width,height)*.405*zoom*e,z:sp*v[1]+cp*z};};
  let gl;
  function fallback(){ready=false;root.dataset.renderer='fallback';status.textContent='静止画で表示しています。地域ボタンから探索できます。';canvas.tabIndex=-1;root.querySelector('.globe-help').textContent='地域を選んでストーリーを探索';root.querySelector('.globe-tools').hidden=true;root.querySelector('.globe-pin-layer').hidden=true;}
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  let program,uniforms;
  function texture(url,unit){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{gl.activeTexture(gl.TEXTURE0+unit);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);resolve();};img.onerror=reject;img.src=url;});}
  async function init(){try{
    gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false});if(!gl)throw Error('WebGL unavailable');
    program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 a; void main(){gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision mediump float;
      uniform vec2 res; uniform float yaw; uniform float pitch; uniform float zoom; uniform sampler2D day; uniform sampler2D night;
      void main(){vec2 p=(gl_FragCoord.xy-res*.5)/(min(res.x,res.y)*.405*zoom);float d=length(p);
        if(d>1.){float glow=exp(-(d-1.)*24.)*.34;gl_FragColor=vec4(.17,.62,.85,glow);return;}
        vec3 n=vec3(p,sqrt(max(0.,1.-dot(p,p))));float cy=cos(yaw),sy=sin(yaw),cp=cos(pitch),sp=sin(pitch);
        vec3 w=vec3(cy*n.x-sy*(-sp*n.y+cp*n.z),cp*n.y+sp*n.z,sy*n.x+cy*(-sp*n.y+cp*n.z));
        vec2 uv=vec2(atan(w.x,w.z)/6.2831853+.5,asin(clamp(w.y,-1.,1.))/3.14159265+.5);
        float light=dot(n,normalize(vec3(-.75,.45,.88)));vec3 color=texture2D(day,uv).rgb*(.14+.94*smoothstep(-.18,.87,light));
        color+=texture2D(night,uv).rgb*(1.-smoothstep(-.12,.28,light))*.95;
        color+=vec3(.16,.55,.8)*pow(1.-n.z,3.2)*.5;gl_FragColor=vec4(color,1.-smoothstep(.992,1.,d));}`));
    gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Globe shader failed');gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    uniforms=Object.fromEntries(['res','yaw','pitch','zoom','day','night'].map(k=>[k,gl.getUniformLocation(program,k)]));
    await Promise.all([texture('assets/earth_atmos_2048.jpg',0),texture('assets/earth_lights_2048.png',1)]);
    gl.uniform1i(uniforms.day,0);gl.uniform1i(uniforms.night,1);ready=true;root.dataset.renderer='webgl';status.hidden=true;resize();
  }catch(e){fallback();}}
  function request(){if(!raf && visible && !document.hidden && ready)raf=requestAnimationFrame(frame);}
  function resize(){const r=stage.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(devicePixelRatio||1,1.6);for(const c of [canvas,overlay]){c.width=Math.round(width*dpr);c.height=Math.round(height*dpr);}if(gl)gl.viewport(0,0,canvas.width,canvas.height);request();}
  function drawOverlay(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    ctx.strokeStyle='rgba(171,217,203,.14)';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(width/2,height/2,Math.min(width,height)*.49,Math.min(width,height)*.15,-.35,0,Math.PI*2);ctx.stroke();
    const start=point(places.fuchu),end=point(places.vietnam),dot=start.reduce((s,v,i)=>s+v*end[i],0),angle=Math.acos(dot);
    const route=t=>{const a=Math.sin((1-t)*angle)/Math.sin(angle),b=Math.sin(t*angle)/Math.sin(angle);return project(start.map((v,i)=>v*a+end[i]*b),1+Math.sin(t*Math.PI)*.16);};
    ctx.beginPath();let drawn=false;for(let i=0;i<=70;i++){const p=route(i/70);if(p.z<.02){drawn=false;continue;}if(!drawn)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);drawn=true;}ctx.strokeStyle='rgba(210,248,154,.8)';ctx.lineWidth=1.15;ctx.stroke();
    for(let i=0;i<3;i++){const p=route((phase*.07+i/3)%1);if(p.z>0){ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fillStyle='#e3ffc0';ctx.shadowColor='#d4f98a';ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;}}
    root.querySelectorAll('[data-pin]').forEach(el=>{const p=project(point(places[el.dataset.pin]),1.012);el.style.left=p.x+'px';el.style.top=p.y+'px';el.hidden=p.z<.12;});
    if(selected==='space'){ctx.beginPath();ctx.setLineDash([3,7]);ctx.moveTo(width*.58,height*.4);ctx.lineTo(width*.8,height*.19);ctx.strokeStyle='rgba(212,249,138,.4)';ctx.stroke();ctx.setLineDash([]);}
  }
  function frame(time){raf=0;if(!ready||!visible||document.hidden)return;const dt=Math.min(time-last||16,40);last=time;const motion=!paused();
    if(motion){phase+=dt/1000;if(auto&&!drag)ty+=dt*.000025;if(!drag&&Math.abs(velocity)>.00002){ty+=velocity;velocity*=Math.pow(.93,dt/16);}}
    const ease=reduced.matches?1:1-Math.exp(-dt/180);yaw+=(ty-yaw)*ease;pitch+=(tp-pitch)*ease;zoom+=(tz-zoom)*ease;
    gl.uniform2f(uniforms.res,canvas.width,canvas.height);gl.uniform1f(uniforms.yaw,yaw);gl.uniform1f(uniforms.pitch,pitch);gl.uniform1f(uniforms.zoom,zoom);gl.drawArrays(gl.TRIANGLES,0,6);drawOverlay();
    canvas.dataset.rotation=yaw.toFixed(4)+','+pitch.toFixed(4);canvas.dataset.zoom=zoom.toFixed(3);
    if(motion||Math.abs(ty-yaw)+Math.abs(tp-pitch)+Math.abs(tz-zoom)>.0005)request();
  }
  function select(key){const p=places[key];selected=key;root.dataset.selected=key;auto=key==='world';velocity=0;let next=-p.lon*rad;next+=Math.round((yaw-next)/(2*Math.PI))*2*Math.PI;ty=next;tp=p.lat*rad;tz=p.zoom;
    root.querySelectorAll('[data-place]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.place===key)));const story=root.querySelector('.globe-story');story.querySelector('.globe-status').textContent=p.status;story.querySelector('h2').textContent=p.title;story.querySelector('p').textContent=p.text;story.querySelector('a').href=p.href;story.querySelector('a').setAttribute('aria-label',p.title+' 詳しく見る');root.querySelector('.space-destination').hidden=key!=='space';request();}
  root.querySelectorAll('[data-place],[data-pin]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.place||b.dataset.pin)));
  root.querySelectorAll('[data-globe-action]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.globeAction;if(a==='reset')select('fuchu');else tz=clamp(tz+(a==='in'?.12:-.12),.55,1.28);request();}));
  canvas.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY};auto=false;velocity=0;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
  canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const f=5/Math.min(width,height),dx=e.clientX-drag.x,dy=e.clientY-drag.y;ty+=dx*f;tp=clamp(tp+dy*f,-1.35,1.35);velocity=dx*f*.3;drag.x=e.clientX;drag.y=e.clientY;request();});
  const release=()=>{drag=null;canvas.classList.remove('dragging');request();};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',()=>{velocity=0;release();});canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','+','-','='].includes(e.key))return;e.preventDefault();auto=false;velocity=0;if(e.key==='Home')select('fuchu');if(e.key==='ArrowLeft')ty-=.13;if(e.key==='ArrowRight')ty+=.13;if(e.key==='ArrowUp')tp=clamp(tp-.1,-1.35,1.35);if(e.key==='ArrowDown')tp=clamp(tp+.1,-1.35,1.35);if(e.key==='+'||e.key==='=')tz=clamp(tz+.12,.55,1.28);if(e.key==='-')tz=clamp(tz-.12,.55,1.28);request();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});canvas.addEventListener('webglcontextrestored',()=>location.reload());
  new ResizeObserver(resize).observe(stage);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;request();}).observe(root);
  new MutationObserver(request).observe(document.body,{attributes:true,attributeFilter:['class']});reduced.addEventListener('change',request);document.addEventListener('visibilitychange',()=>{last=0;request();});
  init();
})();
