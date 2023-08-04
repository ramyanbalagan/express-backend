const mongoose = require('mongoose')
const Task = require('../models/TasksModel')

exports.post_task = async (req, res) => {
    try {
      const authenticatedUser = req.user;
  
      const newTask = new Task({
        user: authenticatedUser._id,
        name: req.body.name,
        description: req.body.description,
        updatedAt: new Date().toLocaleDateString('en-GB'),
        status: req.body.status,
      });
  
      await newTask.save();
      res.status(200).json({
        status: 'success',
        results: newTask,
      });
    } catch (error) {
      return res.status(400).json({
        status: 'failed',
        error: error.message,
      });
    }
  };
  
  exports.get_task = async (req, res) => {
    try {
      const authenticatedUser = req.user;
  
      const tasks = await Task.find({ user: authenticatedUser._id });
      if (!tasks) {
        return res.status(404).json({
          status: 'failed',
          errors: 'No data found',
        });
      }
  
      res.status(200).json({
        status: 'success',
        results: tasks,
      });
    } catch (error) {
      return res.status(400).json({
        status: 'failed',
        errors: error.message,
      });
    }
  };

  exports.put_task = async (req, res) => {
    try {
      const { _id } = req.params;
      let validId = mongoose.isObjectIdOrHexString(_id);
      if (!validId) {
        return res.status(400).json({
          status: 'failed',
          errors: 'Invalid ID',
        });
      }
  
      // Find the task and check if it belongs to the authenticated user
      const task = await Task.findById(_id);
      if (!task) {
        return res.status(404).json({
          status: 'failed',
          errors: 'Task not found',
        });
      }
  
      const updatedData = {
        updatedAt: req.body.updatedAt,
        status: req.body.status,
      };
  
      await Task.findByIdAndUpdate(_id, updatedData);
      res.status(200).json({
        status: 'success',
        results: 'Updated Task',
      });
    } catch (error) {
      return res.status(404).json({
        status: 'failed',
        errors: error.message,
      });
    }
  };
  

exports.delete_task = async (req, res) => {
  try {
    const { _id } = req.params;
    let validId = mongoose.isObjectIdOrHexString(_id);
    if (!validId) {
      return res.status(400).json({
        status: 'failed',
        errors: 'Invalid ID',
      });
    }

    // Find the task and check if it belongs to the authenticated user
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).json({
        status: 'failed',
        errors: 'Task not found',
      });
    }
    await Task.findByIdAndDelete(_id);
    res.status(200).json({
      status: 'success',
      message: 'Deleted Task',
    });
  } catch (error) {
    return res.status(404).json({
      status: 'failed',
      errors: error.message,
    });
  }
};
