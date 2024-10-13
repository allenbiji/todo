const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all todos for a user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      user: req.user.id
    });

    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // Make sure user owns todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // Make sure user owns todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Todo.findByIdAndRemove(req.params.id);

    res.json({ message: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;