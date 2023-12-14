// Importando la biblioteca mongoose para interactuar con MongoDB
const mongoose = require('mongoose');

// Definiendo un esquema de usuario utilizando mongoose.Schema
const userSchema = new mongoose.Schema({
    // Campo 'email' de tipo String para almacenar la dirección de correo electrónico del usuario
<<<<<<< HEAD
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
        // Puedes agregar más opciones según tus necesidades
    },
    image: {
        type: String // Suponiendo que almacenarás la URL de la imagen
    },
    description: {
        type: String
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Referencia a otros usuarios que sigue
=======
    email: String,
    
    // Campo 'password' de tipo String para almacenar la contraseña del usuario
    password: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Referencia a otros usuarios que sigue
    createdRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
>>>>>>> 74c2318ddfb3b458afc2983956df0d8eeacc74c6
}, {
    // Opciones adicionales del esquema: activa la marca de tiempo (timestamps) para los campos 'createdAt' y 'updatedAt'
    timestamps: true
});

// Creando un modelo de mongoose llamado 'User' basado en el esquema 'userSchema'
const User = mongoose.model('User', userSchema);

// Exportando el modelo 'User' para que esté disponible en otras partes de la aplicación
module.exports = User;
