// Local admin configuration for production
window.LOCAL_ADMIN = {
  password: 'admin123'
};

// Data: posts
const posts = [
  {
    slug: "nano-banana-tutorial",
    title: "Nano Banana: guida rapida all'AI image editing di Google (2025)",
    category: "tech",
    date: "2025-09-01",
    readTime: "6 min",
    excerpt: "Come usare il modello di Google per l'editing di immagini: setup, prompt e best practice.",
    cover: "placeholder.svg",
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
    cover: "placeholder.svg",
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
    cover: "placeholder.svg",
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
    cover: "placeholder.svg",
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
      <div class="post-actions" style="position: absolute; top: 8px; right: 8px; opacity: 0; transition: opacity 0.2s;">
        <button class="edit-post-btn" data-slug="${p.slug}" title="Edit this post" style="background: rgba(59, 130, 246, 0.9); border: none; color: white; padding: 6px 8px; border-radius: 6px; font-size: 12px; cursor: pointer;">✏️ Edit</button>
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
    </article>
  `;
  // Add content separately to avoid template literal issues with placeholders
  // Process content through parseContent to convert placeholders to HTML
  container.querySelector('.article').innerHTML += parseContent(post.content);
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
    // Handle edit button clicks
    if (e.target.classList.contains('edit-post-btn')) {
      e.stopPropagation();
      const slug = e.target.dataset.slug;
      loadExistingPostForEdit(slug);
      return;
    }
    
    // Handle post card clicks
    const card = e.target.closest('[data-slug]');
    if(card && !e.target.closest('.post-actions')) {
      openArticle(card.dataset.slug);
    }
  });
  $('#backBtn').addEventListener('click', closeArticle);
}

// Load existing post for editing
function loadExistingPostForEdit(slug) {
  try {
    // Find post in current posts array or localStorage
    let post = posts.find(p => p.slug === slug);
    
    if (!post) {
      // Try loading from localStorage
      const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '{}');
      post = savedPosts[slug];
    }
    
    if (post) {
      // Open admin panel
      const adminOverlay = document.getElementById('adminOverlay');
      if (adminOverlay) {
        adminOverlay.classList.add('open');
      }
      
      // Populate form fields
      document.getElementById('postTitle').value = post.title || '';
      document.getElementById('postCategory').value = post.category || 'tech';
      document.getElementById('postExcerpt').value = post.excerpt || '';
      document.getElementById('postContent').value = post.contentHtml || post.content || '';
      document.getElementById('postCover').value = post.cover || '';
      document.getElementById('postFeatured').checked = post.featured || false;
      document.getElementById('postReadTime').value = post.readTime || '5 min';
      
      // Preserve metadata
      if (post.metadata) {
        window.currentPostMetadata = { ...post.metadata };
      } else {
        // Create metadata from existing post data
        window.currentPostMetadata = {
          createdAt: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
          author: 'Admin',
          version: 1
        };
      }
      
      // Update previews
      const refreshCard = window.refreshCard;
      if (typeof refreshCard === 'function') {
        refreshCard();
      }
      
      // Update live preview if available
      const updateLivePreview = window.updateLivePreview;
      if (typeof updateLivePreview === 'function') {
        updateLivePreview();
      }
      
      // Show cover preview if available
      if (post.cover) {
        const coverPreview = document.getElementById('coverPreview');
        if (coverPreview) {
          coverPreview.src = post.cover;
          coverPreview.style.display = 'block';
        }
      }
      
      // Show success message
      const adminInfo = document.getElementById('adminInfo');
      if (adminInfo) {
        adminInfo.textContent = `✏️ Editing: "${post.title}" - All data preserved for editing`;
        adminInfo.style.color = '#10b981';
      }
      
      console.log('Post loaded for editing:', slug, post);
    } else {
      console.error('Post not found for editing:', slug);
      alert('Post not found for editing');
    }
  } catch (error) {
    console.error('Error loading post for editing:', error);
    alert('Error loading post for editing');
  }
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
let fbApp, fbAuth, db, storage;
let firebaseInitialized = false;
let firebaseError = null;

function initFirebase() {
  if (!window.FIREBASE_CONFIG) {
    console.warn('Firebase config not found. Running in local-only mode.');
    firebaseError = 'Firebase configuration not found';
    return;
  }
  
  // Validate Firebase configuration
  const requiredFields = ['apiKey', 'authDomain', 'projectId'];
  const missingFields = requiredFields.filter(field => 
    !window.FIREBASE_CONFIG[field] || 
    window.FIREBASE_CONFIG[field].includes('YOUR_') || 
    window.FIREBASE_CONFIG[field] === 'YOUR_PROJECT_ID'
  );
  
  if (missingFields.length > 0) {
    console.warn('Firebase config incomplete. Missing or placeholder values for:', missingFields);
    firebaseError = `Firebase configuration incomplete: ${missingFields.join(', ')}`;
    return;
  }
  
  try {
    fbApp = firebase.initializeApp(window.FIREBASE_CONFIG);
    fbAuth = firebase.auth();
    db = firebase.firestore();
    
    // Test connection with timeout
    const connectionTest = db.collection('_test').limit(1).get();
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    Promise.race([connectionTest, timeout])
      .then(() => {
        firebaseInitialized = true;
        console.log('Firebase connected successfully');
      })
      .catch((error) => {
        console.warn('Firebase connection test failed:', error.message);
        firebaseError = `Firebase connection failed: ${error.message}`;
      });
    
    try { 
      if (firebase.storage) storage = firebase.storage(); 
    } catch(_) { 
      storage = null; 
    }
    
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    firebaseError = `Firebase initialization failed: ${error.message}`;
    fbApp = null;
    fbAuth = null;
    db = null;
    storage = null;
  }
}

// Check Firebase status
function getFirebaseStatus() {
  if (!window.FIREBASE_CONFIG) {
    return { connected: false, error: 'No Firebase configuration found', mode: 'local-only' };
  }
  if (firebaseError) {
    return { connected: false, error: firebaseError, mode: 'local-only' };
  }
  if (firebaseInitialized && db) {
    return { connected: true, error: null, mode: 'firebase' };
  }
  return { connected: false, error: 'Firebase initializing...', mode: 'local-only' };
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

  if (btn) btn.addEventListener('click', () => overlay.classList.add('open'));
  closeBtn?.addEventListener('click', () => overlay.classList.remove('open'));

  // Live preview bindings
  const titleEl = document.getElementById('postTitle');
  const excerptEl = document.getElementById('postExcerpt');
  const categoryEl = document.getElementById('postCategory');
  const readEl = document.getElementById('postReadTime');
  const coverUrlEl = document.getElementById('postCover');
  const cardTitle = document.getElementById('cardTitle');
  const cardExcerpt = document.getElementById('cardExcerpt');
  const cardMeta = document.getElementById('cardMeta');
  const cardThumb = document.getElementById('cardThumb');
  const coverPreview = document.getElementById('coverPreview');
  const contentPreview = document.getElementById('contentLivePreview');

  function refreshCard() {
    const t = titleEl?.value?.trim() || 'Titolo';
    const ex = excerptEl?.value?.trim() || 'Estratto...';
    const cat = categoryEl?.value || 'tech';
    const rt = readEl?.value || '5 min';
    const cu = coverUrlEl?.value?.trim() || '';
    if (cardTitle) cardTitle.textContent = t;
    if (cardExcerpt) cardExcerpt.textContent = ex;
    if (cardMeta) cardMeta.textContent = `${cat} · ${rt}`;
    if (cardThumb) cardThumb.style.backgroundImage = cu ? `url(${cu})` : '';
    if (coverPreview && cu) coverPreview.src = cu;
  }
  [titleEl, excerptEl, categoryEl, readEl, coverUrlEl].forEach(el => el?.addEventListener('input', refreshCard));
  refreshCard();

  // Advanced Editor System
  const contentTA = document.getElementById('postContent');
  const editorPreview = document.getElementById('editorPreview');
  const previewToggle = document.getElementById('previewToggle');
  const insertImageBtn = document.getElementById('insertImageBtn');
  const insertYouTubeBtn = document.getElementById('insertYouTubeBtn');
  const editorContainer = document.querySelector('.editor-container');
  
  let isPreviewVisible = false;
  let cursorPosition = 0;
  
  // Sistema di placeholder per immagini
  let imageCounter = 1;
  const imageRegistry = new Map(); // Mappa placeholder -> dati immagine reali
  
  // Funzione avanzata per il rendering Markdown/HTML
   function parseContent(content) {
     let html = content;
     
     // Prima converti i placeholder delle immagini in HTML reale
     html = html.replace(/\[immagine(\d+)\]/g, (match, num) => {
       const imageData = imageRegistry.get(match);
       if (imageData) {
         if (imageData.type === 'single') {
           return `<img src="${imageData.url}" alt="${imageData.alt}" style="max-width:100%; border-radius:8px; margin:8px 0; display:block;">`;
         } else if (imageData.type === 'grid') {
           return imageData.html;
         }
       }
       return match; // Se non trovato, mantieni il placeholder
     });
     
     // Converti Markdown in HTML
     html = html
       // Headers
       .replace(/^### (.*$)/gim, '<h3>$1</h3>')
       .replace(/^## (.*$)/gim, '<h2>$1</h2>')
       .replace(/^# (.*$)/gim, '<h1>$1</h1>')
       
       // Bold e Italic
       .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
       .replace(/\*(.*?)\*/g, '<em>$1</em>')
       
       // Links e Immagini (solo per immagini markdown normali, non placeholder)
       .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:8px; margin:8px 0; display:block;">')
       .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
       
       // Liste non ordinate
       .replace(/^\* (.+)$/gm, '<li>$1</li>')
       .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
       
       // Liste ordinate
       .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
       
       // Code blocks
       .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
       .replace(/`([^`]+)`/g, '<code>$1</code>')
       
       // Paragrafi (converti doppie newline in paragrafi)
       .replace(/\n\n/g, '</p><p>')
       .replace(/^(.+)$/gm, function(match, p1) {
         // Non wrappare in <p> se è già un tag HTML
         if (p1.match(/^<(h[1-6]|ul|ol|li|pre|div|img|iframe)/)) {
           return p1;
         }
         return '<p>' + p1 + '</p>';
       })
       
       // Singole newline diventano <br>
       .replace(/\n/g, '<br>');
     
     // Pulisci paragrafi vuoti e duplicati
     html = html
       .replace(/<p><\/p>/g, '')
       .replace(/<p>(<[^>]+>)<\/p>/g, '$1')
       .replace(/<br><\/p>/g, '</p>')
       .replace(/<p><br>/g, '<p>');
     
     return html;
   }
   
   // Funzione per aggiornare il preview
   function updateLivePreview() {
     if (!contentPreview) return;
     const content = contentTA?.value || '';
     const rendered = parseContent(content);
     
     contentPreview.innerHTML = rendered;
     if (editorPreview) editorPreview.innerHTML = rendered;
   }
  
  // Live preview del contenuto
  if (contentTA) {
    contentTA.addEventListener('input', updateLivePreview);
    
    // Traccia posizione cursore
    contentTA.addEventListener('selectionchange', () => {
      cursorPosition = contentTA.selectionStart;
    });
    
    contentTA.addEventListener('click', () => {
      cursorPosition = contentTA.selectionStart;
    });
    
    contentTA.addEventListener('keyup', () => {
      cursorPosition = contentTA.selectionStart;
    });
  }
  
  // Enhanced Preview System - Real Post Preview
  let previewMode = 'code'; // 'code', 'preview', 'article'
  
  function updatePreviewMode() {
    const textarea = document.getElementById('postContent');
    const editorContainer = document.querySelector('.editor-container');
    const contentLivePreview = document.getElementById('contentLivePreview');
    
    if (!textarea || !editorContainer || !contentLivePreview) return;
    
    switch (previewMode) {
      case 'code':
        textarea.style.display = 'block';
        editorPreview.style.display = 'none';
        contentLivePreview.style.display = 'block';
        editorContainer.classList.remove('preview-mode', 'article-mode');
        previewToggle.textContent = '👁️ Preview';
        break;
        
      case 'preview':
        textarea.style.display = 'block';
        editorPreview.style.display = 'block';
        contentLivePreview.style.display = 'block';
        editorContainer.classList.add('preview-mode');
        editorContainer.classList.remove('article-mode');
        previewToggle.textContent = '📖 Anteprima Articolo';
        updateLivePreview();
        break;
        
      case 'article':
        textarea.style.display = 'none';
        editorPreview.style.display = 'none';
        contentLivePreview.style.display = 'none';
        editorContainer.classList.add('article-mode');
        editorContainer.classList.remove('preview-mode');
        previewToggle.textContent = '✏️ Torna Editor';
        showArticlePreview();
        break;
    }
  }
  
  function showArticlePreview() {
    const title = document.getElementById('postTitle').value.trim() || 'Titolo del Post';
    const category = document.getElementById('postCategory').value || 'tech';
    const readTime = document.getElementById('postReadTime').value || '5 min';
    const content = document.getElementById('postContent').value || '';
    const coverUrl = document.getElementById('postCover').value.trim();
    
    const currentDate = new Date().toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    
    const renderedContent = parseContent(content);
    
    // Crea anteprima articolo completa
    const articlePreview = document.createElement('div');
    articlePreview.id = 'articlePreviewContainer';
    articlePreview.className = 'article-preview-container';
    
    articlePreview.innerHTML = `
      <div class="article-preview-header">
        <button id="closeArticlePreview" class="close-preview-btn">← Torna all'Editor</button>
      </div>
      <article class="article-preview">
        ${coverUrl ? `<div class="article-cover" style="background-image: url('${coverUrl}')"></div>` : ''}
        <div class="article-content">
          <div class="article-meta">
            <span class="article-category">${category.toUpperCase()}</span>
            <span class="article-date">${currentDate}</span>
            <span class="article-read-time">${readTime}</span>
          </div>
          <h1 class="article-title">${title}</h1>
          <div class="article-body">
            ${renderedContent}
          </div>
        </div>
      </article>
    `;
    
    // Rimuovi preview precedente se esiste
    const existing = document.getElementById('articlePreviewContainer');
    if (existing) existing.remove();
    
    // Inserisci dopo l'editor container
    const editorContainer = document.querySelector('.editor-container');
    editorContainer.parentNode.insertBefore(articlePreview, editorContainer.nextSibling);
    
    // Bind close button
    document.getElementById('closeArticlePreview').addEventListener('click', () => {
      previewMode = 'code';
      updatePreviewMode();
      articlePreview.remove();
    });
  }
  
  // Toggle preview system
  if (previewToggle && editorPreview && editorContainer) {
    previewToggle.addEventListener('click', () => {
      switch (previewMode) {
        case 'code':
          previewMode = 'preview';
          break;
        case 'preview':
          previewMode = 'article';
          break;
        case 'article':
          previewMode = 'code';
          // Rimuovi container anteprima articolo
          const articleContainer = document.getElementById('articlePreviewContainer');
          if (articleContainer) articleContainer.remove();
          break;
      }
      updatePreviewMode();
    });
  }
  
  // Multi-Image Insert Modal System
   const imageInsertModal = document.getElementById('imageInsertModal');
   const imageInsertOverlay = document.getElementById('imageInsertOverlay');
   const modalImageFile = document.getElementById('modalImageFile');
   const modalImageUrls = document.getElementById('modalImageUrls');
   const modalImageAlt = document.getElementById('modalImageAlt');
   const modalUploadBtn = document.getElementById('modalUploadBtn');
   const modalInsertUrlBtn = document.getElementById('modalInsertUrlBtn');
   const modalCancelBtn = document.getElementById('modalCancelBtn');
   const modalImagePreview = document.getElementById('modalImagePreview');
   const layoutPreview = document.getElementById('layoutPreview');
   const layoutPreviewSection = document.getElementById('layoutPreviewSection');
   const uniformAspectCheckbox = document.getElementById('uniformAspect');
   const equalHeightCheckbox = document.getElementById('equalHeight');
   const imageSpacingSlider = document.getElementById('imageSpacing');
   const spacingValueSpan = document.getElementById('spacingValue');
   
   let selectedFiles = [];
   let selectedLayout = 'single';
   let layoutSettings = {
     uniformAspect: true,
     equalHeight: true,
     spacing: 12
   };
   
   // Funzione per inserire testo nella posizione del cursore
   function insertAtCursor(text) {
     if (!contentTA) return;
     
     const start = contentTA.selectionStart;
     const end = contentTA.selectionEnd;
     const value = contentTA.value;
     
     contentTA.value = value.substring(0, start) + text + value.substring(end);
     contentTA.selectionStart = contentTA.selectionEnd = start + text.length;
     contentTA.focus();
     updateLivePreview();
   }
   
   // Genera HTML per layout multi-immagine
   function generateImageGridHTML(images, layout, altText = '') {
     const gridClass = `image-grid ${layout}`;
     const spacing = layoutSettings.spacing;
     const aspectClass = layoutSettings.uniformAspect ? ' uniform-aspect' : '';
     const heightClass = layoutSettings.equalHeight ? ' equal-height' : '';
     
     const imageElements = images.map((img, index) => {
       const alt = altText || `Immagine ${index + 1}`;
       return `<img src="${img}" alt="${alt}" loading="lazy">`;
     }).join('\n    ');
     
     return `\n<div class="${gridClass}${aspectClass}${heightClass}" style="gap: ${spacing}px;">\n    ${imageElements}\n</div>\n`;
   }
   
   // Aggiorna preview del layout
   function updateLayoutPreview() {
     if (!layoutPreview) return;
     
     const images = selectedFiles.length > 0 ? 
       selectedFiles.map(f => URL.createObjectURL(f)) : 
       modalImageUrls.value.split('\n').filter(url => url.trim());
     
     if (images.length === 0) {
       layoutPreviewSection.style.display = 'none';
       return;
     }
     
     layoutPreviewSection.style.display = 'block';
     
     // Genera HTML del layout con impostazioni applicate
     const previewHTML = generateImageGridHTML(images, selectedLayout);
     layoutPreview.innerHTML = previewHTML;
     
     // Applica le impostazioni di layout al preview
     const previewGrid = layoutPreview.querySelector('.image-grid');
     if (previewGrid) {
       previewGrid.style.gap = layoutSettings.spacing + 'px';
       
       // Applica classi per controlli layout
       previewGrid.classList.toggle('uniform-aspect', layoutSettings.uniformAspect);
       previewGrid.classList.toggle('equal-height', layoutSettings.equalHeight);
       
       // Ridimensiona immagini per preview
       const previewImages = previewGrid.querySelectorAll('img');
       previewImages.forEach(img => {
         img.style.maxHeight = '120px';
         img.style.objectFit = 'cover';
       });
     }
   }
   
   // Aggiorna preview delle immagini selezionate
   function updateImagePreview() {
     if (!modalImagePreview) return;
     
     modalImagePreview.innerHTML = '';
     
     if (selectedFiles.length > 0) {
       // Crea preview con layout selezionato
       const fileUrls = selectedFiles.map(file => URL.createObjectURL(file));
       
       if (selectedLayout === 'single' && selectedFiles.length === 1) {
         const item = document.createElement('div');
         item.className = 'image-preview-item';
         
         const img = document.createElement('img');
         img.src = fileUrls[0];
         img.alt = selectedFiles[0].name;
         img.style.maxWidth = '200px';
         img.style.maxHeight = '150px';
         img.style.borderRadius = '8px';
         
         const removeBtn = document.createElement('button');
         removeBtn.className = 'remove-btn';
         removeBtn.innerHTML = '×';
         removeBtn.onclick = () => {
           selectedFiles.splice(0, 1);
           updateImagePreview();
           updateLayoutPreview();
         };
         
         item.appendChild(img);
         item.appendChild(removeBtn);
         modalImagePreview.appendChild(item);
       } else {
         // Preview con layout grid
         selectedFiles.forEach((file, index) => {
           const item = document.createElement('div');
           item.className = 'image-preview-item';
           
           const img = document.createElement('img');
           img.src = URL.createObjectURL(file);
           img.alt = file.name;
           
           const removeBtn = document.createElement('button');
           removeBtn.className = 'remove-btn';
           removeBtn.innerHTML = '×';
           removeBtn.onclick = () => {
             selectedFiles.splice(index, 1);
             updateImagePreview();
             updateLayoutPreview();
           };
           
           item.appendChild(img);
           item.appendChild(removeBtn);
           modalImagePreview.appendChild(item);
         });
       }
     }
     
     updateLayoutPreview();
   }
   
   // Mostra modal per inserimento immagine
   function showImageModal() {
     if (imageInsertModal && imageInsertOverlay) {
       imageInsertModal.style.display = 'block';
       imageInsertOverlay.classList.add('open');
       modalImageUrls.value = '';
       modalImageAlt.value = '';
       modalImageFile.value = '';
       selectedFiles = [];
       selectedLayout = 'single';
       document.querySelector('input[name="imageLayout"][value="single"]').checked = true;
       
       // Nascondi controlli layout inizialmente
       const layoutControls = document.getElementById('layoutControls');
       if (layoutControls) {
         layoutControls.style.display = 'none';
       }
       
       // Reset controlli layout ai valori di default
       if (uniformAspectCheckbox) uniformAspectCheckbox.checked = layoutSettings.uniformAspect;
       if (equalHeightCheckbox) equalHeightCheckbox.checked = layoutSettings.equalHeight;
       if (imageSpacingSlider) {
         imageSpacingSlider.value = layoutSettings.spacing;
         if (spacingValueSpan) spacingValueSpan.textContent = layoutSettings.spacing + 'px';
       }
       
       updateImagePreview();
       layoutPreviewSection.style.display = 'none';
     }
   }
   
   // Nascondi modal
   function hideImageModal() {
     if (imageInsertModal && imageInsertOverlay) {
       imageInsertModal.style.display = 'none';
       imageInsertOverlay.classList.remove('open');
       selectedFiles.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
       selectedFiles = [];
     }
   }
   
   // Event listeners per il modal
   if (insertImageBtn) {
     insertImageBtn.addEventListener('click', showImageModal);
   }
   
   if (modalCancelBtn) {
     modalCancelBtn.addEventListener('click', hideImageModal);
   }
   
   if (imageInsertOverlay) {
     imageInsertOverlay.addEventListener('click', hideImageModal);
   }
   
   // Layout selection listeners
   document.querySelectorAll('input[name="imageLayout"]').forEach(radio => {
     radio.addEventListener('change', (e) => {
       selectedLayout = e.target.value;
       // Mostra/nascondi controlli layout
       const layoutControls = document.getElementById('layoutControls');
       if (layoutControls) {
         layoutControls.style.display = e.target.value !== 'single' ? 'block' : 'none';
       }
       updateLayoutPreview();
     });
   });
   
   // Event listeners per controlli layout
   if (uniformAspectCheckbox) {
     uniformAspectCheckbox.addEventListener('change', function() {
       layoutSettings.uniformAspect = this.checked;
       updateLayoutPreview();
     });
   }
   
   if (equalHeightCheckbox) {
     equalHeightCheckbox.addEventListener('change', function() {
       layoutSettings.equalHeight = this.checked;
       updateLayoutPreview();
     });
   }
   
   if (imageSpacingSlider) {
     imageSpacingSlider.addEventListener('input', function() {
       layoutSettings.spacing = parseInt(this.value);
       if (spacingValueSpan) {
         spacingValueSpan.textContent = this.value + 'px';
       }
       updateLayoutPreview();
     });
   }
   
   // File selection listener
   if (modalImageFile) {
     modalImageFile.addEventListener('change', (e) => {
       selectedFiles = Array.from(e.target.files);
       updateImagePreview();
     });
   }
   
   // URL textarea listener
   if (modalImageUrls) {
     modalImageUrls.addEventListener('input', updateLayoutPreview);
   }
   
   // Inserisci immagini da URL
   if (modalInsertUrlBtn) {
     modalInsertUrlBtn.addEventListener('click', () => {
       const urls = modalImageUrls.value.split('\n').filter(url => url.trim());
       const alt = modalImageAlt.value.trim() || 'Immagine';
       
       if (urls.length === 0) {
         alert('Inserisci almeno un URL valido per le immagini');
         return;
       }
       
       // Genera placeholder e registra i dati reali
       const placeholder = `[immagine${imageCounter}]`;
       
       if (urls.length === 1 && selectedLayout === 'single') {
         // Singola immagine
         imageRegistry.set(placeholder, {
           type: 'single',
           url: urls[0],
           alt: alt
         });
       } else {
         // Multiple immagini - genera HTML grid e salvalo
         const gridHtml = generateImageGridHTML(urls, selectedLayout, alt);
         imageRegistry.set(placeholder, {
           type: 'grid',
           html: gridHtml,
           alt: alt
         });
       }
       
       insertAtCursor(placeholder);
       imageCounter++;
       hideImageModal();
       
       // Trigger auto-preview after URL insertion
       if (typeof autoPreviewAfterUpload === 'function') {
         autoPreviewAfterUpload();
       }
     });
   }
   
   // Upload e inserisci immagini
   if (modalUploadBtn && modalImageFile) {
     modalUploadBtn.addEventListener('click', async () => {
       if (selectedFiles.length === 0) {
         alert('Seleziona almeno un file immagine');
         return;
       }
       
       // Auto-switch to article preview after image upload
       const autoPreviewAfterUpload = () => {
         setTimeout(() => {
           if (previewMode === 'code') {
             previewMode = 'article';
             updatePreviewMode();
           }
         }, 1000);
       };
       
       try {
         modalUploadBtn.textContent = '⏳ Caricamento...';
         modalUploadBtn.disabled = true;
         
         const urls = [];
         const alt = modalImageAlt.value.trim();
         
         // Carica tutti i file
         for (let i = 0; i < selectedFiles.length; i++) {
           const file = selectedFiles[i];
           
           if (window.uploadToFirebase) {
             // Upload su Firebase Storage
             const url = await window.uploadToFirebase(file, 'content-images/');
             urls.push(url);
           } else {
             // Fallback: converti in data URL per test locali
             const dataUrl = await new Promise((resolve) => {
               const reader = new FileReader();
               reader.onload = (e) => resolve(e.target.result);
               reader.readAsDataURL(file);
             });
             urls.push(dataUrl);
           }
         }
         
         // Genera placeholder e registra i dati reali
         const placeholder = `[immagine${imageCounter}]`;
         
         if (urls.length === 1 && selectedLayout === 'single') {
           // Singola immagine
           const altText = alt || selectedFiles[0].name.split('.')[0];
           imageRegistry.set(placeholder, {
             type: 'single',
             url: urls[0],
             alt: altText
           });
         } else {
           // Multiple immagini - genera HTML grid e salvalo
           const altText = alt || 'Immagine';
           const gridHtml = generateImageGridHTML(urls, selectedLayout, altText);
           imageRegistry.set(placeholder, {
             type: 'grid',
             html: gridHtml,
             alt: altText
           });
         }
         
         insertAtCursor(placeholder);
         imageCounter++;
         hideImageModal();
         
         // Trigger auto-preview after successful upload
         autoPreviewAfterUpload();
       } catch (error) {
         console.error('Errore upload:', error);
         alert('Errore durante il caricamento delle immagini');
       } finally {
         modalUploadBtn.textContent = '📤 Carica e Inserisci';
         modalUploadBtn.disabled = false;
       }
     });
   }
   
   // YouTube insertion
   if (insertYouTubeBtn) {
     insertYouTubeBtn.addEventListener('click', () => {
       const url = prompt('Inserisci URL YouTube:', 'https://www.youtube.com/watch?v=');
       if (url) {
         let videoId = '';
         
         // Estrai ID video da vari formati URL YouTube
         const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
         if (match) {
           videoId = match[1];
         } else if (url.length === 11) {
           videoId = url; // Assume sia già un ID
         }
         
         if (videoId) {
           const embedHtml = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
           insertAtCursor(embedHtml);
         } else {
           alert('URL YouTube non valido');
         }
       }
     });
   }
   
   window.updateLivePreview = updateLivePreview;
   updateLivePreview();

  // Copy Cover URL
  document.getElementById('coverCopyUrl')?.addEventListener('click', async () => {
    const url = coverUrlEl?.value?.trim();
    if (!url) return;
    try { await navigator.clipboard.writeText(url); info.textContent = 'URL copiato negli appunti'; } catch { info.textContent = 'Copia non riuscita'; }
  });

  // Drag & drop previews
  function wireDropZone(zoneId, inputId, onFiles) {
    const z = document.getElementById(zoneId);
    const inp = document.getElementById(inputId);
    if (!z || !inp) return;
    z.addEventListener('click', () => inp.click());
    ['dragover','dragenter'].forEach(ev => z.addEventListener(ev, e => { e.preventDefault(); z.classList.add('drag'); }));
    ['dragleave','drop'].forEach(ev => z.addEventListener(ev, e => { e.preventDefault(); z.classList.remove('drag'); }));
    z.addEventListener('drop', e => { const files = Array.from(e.dataTransfer.files||[]); if (files.length) { inp.files = e.dataTransfer.files; onFiles(files); } });
    inp.addEventListener('change', () => onFiles(Array.from(inp.files||[])));
  }

  wireDropZone('coverDrop','coverFile', (files) => {
    const f = files[0]; if (!f) return;
    const isGif = /\.gif$/i.test(f.name) || f.type === 'image/gif';
    const reader = new FileReader();
    reader.onload = () => { coverUrlEl.value = reader.result; refreshCard(); if (isGif) info.textContent = 'GIF rilevata: nessun crop 16:9, viene mantenuta l\'animazione.'; };
    reader.readAsDataURL(f);
  });

  wireDropZone('contentDrop','contentFile', (files) => {
     // Only quick local preview of first 4 thumbs
     const thumbs = document.getElementById('contentThumbs');
     if (thumbs) thumbs.innerHTML = '';
     files.slice(0,4).forEach(f => {
       const reader = new FileReader();
       reader.onload = () => {
         const img = document.createElement('img'); img.src = reader.result; thumbs?.appendChild(img);
       };
       reader.readAsDataURL(f);
     });
   });
   // YouTube helpers
   const ytInput = document.getElementById('ytInput');
   const ytPreview = document.getElementById('ytPreview');
   function extractYouTubeId(input) {
     if (!input) return '';
     const m = String(input).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)?([A-Za-z0-9_-]{11})/);
     return m ? m[1] : '';
   }
   document.getElementById('ytPreviewBtn')?.addEventListener('click', () => {
     const id = extractYouTubeId(ytInput?.value?.trim());
     ytPreview.innerHTML = id ? `<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>` : '<div class="hint">ID/URL non valido</div>';
   });
   document.getElementById('ytInsertBtn')?.addEventListener('click', () => {
     const id = extractYouTubeId(ytInput?.value?.trim());
     if (!id) { info.textContent = 'YouTube ID non valido'; return; }
     const ta = document.getElementById('postContent');
     const embed = `\n<div class=\"article\">\n  <div class=\"video\">\n    <iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/${id}\" title=\"YouTube video\" frameborder=\"0\" allowfullscreen></iframe>\n  </div>\n</div>\n`;
     ta.value = (ta.value || '') + embed;
     if (typeof updateLivePreview === 'function') updateLivePreview();
     info.textContent = 'Embed YouTube inserito nel contenuto.';
   });
   // Content images upload and insert
   const contentFile = document.getElementById('contentFile');
  const contentThumbs = document.getElementById('contentThumbs');
  document.getElementById('contentUploadBtn')?.addEventListener('click', async () => {
    const files = Array.from(contentFile?.files || []);
    if (!files.length) { info.textContent = 'Seleziona una o più immagini'; return; }
    const ta = document.getElementById('postContent');
    const urls = [];
    for (const f of files) {
      if (storage) {
        try {
          const ref = storage.ref().child(`content/${Date.now()}_${f.name}`);
          await ref.put(f);
          const url = await ref.getDownloadURL();
          urls.push(url);
        } catch (e) { info.textContent = 'Upload immagine fallito per ' + f.name; }
      } else {
        const reader = new FileReader();
        const url = await new Promise(res => { reader.onload = () => res(reader.result); reader.readAsDataURL(f); });
        urls.push(url);
      }
    }
    // Insert into content usando placeholder
    for (const u of urls) {
      const placeholder = `[immagine${imageCounter}]`;
      imageRegistry.set(placeholder, {
        type: 'single',
        url: u,
        alt: `Immagine ${imageCounter}`
      });
      
      ta.value += `\n${placeholder}\n`;
      imageCounter++;
      
      const img = document.createElement('img');
      img.src = u; contentThumbs?.appendChild(img);
    }
    info.textContent = 'Immagini inserite nel contenuto.';
    
    // Trigger auto-preview after content upload
    if (typeof autoPreviewAfterUpload === 'function') {
      autoPreviewAfterUpload();
    }
  });

  // Auth logic
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

  // Local password unlock (enabled for development domains)
  const isDevelopment = ['localhost','127.0.0.1','l457.com'].includes(location.hostname);
  const expected = isDevelopment ? (window.LOCAL_ADMIN?.password) : null;
  // Show local unlock controls on development domains
  const pwdEl = document.getElementById('adminPwd');
  const unlockEl = document.getElementById('adminPwdUnlock');
  if (!isDevelopment) {
    pwdEl?.setAttribute('disabled', 'true');
    unlockEl?.setAttribute('disabled', 'true');
    if (pwdEl) pwdEl.style.display = 'none';
    if (unlockEl) unlockEl.style.display = 'none';
  }
  document.getElementById('adminPwdUnlock')?.addEventListener('click', () => {
    if (!isDevelopment) { info.textContent = 'Local unlock is disabled on production. Please use Google Sign in.'; return; }
    const provided = (pwdInput?.value || '').trim();
    if (!expected) { info.textContent = 'Local password not configured.'; return; }
    if (provided === expected) { info.textContent = 'Local admin unlocked. You can publish.'; form.style.display = ''; }
    else { info.textContent = 'Wrong password.'; }
  });

  // Load existing post for editing with metadata preservation
  function loadExistingPost(postId) {
    try {
      // Prova a caricare da localStorage per test locali
      const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '{}');
      const post = savedPosts[postId];
      
      if (post) {
        // Preserva tutti i metadati esistenti
        document.getElementById('postTitle').value = post.title || '';
        // Slug generato automaticamente dal titolo
        document.getElementById('postCategory').value = post.category || '';
        document.getElementById('postExcerpt').value = post.excerpt || '';
        document.getElementById('postContent').value = post.content || '';
        document.getElementById('postCover').value = post.coverUrl || '';
        
        // Aggiorna preview
        updateLivePreview();
        refreshCard();
        
        // Mostra anteprima cover se presente
        if (post.coverUrl) {
          const coverPreview = document.getElementById('coverPreview');
          if (coverPreview) {
            coverPreview.src = post.coverUrl;
            coverPreview.style.display = 'block';
          }
        }
        
        // Preserva metadati aggiuntivi (data creazione, autore, etc.)
        if (post.metadata) {
          window.currentPostMetadata = { ...post.metadata };
        }
        
        console.log('Post caricato con metadati preservati:', postId);
        return post;
      }
    } catch (error) {
      console.error('Errore nel caricamento del post:', error);
    }
    
    console.log('Post non trovato:', postId);
    return null;
  }
  
  // Generate slug from title
  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Save post with metadata preservation
  function savePostWithMetadata() {
    // Get form values with proper trimming
    const title = (document.getElementById('postTitle').value || '').trim();
    const category = document.getElementById('postCategory').value || 'tech';
    const excerpt = (document.getElementById('postExcerpt').value || '').trim();
    const content = (document.getElementById('postContent').value || '').trim();
    const coverUrl = (document.getElementById('postCover').value || '').trim();
    
    // Validation object to track errors
    const validation = {
      errors: [],
      isValid: true
    };
    
    // Required field validation
    if (!title) {
      validation.errors.push('Title is required');
      validation.isValid = false;
    } else if (title.length < 3) {
      validation.errors.push('Title must be at least 3 characters long');
      validation.isValid = false;
    } else if (title.length > 100) {
      validation.errors.push('Title must be less than 100 characters');
      validation.isValid = false;
    }
    
    if (!content) {
      validation.errors.push('Content is required');
      validation.isValid = false;
    } else if (content.length < 10) {
      validation.errors.push('Content must be at least 10 characters long');
      validation.isValid = false;
    }
    
    if (!excerpt) {
      validation.errors.push('Excerpt is required');
      validation.isValid = false;
    } else if (excerpt.length < 10) {
      validation.errors.push('Excerpt must be at least 10 characters long');
      validation.isValid = false;
    } else if (excerpt.length > 200) {
      validation.errors.push('Excerpt must be less than 200 characters');
      validation.isValid = false;
    }
    
    // URL validation for cover image
    if (coverUrl && !isValidUrl(coverUrl)) {
      validation.errors.push('Cover URL must be a valid URL');
      validation.isValid = false;
    }
    
    // Generate slug and validate uniqueness
    const slug = generateSlug(title);
    if (!slug) {
      validation.errors.push('Unable to generate valid slug from title');
      validation.isValid = false;
    }
    
    const postData = {
      title: title,
      slug: slug,
      category: category,
      excerpt: excerpt,
      content: content,
      coverUrl: coverUrl,
      validation: validation,
      
      // Preserva metadati esistenti e aggiunge nuovi
      metadata: {
        ...(window.currentPostMetadata || {}),
        lastModified: new Date().toISOString(),
        wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
        hasImages: /!\[.*?\]\(.*?\)/.test(content),
        hasVideos: /<iframe.*youtube.*<\/iframe>/.test(content),
        characterCount: content.length,
        estimatedReadTime: Math.max(1, Math.ceil(content.split(/\s+/).filter(word => word.length > 0).length / 200)) + ' min'
      }
    };
    
    // Se è un nuovo post, aggiungi metadati di creazione
    if (!window.currentPostMetadata) {
      postData.metadata.createdAt = new Date().toISOString();
      postData.metadata.author = localStorage.getItem('username') || 'Admin';
      postData.metadata.version = 1;
    } else {
      postData.metadata.version = (window.currentPostMetadata.version || 1) + 1;
    }
    
    return postData;
  }
  
  // Helper function to validate URLs
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Publish handler - moved inside bindAdminUI to ensure proper binding
  const publishBtn = document.getElementById('publishPost');
  if (publishBtn) {
    publishBtn.addEventListener('click', async () => {
      // Prevent multiple clicks during publishing
      if (publishBtn.disabled) return;
      
      const postData = savePostWithMetadata();
      const { slug, title, category, coverUrl, excerpt, content, metadata, validation } = postData;
      
      // Check validation results
      if (!validation.isValid) {
        const errorList = validation.errors.map(error => `• ${error}`).join('<br>');
        info.innerHTML = `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px; margin: 8px 0;"><strong>❌ Validation Failed:</strong><br>${errorList}</div>`;
        info.style.color = '#ef4444';
        
        // Add visual feedback to invalid fields
        const invalidFields = [];
        validation.errors.forEach(error => {
          let field = null;
          if (error.includes('Title')) {
            field = document.getElementById('postTitle');
          } else if (error.includes('Content')) {
            field = document.getElementById('postContent');
          } else if (error.includes('Excerpt')) {
            field = document.getElementById('postExcerpt');
          } else if (error.includes('Cover URL')) {
            field = document.getElementById('postCover');
          }
          
          if (field) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            invalidFields.push(field);
          }
        });
        
        // Focus on first invalid field and setup error clearing
        if (invalidFields.length > 0) {
          invalidFields[0].focus();
          
          // Clear error styling when user starts interacting
          invalidFields.forEach(field => {
            const clearErrorStyling = () => {
              field.style.borderColor = '';
              field.style.boxShadow = '';
              field.removeEventListener('input', clearErrorStyling);
              field.removeEventListener('focus', clearErrorStyling);
            };
            field.addEventListener('input', clearErrorStyling, { once: true });
            field.addEventListener('focus', clearErrorStyling, { once: true });
          });
        }
        
        return;
      }
      
      const featured = document.getElementById('postFeatured').checked;
      const readTime = document.getElementById('postReadTime').value.trim() || metadata.estimatedReadTime || '5 min';

      // Additional safety check (should not be needed with validation)
      if (!slug || !title) { 
        info.textContent = '❌ Critical error: Missing slug or title after validation';
        info.style.color = '#ef4444';
        return; 
      }
      
      // Show loading state
      const originalText = publishBtn.textContent;
      publishBtn.disabled = true;
      publishBtn.textContent = 'Publishing...';
      publishBtn.style.opacity = '0.7';
      info.textContent = 'Publishing your post...';
      info.style.color = '#3b82f6';
      
      const postObject = {
        title,
        content: content,
        category,
        cover: coverUrl,
        excerpt,
        featured,
        readTime,
      };

      try {
        // Ask for admin password (once per session)
        let adminPassword = sessionStorage.getItem('ADMIN_PASSWORD');
        if (!adminPassword) {
          adminPassword = window.prompt('Enter admin password to publish:');
          if (!adminPassword) {
            info.textContent = '❌ Publishing canceled: password is required';
            info.style.color = '#ef4444';
            publishBtn.disabled = false;
            publishBtn.textContent = originalText;
            publishBtn.style.opacity = '';
            return;
          }
          sessionStorage.setItem('ADMIN_PASSWORD', adminPassword);
        }
        const basicToken = btoa(`admin:${adminPassword}`);
        const response = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${basicToken}` },
          body: JSON.stringify(postObject),
        });

        const result = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }));

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem('ADMIN_PASSWORD');
          throw new Error(result.message || 'Unauthorized: invalid admin password');
        }

        if (response.ok && result.success) {
          publishBtn.textContent = '✓ Published!';
          publishBtn.style.background = 'linear-gradient(90deg, #10b981, #059669)';
          info.innerHTML = `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px; margin: 8px 0;"><strong>✅ Success!</strong><br>Your post has been published locally.</div>`;
          info.style.color = '#10b981';

          ['postTitle', 'postContent', 'postExcerpt', 'postCover'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
              field.style.borderColor = '';
              field.style.boxShadow = '';
            }
          });

        } else {
          throw new Error(result.message || 'Failed to publish post');
        }

      } catch (error) {
        console.error('Publishing error:', error);
        publishBtn.textContent = '❌ Failed';
        publishBtn.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        info.textContent = `❌ Publishing failed: ${error.message}`;
        info.style.color = '#ef4444';

      } finally {
        setTimeout(() => {
          publishBtn.textContent = originalText;
          publishBtn.style.background = '';
          publishBtn.style.opacity = '';
          publishBtn.disabled = false;
        }, 3000);
      }
    });
  }
   
   function saveToLocalStorage(slug, postObject) {
     try {
       const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '{}');
       savedPosts[slug] = postObject;
       localStorage.setItem('blog_posts', JSON.stringify(savedPosts));
       
       // Also update the global posts array for immediate display
       const existingIndex = posts.findIndex(p => p.slug === slug);
       if (existingIndex >= 0) {
         posts[existingIndex] = postObject;
       } else {
         posts.unshift(postObject);
       }
     } catch (e) {
       console.error('Error saving to localStorage:', e);
     }
   }

  const seedBtn = document.getElementById('seedFromLocal');
  if (seedBtn) {
    seedBtn.addEventListener('click', async () => {
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
  }

  const downloadBtn = document.getElementById('downloadPost');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const title = document.getElementById('postTitle').value.trim();
      const slug = generateSlug(title);
      const category = document.getElementById('postCategory').value;
      const cover = document.getElementById('postCover').value.trim();
      const excerpt = document.getElementById('postExcerpt').value.trim();
      const content = document.getElementById('postContent').value.trim();
      const featured = document.getElementById('postFeatured').checked;
      const readTime = document.getElementById('postReadTime').value.trim() || '5 min';
      if (!title) { info.textContent = 'Title is required'; return; }

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
    // Load posts from localStorage first
    const localPosts = loadPostsFromLocalStorage();
    
    // Try to fetch from Firebase
    const remote = await fetchPostsFromFirestore();
    
    // Combine local and remote posts, avoiding duplicates
    const allPosts = [];
    const slugSet = new Set();
    
    // Add Firebase posts first (they have priority)
    if (remote && remote.length) {
      remote.forEach(post => {
        if (!slugSet.has(post.slug)) {
          allPosts.push(post);
          slugSet.add(post.slug);
        }
      });
    }
    
    // Add local posts that aren't already in Firebase
    localPosts.forEach(post => {
      if (!slugSet.has(post.slug)) {
        allPosts.push(post);
        slugSet.add(post.slug);
      }
    });
    
    // Update posts array if we have any content
    if (allPosts.length > 0) {
      posts.splice(0, posts.length, ...allPosts);
      renderFeatured();
      renderPosts();
    }
  } catch {}
}

