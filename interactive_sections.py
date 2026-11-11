GLOBE_HERO='''
<section class="hero interactive-hero" id="planet">
  <div class="hero-stars" aria-hidden="true"></div>
  <div class="hero-content">
    <div class="hero-kicker"><span class="live-dot"></span> A SMALL CITY. A SHARED PLANET.</div>
    <h1>府中から、<br>宇宙へ<span class="lime">。</span></h1>
    <p class="hero-lead">水と資源の循環で、<br>人と地球の未来をつくる。</p>
    <p class="hero-sub">この街の仕事は、世界とつながっている。<br>さあ、地球に触れて、その先へ。</p>
    <a class="button light" href="#circulation-play">循環を、体験する <span aria-hidden="true">↓</span></a>
    <div class="hero-coordinate"><span class="live-dot"></span> ORIGIN: FUCHU, HIROSHIMA <span>34.57° N / 133.23° E</span></div>
  </div>
  <div class="globe-experience" data-globe>
    <div class="globe-stage">
      <img class="globe-fallback" src="assets/earth-nasa.webp" alt="宇宙から見た地球" width="1400" height="1400">
      <canvas class="planet-canvas" tabindex="0" role="img" aria-label="ドラッグや矢印キーで回せる地球。下の地域ボタンでも移動できます。" aria-describedby="globe-help"></canvas>
      <canvas class="planet-overlay" aria-hidden="true"></canvas>
      <div class="globe-pin-layer"><button class="globe-pin" data-pin="fuchu" aria-label="地球上の広島・府中を選ぶ"><i></i><span>FUCHU<small>広島・府中</small></span></button><button class="globe-pin" data-pin="vietnam" aria-label="地球上のベトナムを選ぶ"><i></i><span>VIETNAM<small>海外展開の方針</small></span></button></div>
      <div class="space-destination" hidden><span class="moon-mark" aria-hidden="true"></span><div>BEYOND EARTH<small>宇宙の暮らしを支える構想</small></div></div>
      <div class="globe-tools" aria-label="地球の表示操作"><button data-globe-action="in" aria-label="地球を拡大">＋</button><button data-globe-action="out" aria-label="地球を縮小">−</button><button data-globe-action="reset" aria-label="地球を初期表示に戻す">↺</button></div>
      <div class="globe-orbit-label" aria-hidden="true">ONE PLANET. ENDLESS CONNECTIONS.</div>
      <p id="globe-help" class="globe-help"><span aria-hidden="true">↔</span> ドラッグで回転 · 地域を選んで探索</p>
      <p class="globe-load-status" role="status">地球を準備しています…</p>
    </div>
    <div class="globe-bottom">
      <div class="globe-places" role="group" aria-label="地球で探す場所"><button data-place="fuchu" aria-pressed="true"><span>01</span> 広島・府中</button><button data-place="vietnam" aria-pressed="false"><span>02</span> ベトナム</button><button data-place="world" aria-pressed="false"><span>03</span> 世界</button><button data-place="space" aria-pressed="false"><span>04</span> 宇宙へ ↗</button></div>
      <div class="globe-story" aria-live="polite" aria-atomic="true"><div><span class="globe-status">現在の事業</span><h2>すべては、この街から。</h2></div><p>水環境を守り、資源をつなぐ。府中で培った経験が、未来への出発点です。</p><a href="vision.html#roots" aria-label="広島・府中の取り組みを詳しく見る">↗</a></div>
      <p class="globe-map-note">地図上の点は地域の目安です。線は構想上のつながりを表しています。</p>
    </div>
  </div>
  <div class="hero-bottom"><a href="#circulation-play" class="scroll-cue"><span class="scroll-line"></span> TOUCH THE FUTURE</a><span class="hero-note">OGAWA ECONOS · REBRANDING CONCEPT</span><button class="motion-toggle" aria-pressed="false">演出を止める <span aria-hidden="true">Ⅱ</span></button></div>
</section>
'''

