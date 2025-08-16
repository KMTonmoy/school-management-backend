import { Router } from "express";
import { SMSController } from "./sms.controller";
import { ISMS, ISMSProgressAlert } from "./sms.interface";
import { validate } from "./validate.middleware";

const router = Router();

router.post(
  "/send",
  validate<ISMS>({
    to: {
      type: "string",
      required: true,
      pattern: /^\+[1-9]\d{1,14}$/,  
    },
    body: {
      type: "string",
      required: true,
      minLength: 5,
      maxLength: 160, 
    },
  }),
  SMSController.sendSMS
);

router.post(
  "/progress-alert",
  validate<ISMSProgressAlert>({
    studentId: {
      type: "string",
      required: true,
      pattern: /^[0-9a-fA-F]{24}$/, 
    },
    messageType: {
      type: "string",
      enum: ["progress", "warning", "critical"],
      required: true,
    },
  }),
  SMSController.sendProgressAlert
);

router.get("/history", SMSController.getHistory);

export const SMSRoute = router;
