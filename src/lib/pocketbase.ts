import PocketBase from "pocketbase"

const pbUrl = import.meta.env.VITE_PB_URL ?? "http://localhost:8090"

export const pb = new PocketBase(pbUrl)
