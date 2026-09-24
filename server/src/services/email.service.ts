
import { config } from '../config/env';

export const emailService = {
  async sendPasswordResetEmail(toEmail: string, _resetToken: string) {
    // In production, integrate SendGrid/AWS SES/Resend here using CLIENT_ORIGIN config.
    // For development/mocking, never log raw tokens, token hashes, or reset URLs containing tokens.
    if (config.nodeEnv !== 'test') {
      console.log('=============================================');
      console.log(`[EmailService] Password reset email generated for development.`);
      console.log(`[EmailService] Recipient: ${toEmail}`);
      console.log(`[EmailService] Reset link intentionally omitted from logs.`);
      console.log('=============================================');
    }
    
    return true;
  }
};
