const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./src/config/db');
//const userRoutes = require('./src/routes/userRoutes');
const cors = require('cors');


// Manejo de errores en connectDB
try {
    connectDB();
} catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
}

app.use(cors());
app.use(express.json());
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

const routes = require("./src/routes/router");
app.use("/api", routes);

// Rutas de usuario
//app.use('/api', userRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`);
});
