const Task = require("../models/task-model");

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, startDate, endDate } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const task = new Task({
      title,
      description,
      priority,
      startDate,
      endDate,
      userId: req.user._id,
    });

    await task.save();
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, startDate, endDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description, status, priority, startDate, endDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
