const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    name: {
        type: String,
        required: true
    },
    discountType: {
      type: String,
      enum: ['percent', 'fixed', null],
      default: null
    },
    discountValue: {
      type: Number,
      default: 0
    },
    lineTotal: {
      type: Number,
      required: true
    }
  }],
  transactionDiscountType: {
    type: String,
    enum: ['percent', 'fixed', null],
    default: null
  },
  transactionDiscountValue: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'gcash', 'bank_transfer', 'other'],
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sale', SaleSchema);
