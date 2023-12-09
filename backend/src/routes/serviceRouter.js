const router = require("express").Router();
const upload = require("../config/multer");
const serviceController = require("../controllers/serviceController");

// Rutas del controlador de servicios
router.route("/services").post(upload.single("file"), (req, res) => serviceController.create(req, res));
router.route("/services").get((req, res) => serviceController.getAll(req, res));
router.route("/services/:id/comments").post((req, res) => serviceController.addComment(req, res));
router.route("/services/:id/comments").get((req, res) => serviceController.getComments(req, res));
router.route("/services/:id/like").post((req, res) => serviceController.addLike(req, res));
router.route("/services/:id/likes").get((req, res) => serviceController.getLikes(req, res));

router.route("/services/:id").get((req, res) => serviceController.get(req, res));
router.route("/services/:id").delete((req, res) => serviceController.delete(req, res));
router.route("/services/:id").put(upload.single("file"), (req, res) => serviceController.update(req, res));

module.exports = router;
