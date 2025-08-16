import { Schema, model } from 'mongoose';
import { ISMS } from './sms.interface';

const SMSSchema = new Schema<ISMS>({
  to: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  sid: String,
  error: String
}, { timestamps: true });

export const SMSModel = model<ISMS>('SMS', SMSSchema);