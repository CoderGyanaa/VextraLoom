
import { config } from '../config/env';

export const emailService = {
  async sendPasswordResetEmail(toEmail: string, resetToken: string) {
    const clientOrigin = config.corsOrigin; // Or a dedicated CLIENT_ORIGIN var
    const resetUrl = `${clientOrigin}/reset-password?token=${resetToken}`;
    
    // In production, integrate SendGrid/AWS SES/Resend here.
    // For now, securely log that an email *would* be sent, without exposing the raw token in standard logs if possible,
    // though for development we will log it to allow manual testing.
    
    if (config.nodeEnv !== 'test') {
      console.log('=============================================');
      console.log(`MOCK EMAIL SENT TO: ${toEmail}`);
      console.log(`SUBJECT: Password Reset Request`);
      console.log(`RESET URL: ${resetUrl}`);
      console.log('=============================================');
    }
    
    return true;
  }
};
