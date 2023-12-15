const multer = require("multer");

const path = require("path");
//Configurar el almacenamiento con multer.diskStorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    // Definicion  del nombre del archivo
    filename: function (req, file, cb) {
        // Concatenar la extensión del nombre de archivo original
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

module.exports = upload;
