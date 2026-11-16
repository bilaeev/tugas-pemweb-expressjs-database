const products = [
  { id: 1, name: "Pulpen", price: 5000 },
  { id: 2, name: "Buku Tulis", price: 12000 },
  { id: 3, name: "Spidol", price: 8000 },
  { id: 4, name: "Penggaris", price: 6000 },
  { id: 5, name: "Penghapus", price: 3000 }
];

let nextId = 6;

exports.getAll = (req, res) => {
  res.json({ success: true, data: products });
};

exports.getById = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }
  res.json({ success: true, data: product });
};

exports.create = (req, res) => {
  const { name, price } = req.body;
  const product = { id: nextId++, name: name.trim(), price };
  products.push(product);
  res.status(201).json({ success: true, data: product });
};

exports.update = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  product.name = req.body.name.trim();
  product.price = req.body.price;
  res.json({ success: true, data: product });
};

exports.remove = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  const deleted = products.splice(index, 1)[0];
  res.json({ success: true, message: "Produk dihapus", data: deleted });
};
