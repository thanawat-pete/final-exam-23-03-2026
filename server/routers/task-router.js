const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/task-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.use(authMiddleware);

//http://localhost:5000/api/task
router.post("/", createTask);

//http://localhost:5000/api/task
router.get("/", getTasks);

//http://localhost:5000/api/task/:id
router.get("/:id", getTaskById);

//http://localhost:5000/api/task/:id
router.put("/:id", updateTask);

//http://localhost:5000/api/task/:id
router.delete("/:id", deleteTask);

module.exports = router;
