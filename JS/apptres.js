const http = require('http');

const servidor = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    if (req.method === 'POST') {
        let datos = '';
        req.on('data', parte => datos += parte);
        req.on('end', () => {
            const formulario = new URLSearchParams(datos);
            const alumno = formulario.get('nombre') || 'alumno'; 
            
            res.end(`
                <h1>Hola, ${alumno}</h1>
                <p>Tu formulario fue recibido</p>
                <a href="/">Regresar</a>
                 <a href="/">Regresar</a>
            `);
        });
    } else {
        res.end(`
            <h1>Registro de alumnos</h1>
            <form method="POST">
                <label>Escribe tu nombre:</label>
                <input name="nombre" required>
                <button type="submit">Enviar</button>
            </form> 
        `);
    }
});

servidor.listen(3002, () => {
    console.log('Servidor activo en http://localhost:3002');
});
