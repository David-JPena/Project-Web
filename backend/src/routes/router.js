const router  = require("express").Router();

// api routes
const serviceRouter = require("./serviceRouter");

const userRouter = require('./userRoutes');

// Rutas de usuario
router.use('/', userRouter);

router.use("/service", serviceRouter);

// Exportando el enrutador para su uso en otras partes de la aplicación
module.exports = router;
