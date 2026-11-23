import { Link } from "react-router"

export default function NotFoundPage() {
    return (
        <div className="py-16 text-center">
            <h1 className="text-6xl font-bold text-pink-500">404</h1>
            <p className="mt-2 text-lg">Halaman tidak ditemukan.</p>
            <Link
                to="/products"
                className="mt-6 inline-block rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
            >
                Kembali ke daftar produk
            </Link>
        </div>
    )
}
