const express = require("express");
const path = require("path");
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(express.json());

// REST API produk
app.use("/products", productRoutes);

// Frontend pink pastel
app.use(express.static(path.join(__dirname, "../public")));

// Halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Penanganan endpoint tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan"
  });
});

module.exports = app;
