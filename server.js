const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '127.0.0.1';
const port = 5500;
const baseDir = __dirname;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function safeJoin(base, target) {
  const targetPath = path.posix.normalize(target.replace(/\\/g, '/'));
  return path.join(base, targetPath);
}

const server = http.createServer((req, res) => {
  // Handle API requests
  if (req.url === '/api/publish' && req.method === 'POST') {
    // Basic authentication check
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Admin Access"', 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Authentication required' }));
      return;
    }
    
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    if (username !== 'admin' || password !== process.env.ADMIN_PASSWORD) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
      return;
    }
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const post = JSON.parse(body);
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const postFilePath = safeJoin(baseDir, `posts/${slug}.html`);
        const indexFilePath = safeJoin(baseDir, 'posts/index.json');

        // Create post HTML file
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${post.title}</title>
</head>
<body>
  ${post.content}
</body>
</html>`;
        fs.writeFileSync(postFilePath, htmlContent);

        // Update index.json
        const index = JSON.parse(fs.readFileSync(indexFilePath, 'utf-8'));
        index.unshift({
          slug: slug,
          title: post.title,
          category: post.category,
          date: new Date().toISOString().split('T')[0],
          readTime: post.readTime,
          excerpt: post.excerpt,
          cover: post.cover,
          featured: post.featured
        });
        fs.writeFileSync(indexFilePath, JSON.stringify(index, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Post published successfully!' }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: error.message }));
      }
    });
    return;
  }


  let urlPath = req.url.split('?')[0];
  if (urlPath === '/' || urlPath === '' || urlPath.startsWith('/#')) {
    urlPath = '/index.html';
  }
  const filePath = safeJoin(baseDir, urlPath);

  fs.stat(filePath, (err, stat) => {
    if (err || !stat || !stat.isFile()) {
      // Fallback SPA to index.html
      const fallback = path.join(baseDir, 'index.html');
      fs.readFile(fallback, (e, data) => {
        if (e) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(data);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    fs.readFile(filePath, (e, data) => {
      if (e) { res.writeHead(500); res.end('Server error'); return; }
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
      res.end(data);
    });
  });
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});