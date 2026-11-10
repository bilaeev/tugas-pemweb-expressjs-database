let products = [
  { id: 1, name: "Buku", price: 12000 },
  { id: 2, name: "Pulpen", price: 5000 }
];

exports.getAll = (req, res) => {
  res.json({ success: true, data: products });
};

exports.getById = (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  res.json({ success: true, data: product });
};

exports.create = (req, res) => {
  const { name, price } = req.body;

  const id = products.length
    ? Math.max(...products.map(p => p.id)) + 1
    : 1;

  const product = {
    id,
    name: name.trim(),
    price: Number(price)
  };

  products.push(product);
  res.status(201).json({ success: true, data: product });
};
