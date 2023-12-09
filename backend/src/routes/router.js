const router  = require("express").Router();

// api routes
const servicesRouter = require("./serviceRouter");

router.use("/",servicesRouter);

// Exportando el enrutador para su uso en otras partes de la aplicación
module.exports = router;
