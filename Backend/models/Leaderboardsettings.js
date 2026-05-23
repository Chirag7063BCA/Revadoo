// LOCATION: Backend/models/LeaderboardSettings.js
const mongoose = require("mongoose");

const leaderboardSettingsSchema = new mongoose.Schema(
  {
    singletonKey    : { type: String, default: "main", unique: true },
    autoResetDaily  : { type: Boolean, default: true  },
    autoResetWeekly : { type: Boolean, default: true  },
    autoResetMonthly: { type: Boolean, default: true  },
    dailyReward     : { type: Number,  default: 10    },
    weeklyReward    : { type: Number,  default: 50    },
    monthlyReward   : { type: Number,  default: 200   },
    lastDailyReset  : { type: Date,    default: null  },
    lastWeeklyReset : { type: Date,    default: null  },
    lastMonthlyReset: { type: Date,    default: null  },
    manualLeaderId  : { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaderboardSettings", leaderboardSettingsSchema);