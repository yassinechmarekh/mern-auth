import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectToDB from "./config/db";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

connectToDB();

mongoose.connection.once("open", () => {
  console.log("Database connected successfully.");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
