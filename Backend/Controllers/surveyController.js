const Survey = require('../models/Survey');
const User = require('../models/User'); 
const Transaction = require('../models/Transaction'); 

// 1. Get All Surveys (LIGHTNING FAST LOAD)
exports.getSurveys = async (req, res) => {
  try {
    // .lean() makes fetching 10x faster as it skips Mongoose formatting
    const surveys = await Survey.find({ expiresAt: { $gt: new Date() } })
                                .sort({ createdAt: -1 })
                                .lean(); 
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: "Error fetching surveys" });
  }
};

// 2. Add New Survey (INSTANT CREATE)
exports.addSurvey = async (req, res) => {
  try {
    const survey = await Survey.create(req.body); // Faster than new Survey() + save()
    res.status(201).json({ message: "Survey created!", survey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete Survey
exports.deleteSurvey = async (req, res) => {
  try {
    await Survey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Submit Survey (PARALLEL PROCESSING FOR ZERO-LAG)
exports.submitSurvey = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Fetch Survey and User at the SAME TIME (Cuts wait time in half)
    const [survey, user] = await Promise.all([
      Survey.findById(req.params.id).lean(),
      User.findById(userId || "65f1a2b3c4d5e6f7a8b9c0d1")
    ]);

    if (!survey) return res.status(404).json({ message: 'Survey not found' });

    const multipliers = [1, 1, 1, 1.2, 1.5, 2]; 
    const randomMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    
    const baseReward = survey.reward + 10; 
    const finalReward = Math.floor(baseReward * randomMultiplier); 
    const isJackpot = randomMultiplier >= 1.5;

    let newBalance = 0;

    if (user) {
      user.creds = (user.creds || 0) + finalReward;
      user.wallet = (user.wallet || 0) + finalReward;
      newBalance = user.creds;
      
      // Save User and Create Transaction at the SAME TIME
      await Promise.all([
        user.save(),
        Transaction.create({
          userId: user._id,
          type: "credit",
          amount: finalReward,
          description: `Survey Reward: ${survey.title} (x${randomMultiplier})`
        })
      ]);
    } else {
      // Dummy logic if no user found in DB but frontend sends request
      newBalance = finalReward;
    }

    res.json({ 
      message: 'Success', 
      earnedCoins: finalReward,
      baseReward: baseReward,
      multiplier: randomMultiplier,
      isJackpot: isJackpot,
      newBalance: newBalance // Real-time balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};