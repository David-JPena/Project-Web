// Importando la biblioteca mongoose para la interacción con MongoDB
const mongoose = require('mongoose');

// URI de conexión a MongoDB, que incluye el nombre de usuario, la contraseña y la información del clúster
const MONGODB_URI = 'mongodb+srv://Jordi:HynhJ8CvBlNStugn@cluster0.lmdhbvn.mongodb.net/';

// Función asíncrona para conectarse a MongoDB
const connectDB = async () => {
    try {
        // Intentando conectarse a MongoDB usando la biblioteca Mongoose
        const conn = await mongoose.connect(MONGODB_URI);

        // Si la conexión es exitosa, se registra el host al que se conectó
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        // Si ocurre un error durante el intento de conexión, se registra el error y se sale del proceso con el código 1
        console.error(error);
        process.exit(1);
    }
};

// Exportando la función connectDB para que esté disponible en otras partes de la aplicación
module.exports = connectDB;
