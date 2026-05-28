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
      default: '',
    },
    prizePool: {
      type: Number,
      required: [true, 'Prize pool amount is required'],
      min: [1, 'Prize pool must be greater than 0'],
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
    maxTicketsPerUser: {
      type: Number,
      default: 3,
      min: [1, 'Max tickets per user must be at least 1'],
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
      trim: true,
    },
    preGeneratedTicketNumbers: {
      type: [String],
      default: [],
    },
    winningNumber: {
      type: String,
      default: null,
      trim: true,
    },
    winningAmount: {
      type: Number,
      default: 0,
    },
    isAutoWinner: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

LotterySchema.index({ status: 1 });
LotterySchema.index({ drawEndAt: 1 });
LotterySchema.index({ publishAt: 1 });

module.exports = mongoose.model('Lottery', LotterySchema);