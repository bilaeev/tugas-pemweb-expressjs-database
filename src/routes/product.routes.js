const router = require("express").Router();
const controller = require("../controllers/product.controller");
const validate = require("../middleware/validateProduct");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validate, controller.create);

module.exports = router;
