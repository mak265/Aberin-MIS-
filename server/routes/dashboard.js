const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

router.get('/', auth, async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    // Include price for value calculation, populate category for charts
    const items = await Item.find({}, { name: 1, quantity: 1, minStock: 1, price: 1, category: 1 }).populate('category', 'name');
    
    const lowStockItems = items.filter(i => i.quantity <= (i.minStock || 0));
    
    const latestIn = await Transaction.find({ type: 'in' }).sort({ date: -1 }).limit(10).populate('item');
    const latestOut = await Transaction.find({ type: 'out' }).sort({ date: -1 }).limit(10).populate('item project');

    // Pending Orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Category Distribution
    const categoryStats = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$categoryInfo.name', 0] },
          count: 1,
          totalValue: 1
        }
      }
    ]);

    // Top Projects (Most Stock Out by Quantity)
    const topProjects = await Transaction.aggregate([
      { $match: { type: 'out', project: { $exists: true } } },
      {
        $group: {
          _id: '$project',
          totalQuantity: { $sum: '$quantity' },
          txn_count: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$projectInfo.name', 0] },
          totalQuantity: 1,
          txn_count: 1
        }
      }
    ]);

    res.json({
      totalItems,
      items,
      lowStockItems,
      latestIn,
      latestOut,
      pendingOrders,
      categoryStats,
      topProjects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
