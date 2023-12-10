const router  = require("express").Router();

// api routes
const serviceRouter = require("./serviceRouter");
router.use("/", serviceRouter);


const userRouter = require('./userRoutes');

// Rutas de usuario
router.use('/', userRouter);



// Exportando el enrutador para su uso en otras partes de la aplicación
module.exports = router;