function loadPostsFromLocalStorage() {
  try {
    const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '{}');
    return Object.values(savedPosts).sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    return [];
  }
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

// 📁 LOCAL UPLOAD SOLUTION - Download posts without Firebase!
function downloadPostAsHTML(slug) {
  const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '{}');
  const post = savedPosts[slug];
  
  if (!post) {
    alert('Post not found!');
    return;
  }
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    .post-header { margin-bottom: 30px; }
    .post-title { font-size: 2.5em; margin-bottom: 10px; }
    .post-meta { color: #666; margin-bottom: 20px; }
    .post-content { font-size: 1.1em; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <article>
    <header class="post-header">
      <h1 class="post-title">${post.title}</h1>
      <div class="post-meta">
        <span>📅 ${post.date}</span>
        <span>⏱️ ${post.readTime}</span>
        <span>🏷️ ${post.category}</span>
      </div>
      ${post.cover ? `<img src="${post.cover}" alt="${post.title}" style="width: 100%; border-radius: 8px; margin: 20px 0;">` : ''}
    </header>
    <div class="post-content">
      ${post.contentHtml || post.content}
    </div>
  </article>
</body>
</html>`;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAllPosts() {
  const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '{}');
  const posts = Object.values(savedPosts);
  
  if (posts.length === 0) {
    alert('No posts found! Create some posts first.');
    return;
  }
  
  // Download each post as HTML with delay
  posts.forEach((post, index) => {
    setTimeout(() => downloadPostAsHTML(post.slug), index * 200);
  });
  
  alert(`Downloading ${posts.length} posts! Check your Downloads folder.`);
}

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

// Add download buttons to admin panel
function addDownloadButtons() {
  const adminActions = document.querySelector('.admin-actions');
  if (!adminActions || document.getElementById('downloadSection')) return;
  
  const downloadSection = document.createElement('div');
  downloadSection.id = 'downloadSection';
  downloadSection.innerHTML = `
    <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px;">
      <h4 style="margin: 0 0 10px 0; color: #0369a1;">📁 Download Posts (No Firebase needed!)</h4>
      <button id="downloadAllBtn" class="btn-secondary" style="margin: 5px; background: #0ea5e9; color: white;">📦 Download All Posts</button>
      <button id="downloadCurrentBtn" class="btn-secondary" style="margin: 5px;">📄 Download Current Post</button>
      <p style="font-size: 0.9em; color: #0369a1; margin: 10px 0 0 0;">💡 Your posts are saved locally and can be downloaded as HTML files!</p>
    </div>
  `;
  
  adminActions.appendChild(downloadSection);
  
  // Add event listeners
  document.getElementById('downloadAllBtn')?.addEventListener('click', downloadAllPosts);
  document.getElementById('downloadCurrentBtn')?.addEventListener('click', () => {
    const title = document.getElementById('postTitle')?.value;
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      downloadPostAsHTML(slug);
    } else {
      alert('Please enter a post title first!');
    }
  });
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
   
   // Add download buttons when admin panel opens
   const adminToggle = document.getElementById('adminToggle');
   if (adminToggle) {
     adminToggle.addEventListener('click', () => {
       setTimeout(addDownloadButtons, 300);
     });
   }
 };

// re-run
init();