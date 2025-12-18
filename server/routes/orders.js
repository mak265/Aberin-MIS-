const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const logActivity = require('../utils/logger');

// GET all orders (Admin/Staff) or My Orders (User)
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        const { view } = req.query;

        console.log(`GET /orders - User: ${req.user.email} (${req.user.role}), View: ${view}`);

        // If 'view=mine' is requested, or if user is NOT admin/staff, only show own orders
        if (view === 'mine' || !['admin', 'warehouse_staff'].includes(req.user.role)) {
            query.user = req.user.id;
        }

        console.log('Query:', query);

        const orders = await Order.find(query)
            .populate('user', 'email')
            .populate('items.item')
            .sort({ createdAt: -1 });
        
        console.log(`Found ${orders.length} orders`);
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'email')
            .populate('items.item');
        
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Access control
        if (req.user.role !== 'admin' && req.user.role !== 'warehouse_staff' && order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE Order
router.post('/', auth, async (req, res) => {
    try {
        const { items, type, deliveryAddress, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Validate stock and calculate total
        for (let i of items) {
            const item = await Item.findById(i.item);
            if (!item) return res.status(404).json({ message: `Item not found: ${i.item}` });
            
            if (item.quantity < i.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}. Available: ${item.quantity}` });
            }

            // Deduct stock immediately (Reserve)
            item.quantity -= i.quantity;
            await item.save();

            orderItems.push({
                item: item._id,
                quantity: i.quantity,
                priceAtOrder: item.price
            });
            totalAmount += (item.price || 0) * i.quantity;
        }

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            type,
            deliveryAddress: type === 'delivery' ? deliveryAddress : undefined,
            totalAmount,
            notes,
            status: 'pending'
        });

        const newOrder = await order.save();
        await logActivity(req.user.id, 'order_created', `Created order ${newOrder._id} (${type})`);
        
        res.status(201).json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE Order Status (Admin/Staff only)
router.put('/:id/status', auth, roles('admin', 'warehouse_staff'), async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const oldStatus = order.status;
        
        // Handle Cancellation (Restock items)
        if (status === 'cancelled' && oldStatus !== 'cancelled') {
            for (let i of order.items) {
                const item = await Item.findById(i.item);
                if (item) {
                    item.quantity += i.quantity;
                    await item.save();
                }
            }
        }

        order.status = status;
        order.updatedAt = Date.now();
        await order.save();

        await logActivity(req.user.id, 'order_update', `Updated order ${order._id} status to ${status}`);
        
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
