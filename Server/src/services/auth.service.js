const User = require('../models/User.model');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { sendOtpEmail } = require('./email.service');
const EmailVerification = require('../models/EmailVerification.model');

/**
 * Generate 6-digit OTP
 */
const generateOtp = () => {
    // return Math.floor(100000 + Math.random() * 900000).toString();
    return 111111;
    
};

/**
 * Request OTP for email (pre-registration)
 */
const requestOtp = async (email) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const otp = generateOtp();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  const existing = await EmailVerification.findOne({ email: normalizedEmail });
  if (existing) {
    existing.otp = otp;
    existing.otpExpires = otpExpires;
    existing.verified = false;
    await existing.save();
  } else {
    await EmailVerification.create({
      email: normalizedEmail,
      otp,
      otpExpires,
      verified: false,
    });
  }
  await sendOtpEmail(normalizedEmail, otp);
  return { message: 'OTP sent to email' };
};

/**
 * Register user (Step 1)
 */
const register = async (userData) => {
  const { username, email, password,avatarUrl, deviceToken, platform } = userData;
  const normalizedEmail = (email || '').trim().toLowerCase();

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
  if (userExists) {
      if (userExists.isVerified) {
          throw new Error('User already exists (email or username)');
      } else {
        
      }
  }

  // Ensure email verified
  const verification = await EmailVerification.findOne({ email: normalizedEmail });
  if (!verification || !verification.verified) {
    throw new Error('Email not verified');
  }

  const hashedPassword = await hashPassword(password);

  let user;
  if (userExists && !userExists.isVerified) {
      user = userExists;
      user.username = username;
      user.passwordHash = hashedPassword;
      user.avatarUrl=avatarUrl;
      user.deviceToken = deviceToken;
      user.platform = platform;
      user.isVerified = true;
      await user.save();
  } else {
      user = await User.create({
        username,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        avatarUrl: avatarUrl,
        deviceToken,
        platform,
        isVerified: true
      });
  }

  // Cleanup verification record
  await EmailVerification.deleteOne({ email: normalizedEmail });

  return {
    _id: user._id,
    email: user.email,
    message: 'Registration successful'
  };
};

/**
 * Verify OTP (Step 2)
 */
const verifyEmail = async (email, otp) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const record = await EmailVerification.findOne({ email: normalizedEmail });

    if (!record) {
        throw new Error('Verification record not found');
    }

    if (record.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    if (record.otpExpires < Date.now()) {
        throw new Error('OTP expired');
    }

    record.verified = true;
    await record.save();

    return {
        email: normalizedEmail,
        verified: true
    };
};

/**
 * Resend OTP
 */
const resendOtp = async (email) => {
    return requestOtp(email);
}

/**
 * Login user
 */
const login = async (email, password, deviceToken, platform) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && (await comparePassword(password, user.passwordHash))) {
    if (!user.isVerified) {
        throw new Error('Email not verified');
    }

    // Update device token and last login
    user.deviceToken = deviceToken || user.deviceToken;
    user.platform = platform || user.platform;
    user.lastLoginAt = Date.now();
    await user.save();

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

/**
 * Update Profile (Username/Avatar)
 */
const updateProfile = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (updateData.username) {
        // Check if username taken
        const existingUser = await User.findOne({ username: updateData.username });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new Error('Username already taken');
        }
        user.username = updateData.username;
    }

    if (updateData.avatarUrl) {
        user.avatarUrl = updateData.avatarUrl;
    }

    await user.save();
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl
    };
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendOtp,
  updateProfile,
  requestOtp
};
