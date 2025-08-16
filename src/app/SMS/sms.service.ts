import twilio from 'twilio';
import { ISMS, ISMSProgressAlert } from './sms.interface';
import { SMSModel } from './sms.model';
import { StudentModel } from '../User/user.model';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const SMSService = {
  async sendSMS(payload: ISMS): Promise<ISMS> {
    try {
      // Validate and format phone number
      const formattedTo = this.formatPhoneNumber(payload.to);
      
      // For trial accounts, we should verify the number first
      if (process.env.TWILIO_ACCOUNT_TYPE === 'trial') {
        return this.handleTrialAccountSMS(payload, formattedTo);
      }

      const result = await client.messages.create({
        body: payload.body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedTo
      });

      return await this.saveSMSRecord({
        ...payload,
        to: formattedTo,
        status: 'sent',
        sid: result.sid
      });
    } catch (error: any) {
      return await this.saveSMSRecord({
        ...payload,
        status: 'failed',
        error: error.message
      });
    }
  },

  async handleTrialAccountSMS(payload: ISMS, formattedTo: string): Promise<ISMS> {
    // In trial mode, we'll log instead of actually sending
    console.log(`[TRIAL MODE] Would send SMS to ${formattedTo}: ${payload.body}`);
    
    return await this.saveSMSRecord({
      ...payload,
      to: formattedTo,
      status: 'sent',
      sid: 'trial-mode-simulation'
    });
  },

  async saveSMSRecord(payload: ISMS): Promise<ISMS> {
    const smsRecord = await SMSModel.create(payload);
    return smsRecord.toObject();
  },

  async sendProgressAlert(payload: ISMSProgressAlert): Promise<ISMS> {
    try {
      const student = await StudentModel.findById(payload.studentId).exec();
      if (!student) throw new Error('Student not found');
      if (!student.guardian?.primaryContact) {
        throw new Error('Guardian contact number not available');
      }

      const formattedNumber = this.formatPhoneNumber(student.guardian.primaryContact);

      const defaultMessages = {
        progress: `${student.name}'s progress report is now available.`,
        warning: `Warning: ${student.name}'s performance needs improvement.`,
        critical: `URGENT: ${student.name} is at risk of failing. Contact school immediately.`
      };

      const messageBody = payload.customMessage || defaultMessages[payload.messageType];

      return await this.sendSMS({
        to: formattedNumber,
        body: messageBody
      });
    } catch (error: any) {
      throw new Error(`Failed to send progress alert: ${error.message}`);
    }
  },

  async getSMSHistory(): Promise<ISMS[]> {
    try {
      return await SMSModel.find().sort({ createdAt: -1 }).lean();
    } catch (error: any) {
      throw new Error(`Failed to fetch SMS history: ${error.message}`);
    }
  },

  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');

    // Remove leading 0 if present
    const withoutLeadingZero = digitsOnly.startsWith('0') 
      ? digitsOnly.substring(1) 
      : digitsOnly;

    // Check if already has +880 prefix
    if (withoutLeadingZero.startsWith('880')) {
      return `+${withoutLeadingZero}`;
    }

    // Validate length (10 digits for Bangladesh)
    if (withoutLeadingZero.length !== 10) {
      throw new Error(`Invalid phone number length. Expected 10 digits, got ${withoutLeadingZero.length}`);
    }

    // Check if it's a valid Bangladeshi operator number
    const validPrefixes = ['13', '14', '15', '16', '17', '18', '19'];
    const prefix = withoutLeadingZero.substring(0, 2);
    if (!validPrefixes.includes(prefix)) {
      throw new Error(`Invalid Bangladeshi mobile operator prefix: ${prefix}`);
    }

    return `+880${withoutLeadingZero}`;
  },
  
};