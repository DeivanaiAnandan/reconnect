import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { connectDB } from "./config/db.js";
import regionRoutes from "./routes/regionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";

import cors from "cors";
import assistanceRequestRoutes from "./routes/assistanceRequestRoutes.js";

dotenv.config();
// console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();

const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

app.use(express.json());

app.use("/api/regions", regionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/assistance-requests", assistanceRequestRoutes);
// app.get("/", (req, res) => {
//   res.send("Reconnect is running");
// });
app.get("/test", (req, res) => {
  res.json({ message: "ReConnect server is running" });
});
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode and in port ${PORT}`,
  );
});
