const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const User = require('../models/User'); // Import User model

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
    
    // Active Deliveries (out_for_delivery)
    const activeDeliveries = await Order.countDocuments({ status: 'out_for_delivery' });

    // Total Users
    const totalUsers = await User.countDocuments();
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

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

    // Top Projects (Suki) - Aggregated by Value and Quantity
    const topProjects = await Transaction.aggregate([
      { $match: { type: 'out', project: { $exists: true } } },
      // Lookup Item to get price (using current price as approximation)
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'itemData'
        }
      },
      { $unwind: '$itemData' },
      {
        $group: {
          _id: '$project',
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$quantity', '$itemData.price'] } },
          txn_count: { $sum: 1 }
        }
      },
      { $sort: { totalValue: -1 } }, // Default sort by value (Suki)
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
          totalValue: 1,
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
      activeDeliveries,
      totalUsers,
      userStats,
      categoryStats,
      topProjects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
