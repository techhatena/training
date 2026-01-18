const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const formController = require("../controllers/form.controller");

router.post("/", auth, formController.createForm);
router.get("/", auth, formController.getForms);
router.get("/:id", auth, formController.getFormsDetail);
router.put("/:id", auth, formController.updateForm);
router.delete("/:id", auth, formController.deleteForm);

module.exports = router;
