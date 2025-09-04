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
  } else if (location.hash.startsWith('#/admin')) {
    // open Admin overlay via secret hash link
    document.getElementById('adminOverlay')?.classList.add('open');
  } else {
    document.getElementById('articleOverlay')?.classList.remove('open');
    // also close admin overlay when leaving
    document.getElementById('adminOverlay')?.classList.remove('open');
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

// Firebase setup
let fbApp, fbAuth, db;
function initFirebase() {
  if (!window.FIREBASE_CONFIG) return;
  fbApp = firebase.initializeApp(window.FIREBASE_CONFIG);
  fbAuth = firebase.auth();
  db = firebase.firestore();
}

// Username management (unique, no password)
const LS_USERNAME = 'l457_username';
let myUsername = localStorage.getItem(LS_USERNAME) || null;

async function ensureUsername() {
  if (myUsername) return myUsername;
  // open overlay
  document.getElementById('usernameOverlay')?.classList.add('open');
  return new Promise((resolve) => {
    const input = document.getElementById('usernameInput');
    const error = document.getElementById('usernameError');
    const confirmBtn = document.getElementById('usernameConfirm');
    const closeBtn = document.getElementById('usernameClose');

    function cleanup() {
      confirmBtn.removeEventListener('click', onConfirm);
      closeBtn.removeEventListener('click', onClose);
    }

    async function onConfirm() {
      const name = (input.value || '').trim().toLowerCase();
      if (!name || name.length < 3) { error.textContent = 'At least 3 characters'; error.style.display='block'; return; }
      // check Firestore uniqueness
      try {
        const docRef = db.collection('usernames').doc(name);
        const doc = await docRef.get();
        if (doc.exists) { error.textContent = 'Username already taken'; error.style.display='block'; return; }
        // reserve
        await docRef.set({ createdAt: Date.now() });
        myUsername = name;
        localStorage.setItem(LS_USERNAME, name);
        document.getElementById('usernameOverlay')?.classList.remove('open');
        cleanup();
        resolve(name);
      } catch (e) {
        error.textContent = 'Error, please try again'; error.style.display='block';
      }
    }

    function onClose() {
      document.getElementById('usernameOverlay')?.classList.remove('open');
      cleanup();
      resolve(null);
    }

    confirmBtn.addEventListener('click', onConfirm);
    closeBtn.addEventListener('click', onClose);
  });
}

// Comments logic
function listenComments(slug) {
  if (!db) return; // skip if firebase missing
  return db.collection('posts').doc(slug).collection('comments')
    .orderBy('createdAt', 'asc')
    .onSnapshot((snap) => {
      const wrap = document.getElementById('commentsList');
      if (!wrap) return;
      wrap.innerHTML = snap.docs.map(d => {
        const c = d.data();
        return `<div class="comment-item"><div class="comment-head">@${c.username} · ${new Date(c.createdAt).toLocaleString()}</div><div class="comment-body">${escapeHtml(c.text)}</div></div>`;
      }).join('');
    });
}

function escapeHtml(s='') { return s.replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch])); }

async function submitComment(slug) {
  if (!db) return;
  const text = (document.getElementById('commentText')?.value || '').trim();
  if (!text) return;
  const name = await ensureUsername();
  if (!name) return;
  await db.collection('posts').doc(slug).collection('comments').add({
    text,
    username: name,
    createdAt: Date.now()
  });
  const ta = document.getElementById('commentText'); if (ta) ta.value = '';
}

