export interface ISMS {
  to: string;
  body: string;
  status?: "pending" | "sent" | "failed";
  sid?: string;
  error?: string;
}

export interface ISMSProgressAlert {
  studentId: string;
  messageType: "progress" | "warning" | "critical";
  customMessage?: string; // Add the optional custom message
}

// Optional: You might want to add this for more type safety
export type SMSMessageType = "progress" | "warning" | "critical";