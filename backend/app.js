const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const path = require('path');

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Ruta al directorio donde se almacenan las imágenes
const uploadsPath = path.join(__dirname, 'uploads');

// Configuración para servir archivos estáticos desde la ruta /uploads
app.use('/uploads', express.static(uploadsPath));

// Conexión a MongoDB
const connectDB = require('./src/config/db');
connectDB();

// Rutas de Usuario
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);

// Rutas de Servicios
const serviceRouter = require('./src/routes/serviceRouter');
app.use('/api/services', serviceRouter);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor en línea en el puerto ${PORT}`);
});

app.use((req, res, next) => {
    console.log('Request:', req.url);
    next();
});
