const express = require("express");
const router = express.Router();
const taskController = require("../controllers/controller");

router.post("/add", taskController.createTask);
router.get("/hien-thi", taskController.getAllTasks);
router.get("/get/:id", taskController.getTaskById);
router.put("/update/:id", taskController.updateTask);
router.delete("/delete/:id", taskController.deleteTask);

module.exports = router;
