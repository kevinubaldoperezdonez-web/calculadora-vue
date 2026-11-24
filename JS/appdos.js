const http=require('http');

const servidor = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

res.end(`
    <html>
    <head>
        <title> Horario escolar</title>
        <style>
           body {
           font-family:Arial;
           Text-align:center;
           background: #e8f5e9
           }
        h1{color: green;}
        p{font-size: 20px;}
        </style>
        </head>
        <body>
          <h1>Mi horario escolar</h1>
          <p>8:00 - 9:40 Implementa app web</p>
          <p>10:10- 12:00 construye app web</p>
          <p>12:00- 1:00 matematicas</p>
          <p>1:00 - 2:00 Ingles</p>
        </body>
        </html>
       `);

});
servidor.listen(3001, () => { console.log('Servidor activo en http://localhost:3001'); });
