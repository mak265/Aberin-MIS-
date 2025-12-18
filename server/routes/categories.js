const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// GET all categories
router.get('/', auth, async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a category
router.post('/', auth, roles('admin', 'warehouse_staff'), async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a category
router.delete('/:id', auth, roles('admin', 'warehouse_staff'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        const hasItems = await Item.exists({ category: category._id });
        if (hasItems) return res.status(400).json({ message: 'Category has assigned items' });
        await category.deleteOne();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
