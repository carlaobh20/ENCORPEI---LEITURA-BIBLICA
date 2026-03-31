<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#0d0d14">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Encorpei">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="icon-192.png">
  <title>Encorpei Leitura</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    :root {
      --bg: #0d0d14; --bg2: #13131f; --bg3: #1a1a2a;
      --card: #1e1e2e; --border: #2a2a42;
      --red: #e63946; --red-dim: rgba(230,57,70,0.12);
      --text: #f0f0f5; --muted: #6060a0; --muted2: #9090c0;
      --success: #22d3a5;
    }
    * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
    html,body { height:100%; background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; overflow:hidden; }
    #app { height:100dvh; display:flex; flex-direction:column; position:relative; }

    /* SCREENS */
    .screen { display:none; flex:1; overflow-y:auto; padding-bottom:80px; -webkit-overflow-scrolling:touch; }
    .screen.active { display:flex; flex-direction:column; }

    /* BOTTOM NAV */
    .bottom-nav { position:fixed; bottom:0; left:0; right:0; height:68px; background:var(--bg2); border-top:1px solid var(--border); display:flex; align-items:center; z-index:100; padding-bottom:env(safe-area-inset-bottom); }
    .nav-btn { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px; cursor:pointer; border:none; background:none; color:var(--muted); font-size:10px; font-family:'DM Sans',sans-serif; transition:color 0.2s; }
    .nav-btn.active { color:var(--red); }
    .nav-btn svg { width:22px; height:22px; }

    /* SETUP */
    #screen-setup { justify-content:flex-start; padding:0 20px 40px; min-height:100dvh; overflow-y:auto; padding-bottom:40px; }
    .setup-hero { text-align:center; padding:48px 0 32px; }
    .setup-pin { font-size:48px; margin-bottom:8px; }
    .setup-logo { font-family:'Bebas Neue',sans-serif; font-size:52px; color:var(--red); letter-spacing:3px; line-height:1; }
    .setup-tagline { color:var(--muted2); font-size:14px; margin-top:6px; }
    .setup-card { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:24px; margin-bottom:16px; }
    .setup-card-title { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:1px; color:var(--muted2); margin-bottom:16px; }
    .fase-setup-item { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--border); }
    .fase-setup-item:last-child { border-bottom:none; }
    .fase-setup-num { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--red); width:28px; flex-shrink:0; }
    .fase-setup-info { flex:1; }
    .fase-setup-name { font-size:14px; font-weight:600; }
    .fase-setup-sub { font-size:11px; color:var(--muted); margin-top:1px; }
    .fase-setup-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .days-section { margin-bottom:16px; }
    .days-label { font-size:14px; color:var(--muted2); margin-bottom:10px; text-align:center; }
    .days-display { font-family:'Bebas Neue',sans-serif; font-size:80px; color:var(--text); text-align:center; line-height:1; }
    .days-display span { font-size:20px; color:var(--muted); }
    .days-slider { width:100%; accent-color:var(--red); margin:12px 0 8px; height:6px; }
    .days-presets { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
    .preset-btn { flex:1; min-width:70px; padding:8px; background:var(--bg3); border:1px solid var(--border); border-radius:10px; color:var(--muted2); font-size:12px; font-weight:600; cursor:pointer; text-align:center; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
    .preset-btn:active, .preset-btn.sel { background:var(--red-dim); border-color:var(--red); color:var(--red); }
    .days-hint { font-size:12px; color:var(--muted); text-align:center; margin-top:8px; }
    .btn-primary { width:100%; background:var(--red); color:#fff; border:none; border-radius:16px; padding:18px; font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:2px; cursor:pointer; transition:opacity 0.2s; margin-top:8px; }
    .btn-primary:active { opacity:0.8; }

    /* HOME */
    .home-header { padding:24px 20px 0; }
    .home-greeting { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; }
    .home-day { font-family:'Bebas Neue',sans-serif; font-size:44px; letter-spacing:1px; line-height:1.1; }
    .home-day em { color:var(--red); font-style:normal; }
    .home-progress-bar { height:4px; background:var(--border); border-radius:100px; margin:14px 0 6px; overflow:hidden; }
    .home-progress-fill { height:100%; background:var(--red); border-radius:100px; transition:width 0.5s ease; }
    .home-progress-text { font-size:12px; color:var(--muted); display:flex; justify-content:space-between; }
    .section-title { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:1px; color:var(--muted); padding:18px 20px 10px; }
    
    .day-nav { display:flex; align-items:center; gap:10px; padding:0 20px 0; margin-top:16px; }
    .day-nav-btn { width:36px; height:36px; border-radius:50%; border:1px solid var(--border); background:var(--bg3); color:var(--muted2); font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .day-nav-label { flex:1; text-align:center; font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:1px; }
    .day-all-done { margin:0 16px 12px; background:linear-gradient(135deg,rgba(34,211,165,0.12),rgba(34,211,165,0.05)); border:1px solid rgba(34,211,165,0.3); border-radius:16px; padding:20px; text-align:center; }
    .day-all-done-icon { font-size:36px; margin-bottom:8px; }
    .day-all-done-text { font-size:15px; font-weight:600; color:var(--success); }
    .day-all-done-sub { font-size:12px; color:var(--muted); margin-top:4px; }

    .reading-card { margin:0 16px 10px; background:var(--card); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
    .reading-item { display:flex; align-items:center; gap:12px; padding:13px 16px; border-bottom:1px solid var(--border); cursor:pointer; transition:background 0.15s; }
    .reading-item:last-child { border-bottom:none; }
    .reading-item:active { background:var(--bg3); }
    .reading-check { width:26px; height:26px; border-radius:50%; border:2px solid var(--border); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.25s; }
    .reading-check.done { background:var(--success); border-color:var(--success); }
    .reading-check svg { width:14px; height:14px; opacity:0; transition:opacity 0.2s; }
    .reading-check.done svg { opacity:1; }
    .reading-info { flex:1; min-width:0; }
    .reading-book { font-size:15px; font-weight:600; }
    .reading-detail { font-size:12px; color:var(--muted); margin-top:2px; }
    .reading-tag { font-size:10px; font-weight:700; padding:3px 8px; border-radius:100px; flex-shrink:0; }

    /* FASES */
    .fase-card { margin:0 16px 10px; background:var(--card); border:1px solid var(--border); border-radius:16px; overflow:hidden; cursor:pointer; transition:transform 0.15s; }
    .fase-card:active { transform:scale(0.98); }
    .fase-card-header { display:flex; align-items:center; gap:14px; padding:16px; }
    .fase-icon { width:46px; height:46px; border-radius:13px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
    .fase-info { flex:1; min-width:0; }
    .fase-name { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:0.5px; line-height:1.1; }
    .fase-sub { font-size:11px; color:var(--muted); margin-top:2px; }
    .fase-pct { font-family:'Bebas Neue',sans-serif; font-size:24px; flex-shrink:0; }
    .fase-progress-bar { height:3px; background:var(--border); }
    .fase-progress-fill { height:100%; transition:width 0.5s; }
    .fase-books { padding:0 16px 16px; display:none; }
    .fase-books.open { display:block; }
    .book-row { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); cursor:pointer; }
    .book-row:last-child { border-bottom:none; }
    .book-row:active { opacity:0.7; }
    .book-row-name { flex:1; font-size:14px; font-weight:500; }
    .book-row-pct { font-size:12px; font-weight:600; }
    .book-row-bar { width:60px; height:4px; background:var(--border); border-radius:100px; overflow:hidden; }
    .book-row-fill { height:100%; border-radius:100px; transition:width 0.5s; }

    /* BOOK DETAIL */
    #screen-book { position:fixed; inset:0; z-index:50; transform:translateX(100%); transition:transform 0.35s cubic-bezier(0.32,0.72,0,1); background:var(--bg); padding-bottom:20px; }
    #screen-book.open { transform:translateX(0); }
    .back-btn { display:flex; align-items:center; gap:6px; color:var(--muted2); font-size:14px; cursor:pointer; background:none; border:none; font-family:'DM Sans',sans-serif; padding:0; }
    .back-btn svg { width:18px; height:18px; }
    .book-header { padding:env(safe-area-inset-top,24px) 20px 0; padding-top:max(env(safe-area-inset-top),24px); }
    .book-title-row { margin-top:16px; }
    .book-fase-tag { font-size:11px; font-weight:700; padding:4px 10px; border-radius:100px; display:inline-block; margin-bottom:8px; }
    .book-title { font-family:'Bebas Neue',sans-serif; font-size:48px; letter-spacing:1px; line-height:1; }
    .book-progress-row { display:flex; align-items:center; gap:10px; margin-top:10px; margin-bottom:4px; }
    .book-caps-text { font-size:13px; color:var(--muted); }
    .book-progress-bar-wrap { flex:1; height:4px; background:var(--border); border-radius:100px; overflow:hidden; }
    .book-progress-bar-fill { height:100%; border-radius:100px; transition:width 0.5s; }
    .book-pct-text { font-size:13px; font-weight:700; }
    .caps-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(52px,1fr)); gap:8px; padding:16px 16px 120px; }
    .cap-btn { aspect-ratio:1; border-radius:12px; border:2px solid var(--border); background:var(--bg2); color:var(--muted2); font-size:14px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
    .cap-btn.done { border-color:transparent; color:#000; }
    .cap-btn:active { transform:scale(0.88); }
    .youtube-banner { position:fixed; bottom:0; left:0; right:0; padding:16px; background:var(--bg2); border-top:1px solid var(--border); display:none; }
    .youtube-banner.show { display:block; }
    .youtube-btn { display:flex; align-items:center; justify-content:center; gap:10px; padding:14px; background:#ff0000; border-radius:14px; color:#fff; font-weight:700; font-size:15px; text-decoration:none; border:none; width:100%; cursor:pointer; font-family:'DM Sans',sans-serif; }
    .youtube-btn svg { width:22px; height:22px; fill:#fff; }

    /* PROGRESS */
    .progress-header { padding:24px 20px 0; }
    .progress-title { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:1px; }
    .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:16px 16px 8px; }
    .stat-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:16px; }
    .stat-val { font-family:'Bebas Neue',sans-serif; font-size:40px; color:var(--red); line-height:1; }
    .stat-label { font-size:12px; color:var(--muted); margin-top:4px; }
    .stat-card.full { grid-column:span 2; }
    .big-ring { display:flex; flex-direction:column; align-items:center; padding:8px 0 4px; }
    .ring-svg { width:120px; height:120px; }
    .ring-bg { fill:none; stroke:var(--border); stroke-width:8; }
    .ring-fill { fill:none; stroke:var(--red); stroke-width:8; stroke-linecap:round; transition:stroke-dashoffset 0.8s ease; transform:rotate(-90deg); transform-origin:60px 60px; }
    .ring-label { font-family:'Bebas Neue',sans-serif; font-size:36px; }
    .ring-sub { font-size:12px; color:var(--muted); margin-top:2px; }

    /* TOAST */
    .toast { position:fixed; top:20px; left:50%; transform:translateX(-50%) translateY(-80px); background:var(--success); color:#000; font-weight:700; font-size:13px; padding:10px 20px; border-radius:100px; z-index:400; transition:transform 0.3s ease; white-space:nowrap; pointer-events:none; }
    .toast.show { transform:translateX(-50%) translateY(0); }

    /* MODAL */
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:flex-end; z-index:200; backdrop-filter:blur(6px); opacity:0; transition:opacity 0.3s; pointer-events:none; }
    .modal-overlay.show { opacity:1; pointer-events:all; }
    .modal-sheet { background:var(--card); border-top-left-radius:24px; border-top-right-radius:24px; padding:20px 20px 36px; width:100%; transform:translateY(100%); transition:transform 0.35s ease; }
    .modal-overlay.show .modal-sheet { transform:translateY(0); }
    .modal-handle { width:40px; height:4px; background:var(--border); border-radius:100px; margin:0 auto 20px; }
    .modal-title { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:1px; margin-bottom:4px; }
    .modal-sub { font-size:14px; color:var(--muted); margin-bottom:20px; }
    .modal-yt-btn { display:flex; align-items:center; gap:12px; padding:14px 16px; background:#1a0000; border:1px solid #ff3333; border-radius:14px; width:100%; color:#ff4444; font-weight:600; font-size:15px; text-decoration:none; cursor:pointer; font-family:'DM Sans',sans-serif; border-style:solid; margin-bottom:10px; }
    .modal-close-btn { display:flex; align-items:center; justify-content:center; padding:14px; background:var(--bg3); border:1px solid var(--border); border-radius:14px; width:100%; color:var(--muted2); font-size:15px; cursor:pointer; font-family:'DM Sans',sans-serif; }

    .empty-day { text-align:center; padding:40px 24px; color:var(--muted); }
    .empty-day div { font-size:48px; margin-bottom:12px; }
  </style>
</head>
<body>
<div id="app">
  <div id="screen-setup" class="screen active"></div>
  <div id="screen-home" class="screen"></div>
  <div id="screen-fases" class="screen"></div>
  <div id="screen-progress" class="screen"></div>
  <div id="screen-book" class="screen"></div>
  <nav class="bottom-nav" id="bottom-nav" style="display:none">
    <button class="nav-btn active" onclick="showScreen('home')" id="nav-home">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>Hoje
    </button>
    <button class="nav-btn" onclick="showScreen('fases')" id="nav-fases">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>Fases
    </button>
    <button class="nav-btn" onclick="showScreen('progress')" id="nav-progress">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>Progresso
    </button>
  </nav>
  <div class="modal-overlay" id="modal-overlay" onclick="closeModal()">
    <div class="modal-sheet" onclick="event.stopPropagation()">
      <div class="modal-handle"></div>
      <div id="modal-content"></div>
    </div>
  </div>
  <div class="toast" id="toast"></div>
</div>

<script>
const SUPABASE_URL = 'https://xubmmswoeamnynybfdxz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9p8C7tTp3SFirzxfyJWdhQ_f8P2VdRN';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── DATA ────────────────────────────────────────────────────────────────────
const FASES = [
  { id:1, nome:'Os Evangelhos', subtitulo:'Mateus, Marcos, Lucas e João', cor:'#e63946', bg:'rgba(230,57,70,0.12)', icone:'✝️',
    livros:[{nome:'Mateus',caps:28},{nome:'Marcos',caps:16},{nome:'Lucas',caps:24},{nome:'João',caps:21}]},
  { id:2, nome:'O Início da Igreja', subtitulo:'Atos dos Apóstolos', cor:'#f4a261', bg:'rgba(244,162,97,0.12)', icone:'🕊️',
    livros:[{nome:'Atos',caps:28}]},
  { id:3, nome:'A Origem', subtitulo:'Gênesis até Ester • 17 livros', cor:'#2a9d8f', bg:'rgba(42,157,143,0.12)', icone:'🌍',
    livros:[{nome:'Gênesis',caps:50},{nome:'Êxodo',caps:40},{nome:'Levítico',caps:27},{nome:'Números',caps:36},{nome:'Deuteronômio',caps:34},{nome:'Josué',caps:24},{nome:'Juízes',caps:21},{nome:'Rute',caps:4},{nome:'1 Samuel',caps:31},{nome:'2 Samuel',caps:24},{nome:'1 Reis',caps:22},{nome:'2 Reis',caps:25},{nome:'1 Crônicas',caps:29},{nome:'2 Crônicas',caps:36},{nome:'Esdras',caps:10},{nome:'Neemias',caps:13},{nome:'Ester',caps:10}]},
  { id:4, nome:'As Cartas', subtitulo:'Romanos até Judas • 21 livros', cor:'#8338ec', bg:'rgba(131,56,236,0.12)', icone:'✉️',
    livros:[{nome:'Romanos',caps:16},{nome:'1 Coríntios',caps:16},{nome:'2 Coríntios',caps:13},{nome:'Gálatas',caps:6},{nome:'Efésios',caps:6},{nome:'Filipenses',caps:4},{nome:'Colossenses',caps:4},{nome:'1 Tessalonicenses',caps:5},{nome:'2 Tessalonicenses',caps:3},{nome:'1 Timóteo',caps:6},{nome:'2 Timóteo',caps:4},{nome:'Tito',caps:3},{nome:'Filemom',caps:1},{nome:'Hebreus',caps:13},{nome:'Tiago',caps:5},{nome:'1 Pedro',caps:5},{nome:'2 Pedro',caps:3},{nome:'1 João',caps:5},{nome:'2 João',caps:1},{nome:'3 João',caps:1},{nome:'Judas',caps:1}]},
  { id:5, nome:'Os Profetas', subtitulo:'Isaías até Malaquias • 17 livros', cor:'#e9c46a', bg:'rgba(233,196,106,0.12)', icone:'🔥',
    livros:[{nome:'Isaías',caps:66},{nome:'Jeremias',caps:52},{nome:'Lamentações',caps:5},{nome:'Ezequiel',caps:48},{nome:'Daniel',caps:12},{nome:'Oseias',caps:14},{nome:'Joel',caps:3},{nome:'Amós',caps:9},{nome:'Obadias',caps:1},{nome:'Jonas',caps:4},{nome:'Miquéias',caps:7},{nome:'Naum',caps:3},{nome:'Habacuque',caps:3},{nome:'Sofonias',caps:3},{nome:'Ageu',caps:2},{nome:'Zacarias',caps:14},{nome:'Malaquias',caps:4}]},
  { id:6, nome:'Reflexões', subtitulo:'Jó, Salmos, Provérbios, Eclesiastes e Cânticos', cor:'#06d6a0', bg:'rgba(6,214,160,0.12)', icone:'🎵',
    livros:[{nome:'Jó',caps:42},{nome:'Salmos',caps:150},{nome:'Provérbios',caps:31},{nome:'Eclesiastes',caps:12},{nome:'Cânticos',caps:8}]},
  { id:7, nome:'O Grand Finale', subtitulo:'Apocalipse', cor:'#ff006e', bg:'rgba(255,0,110,0.12)', icone:'👑',
    livros:[{nome:'Apocalipse',caps:22}]},
];

// Flat list of all chapters in order
const ALL_CHAPTERS = [];
FASES.forEach(f => f.livros.forEach(l => {
  for(let c=1;c<=l.caps;c++) ALL_CHAPTERS.push({faseId:f.id,livro:l.nome,capitulo:c});
}));
const TOTAL_CAPS = ALL_CHAPTERS.length; // 1189

// ─── STATE ───────────────────────────────────────────────────────────────────
let deviceId = localStorage.getItem('enc_device_id');
if(!deviceId){ deviceId = 'dev_'+Math.random().toString(36).slice(2)+Date.now().toString(36); localStorage.setItem('enc_device_id',deviceId); }
let plan = null; // {totalDias, dataInicio}
let lidosSet = new Set(); // "Livro|cap"
let currentScreen = 'setup';
let viewingBook = null; // {fase, livro}
let viewingDay = null; // number
let dayPlan = []; // array of arrays of chapters per day

// ─── PLAN HELPERS ────────────────────────────────────────────────────────────
function buildDayPlan(totalDias) {
  const capsPerDay = Math.ceil(TOTAL_CAPS / totalDias);
  const days = [];
  let idx = 0;
  for(let d=0;d<totalDias;d++){
    const dayChaps = [];
    while(dayChaps.length < capsPerDay && idx < TOTAL_CAPS){
      dayChaps.push(ALL_CHAPTERS[idx++]);
    }
    if(dayChaps.length) days.push(dayChaps);
  }
  // remaining chapters go to last day
  while(idx < TOTAL_CAPS){ days[days.length-1].push(ALL_CHAPTERS[idx++]); }
  return days;
}

function todayDayNumber() {
  if(!plan) return 1;
  const start = new Date(plan.dataInicio);
  const now = new Date();
  const diff = Math.floor((now - start)/(1000*60*60*24));
  return Math.min(Math.max(diff+1, 1), plan.totalDias);
}

function isLido(livro, cap){ return lidosSet.has(livro+'|'+cap); }

function chapKey(livro,cap){ return livro+'|'+cap; }

function getBookProgress(livro, totalCaps){
  let done=0;
  for(let c=1;c<=totalCaps;c++) if(isLido(livro,c)) done++;
  return done;
}

function getFaseProgress(fase){
  let done=0, total=0;
  fase.livros.forEach(l=>{ total+=l.caps; done+=getBookProgress(l.nome,l.caps); });
  return {done,total};
}

function getTotalProgress(){
  return {done:lidosSet.size, total:TOTAL_CAPS};
}

function chapsPerDay(){ return dayPlan[0]?.length || 0; }

// ─── SUPABASE ────────────────────────────────────────────────────────────────
async function loadLidos(){
  const {data,error} = await sb.from('leituras').select('livro,capitulo').eq('device_id',deviceId);
  if(error){ console.error(error); return; }
  lidosSet = new Set(data.map(r=>r.livro+'|'+r.capitulo));
}

async function toggleChapter(livro, cap){
  const key = chapKey(livro,cap);
  const done = lidosSet.has(key);
  if(done){
    lidosSet.delete(key);
    await sb.from('leituras').delete().eq('device_id',deviceId).eq('livro',livro).eq('capitulo',cap);
  } else {
    lidosSet.add(key);
    await sb.from('leituras').upsert({device_id:deviceId,livro,capitulo:cap,lido:true},{onConflict:'device_id,livro,capitulo'});
  }
  return !done; // returns new state
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function showScreen(name){
  ['home','fases','progress'].forEach(s=>{
    document.getElementById('screen-'+s).classList.toggle('active', s===name);
    const nb = document.getElementById('nav-'+s);
    if(nb) nb.classList.toggle('active', s===name);
  });
  currentScreen = name;
  if(name==='home') renderHome();
  if(name==='fases') renderFases();
  if(name==='progress') renderProgress();
}

function openBook(faseId, livroNome){
  viewingBook = {faseId, livroNome};
  renderBookDetail();
  document.getElementById('screen-book').classList.add('open');
}

function closeBook(){
  document.getElementById('screen-book').classList.remove('open');
  setTimeout(()=>{
    if(currentScreen==='home') renderHome();
    else if(currentScreen==='fases') renderFases();
  }, 350);
}

// ─── RENDER: SETUP ───────────────────────────────────────────────────────────
function renderSetup(){
  const el = document.getElementById('screen-setup');
  let selectedDays = 365;
  el.innerHTML = `
    <div class="setup-hero">
      <div class="setup-pin">📍</div>
      <div class="setup-logo">ENCORPEI</div>
      <div class="setup-tagline">Leitura Bíblica Completa</div>
    </div>
    <div class="setup-card">
      <div class="setup-card-title">7 FASES DO PLANO</div>
      ${FASES.map(f=>`
        <div class="fase-setup-item">
          <div class="fase-setup-num">${f.id}</div>
          <div class="fase-setup-dot" style="background:${f.cor}"></div>
          <div class="fase-setup-info">
            <div class="fase-setup-name">${f.nome}</div>
            <div class="fase-setup-sub">${f.subtitulo}</div>
          </div>
        </div>`).join('')}
    </div>
    <div class="setup-card">
      <div class="setup-card-title">QUANTOS DIAS PARA LER A BÍBLIA?</div>
      <div class="days-section">
        <div class="days-display"><span id="days-val">365</span> <span>dias</span></div>
        <input type="range" class="days-slider" id="days-slider" min="90" max="730" value="365" oninput="updateDays(this.value)">
        <div class="days-presets">
          <div class="preset-btn" onclick="setDays(90)">3 meses</div>
          <div class="preset-btn sel" onclick="setDays(180)">6 meses</div>
          <div class="preset-btn" onclick="setDays(365)">1 ano</div>
          <div class="preset-btn" onclick="setDays(730)">2 anos</div>
        </div>
        <div class="days-hint" id="days-hint">≈ 4 capítulos por dia • 1.189 capítulos no total</div>
      </div>
      <button class="btn-primary" onclick="startPlan()">COMEÇAR MEU PLANO 🚀</button>
    </div>
  `;
  
  window.updateDays = function(v){
    v = parseInt(v);
    document.getElementById('days-val').textContent = v;
    document.getElementById('days-slider').value = v;
    const cpp = Math.ceil(TOTAL_CAPS/v);
    document.getElementById('days-hint').textContent = `≈ ${cpp} capítulo${cpp>1?'s':''} por dia • ${TOTAL_CAPS} capítulos no total`;
    document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('sel'));
    selectedDays = v;
  };
  window.setDays = function(v){
    selectedDays = v;
    updateDays(v);
    document.querySelectorAll('.preset-btn').forEach(b=>{
      const txt = b.textContent;
      if((v===90&&txt.includes('3'))||(v===180&&txt.includes('6'))||(v===365&&txt.includes('1 a'))||(v===730&&txt.includes('2'))) b.classList.add('sel');
    });
  };
  window.startPlan = async function(){
    plan = {totalDias: selectedDays, dataInicio: new Date().toISOString().split('T')[0]};
    localStorage.setItem('enc_plan', JSON.stringify(plan));
    dayPlan = buildDayPlan(plan.totalDias);
    viewingDay = todayDayNumber();
    document.getElementById('screen-setup').classList.remove('active');
    document.getElementById('bottom-nav').style.display='flex';
    showScreen('home');
    showToast('Plano criado! Bora ler! 📖');
  };
}

// ─── RENDER: HOME ────────────────────────────────────────────────────────────
function renderHome(){
  const el = document.getElementById('screen-home');
  if(!plan || !dayPlan.length){ el.innerHTML=''; return; }
  const today = todayDayNumber();
  if(viewingDay===null) viewingDay = today;
  const {done,total} = getTotalProgress();
  const pct = Math.round(done/total*100);
  const dayChaps = dayPlan[viewingDay-1] || [];
  const dayDone = dayChaps.filter(c=>isLido(c.livro,c.capitulo)).length;
  const allDayDone = dayChaps.length>0 && dayDone===dayChaps.length;

  // Group by book for display
  const byBook = {};
  dayChaps.forEach(c=>{
    if(!byBook[c.livro]) byBook[c.livro]={livro:c.livro,faseId:c.faseId,caps:[]};
    byBook[c.livro].caps.push(c.capitulo);
  });

  el.innerHTML = `
    <div class="home-header">
      <div class="home-greeting">Seu progresso total</div>
      <div class="home-day">DIA <em>${viewingDay}</em> DE ${plan.totalDias}</div>
      <div class="home-progress-bar"><div class="home-progress-fill" style="width:${pct}%"></div></div>
      <div class="home-progress-text"><span>${done} de ${total} capítulos</span><span>${pct}%</span></div>
    </div>
    <div class="day-nav">
      <button class="day-nav-btn" onclick="changeDay(-1)">‹</button>
      <div class="day-nav-label">${viewingDay===today?'📅 HOJE':'DIA '+viewingDay}</div>
      <button class="day-nav-btn" onclick="changeDay(1)">›</button>
    </div>
    ${allDayDone ? `
      <div style="padding:0 16px; margin-top:12px">
        <div class="day-all-done">
          <div class="day-all-done-icon">✅</div>
          <div class="day-all-done-text">Dia ${viewingDay} concluído!</div>
          <div class="day-all-done-sub">Parabéns! Continue assim 💪</div>
        </div>
      </div>` : ''}
    <div class="section-title">LEITURAS DO DIA · ${dayDone}/${dayChaps.length}</div>
    ${Object.values(byBook).length===0 ? '<div class="empty-day"><div>🎉</div><p>Nenhuma leitura neste dia</p></div>' : ''}
    ${Object.values(byBook).map(group=>{
      const fase = FASES.find(f=>f.id===group.faseId);
      const allDone = group.caps.every(c=>isLido(group.livro,c));
      const someDone = group.caps.some(c=>isLido(group.livro,c));
      return `
      <div class="reading-card">
        <div class="reading-item" onclick="openBook(${group.faseId},'${group.livro.replace(/'/g,"\\'")}')">
          <div class="reading-check ${allDone?'done':''}" style="${allDone?'':''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <div class="reading-info">
            <div class="reading-book">${group.livro}</div>
            <div class="reading-detail">Caps ${group.caps[0]}${group.caps.length>1?'–'+group.caps[group.caps.length-1]:''} · ${group.caps.filter(c=>isLido(group.livro,c)).length}/${group.caps.length} lidos</div>
          </div>
          <div class="reading-tag" style="background:${fase.bg};color:${fase.cor}">FASE ${fase.id}</div>
        </div>
      </div>`;
    }).join('')}
    <div style="height:20px"></div>
  `;

  window.changeDay = function(d){
    viewingDay = Math.min(Math.max((viewingDay||today)+d, 1), plan.totalDias);
    renderHome();
  };
}

// ─── RENDER: FASES ───────────────────────────────────────────────────────────
function renderFases(){
  const el = document.getElementById('screen-fases');
  el.innerHTML = `<div class="section-title" style="padding-top:24px">AS 7 FASES</div>` +
    FASES.map(f=>{
      const {done,total} = getFaseProgress(f);
      const pct = total?Math.round(done/total*100):0;
      return `
      <div class="fase-card" onclick="toggleFaseExpand(${f.id})">
        <div class="fase-card-header">
          <div class="fase-icon" style="background:${f.bg}">${f.icone}</div>
          <div class="fase-info">
            <div class="fase-name">FASE ${f.id} · ${f.nome}</div>
            <div class="fase-sub">${f.subtitulo}</div>
          </div>
          <div class="fase-pct" style="color:${f.cor}">${pct}%</div>
        </div>
        <div class="fase-progress-bar"><div class="fase-progress-fill" style="width:${pct}%;background:${f.cor}"></div></div>
        <div class="fase-books" id="fase-books-${f.id}">
          ${f.livros.map(l=>{
            const ldone = getBookProgress(l.nome,l.caps);
            const lpct = Math.round(ldone/l.caps*100);
            return `<div class="book-row" onclick="event.stopPropagation();openBook(${f.id},'${l.nome.replace(/'/g,"\\'")}')">
              <div class="book-row-name">${l.nome}</div>
              <div class="book-row-bar"><div class="book-row-fill" style="width:${lpct}%;background:${f.cor}"></div></div>
              <div class="book-row-pct" style="color:${f.cor}">${ldone}/${l.caps}</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('') + '<div style="height:20px"></div>';

  window.toggleFaseExpand = function(id){
    const el = document.getElementById('fase-books-'+id);
    el.classList.toggle('open');
  };
}

// ─── RENDER: BOOK DETAIL ─────────────────────────────────────────────────────
function renderBookDetail(){
  if(!viewingBook) return;
  const fase = FASES.find(f=>f.id===viewingBook.faseId);
  const livroData = fase.livros.find(l=>l.nome===viewingBook.livroNome);
  if(!livroData) return;
  const done = getBookProgress(livroData.nome, livroData.caps);
  const pct = Math.round(done/livroData.caps*100);
  const allDone = done===livroData.caps;

  const el = document.getElementById('screen-book');
  el.innerHTML = `
    <div class="book-header">
      <button class="back-btn" onclick="closeBook()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"/></svg>
        Voltar
      </button>
      <div class="book-title-row">
        <div class="book-fase-tag" style="background:${fase.bg};color:${fase.cor}">${fase.icone} FASE ${fase.id} · ${fase.nome}</div>
        <div class="book-title">${livroData.nome}</div>
        <div class="book-progress-row">
          <div class="book-caps-text">${done} de ${livroData.caps} caps</div>
          <div class="book-progress-bar-wrap"><div class="book-progress-bar-fill" id="book-pbar" style="width:${pct}%;background:${fase.cor}"></div></div>
          <div class="book-pct-text" style="color:${fase.cor}">${pct}%</div>
        </div>
      </div>
    </div>
    <div class="caps-grid" id="caps-grid">
      ${Array.from({length:livroData.caps},(_,i)=>{
        const c=i+1;
        const done=isLido(livroData.nome,c);
        return `<button class="cap-btn ${done?'done':''}" style="${done?'background:'+fase.cor:'color:var(--muted2)'}" id="cap-${c}" onclick="toggleCap(${c})">${c}</button>`;
      }).join('')}
    </div>
    ${allDone?'<div style="height:80px"></div>':''}
  `;

  // YouTube banner
  const existingBanner = document.querySelector('.youtube-banner');
  if(existingBanner) existingBanner.remove();
  const banner = document.createElement('div');
  banner.className = 'youtube-banner' + (allDone?' show':'');
  banner.id = 'yt-banner';
  banner.innerHTML = `
    <a class="youtube-btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent('livro de '+livroData.nome+' bíblia explicado')}" target="_blank">
      <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#ff0000"/></svg>
      Buscar vídeos sobre ${livroData.nome} no YouTube
    </a>
  `;
  el.appendChild(banner);

  window.toggleCap = async function(c){
    const btn = document.getElementById('cap-'+c);
    const nowDone = await toggleChapter(livroData.nome, c);
    btn.className = 'cap-btn'+(nowDone?' done':'');
    btn.style.background = nowDone ? fase.cor : '';
    btn.style.color = nowDone ? '' : 'var(--muted2)';
    // update progress
    const newDone = getBookProgress(livroData.nome, livroData.caps);
    const newPct = Math.round(newDone/livroData.caps*100);
    document.getElementById('book-pbar').style.width=newPct+'%';
    el.querySelector('.book-caps-text').textContent=newDone+' de '+livroData.caps+' caps';
    el.querySelector('.book-pct-text').textContent=newPct+'%';
    // show YouTube if all done
    const ytBanner = document.getElementById('yt-banner');
    const bookAllDone = newDone===livroData.caps;
    ytBanner.classList.toggle('show', bookAllDone);
    if(bookAllDone && nowDone) {
      showToast('🎉 '+livroData.nome+' concluído!');
      setTimeout(()=>openYTModal(livroData.nome), 1200);
    }
  };
}

function openYTModal(livroNome){
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-title">🎉 Livro Concluído!</div>
    <div class="modal-sub">Você terminou ${livroNome}! Que tal assistir um vídeo para aprofundar?</div>
    <a class="modal-yt-btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent('livro de '+livroNome+' bíblia explicado')}" target="_blank" onclick="closeModal()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4444"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#fff"/></svg>
      Buscar "${livroNome}" no YouTube
    </a>
    <button class="modal-close-btn" onclick="closeModal()">Fechar</button>
  `;
  document.getElementById('modal-overlay').classList.add('show');
}

function closeModal(){
  document.getElementById('modal-overlay').classList.remove('show');
}

// ─── RENDER: PROGRESS ────────────────────────────────────────────────────────
function renderProgress(){
  const el = document.getElementById('screen-progress');
  if(!plan){ el.innerHTML=''; return; }
  const {done,total} = getTotalProgress();
  const pct = Math.round(done/total*100);
  const circumference = 2*Math.PI*52;
  const offset = circumference*(1-pct/100);
  const today = todayDayNumber();
  const daysDone = today-1;
  const faseDone = FASES.filter(f=>{ const p=getFaseProgress(f); return p.done===p.total&&p.total>0; }).length;
  const cppEstimate = plan ? Math.ceil(TOTAL_CAPS/plan.totalDias) : 0;

  el.innerHTML = `
    <div class="progress-header">
      <div class="home-greeting" style="margin-top:24px">Visão Geral</div>
      <div class="progress-title">SEU PROGRESSO</div>
    </div>
    <div class="stats-grid">
      <div class="stat-card full" style="display:flex;align-items:center;gap:20px;padding:20px">
        <div class="big-ring">
          <svg class="ring-svg" viewBox="0 0 120 120">
            <circle class="ring-bg" cx="60" cy="60" r="52"/>
            <circle class="ring-fill" cx="60" cy="60" r="52" stroke="${FASES[0].cor}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
            <text x="60" y="66" text-anchor="middle" class="ring-label" fill="var(--text)" font-family="Bebas Neue,sans-serif" font-size="28">${pct}%</text>
          </svg>
        </div>
        <div>
          <div class="stat-val">${done}</div>
          <div class="stat-label">capítulos lidos de ${total}</div>
          <div style="margin-top:8px;font-size:13px;color:var(--muted2)">${TOTAL_CAPS-done} restantes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${today}</div>
        <div class="stat-label">dia atual de ${plan.totalDias}</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${faseDone}</div>
        <div class="stat-label">fases completas de 7</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${cppEstimate}</div>
        <div class="stat-label">capítulos por dia no plano</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" style="color:var(--success)">${Math.round(done/Math.max(daysDone,1))}</div>
        <div class="stat-label">média real de caps/dia</div>
      </div>
    </div>
    <div class="section-title">PROGRESSO POR FASE</div>
    ${FASES.map(f=>{
      const p=getFaseProgress(f);
      const fp=p.total?Math.round(p.done/p.total*100):0;
      return `<div style="margin:0 16px 10px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div><span style="font-size:16px;margin-right:6px">${f.icone}</span><strong style="font-size:14px">Fase ${f.id} · ${f.nome}</strong></div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:${f.cor}">${fp}%</div>
        </div>
        <div style="height:4px;background:var(--border);border-radius:100px;overflow:hidden">
          <div style="height:100%;width:${fp}%;background:${f.cor};border-radius:100px;transition:width 0.5s"></div>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-top:6px">${p.done} de ${p.total} capítulos</div>
      </div>`;
    }).join('')}
    <div style="text-align:center;padding:16px 24px 8px">
      <button onclick="resetPlan()" style="background:none;border:1px solid var(--border);color:var(--muted);border-radius:12px;padding:10px 20px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif">⚙️ Reiniciar plano</button>
    </div>
    <div style="height:20px"></div>
  `;

  window.resetPlan = function(){
    if(confirm('Isso vai apagar seu plano (não apaga as leituras marcadas). Confirmar?')){
      localStorage.removeItem('enc_plan');
      plan=null; dayPlan=[]; viewingDay=null;
      document.getElementById('bottom-nav').style.display='none';
      ['home','fases','progress'].forEach(s=>document.getElementById('screen-'+s).classList.remove('active'));
      document.getElementById('screen-setup').classList.add('active');
      renderSetup();
    }
  };
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2500);
}

// ─── INIT ────────────────────────────────────────────────────────────────────
async function init(){
  renderSetup();
  const savedPlan = localStorage.getItem('enc_plan');
  if(savedPlan){
    plan = JSON.parse(savedPlan);
    dayPlan = buildDayPlan(plan.totalDias);
    viewingDay = todayDayNumber();
  }
  await loadLidos();
  if(plan){
    document.getElementById('screen-setup').classList.remove('active');
    document.getElementById('bottom-nav').style.display='flex';
    showScreen('home');
  }
}

// Service Worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}

init();
</script>
</body>
</html>
