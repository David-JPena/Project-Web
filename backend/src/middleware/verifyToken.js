// Importando la biblioteca jsonwebtoken para manejar tokens JWT
const jwt = require('jsonwebtoken');

// Función middleware para verificar el token en las solicitudes
function verifyToken(req, res, next) {
    // Verifica si la solicitud no incluye la cabecera 'authorization'
    if (!req.headers.authorization) {
        // Si no hay cabecera 'authorization', devuelve una respuesta de no autorizado (401)
        return res.status(401).send('Solicitud no autorizada');
    }

    // Obtiene el token de la cabecera 'authorization' y lo divide para obtener solo el token (sin 'Bearer ')
    const token = req.headers.authorization.split(' ')[1];

    // Verifica si el token es 'null'
    if (token === 'null') {
        // Si el token es 'null', devuelve una respuesta de no autorizado (401)
        return res.status(401).send('Solicitud no autorizada');
    }

    // Verifica el token utilizando la clave secreta 'secretkey' y obtiene el payload
    const payload = jwt.verify(token, 'secretkey');

    // Agrega el ID de usuario (extraído del payload) al objeto de solicitud (req) para su uso posterior
    req.userId = payload._id;

    // Llama a la función next() para pasar al siguiente middleware o ruta en la cadena de middleware
    next();
}

// Exporta la función verifyToken para que esté disponible para su uso en otras partes de la aplicación
module.exports = verifyToken;
