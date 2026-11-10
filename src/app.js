const express = require("express");
const productRoutes = require("./routes/product.routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Produk ExpressJS", status: "OK" });
});

app.use("/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

module.exports = app;
