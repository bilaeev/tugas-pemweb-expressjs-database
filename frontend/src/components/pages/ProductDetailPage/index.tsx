import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { api } from "../../../data/product/api"
import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"

type State =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ok"; product: Product }

export default function ProductDetailPage() {
    const { id } = useParams()
    const [result, setResult] = useState<{ id?: string; state: State }>({
        state: { status: "loading" },
    })

    useEffect(() => {
        let active = true
        api.detail(Number(id))
            .then((product) => {
                if (active) setResult({ id, state: { status: "ok", product } })
            })
            .catch((e) => {
                if (active)
                    setResult({
                        id,
                        state: {
                            status: "error",
                            message: e instanceof Error ? e.message : "Gagal memuat produk",
                        },
                    })
            })
        return () => {
            active = false
        }
    }, [id])

    const state: State = result.id === id ? result.state : { status: "loading" }

    return (
        <div>
            <Link to="/products" className="mb-4 inline-block text-pink-600 hover:underline">
                &larr; Kembali ke daftar produk
            </Link>
            {state.status === "loading" && <p>Memuat...</p>}
            {state.status === "error" && (
                <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-700">
                    {state.message}
                </p>
            )}
            {state.status === "ok" && (
                <div className="rounded-2xl bg-pink-50 p-6 shadow">
                    <p className="text-sm text-pink-400">ID: {state.product.id}</p>
                    <h1 className="text-3xl font-bold">{state.product.name}</h1>
                    <p className="mt-2 text-xl text-pink-600">
                        {formatRupiah(state.product.price)}
                    </p>
                </div>
            )}
        </div>
    )
}
