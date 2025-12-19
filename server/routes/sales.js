const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Sale = require('../models/Sale');
const Item = require('../models/Item');
const crypto = require('crypto');

function toCSV(rows, headers) {
  const h = headers.join(',');
  const b = rows.map(r => headers.map(k => (r[k] ?? '')).join(',')).join('\n');
  return `${h}\n${b}`;
}

// Create a new sale
router.post('/', auth, async (req, res) => {
  const session = await Item.startSession();
  session.startTransaction();
  try {
    const { 
      items, 
      transactionDiscountType = null, 
      transactionDiscountValue = 0,
      paymentMethod,
      amountPaid
    } = req.body;
    if (!Array.isArray(items) || items.length === 0) throw new Error('No items in sale');
    if (!paymentMethod) throw new Error('Payment method is required');
    if (typeof amountPaid !== 'number') throw new Error('Amount paid is required');
    
    const txId = `POS-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0,14)}-${crypto.randomBytes(2).toString('hex')}`;
    
    // Validate stock and update inventory
    let subtotal = 0;
    const saleItems = [];
    for (const saleItem of items) {      
      const item = await Item.findById(saleItem.item).session(session);
      if (!item) {
        throw new Error(`Item ${saleItem.name} not found`);
      }
      if (item.quantity < saleItem.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
      item.quantity -= saleItem.quantity;
      await item.save({ session });
      
      const base = Number(saleItem.price) * Number(saleItem.quantity);
      const iType = saleItem.discountType || null;
      const iVal = Number(saleItem.discountValue || 0);
      let lineDiscount = 0;
      if (iType === 'percent') {
        lineDiscount = Math.max(0, Math.min(base, base * (iVal / 100)));
      } else if (iType === 'fixed') {
        lineDiscount = Math.max(0, Math.min(base, iVal));
      }
      const lineTotal = base - lineDiscount;
      subtotal += lineTotal;
      saleItems.push({
        item: item._id,
        quantity: saleItem.quantity,
        price: saleItem.price,
        name: saleItem.name,
        discountType: iType,
        discountValue: iVal,
        lineTotal
      });
    }

    let txDiscount = 0;
    if (transactionDiscountType === 'percent') {
      txDiscount = Math.max(0, Math.min(subtotal, subtotal * (Number(transactionDiscountValue) / 100)));
    } else if (transactionDiscountType === 'fixed') {
      txDiscount = Math.max(0, Math.min(subtotal, Number(transactionDiscountValue)));
    }
    const totalAmount = subtotal - txDiscount;
    if (totalAmount < 0) throw new Error('Total amount cannot be negative');

    let change = 0;
    if (paymentMethod === 'cash') {
      if (amountPaid < totalAmount) throw new Error('Insufficient cash payment');
      change = Number((amountPaid - totalAmount).toFixed(2));
    } else {
      if (amountPaid < totalAmount) throw new Error('Non-cash payment less than total amount');
    }

    const newSale = new Sale({
      transactionId: txId,
      user: req.user.id,
      items: saleItems,
      transactionDiscountType,
      transactionDiscountValue: Number(transactionDiscountValue || 0),
      totalAmount,
      amountPaid: Number(amountPaid),
      paymentMethod,
      change
    });

    const sale = await newSale.save({ session });
    await session.commitTransaction();
    res.json(sale);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

// Get all sales (for history/dashboard)
router.get('/', auth, async (req, res) => {
  try {
    const query = {};
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      if (req.query.startDate) query.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.date.$lte = new Date(req.query.endDate);
    }
    if (req.query.paymentMethod && req.query.paymentMethod !== 'undefined' && req.query.paymentMethod !== '') {
      query.paymentMethod = req.query.paymentMethod;
    }

    const sales = await Sale.find(query).sort({ date: -1 }).populate('user', 'email');

    if (req.query.format === 'csv') {
      const rows = sales.map(s => ({
        transactionId: s.transactionId,
        date: s.date.toISOString(),
        items: s.items.map(i => `${i.name} x${i.quantity} @${i.price} (${i.discountType || 'none'}:${i.discountValue}) = ${i.lineTotal}`).join('; '),
        subTotal: s.items.reduce((acc, i) => acc + i.lineTotal, 0),
        txDiscountType: s.transactionDiscountType || 'none',
        txDiscountValue: s.transactionDiscountValue || 0,
        totalAmount: s.totalAmount,
        amountPaid: s.amountPaid,
        change: s.change,
        paymentMethod: s.paymentMethod,
        cashier: s.user ? s.user.email : ''
      }));
      const csv = toCSV(rows, ['transactionId','date','items','subTotal','txDiscountType','txDiscountValue','totalAmount','amountPaid','change','paymentMethod','cashier']);
      res.header('Content-Type', 'text/csv');
      return res.send(csv);
    }

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get sales stats for dashboard
router.get('/stats', auth, async (req, res) => {
    try {
        const { days } = req.query;
        let matchStage = {};

        if (days && days !== 'all') {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(days));
            startDate.setHours(0, 0, 0, 0); // Start of that day
            matchStage = { date: { $gte: startDate } };
        }

        const stats = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalSales: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
