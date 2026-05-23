// routes/auth.js
const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const User     = require('../models/User');
const Referral = require('../models/Referral');
const { protectRoute } = require('../middleware/authMiddleware');
const { sendEmail } = require('../utils/emailService');

// ── Helper: auto-generate referral code (e.g. "A1B2C3") ──
const generateReferralCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// ── Helper: sign JWT ───────────────────────────────────
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ════════════════════════════════════════════════════════
// @route   POST /api/auth/register
// @access  Public
// ════════════════════════════════════════════════════════
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirm, referral } = req.body;

    if (!username || !email || !password || !confirm) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: 'This email is already registered' });
    }
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'This username is already taken' });
    }

    let referredBy     = null;
    let referredByCode = null;
    if (referral && referral.trim()) {
      const referralCodeInput = referral.trim().toUpperCase();
      const referrer = await User.findOne({ referralCode: referralCodeInput });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
      referredBy     = referrer._id;
      referredByCode = referralCodeInput;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let referralCode = generateReferralCode();
    while (await User.findOne({ referralCode })) {
      referralCode = generateReferralCode();
    }

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      referralCode,
      referredBy,
      referredByCode,
    });
    await newUser.save();

    if (referredBy) {
      const BASE_REWARD = 50;
      const referralCount = await Referral.countDocuments({ referrer: referredBy });
      const newCount      = referralCount + 1;

      const MILESTONES = [
        { refs: 1,  bonus: 50   },
        { refs: 5,  bonus: 300  },
        { refs: 15, bonus: 1000 },
        { refs: 50, bonus: 5000 },
      ];
      const hitMilestone = MILESTONES.find((m) => m.refs === newCount);
      const bonusAmount  = hitMilestone ? hitMilestone.bonus : 0;
      const totalReward  = BASE_REWARD + bonusAmount;

      await Referral.create({
        referrer:     referredBy,
        referredUser: newUser._id,
        status:       'Active',
        earnings:     totalReward,
      });

      await User.findByIdAndUpdate(referredBy, {
        $inc: { creds: totalReward },
      });
    }

    const token = generateToken(newUser._id, newUser.email);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id:             newUser._id,
        username:       newUser.username,
        email:          newUser.email,
        creds:          newUser.creds,
        avatar:         newUser.avatar,
        referralCode:   newUser.referralCode,
        referredBy:     newUser.referredBy,
        referredByCode: newUser.referredByCode,
        createdAt:      newUser.createdAt,
      },
    });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   POST /api/auth/login
// @access  Public
// ════════════════════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id:        user._id,
        username:  user.username,
        email:     user.email,
        creds:     user.creds,
        avatar:    user.avatar,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   POST /api/auth/google
