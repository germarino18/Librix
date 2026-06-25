import { pb } from "@/lib/pocketbase"
import type {
  Producto,
  CreateProductoInput,
  UpdateProductoInput,
  ProductoListParams,
  ProductoListResponse,
} from "../types/productosTypes"

const COLLECTION = "producto"

export async function list(params: ProductoListParams = {}): Promise<ProductoListResponse> {
  const { categoria, search, page = 1, perPage = 20 } = params

  const filterParts: string[] = []
  if (categoria) {
    filterParts.push(`categoria_id="${categoria}"`)
  }
  if (search) {
    filterParts.push(`nombre~"%${search}%"`)
  }

  const result = await pb.collection(COLLECTION).getList<Producto>(page, perPage, {
    filter: filterParts.length > 0 ? filterParts.join(" && ") : "",
    sort: "-created",
    expand: "categoria_id",
  })

  return {
    items: result.items,
    totalItems: result.totalItems,
    totalPages: result.totalPages,
    page: result.page,
    perPage: result.perPage,
  }
}

export async function getById(id: string): Promise<Producto> {
  return pb.collection(COLLECTION).getOne<Producto>(id, {
    expand: "categoria_id",
  })
}

export async function create(data: CreateProductoInput): Promise<Producto> {
  return pb.collection(COLLECTION).create<Producto>(data)
}

export async function update(id: string, data: UpdateProductoInput): Promise<Producto> {
  return pb.collection(COLLECTION).update<Producto>(id, data)
}
