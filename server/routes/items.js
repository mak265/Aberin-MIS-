const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const logActivity = require('../utils/logger');

router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find().populate('category').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, roles('admin', 'warehouse_staff'), async (req, res) => {
  try {
    if (req.body.category) {
      const cat = await Category.findById(req.body.category);
      if (!cat) return res.status(400).json({ message: 'Invalid category' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  const qtyNum = Number(req.body.quantity);
  const initialQty = Number.isFinite(qtyNum) && qtyNum >= 0 ? qtyNum : 0;
  const item = new Item({
    name: req.body.name,
    itemCode: req.body.itemCode || undefined,
    category: req.body.category,
    quantity: initialQty,
    unit: req.body.unit,
    price: req.body.price,
    description: req.body.description,
    minStock: req.body.minStock
  });
  try {
    const newItem = await item.save();
    await logActivity(req.user.id, 'create_item', `Created item ${newItem.name}`);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, roles('admin'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (req.body.name != null) item.name = req.body.name;
    if (req.body.itemCode !== undefined) item.itemCode = req.body.itemCode || undefined;
    if (req.body.category != null) {
      try {
        if (req.body.category) {
          const cat = await Category.findById(req.body.category);
          if (!cat) return res.status(400).json({ message: 'Invalid category' });
        }
        item.category = req.body.category;
      } catch (err) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }
    if (req.body.unit != null) item.unit = req.body.unit;
    if (req.body.price != null) item.price = req.body.price;
    if (req.body.description != null) item.description = req.body.description;
    if (req.body.minStock != null) item.minStock = req.body.minStock;
    const updatedItem = await item.save();
    await logActivity(req.user.id, 'update_item', `Updated item ${updatedItem.name}`);
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, roles('admin'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.deleteOne();
    await logActivity(req.user.id, 'delete_item', `Deleted item ${item.name}`);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
