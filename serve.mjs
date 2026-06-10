import http from 'http';
import fs from 'fs';
import path from 'path';
const dir = '/tmp/kage-v2-2/dist';
const mime = {
  '.js':'application/javascript','.css':'text/css','.png':'image/png',
  '.jpg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml',
  '.ico':'image/x-icon','.html':'text/html','.json':'application/json'
};
const srv = http.createServer((req, res) => {
  let f = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  try {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (!stat.isFile()) throw new Error();
    const ext = path.extname(p);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(p));
  } catch {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(path.join(dir, 'index.html')));
  }
});
srv.listen(3000, '0.0.0.0', () => console.log('READY'));
