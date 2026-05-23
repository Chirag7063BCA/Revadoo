const mongoose = require("mongoose");

const referralSettingsSchema = new mongoose.Schema(
  {
    baseReward:      { type: Number,  default: 50       },
    payoutMethod:    { type: String,  default: "wallet" },
    autoPayout:      { type: Boolean, default: true     },
    milestone1Refs:  { type: Number,  default: 1        },
    milestone1Bonus: { type: Number,  default: 50       },
    milestone2Refs:  { type: Number,  default: 5        },
    milestone2Bonus: { type: Number,  default: 300      },
    milestone3Refs:  { type: Number,  default: 15       },
    milestone3Bonus: { type: Number,  default: 1000     },
    milestone4Refs:  { type: Number,  default: 50       },
    milestone4Bonus: { type: Number,  default: 5000     },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReferralSettings", referralSettingsSchema);