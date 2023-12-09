// Importando la biblioteca express y configurando un enrutador (router)
const express = require('express');
const router = express.Router();

// Importando el modelo de usuario (userModel), la biblioteca jsonwebtoken (jwt) y el middleware verifyToken
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

// Ruta inicial que devuelve un mensaje de 'Hello World'
router.get('/', (req, res) => res.send('Hello World'));

// Ruta para registrar un nuevo usuario (signup)
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Creando un nuevo usuario con la información proporcionada en la solicitud
        const newUser = new User({
            email,
            password
        });

        // Guardando el nuevo usuario en la base de datos
        await newUser.save();

        // Creando un token JWT para el nuevo usuario
        const token = jwt.sign({ _id: newUser._id }, 'secretkey');

        // Respondiendo con el token en formato JSON
        res.status(200).json({ token });
    } catch (error) {
        // Manejando errores y respondiendo con un código de estado 500 en caso de error
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Ruta para iniciar sesión (signin)
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscando un usuario en la base de datos con el correo electrónico proporcionado
        const user = await User.findOne({ email });

        // Verificando si el usuario no existe o la contraseña es incorrecta
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
        }

        // Creando un token JWT para el usuario autenticado
        const token = jwt.sign({ _id: user._id }, 'secretkey');

        // Respondiendo con el token en formato JSON
        res.status(200).json({ token });
    } catch (error) {
        // Manejando errores y respondiendo con un código de estado 500 en caso de error
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para obtener datos de tareas (públicas)
router.get('/tasks', (req, res) => {
    // Respondiendo con un array de tareas en formato JSON
    res.json({
        _id: 1,
        name: 'Task one',
        description: 'lorem ipsum',
        date: "2023-12-01T22:35:34.211Z"
    });
});

// Ruta para obtener datos de una tarea (privada) que requiere un token válido (usando el middleware verifyToken)
router.get('/private', verifyToken, (req, res) => {
    // Respondiendo con datos de una tarea en formato JSON para rutas privadas
    res.json({
        _id: 2,
        name: 'Task two',
        description: 'lorem ipsum',
        date: "2023-12-01T22:35:34.211Z"
    });
});

// Ruta para obtener el ID de usuario a partir del token (usando el middleware verifyToken)
router.get('/profile', verifyToken, (req, res) => {
    // Respondiendo con el ID de usuario extraído del token
    res.send(req.userId);
});

router.post('/follow/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;

        // Verifica si el usuario a seguir existe
        const userToFollow = await User.findById(userId);

        if (!userToFollow) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Añade el usuario a seguir a la lista de seguidos
        const currentUser = await User.findById(req.userId);
        currentUser.following.push(userToFollow._id);
        await currentUser.save();

        res.status(200).json({ message: 'Usuario seguido con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al seguir al usuario' });
    }
});

router.get('/followers', verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId).populate('following', 'email');
        res.status(200).json({ followers: currentUser.following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener seguidores' });
    }
});

// Exportando el enrutador para su uso en otras partes de la aplicación
module.exports = router;
