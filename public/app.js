const $ = (id) => document.getElementById(id);
const money = (value) => "Rp" + Number(value).toLocaleString("id-ID");

let products = [];
let selectedId = null;
let mode = "add";
let toastTimer;

function notify(message) {
  $("toast").textContent = message;
  $("toast").style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").style.display = "none", 3000);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Terjadi kesalahan");
  return result;
}

async function loadProducts() {
  try {
    const result = await api("/products");
    products = result.data;
    render();
  } catch (error) {
    $("products").textContent = "Gagal memuat produk: " + error.message;
  }
}

function render() {
  const keyword = $("search").value.trim().toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(keyword)
  );

  $("products").replaceChildren();

  for (const product of filtered) {
    const card = document.createElement("article");
    card.className = "product-card";

    const id = document.createElement("div");
    id.className = "id";
    id.textContent = "✿ ID: " + product.id;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = money(product.price);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn outline";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => openModal("edit", product);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn outline";
    deleteBtn.textContent = "Hapus";
    deleteBtn.onclick = () => openModal("delete", product);

    actions.append(editBtn, deleteBtn);
    card.append(id, name, price, actions);
    $("products").append(card);
  }

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "🌷 Belum ada produk yang cocok.";
    $("products").append(empty);
  }

  $("count").textContent = products.length + " produk";
  $("summary").textContent =
    "Menampilkan " + filtered.length + " dari " +
    products.length + " produk ♡";
}

function closeModal() {
  $("overlay").classList.add("hidden");
  $("formError").textContent = "";
}

function openModal(newMode, product = null) {
  mode = newMode;
  selectedId = product ? product.id : null;

  $("productForm").classList.toggle("hidden", mode === "delete");
  $("deleteContent").classList.toggle("hidden", mode !== "delete");
  $("formError").textContent = "";

  if (mode === "add") {
    $("modalIcon").textContent = "🌷";
    $("modalTitle").textContent = "Tambah Produk";
    $("modalDesc").textContent = "Masukkan informasi produk baru.";
    $("submitBtn").textContent = "Simpan Produk";
    $("productForm").reset();
  } else if (mode === "edit") {
    $("modalIcon").textContent = "🎀";
    $("modalTitle").textContent = "Edit Produk";
    $("modalDesc").textContent = "Perbarui informasi produk yang dipilih.";
    $("submitBtn").textContent = "Simpan Perubahan";
    $("name").value = product.name;
    $("price").value = product.price;
  } else {
    $("modalIcon").textContent = "🗑️";
    $("modalTitle").textContent = "Hapus Produk?";
    $("modalDesc").textContent =
      "Produk yang dihapus tidak dapat dikembalikan.";

    const preview = $("deletePreview");
    preview.replaceChildren();

    const name = document.createElement("strong");
    name.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = money(product.price);
    preview.append(name, price);
  }

  $("overlay").classList.remove("hidden");
  if (mode !== "delete") $("name").focus();
}

$("productForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = $("name").value.trim();
  const price = Number($("price").value);

  if (!name || !Number.isSafeInteger(price) || price <= 0) {
    $("formError").textContent =
      "Nama wajib diisi dan harga harus bilangan bulat lebih dari 0.";
    return;
  }

  const button = $("submitBtn");
  button.disabled = true;

  try {
    await api(mode === "add" ? "/products" : "/products/" + selectedId, {
      method: mode === "add" ? "POST" : "PUT",
      body: JSON.stringify({ name, price })
    });
    closeModal();
    await loadProducts();
    notify(mode === "add" ? "Produk berhasil ditambahkan ♡" :
      "Produk berhasil diperbarui ♡");
  } catch (error) {
    $("formError").textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

$("confirmDelete").addEventListener("click", async () => {
  const button = $("confirmDelete");
  button.disabled = true;
  try {
    await api("/products/" + selectedId, { method: "DELETE" });
    closeModal();
    await loadProducts();
    notify("Produk berhasil dihapus ♡");
  } catch (error) {
    notify(error.message);
  } finally {
    button.disabled = false;
  }
});

$("addBtn").onclick = () => openModal("add");
$("closeBtn").onclick = closeModal;
$("cancelBtn").onclick = closeModal;
$("cancelDelete").onclick = closeModal;
$("search").addEventListener("input", render);

$("overlay").addEventListener("click", (event) => {
  if (event.target === $("overlay")) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

loadProducts();
