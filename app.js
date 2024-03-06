import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";

dotenv.config();
const app = express();

const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/db-contacts?retryWrites=true&w=majority`;


mongoose
  .connect(uri)
  .then(() => {
    console.log(`Database connection successful.`);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

const publicDirectoryPath = path.join(path.resolve(), "public");
app.use(express.static(publicDirectoryPath));

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port ${PORT}`);
});
