// 🚀 LOCAL UPLOAD SOLUTION - No Firebase/API needed!
// This creates a simple file download system for your posts

// Add this to your existing script.js or run in console

// 1. DOWNLOAD SINGLE POST AS HTML FILE
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

// 2. DOWNLOAD ALL POSTS AS ZIP-READY FOLDER
function downloadAllPosts() {
  const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '{}');
  const posts = Object.values(savedPosts);
  
  if (posts.length === 0) {
    alert('No posts found in localStorage!');
    return;
  }
  
  // Create index.json for the posts
  const index = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    date: post.date,
    readTime: post.readTime,
    excerpt: post.excerpt,
    cover: post.cover,
    featured: post.featured
  }));
  
  // Download index.json
  const indexBlob = new Blob([JSON.stringify(index, null, 2)], { type: 'application/json' });
  const indexUrl = URL.createObjectURL(indexBlob);
  const indexLink = document.createElement('a');
  indexLink.href = indexUrl;
  indexLink.download = 'posts-index.json';
  indexLink.click();
  URL.revokeObjectURL(indexUrl);
  
  // Download each post as HTML
  posts.forEach(post => {
    setTimeout(() => downloadPostAsHTML(post.slug), 100);
  });
  
  alert(`Downloaded ${posts.length} posts! Check your Downloads folder.`);
}

// 3. EXPORT POSTS AS MARKDOWN
function downloadPostAsMarkdown(slug) {
  const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '{}');
  const post = savedPosts[slug];
  
  if (!post) {
    alert('Post not found!');
    return;
  }
  
  const markdownContent = `# ${post.title}

**Date:** ${post.date}  
**Category:** ${post.category}  
**Read Time:** ${post.readTime}  
**Featured:** ${post.featured ? 'Yes' : 'No'}  

${post.cover ? `![${post.title}](${post.cover})\n\n` : ''}## Excerpt

${post.excerpt}

## Content

${post.contentHtml ? post.contentHtml.replace(/<[^>]*>/g, '') : post.content}
`;
  
  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// 4. ADD DOWNLOAD BUTTONS TO ADMIN PANEL
function addDownloadButtons() {
  const adminActions = document.querySelector('.admin-actions');
  if (!adminActions) return;
  
  // Create download section
  const downloadSection = document.createElement('div');
  downloadSection.innerHTML = `
    <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
      <h4>📁 Download Posts (No Firebase needed!)</h4>
      <button id="downloadAllBtn" class="btn-secondary" style="margin: 5px;">Download All Posts</button>
      <button id="downloadCurrentBtn" class="btn-secondary" style="margin: 5px;">Download Current Post</button>
      <button id="downloadMarkdownBtn" class="btn-secondary" style="margin: 5px;">Download as Markdown</button>
      <p style="font-size: 0.9em; color: #666; margin-top: 10px;">💡 Posts are saved locally and can be downloaded as HTML files!</p>
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
  document.getElementById('downloadMarkdownBtn')?.addEventListener('click', () => {
    const title = document.getElementById('postTitle')?.value;
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      downloadPostAsMarkdown(slug);
    } else {
      alert('Please enter a post title first!');
    }
  });
}

// 5. AUTO-INITIALIZE WHEN ADMIN PANEL OPENS
const originalAdminToggle = document.getElementById('adminToggle')?.onclick;
if (originalAdminToggle) {
  document.getElementById('adminToggle').onclick = function() {
    originalAdminToggle.call(this);
    setTimeout(addDownloadButtons, 500);
  };
}

// 6. CONSOLE COMMANDS FOR QUICK ACCESS
console.log('🚀 LOCAL UPLOAD SOLUTION LOADED!');
console.log('Commands available:');
console.log('- downloadAllPosts() - Download all your posts');
console.log('- downloadPostAsHTML("post-slug") - Download specific post');
console.log('- downloadPostAsMarkdown("post-slug") - Download as markdown');
console.log('');
console.log('💡 Your posts are already saved locally! No Firebase needed.');

// Make functions globally available
window.downloadAllPosts = downloadAllPosts;
window.downloadPostAsHTML = downloadPostAsHTML;
window.downloadPostAsMarkdown = downloadPostAsMarkdown;