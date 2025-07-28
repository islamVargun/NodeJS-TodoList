const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Veritabanı bağlantısını hemen yap
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlantısı başarılı!"))
  .catch((error) => {
    console.error("MongoDB bağlantı hatası:", error.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Full-Stack Todo App API çalışıyor!");
});

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
