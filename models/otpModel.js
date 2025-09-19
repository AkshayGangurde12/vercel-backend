
import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Document expires after 10 minutes (in seconds)
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  }
});

export default mongoose.model('OTP', OTPSchema);