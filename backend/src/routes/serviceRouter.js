const router = require("express").Router();
const upload = require("../config/multer");
const serviceController = require("../controllers/serviceController");
const verifyToken = require('../middleware/verifyToken');

// Rutas del controlador de servicios

router.route("/services").post(verifyToken, upload.single("file"), (req, res) => serviceController.create(req, res));
router.route("/services/all").get((req, res) => serviceController.getAll(req, res));
router.route("/services").get(verifyToken, (req, res) => serviceController.getUserServices(req, res));
router.route("/services/search").get(verifyToken,(req, res) => serviceController.searchByName(req, res));
router.route("/services/searchByCategory").get(verifyToken,(req, res) => serviceController.searchByCategory(req, res));
router.route("/services/:id/comments").post(verifyToken,(req, res) => serviceController.addComment(req, res));
router.route("/services/:id/comments").get((req, res) => serviceController.getComments(req, res));
router.route("/services/:id/like").post(verifyToken,(req, res) => serviceController.addLike(req, res));
router.route("/services/:id/likes").get(verifyToken,(req, res) => serviceController.getLikes(req, res));
router.route("/services/:id").get((req, res) => serviceController.get(req, res));
router.route("/services/:id").delete(verifyToken,(req, res) => serviceController.delete(req, res));
router.route("/services/:id").put(verifyToken,upload.single("file"), (req, res) => serviceController.update(req, res));

module.exports = router;
