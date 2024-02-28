import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const {
  DB_URI = "mongodb+srv://Student:BfuREnsJF9CYT589@cluster0.awdzfcn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  PORT = 3000,
} = process.env;

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
      console.log(`Database connection successful.`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
