const assert = require("node:assert/strict");
const app = require("./src/app");

async function main() {
  const server = app.listen(0);
  await new Promise(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  async function request(path, method = "GET", body) {
    const response = await fetch(base + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, body: await response.json() };
  }

  try {
    let r = await request("/products");
    assert.equal(r.status, 200);
    assert.equal(r.body.data.length, 5);
    console.log("PASS GET daftar produk");

    r = await request("/products/1");
    assert.equal(r.status, 200);
    console.log("PASS GET detail produk");

    r = await request("/products", "POST", { name: "Pensil", price: 4000 });
    assert.equal(r.status, 201);
    const id = r.body.data.id;
    console.log("PASS POST tambah produk");

    r = await request(`/products/${id}`, "PUT", { name: "Pensil 2B", price: 5000 });
    assert.equal(r.status, 200);
    assert.equal(r.body.data.name, "Pensil 2B");
    console.log("PASS PUT edit produk");

    r = await request(`/products/${id}`, "DELETE");
    assert.equal(r.status, 200);
    console.log("PASS DELETE hapus produk");

    r = await request(`/products/${id}`);
    assert.equal(r.status, 404);
    console.log("PASS produk terhapus menghasilkan 404");

    r = await request("/products", "POST", { name: "", price: -1 });
    assert.equal(r.status, 400);
    console.log("PASS validasi input 400");

    console.log("SEMUA PENGUJIAN BERHASIL");
  } finally {
    server.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

