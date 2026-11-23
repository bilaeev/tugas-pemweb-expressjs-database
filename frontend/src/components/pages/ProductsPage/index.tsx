import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router"
import { api } from "../../../data/product/api"
import type { Product, ProductValues } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editing, setEditing] = useState<Product | null>(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let active = true
        api.list()
            .then((data) => {
                if (!active) return
                setProducts(data)
                setError("")
            })
            .catch((e) => {
                if (active) setError(e instanceof Error ? e.message : "Gagal memuat produk")
            })
            .finally(() => {
                if (active) setLoading(false)
            })
        return () => {
            active = false
        }
    }, [reloadKey])

    function reload() {
        setReloadKey((k) => k + 1)
    }

    function reset() {
        setEditing(null)
        setName("")
        setPrice("")
    }

    async function submit(e: FormEvent) {
        e.preventDefault()
        const values: ProductValues = { name: name.trim(), price: Number(price) }
        try {
            if (editing) await api.update(editing.id, values)
            else await api.create(values)
            reset()
            reload()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menyimpan")
        }
    }

    async function remove(p: Product) {
        if (!confirm(`Hapus ${p.name}?`)) return
        try {
            await api.remove(p.id)
            reload()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menghapus")
        }
    }

    function startEdit(p: Product) {
        setEditing(p)
        setName(p.name)
        setPrice(String(p.price))
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold text-pink-600">Manajemen Produk</h1>

            <form
                onSubmit={submit}
                className="mb-8 flex flex-col gap-3 rounded-2xl bg-pink-50 p-4 shadow sm:flex-row"
            >
                <input
                    className="flex-1 rounded-lg border border-pink-200 px-3 py-2"
                    placeholder="Nama produk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    className="rounded-lg border border-pink-200 px-3 py-2 sm:w-40"
                    type="number"
                    min="0"
                    placeholder="Harga"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <button className="rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600">
                    {editing ? "Simpan" : "Tambah"}
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-lg bg-gray-200 px-4 py-2"
                    >
                        Batal
                    </button>
                )}
            </form>

            {error && (
                <p role="alert" className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                    {error}
                </p>
            )}
            {loading && <p>Memuat...</p>}
            {!loading && products.length === 0 && <p>Belum ada produk.</p>}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                    <article key={p.id} className="rounded-2xl bg-white p-4 shadow">
                        <p className="text-sm text-pink-400">ID: {p.id}</p>
                        <h2 className="text-lg font-semibold">{p.name}</h2>
                        <p className="mb-3 text-pink-600">{formatRupiah(p.price)}</p>
                        <div className="flex gap-2 text-sm">
                            <Link
                                to={`/products/${p.id}`}
                                className="rounded bg-pink-100 px-3 py-1 hover:bg-pink-200"
                            >
                                Detail
                            </Link>
                            <button
                                onClick={() => startEdit(p)}
                                className="rounded bg-yellow-100 px-3 py-1 hover:bg-yellow-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => remove(p)}
                                className="rounded bg-red-100 px-3 py-1 hover:bg-red-200"
                            >
                                Hapus
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
