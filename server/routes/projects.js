const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// GET all projects
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single project
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a project
router.post('/', auth, roles('admin'), async (req, res) => {
    const project = new Project({
        name: req.body.name,
        location: req.body.location,
        coordinates: req.body.coordinates, // { lat, lng }
        manager: req.body.manager,
        status: req.body.status
    });

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a project
router.put('/:id', auth, roles('admin'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (req.body.name) project.name = req.body.name;
        if (req.body.location) project.location = req.body.location;
        if (req.body.manager) project.manager = req.body.manager;
        if (req.body.status) project.status = req.body.status;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a project
router.delete('/:id', auth, roles('admin'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        await project.deleteOne();
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