// @access  Public
// ════════════════════════════════════════════════════════
router.post('/google', async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const lowerCaseEmail = email.toLowerCase();
    let user = await User.findOne({ email: lowerCaseEmail });

    if (user) {
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }

      const token = generateToken(user._id, user.email);
      return res.status(200).json({
        message: 'Google login successful!',
        token,
        user: {
          id:        user._id,
          username:  user.username,
          email:     user.email,
          creds:     user.creds,
          avatar:    user.avatar,
          createdAt: user.createdAt,
        },
      });
    }

    // Create new user with 8-digit auto-generated password
    const generatedPassword = Math.floor(10000000 + Math.random() * 90000000).toString();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    let referralCode = generateReferralCode();
    while (await User.findOne({ referralCode })) {
      referralCode = generateReferralCode();
    }

    let username = name || lowerCaseEmail.split('@')[0];
    
    // Ensure username is unique if it happens to be taken (e.g., from email parsing)
    let usernameExists = await User.findOne({ username });
    if (usernameExists) {
      username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newUser = new User({
      username,
      email: lowerCaseEmail,
      password: hashedPassword,
      tempPassword: generatedPassword,
      referralCode,
      avatar: picture || null,
    });

    await newUser.save();

    const token = generateToken(newUser._id, newUser.email);

    return res.status(201).json({
      message: 'Google account created successfully!',
      token,
      generatedPassword, // Return so frontend can notify the user
      user: {
        id:             newUser._id,
        username:       newUser.username,
        email:          newUser.email,
        creds:          newUser.creds,
        avatar:         newUser.avatar,
        referralCode:   newUser.referralCode,
        createdAt:      newUser.createdAt,
      },
    });

  } catch (err) {
    console.error('Google Auth error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   GET /api/auth/me
// @access  Private
// ════════════════════════════════════════════════════════
router.get('/me', protectRoute, async (req, res) => {
  try {
    res.status(200).json({
      id:           req.user._id,
      username:     req.user.username,
      email:        req.user.email,
      creds:        req.user.creds,
      avatar:       req.user.avatar,
      referralCode: req.user.referralCode, // ✅ this is what ReferralLinkCard.jsx uses
      tempPassword: req.user.tempPassword,
      createdAt:    req.user.createdAt,
    });
  } catch (err) {
    console.error('Get me error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   POST /api/auth/generate-referral-code
// @access  Private
// ════════════════════════════════════════════════════════
router.post('/generate-referral-code', protectRoute, async (req, res) => {
  try {
    if (req.user.referralCode) {
      return res.json({ referralCode: req.user.referralCode });
    }

    let referralCode = generateReferralCode();
    while (await User.findOne({ referralCode })) {
      referralCode = generateReferralCode();
    }

    await User.findByIdAndUpdate(req.user._id, { referralCode });

    res.json({ message: 'Referral code generated!', referralCode });
  } catch (err) {
    console.error('Generate code error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   PUT /api/auth/update-creds
// @access  Private
// ════════════════════════════════════════════════════════
router.put('/update-creds', protectRoute, async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount === undefined || isNaN(amount)) {
      return res.status(400).json({ message: 'Amount is required and must be a number' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { creds: amount } },
      { new: true, select: '-password' }
    );

    res.status(200).json({
      message: `Creds updated! New balance: ${updatedUser.creds}`,
      creds:   updatedUser.creds,
    });

  } catch (err) {
    console.error('Update creds error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   PUT /api/auth/update-profile
// @access  Private
// ════════════════════════════════════════════════════════
router.put('/update-profile', protectRoute, async (req, res) => {
  try {
    const { username, email } = req.body;

    if (username) {
      const taken = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (taken) return res.status(400).json({ message: 'Username already taken' });
    }
    if (email) {
      const taken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } });
      if (taken) return res.status(400).json({ message: 'Email already in use' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...(username && { username }), ...(email && { email }) },
      { new: true, select: '-password' }
    );

    res.status(200).json({
      message: 'Profile updated!',
      user: {
        id:       updatedUser._id,
        username: updatedUser.username,
        email:    updatedUser.email,
        creds:    updatedUser.creds,
      },
    });

  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   PUT /api/auth/change-password
// @access  Private
// ════════════════════════════════════════════════════════
router.put('/change-password', protectRoute, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hashed });

    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   DELETE /api/auth/delete-account
// @desc    Archive user data then delete account
// @access  Private
// ════════════════════════════════════════════════════════
router.delete('/delete-account', protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Get reason from request body
    const { reason } = req.body;

    const DeletedUser = require('../models/DeletedUser');
    await DeletedUser.create({
      originalId:     user._id,
      username:       user.username,
      email:          user.email,
      referralCode:   user.referralCode,
      referredBy:     user.referredBy,
      referredByCode: user.referredByCode,
      creds:          user.creds,
      wallet:         user.wallet,
      createdAt:      user.createdAt,
      deletedAt:      new Date(),
      reason:         "User requested account deletion",

      // ✅ Save the actual reason they selected
      deletionReason: reason || "Not provided",
    });

    await User.findByIdAndDelete(req.user._id);

    console.log(`🗑️  Deleted: ${user.username} | Reason: ${reason || "Not provided"}`);

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('Delete account error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});


// verify passowrd for delete account or change password
router.post('/verify-password', protectRoute, async (req, res) => {
  try {
    const { password } = req.body;
 
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
 
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await bcrypt.compare(password, user.password);
 
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }
 
    res.json({ message: 'Password verified' });
  } catch (err) {
    console.error('Verify password error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════
// @route   POST /api/auth/forgot-password
// @access  Public
// ════════════════════════════════════════════════════════
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 15 mins
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expires;
    await user.save();

    // Send email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #FF6B00; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 24px;">REVADOO</h2>
        </div>
        <div style="padding: 30px; text-align: center;">
          <h3 style="color: #333; margin-top: 0;">Password Reset Request</h3>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Here is your Authorization Code:</p>
          <div style="margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #FF6B00; letter-spacing: 5px; background: #fff8f3; padding: 10px 20px; border-radius: 8px; border: 1px dashed #ffc299;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
          <p style="color: #aaa; font-size: 12px; margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'REVADOO - Your Password Reset Code',
      html: emailHtml
    });

    res.status(200).json({ message: 'OTP sent successfully to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error while sending email' });
  }
});

// ════════════════════════════════════════════════════════
// @route   POST /api/auth/verify-otp
// @access  Public
// ════════════════════════════════════════════════════════
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new one.' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// ════════════════════════════════════════════════════════
// @route   POST /api/auth/reset-password
// @access  Public
// ════════════════════════════════════════════════════════
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new one.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the new password & update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // Optionally also update the temp password so the user can see setting if they forget again it's not the auto generated one anymore.
    // Or just clear temp password
    user.tempPassword = null;
    
    // Clear OTP fields
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;