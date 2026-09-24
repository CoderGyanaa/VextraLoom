
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { RefreshToken } from '../models/RefreshToken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth';
import { AppError } from '../utils/AppError';

export const authService = {
  async register(data: any, ip: string) {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email is already registered', 400, 'DUPLICATE_EMAIL');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash,
      role: 'student',
      status: 'active' // auto-active for now
    });

    await Profile.create({
      user: user._id,
      basic: { name }
    });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    const decodedRefresh: any = verifyRefreshToken(refreshToken);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expires: new Date(decodedRefresh.exp * 1000),
      createdByIp: ip
    });

    const safeUser = { id: user._id, email: user.email, role: user.role, status: user.status, name };
    return { user: safeUser, accessToken, refreshToken };
  },

  async login(data: any, ip: string) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended') {
      throw new AppError('Account is suspended', 403, 'FORBIDDEN');
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    const decodedRefresh: any = verifyRefreshToken(refreshToken);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expires: new Date(decodedRefresh.exp * 1000),
      createdByIp: ip
    });

    const profile = await Profile.findOne({ user: user._id });
    const safeUser = { id: user._id, email: user.email, role: user.role, status: user.status, name: profile?.basic?.name };
    
    return { user: safeUser, accessToken, refreshToken };
  },

  async refresh(token: string, ip: string) {
    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    
    if (!refreshToken) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    if (!refreshToken.isActive) {
      // SECURITY: REUSE DETECTED! A previously used/revoked token was presented.
      // Revoke ALL active tokens for this user immediately (token family compromise).
      await RefreshToken.updateMany({ user: refreshToken.user._id, revoked: { $exists: false } }, { $set: { revoked: new Date(), revokedByIp: 'REUSE_DETECTION_SYSTEM' } });
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    try {
      const decoded: any = verifyRefreshToken(token);
      const user: any = refreshToken.user;
      
      if (user.status === 'suspended') {
        throw new AppError('Account is suspended', 403, 'FORBIDDEN');
      }

      // Revoke old token
      refreshToken.revoked = new Date();
      refreshToken.revokedByIp = ip;
      
      const newAccessToken = generateAccessToken(user._id, user.role);
      const newRefreshTokenStr = generateRefreshToken(user._id);
      const decodedNewRefresh: any = verifyRefreshToken(newRefreshTokenStr);
      
      refreshToken.replacedByToken = newRefreshTokenStr;
      await refreshToken.save();

      await RefreshToken.create({
        user: user._id,
        token: newRefreshTokenStr,
        expires: new Date(decodedNewRefresh.exp * 1000),
        createdByIp: ip
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshTokenStr };
    } catch (error) {
      // Token is invalid/expired cryptographically
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
    }
  },

  async logout(token: string, ip: string) {
    const refreshToken = await RefreshToken.findOne({ token });
    if (refreshToken) {
      refreshToken.revoked = new Date();
      refreshToken.revokedByIp = ip;
      await refreshToken.save();
    }
    return true;
  }
};
