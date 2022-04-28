// Se importan las librerias
const express = require('express');
const app = express();
const expressFileUpload = require('express-fileupload');
//const bodyParser = require('body-parser');
const fs = require('fs')
const PORT = 3000;
// Servidor a la escucha en el puerto 3000
app.listen(PORT, () => console.log(`Server ON, PORT ${PORT}`))

// Middleware y objeto de configuración
app.use(expressFileUpload({
    limits: { fileSize: 5000000 }, // Se establece un peso maximo por archivo de 5MB 
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo que deseas subir intensa subir, supera el limite permitido',
}));

// Middleware body-parser para la manipulación del payload
// Su función es formatear automáticamente el JSON que recibimos en una consulta a
// un objeto manipulable y disponibilizar una propiedad “body” dentro del objeto request.
/*
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Carpeta pública
app.use(express.static("public"));

// Ruta raíz
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/formulario.html')
})

// Ruta POST "/imagen" que recibe y almacena una imagen en la carpeta pública del servidor
app.post('/imagen', (req, res) => {
    console.log(req.body)
    const { target_file } = req.files;
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
        res.redirect('/collage');
    });
});

// Ruta GET "/collage"
app.get("/collage", (req, res) => {
    res.sendFile(__dirname + '/collage.html')

})

// Ruta GET "/deleteImg/:nombre" que recibe como parametro el nombre de la imagen y la elimine
app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        res.redirect("/collage")
    });
});

// Rutas no declaradas
app.get('*', (req, res) => {
    res.send(`<br><center><h1>Pagina no encontrada 404</h1></center>`)
})

