// Data: posts
const posts = [
  {
    slug: "nano-banana-tutorial",
    title: "Nano Banana: guida rapida all'AI image editing di Google (2025)",
    category: "tech",
    date: "2025-09-01",
    readTime: "6 min",
    excerpt: "Come usare il modello di Google per l'editing di immagini: setup, prompt e best practice.",
    cover: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
    featured: true,
    content: `
      <div class="article">
        <h1>Nano Banana: guida rapida</h1>
        <p>Questa è una guida sintetica per iniziare subito con l'AI image editing. In stile minimal, step-by-step.</p>
        <h2>Setup</h2>
        <p>Serve un account Google e accesso al modello. Imposta i parametri base e carica un'immagine di test.</p>
        <pre><code>// esempio pseudo codice
const model = initNanoBanana({ quality: 'high' })
const edited = await model.edit(image, { prompt: 'mood cinematico, tonalità fredde' })
        </code></pre>
        <h2>Best Practice</h2>
        <ul>
          <li>Tieni i prompt brevi e specifici</li>
          <li>Usa maschere per interventi locali</li>
          <li>Lavora in iterazioni</li>
        </ul>
      </div>
    `,
  },
  {
    slug: "poster-neo-brutalism",
    title: "Poster Design: Neo-brutalism pulito in Figma",
    category: "design",
    date: "2025-08-18",
    readTime: "4 min",
    excerpt: "Palette limitata, gerarchia tipografica e griglie per un look d'impatto.",
    cover: "https://images.unsplash.com/photo-1489528792649-5a1b962d3daa?q=80&w=1600&auto=format&fit=crop",
    featured: true,
    content: `
      <div class="article">
        <h1>Neo-brutalism pulito</h1>
        <p>Un approccio minimale ma deciso: blocchi, colori piatti, ombre morbide.</p>
      </div>
    `,
  },
  {
    slug: "beats-iphone-daw",
    title: "Beatmaking su iPhone: workflow leggero con app gratuite",
    category: "music",
    date: "2025-07-29",
    readTime: "5 min",
    excerpt: "Sequencer, drumkits e mix di base con un setup tascabile.",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    content: `
      <div class="article">
        <h1>Beatmaking leggero</h1>
        <p>Usa app gratuite per comporre e arrangiare senza frizioni.</p>
      </div>
    `,
  },
  {
    slug: "weekly-news-01",
    title: "Weekly News #1: tool AI utili per creator",
    category: "news",
    date: "2025-09-03",
    readTime: "3 min",
    excerpt: "Una selezione rapida di tool pratici e ispirazioni.",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    content: `
      <div class="article">
        <h1>Weekly News #1</h1>
        <p>Curated picks per migliorare il tuo flusso.</p>
      </div>
    `,
  },
];

// State
let currentCategory = 'all';
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

// Utilities
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

// Render Featured
function renderFeatured() {
  const wrap = $('#featuredSlider');
  const featured = posts.filter(p => p.featured && (currentCategory==='all' || p.category===currentCategory));
  wrap.innerHTML = featured.map(p => `
    <article class="feature-card clickable" data-slug="${p.slug}">
      <div class="feature-thumb" style="background-image:url('${p.cover}')"></div>
      <div class="feature-content">
        <div class="feature-tag">${p.category.toUpperCase()}</div>
        <h3 class="feature-title">${p.title}</h3>
        <div class="feature-meta">${p.date} · ${p.readTime}</div>
      </div>
    </article>
  `).join('');
}

// Render Posts Grid
function renderPosts() {
  const grid = $('#postsGrid');
  const list = posts.filter(p => currentCategory==='all' || p.category===currentCategory);
  grid.innerHTML = list.map(p => `
    <article class="post-card clickable" data-slug="${p.slug}">
      <div class="post-thumb" style="background-image:url('${p.cover}')"></div>
      <div class="post-body">
        <h3 class="post-title">${p.title}</h3>
        <p class="post-excerpt">${p.excerpt}</p>
        <div class="post-meta">
          <span>${p.category}</span>
          <span>${p.date}</span>
          <span>${p.readTime}</span>
        </div>
      </div>
    </article>
  `).join('');
}

// Category filter
function bindCategories() {
  $all('.category-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      $all('.category-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderFeatured();
      renderPosts();
    });
  });
}

// Slider drag support
function bindSliderDrag() {
  const el = $('#featuredSlider');
  let isDown = false, startX = 0, scrollLeft = 0;
  el.addEventListener('pointerdown', (e) => { isDown = true; el.setPointerCapture(e.pointerId); startX = e.pageX; scrollLeft = el.scrollLeft; });
  el.addEventListener('pointermove', (e) => { if(!isDown) return; const dx = e.pageX - startX; el.scrollLeft = scrollLeft - dx; });
  el.addEventListener('pointerup', () => { isDown = false; });
  el.addEventListener('pointerleave', () => { isDown = false; });
}

// Routing + Article overlay
function openArticle(slug) {
  const post = posts.find(p => p.slug === slug);
  if(!post) return;
  const container = $('#articleContent');
  container.innerHTML = `
    <article class="article">
      <div class="post-meta">${post.category} · ${post.date} · ${post.readTime}</div>
      ${post.content}
    </article>
  `;
  $('#articleOverlay').classList.add('open');
  location.hash = `#/post/${slug}`;
}
function closeArticle() {
  $('#articleOverlay').classList.remove('open');
  if(location.hash.startsWith('#/post/')) history.pushState('', document.title, window.location.pathname + window.location.search);
}

function handleHashChange() {
  const match = location.hash.match(/^#\/post\/(.+)$/);
  if (match) {
    openArticle(match[1]);
  } else {
    $('#articleOverlay').classList.remove('open');
  }
}

// Search
function bindSearch() {
  const overlay = $('#searchOverlay');
  $('#searchBtn').addEventListener('click', () => { overlay.classList.add('open'); $('#searchInput').focus(); });
  $('#searchClose').addEventListener('click', () => { overlay.classList.remove('open'); $('#searchResults').innerHTML=''; $('#searchInput').value=''; });
  $('#searchInput').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const res = posts.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.includes(q));
    $('#searchResults').innerHTML = res.map(p => `
      <div class="post-card clickable" data-slug="${p.slug}">
        <div class="post-body">
          <div class="post-meta">${p.category}</div>
          <h3 class="post-title">${p.title}</h3>
          <p class="post-excerpt">${p.excerpt}</p>
        </div>
      </div>
    `).join('');
  });
}

// Bookmarks (placeholder for future)
function toggleBookmark(slug) {
  const i = bookmarks.indexOf(slug);
  if(i>=0) bookmarks.splice(i,1); else bookmarks.push(slug);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// Event delegation for opening posts
function bindOpeners() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-slug]');
    if(card) openArticle(card.dataset.slug);
  });
  $('#backBtn').addEventListener('click', closeArticle);
}

// Init
function init() {
  renderFeatured();
  renderPosts();
  bindCategories();
  bindSliderDrag();
  bindSearch();
  bindOpeners();
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

init();