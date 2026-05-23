const mongoose = require('mongoose');

const LotteryTicketSchema = new mongoose.Schema(
  {
    lotteryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lottery',
      required: [true, 'Lottery ID is required'],
    },
    ticketNumber: {
      type: String,
      required: [true, 'Ticket number is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userName: {
      type: String,
      default: null,
    },
    userEmail: {
      type: String,
      default: null,
    },
    purchasedAt: {
      type: Date,
      default: null,
    },
    purchasePrice: {
      type: Number,
      default: 0,
    },
    isWinner: {
      type: Boolean,
      default: false,
    },
    prizeAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'claimed'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique ticket per lottery
LotteryTicketSchema.index({ lotteryId: 1, ticketNumber: 1 }, { unique: true });
LotteryTicketSchema.index({ lotteryId: 1, status: 1 });
LotteryTicketSchema.index({ userId: 1 });

module.exports = mongoose.model('LotteryTicket', LotteryTicketSchema);
