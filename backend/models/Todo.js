// File: backend/models/Todo.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  task: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
