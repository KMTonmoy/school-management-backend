import cors from "cors";
import express, { Application, Request, Response } from "express";
import { UserRoutes } from "./app/User/user.route";
import { AssignRoutes } from "./app/Assign/assign.route";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://school-management-frontend-five.vercel.app",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", UserRoutes);
app.use("/api", AssignRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send(`School ManagementStore Running Here !!!`);
});

export default app;
