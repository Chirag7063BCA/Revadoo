const mongoose = require('mongoose');

const LotterySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lottery name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    prizePool: {
      type: Number,
      required: [true, 'Prize pool amount is required'],
      min: [0, 'Prize pool cannot be negative'],
    },
    entryFee: {
      type: Number,
      required: [true, 'Entry fee is required'],
      min: [0, 'Entry fee cannot be negative'],
    },
    totalTickets: {
      type: Number,
      required: [true, 'Total tickets count is required'],
      min: [1, 'Must have at least 1 ticket'],
    },
    ticketsSold: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'announced', 'completed'],
      default: 'draft',
    },
    drawDateTime: {
      type: Date,
      default: null,
    },
    publishAt: {
      type: Date,
      default: Date.now,
    },
    drawEndAt: {
      type: Date,
      required: [true, 'Draw end date and time is required'],
    },
    winnerSelectionMode: {
      type: String,
      enum: ['auto', 'manual'],
      default: 'auto',
    },
    preselectedWinningNumber: {
      type: String,
      default: null,
    },
    preGeneratedTicketNumbers: {
      type: [String],
      default: [],
    },
    winningNumber: {
      type: String,
      default: null,
    },
    winningAmount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    isAutoWinner: {
      type: Boolean,
      default: false,
      description: 'True if winner was selected automatically',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
LotterySchema.index({ status: 1, drawDateTime: 1 });
LotterySchema.index({ createdBy: 1 });
LotterySchema.index({ publishAt: 1, drawEndAt: 1 });

module.exports = mongoose.model('Lottery', LotterySchema);
