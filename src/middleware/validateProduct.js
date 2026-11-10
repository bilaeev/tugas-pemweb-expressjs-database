module.exports = (req, res, next) => {
  const { name, price } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return res.status(400).json({
      message: "Nama wajib berupa teks dan harga harus angka non-negatif"
    });
  }

  next();
};
