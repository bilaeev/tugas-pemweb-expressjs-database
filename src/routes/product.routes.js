const router = require("express").Router();
const controller = require("../controllers/product.controller");
const validate = require("../middleware/validateProduct");

const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID tidak valid" });
  }
  next();
};

router.get("/", controller.getAll);
router.get("/:id", validateId, controller.getById);
router.post("/", validate, controller.create);
router.put("/:id", validateId, validate, controller.update);
router.delete("/:id", validateId, controller.remove);

module.exports = router;