CIRCULATION_PLAY='''
<section id="circulation-play" class="circulation-play" data-circulation>
  <div class="play-heading"><div><p class="eyebrow">THE CIRCULATION IS IN YOUR HANDS.</p><h2>触れる。つながる。<br><em>未来が、めぐりだす。</em></h2></div><p>水も、資源も、私たちの暮らしも。<br>ひとつを動かすと、世界はつながっていく。<br><strong>５つの要素に触れてみてください。</strong></p></div>
  <div class="play-switch" role="group" aria-label="体験する循環"><button data-cycle-mode="earth" aria-pressed="true">ON EARTH <span>地域の循環</span></button><button data-cycle-mode="space" aria-pressed="false">IN SPACE <span>宇宙への構想</span></button></div>
  <div class="play-layout"><div class="network-stage">
    <svg class="network-lines" viewBox="0 0 700 550" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter><radialGradient id="center-glow"><stop offset="0" stop-color="#d4f98a" stop-opacity=".13"/><stop offset="1" stop-color="#d4f98a" stop-opacity="0"/></radialGradient></defs><circle cx="350" cy="275" r="210" fill="url(#center-glow)"/><circle class="network-orbit" cx="350" cy="275" r="183" fill="none"/><g class="flow-paths"></g><g class="flow-particles"></g></svg>
    <button class="cycle-core" data-connect-all aria-label="５つの要素をすべてつなぐ"><span class="core-top">EVERYTHING IS CONNECTED</span><span class="core-counter">0<span>/5</span></span><span class="core-caption">すべてをつなぐ ↗</span></button>
    <button class="cycle-node-button" data-cycle-node="water" aria-pressed="false" style="--node-color:#81d6ee;left:50%;top:15%"><span class="node-icon">◌</span><strong>水</strong><small>WATER</small></button>
    <button class="cycle-node-button" data-cycle-node="resources" aria-pressed="false" style="--node-color:#c5ec95;left:81%;top:40%"><span class="node-icon">◇</span><strong>資源</strong><small>RESOURCES</small></button>
    <button class="cycle-node-button" data-cycle-node="energy" aria-pressed="false" style="--node-color:#f4ce81;left:69%;top:79%"><span class="node-icon">ϟ</span><strong>エネルギー</strong><small>ENERGY</small></button>
    <button class="cycle-node-button" data-cycle-node="soil" aria-pressed="false" style="--node-color:#e6b798;left:31%;top:79%"><span class="node-icon">✳</span><strong>土と食</strong><small>SOIL & FOOD</small></button>
    <button class="cycle-node-button" data-cycle-node="life" aria-pressed="false" style="--node-color:#e6eede;left:19%;top:40%"><span class="node-icon">◎</span><strong>暮らし</strong><small>LIFE</small></button>
    <div class="network-celebration" aria-hidden="true">ONE CIRCULATION.<br><span>ONE FUTURE.</span></div>
    <div class="network-help"><span>クリックで発見。ドラッグで、つながりを動かす。</span><button data-cycle-reset>最初から ↺</button></div>
  </div><aside class="cycle-story" aria-live="polite" aria-atomic="true"><span class="cycle-story-label">EXPLORE THE CONNECTIONS</span><h3>その先には、<br>何があるだろう。</h3><p>気になる要素を選ぶと、役割とつながりが見えてきます。丸をつかんで動かすこともできます。</p><div class="cycle-relations"><span>水</span><i>↔</i><span>資源</span><i>↔</i><span>暮らし</span></div><a class="line-link" href="services.html">事業の全体像を見る ↗</a></aside></div>
  <div class="play-foot"><p class="cycle-progress" role="status">５つのつながりを探してみよう。</p><p>※事業と将来構想のつながりを表した概念図です。</p></div>
</section>
'''

def enhance(name,html):
    if name=='index.html':
        start=html.index('<section class="hero">')
        end=html.index('<div class="chapter-strip">',start)
        html=html[:start]+GLOBE_HERO+html[end:]
        point=html.index('<section id="origin"')
        html=html[:point]+CIRCULATION_PLAY+html[point:]
    elif name=='partners.html':
        point=html.index('<section id="themes"')
        html=html[:point]+CIRCULATION_PLAY+html[point:]
    return html
