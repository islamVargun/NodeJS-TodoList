const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// DÜZELTME: dotenv.config() en başa taşındı.
dotenv.config();

const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB bağlantısı başarılı!");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error.message);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("Full-Stack Todo App API çalışıyor!");
});

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
  });
});
