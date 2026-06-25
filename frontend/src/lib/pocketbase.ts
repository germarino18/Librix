/* Stub — will be removed when services migrate to api.ts */
type RecordService = {
  getFullList<T>(options?: Record<string, unknown>): Promise<T[]>
  getOne<T>(id: string, options?: Record<string, unknown>): Promise<T>
  getList<T>(page: number, perPage: number, options?: Record<string, unknown>): Promise<{ items: T[]; totalItems: number; totalPages: number; page: number; perPage: number }>
  create<T>(data: object): Promise<T>
  update<T>(id: string, data: object): Promise<T>
  delete(id: string): Promise<boolean>
}

const stubCollection = (): RecordService => ({
  getFullList: () => Promise.resolve([]),
  getOne: () => Promise.resolve({} as never),
  getList: () => Promise.resolve({ items: [], totalItems: 0, totalPages: 0, page: 1, perPage: 20 }),
  create: (data) => Promise.resolve(data as never),
  update: (_id, data) => Promise.resolve(data as never),
  delete: () => Promise.resolve(true),
})

export const pb = {
  collection: (_name: string): RecordService => stubCollection(),
}
