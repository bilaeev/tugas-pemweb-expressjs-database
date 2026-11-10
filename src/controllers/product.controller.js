const prisma = require("../lib/prisma");

exports.getAll = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" }
    });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail produk" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = await prisma.product.create({
      data: { name: name.trim(), price }
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat produk" });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, price } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const product = await prisma.product.update({
      where: { id },
      data: { name: name.trim(), price }
    });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui produk" });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};
