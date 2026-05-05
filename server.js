const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 8080;
const rootDir = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.wasm': 'application/wasm',
    '.ico': 'image/x-icon',
    '.bin': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(rootDir, req.url);
    if (filePath === path.join(rootDir, '/')) {
        filePath = path.join(rootDir, 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT'){
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            }
            else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});