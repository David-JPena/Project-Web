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
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Obtén el usuario completo utilizando el ID extraído del token
        const user = await User.findById(req.userId);

        // Respondiendo con la información del usuario en formato JSON
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
    }
});

// Ruta para obtener el perfil de un usuario por su ID
router.get('/profile/:userId', verifyToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ user: userDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener detalles del perfil' });
    }
});

router.post('/follow/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;

        const userToFollow = await User.findById(userId);

        if (!userToFollow) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const currentUser = await User.findById(req.userId);

        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ error: 'Ya estás siguiendo a este usuario' });
        }

        // Actualizar la lista de seguidos en la base de datos
        currentUser.following.push(userToFollow._id);
        await currentUser.save();

        res.status(200).json({ message: 'Usuario seguido con éxito', user: currentUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al seguir al usuario' });
    }
});

// Ruta para dejar de seguir a un usuario
router.post('/unfollow/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;

        const userToUnfollow = await User.findById(userId);

        if (!userToUnfollow) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const currentUser = await User.findById(req.userId);

        if (!currentUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ error: 'No estás siguiendo a este usuario' });
        }

        // Actualizar la lista de seguidos en la base de datos
        currentUser.following = currentUser.following.filter(followedUser => followedUser.toString() !== userToUnfollow._id.toString());
        await currentUser.save();

        res.status(200).json({ message: 'Dejaste de seguir a este usuario', user: currentUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al dejar de seguir al usuario' });
    }
});

router.get('/followers', verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId);

        // Obtén la lista de todos los usuarios que no son el usuario actual ni aquellos a los que ya sigue
        const usersToFollow = await User.find({
            _id: { $ne: req.userId, $nin: currentUser.following }
        }).select('email');

        // Marcar cuáles de estos usuarios están siendo seguidos por el usuario actual
        const usersWithFollowingStatus = usersToFollow.map(user => ({
            ...user.toObject(),
            isFollowing: currentUser.following.includes(user._id)
        }));

        res.status(200).json({ users: usersWithFollowingStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios para seguir' });
    }
});

// Ruta para obtener todos los usuarios (públicos)
router.get('/all-users', verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId);

        // Obtén la lista de todos los usuarios excluyendo al usuario actual y aquellos a los que ya sigue
        const usersToDisplay = await User.find({
            _id: { $ne: req.userId, $nin: currentUser.following }
        }).select('email');

        // Obtén la lista de usuarios que el usuario actual sigue y agrégales al final
        const usersAlreadyFollowing = await User.find({
            _id: { $in: currentUser.following }
        }).select('email');

        // Combina ambas listas para mostrar primero los usuarios que puede seguir y al final los que ya sigue
        const allUsers = usersToDisplay.concat(usersAlreadyFollowing);

        res.status(200).json({ users: allUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todos los usuarios' });
    }
});

// Ruta para obtener los usuarios seguidos por el usuario actual
router.get('/following', verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId);

        // Obtén la lista de usuarios que el usuario actual sigue
        const followingUsers = await User.find({
            _id: { $in: currentUser.following }
        }).select('email');

        res.status(200).json({ users: followingUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios seguidos' });
    }
});

// Exportando el enrutador para su uso en otras partes de la aplicación
module.exports = router;