// Admin auth + upload
let adminUnsub = null;
function bindAdminUI() {
  const btn = document.getElementById('adminBtn');
  const overlay = document.getElementById('adminOverlay');
  const closeBtn = document.getElementById('adminClose');
  const authBtn = document.getElementById('adminAuthBtn');
  const info = document.getElementById('adminInfo');
  const form = document.getElementById('adminForm');
  const pwdInput = document.getElementById('adminPwd');
  const pwdUnlock = document.getElementById('adminPwdUnlock');

  if (!overlay) return; // allow binding without a visible Admin button

  // If a visible Admin button exists, use it. Otherwise rely on #/admin link.
  if (btn) btn.addEventListener('click', () => overlay.classList.add('open'));
  closeBtn?.addEventListener('click', () => overlay.classList.remove('open'));

  authBtn?.addEventListener('click', async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const cred = await fbAuth.signInWithPopup(provider);
      const email = cred.user?.email || '';
      if (!window.ALLOWED_ADMIN_EMAILS?.includes(email)) {
        info.textContent = 'Unauthorized email.';
        await fbAuth.signOut();
        return;
      }
      info.textContent = `Hello ${email}. You can publish.`;
      form.style.display = '';
    } catch (e) {
      info.textContent = 'Sign-in canceled or failed.';
    }
  });

  // Local password unlock (for local dev only)
  pwdUnlock?.addEventListener('click', () => {
    const provided = (pwdInput?.value || '').trim();
    const expected = window.LOCAL_ADMIN?.password;
    if (!expected) { info.textContent = 'Local password not configured.'; return; }
    if (provided === expected) {
      info.textContent = 'Local admin unlocked. You can publish.';
      form.style.display = '';
    } else {
      info.textContent = 'Wrong password.';
    }
  });

  document.getElementById('publishPost')?.addEventListener('click', async () => {
    if (!db) { info.textContent = 'Firebase not initialized'; return; }
    const slug = document.getElementById('postSlug').value.trim();
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const cover = document.getElementById('postCover').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const featured = document.getElementById('postFeatured').checked;
    const readTime = document.getElementById('postReadTime').value.trim() || '5 min';

    if (!slug || !title) { info.textContent = 'Slug and title are required'; return; }
    const postDoc = db.collection('posts').doc(slug);
    await postDoc.set({ slug, title, category, cover, excerpt, featured, readTime, date: new Date().toISOString().slice(0,10), contentHtml: content }, { merge: true });
    info.textContent = 'Published! Refresh the home to see the new post.';
  });

  document.getElementById('seedFromLocal')?.addEventListener('click', async () => {
    if (!db) { info.textContent = 'Firebase not initialized'; return; }
    try {
      info.textContent = 'Seeding in progress...';
      for (const p of posts) {
        const docRef = db.collection('posts').doc(p.slug);
        await docRef.set({
          slug: p.slug,
          title: p.title,
          category: p.category,
          date: p.date || new Date().toISOString().slice(0,10),
          readTime: p.readTime || '5 min',
          excerpt: p.excerpt || '',
          cover: p.cover || '',
          featured: !!p.featured,
          contentHtml: typeof p.content === 'string' ? p.content : ''
        }, { merge: true });
      }
      info.textContent = 'Seeding complete. Refresh the home to load Firestore data.';
    } catch (e) {
      info.textContent = 'Error during seeding.';
    }
  });

  document.getElementById('downloadPost')?.addEventListener('click', () => {
    const slug = document.getElementById('postSlug').value.trim();
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const cover = document.getElementById('postCover').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const featured = document.getElementById('postFeatured').checked;
    const readTime = document.getElementById('postReadTime').value.trim() || '5 min';
    if (!slug || !title) { info.textContent = 'Slug and title are required'; return; }

    const htmlContent = content || '<div class="article"><p>(No content)</p></div>';
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const jsonObj = { slug, title, category, date: new Date().toISOString().slice(0,10), readTime, excerpt, cover, featured };
    const jsonBlob = new Blob([JSON.stringify(jsonObj, null, 2)], { type: 'application/json' });

    function triggerDownload(name, blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }

    triggerDownload(`${slug}.html`, htmlBlob);
    triggerDownload(`${slug}.json`, jsonBlob);
    info.textContent = 'Downloads ready: HTML and JSON snippet.';
  });
}

// Load posts from Firestore (if available)
async function fetchPostsFromFirestore() {
  if (!db) return null;
  const snap = await db.collection('posts').orderBy('date', 'desc').get();
  return snap.docs.map(d => {
    const p = d.data();
    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      date: p.date,
      readTime: p.readTime || '5 min',
      excerpt: p.excerpt || '',
      cover: p.cover || '',
      featured: !!p.featured,
      content: p.contentHtml || '<div class="article"><p>(Senza contenuto)</p></div>'
    };
  });
}

// Override render source if Firestore has content
async function initDynamicContent() {
  initFirebase();
  try {
    const remote = await fetchPostsFromFirestore();
    if (remote && remote.length) {
      posts.splice(0, posts.length, ...remote);
      renderFeatured();
      renderPosts();
    }
  } catch {}
}

// Hook comments when opening article
let commentsUnsub = null;
const origOpenArticle = openArticle;
openArticle = function(slug) {
  origOpenArticle(slug);
  // bind submit
  document.getElementById('commentSubmit')?.addEventListener('click', () => submitComment(slug));
  if (commentsUnsub) { try { commentsUnsub(); } catch {} }
  commentsUnsub = listenComments(slug);
};

// Local posts (static files) loader
async function fetchPostsFromLocal() {
  try {
    const res = await fetch('posts/index.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const list = await res.json();
    const items = [];
    for (const p of list) {
      try {
        const html = await fetch(`posts/${p.slug}.html`, { cache: 'no-store' }).then(r => r.ok ? r.text() : '<div class="article"><p>(Senza contenuto)</p></div>');
        items.push({
          slug: p.slug,
          title: p.title,
          category: p.category,
          date: p.date,
          readTime: p.readTime || '5 min',
          excerpt: p.excerpt || '',
          cover: p.cover || '',
          featured: !!p.featured,
          content: html
        });
      } catch (_) {
        // skip broken file
      }
    }
    return items.length ? items : null;
  } catch (_) { return null; }
}

async function initLocalContent() {
  const local = await fetchPostsFromLocal();
  if (local && local.length) {
    posts.splice(0, posts.length, ...local);
    renderFeatured();
    renderPosts();
  }
}

// Extend init
const origInit = init;
init = function() {
  origInit();
  // Load local posts first (if available), then try Firestore override
  initLocalContent().then(() => {
    initDynamicContent();
  });
  bindAdminUI();
};

// re-run
init();