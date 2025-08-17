import cors from "cors";
import express, { Application, Request, Response } from "express";
 import { AssignRoutes } from "./app/Assign/assign.route";
import { resultRouter } from "./app/Result/result.route";
import { SMSRoute } from "./app/SMS/sms.route";
import { UserRoutes } from "./app/User/user.route";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://school-management-frontend-five.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", UserRoutes);
app.use("/api", AssignRoutes);
app.use("/api", resultRouter);
app.use("/api", SMSRoute);

app.get("/", (req: Request, res: Response) => {
  res.send(`School Management API Running Here !!!`);
});

export default app;
