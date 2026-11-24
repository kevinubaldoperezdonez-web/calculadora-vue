const http = require('http');

const servidor = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

res.end(`
    <h1>Bienvenidos al CBTis</h1>
    <p>Mi primera página web con Node.js</p>
    <p>Estoy aprendiendo a programar</p>
`);


});

servidor.listen(3000, () => { console.log('Servidor activo en http://localhost:3000'); });
