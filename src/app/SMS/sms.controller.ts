import { Request, Response } from "express";
import { ISMS, ISMSProgressAlert } from "./sms.interface";
import { SMSService } from "./sms.service";

export const SMSController = {
  async sendSMS(req: Request, res: Response) {
    const result = await SMSService.sendSMS(req.body);
    res.status(200).json(result);
  },

  async sendProgressAlert(req: Request, res: Response) {
    const result = await SMSService.sendProgressAlert(req.body);
    res.status(200).json(result);
  },

  async getHistory(req: Request, res: Response) {
    const history = await SMSService.getSMSHistory();
    res.status(200).json(history);
  },
};
 