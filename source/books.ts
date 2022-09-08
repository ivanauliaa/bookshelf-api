interface BookInterface {
  id: string
  name: string
  year: number
  author: string
  summary: string
  publisher: string
  pageCount: number
  readPage: number
  reading: boolean
  finished: boolean
  insertedAt: string
  updatedAt: string
}

interface AddBookInterface {
  name?: string
  year?: number
  author?: string
  summary?: string
  publisher?: string
  pageCount?: number
  readPage?: number
  reading?: boolean
}

interface BookPathParamInterface {
  id?: string
}

interface BookQueryParamInterface {
  name?: string
  reading?: string
  finished?: string
}

const books: BookInterface[] = [];

export {
  BookInterface,
  AddBookInterface,
  BookPathParamInterface,
  BookQueryParamInterface,
  books,
};
