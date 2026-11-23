import type { Product, ProductValues } from "../../types/product"

const BASE = import.meta.env.VITE_API_BASE_URL ?? ""

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init,
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
        const err = new Error(body.message ?? "Terjadi kesalahan") as Error & { status?: number }
        err.status = res.status
        throw err
    }
    return body.data as T
}

export const api = {
    list: () => request<Product[]>("/products"),
    detail: (id: number) => request<Product>(`/products/${id}`),
    create: (v: ProductValues) =>
        request<Product>("/products", { method: "POST", body: JSON.stringify(v) }),
    update: (id: number, v: ProductValues) =>
        request<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(v) }),
    remove: (id: number) => request<Product>(`/products/${id}`, { method: "DELETE" }),
}