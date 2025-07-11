const express = require('express');
const router = express.Router();

const Category = require('../models/Category');
const Tag = require('../models/Tag');

// Helper function to get model by metaType
const getModel = (metaType) => {
  if (metaType === 'categories') return Category;
  if (metaType === 'tags') return Tag;
  return null;
};

// GET all
router.get('/:metaType', async (req, res) => {
  const { metaType } = req.params;
  const Model = getModel(metaType);
  if (!Model) return res.status(400).json({ error: 'Invalid metaType' });

  try {
    const items = await Model.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/:metaType', async (req, res) => {
  const { metaType } = req.params;
  const { name } = req.body;

  const Model = getModel(metaType);
  if (!Model || !name) return res.status(400).json({ error: 'Invalid request' });

  try {
    const exists = await Model.findOne({ name });
    if (exists) return res.status(400).json({ error: `${metaType.slice(0, -1)} already exists` });

    const newItem = new Model({ name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:metaType/:id', async (req, res) => {
  const { metaType, id } = req.params;
  const { name } = req.body;

  const Model = getModel(metaType);
  if (!Model || !name) return res.status(400).json({ error: 'Invalid request' });

  try {
    const updated = await Model.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:metaType/:id', async (req, res) => {
  const { metaType, id } = req.params;
  const Model = getModel(metaType);
  if (!Model) return res.status(400).json({ error: 'Invalid metaType' });

  try {
    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
