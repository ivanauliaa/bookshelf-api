import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { nanoid } from 'nanoid';
import {
  AddBookInterface,
  BookInterface,
  BookPathParamInterface,
  BookQueryParamInterface,
  books,
} from './books';

const addBookHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }: AddBookInterface = <AddBookInterface>request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage! > pageCount!) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id: string = nanoid(16);
  const insertedAt: string = new Date().toISOString();
  const updatedAt: string = insertedAt;
  const finished: boolean = readPage! === pageCount!;

  const newBook: BookInterface = {
    name,
    year: year as number,
    author: author as string,
    summary: summary as string,
    publisher: publisher as string,
    pageCount: pageCount as number,
    readPage: readPage as number,
    reading: reading as boolean,
    id,
    insertedAt,
    updatedAt,
    finished,
  };

  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooksHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  let filteredBooks: BookInterface[] = [...books];

  const { name, reading, finished } = <BookQueryParamInterface>request.query;

  if (name) {
    const regex: RegExp = new RegExp(name, 'i');
    filteredBooks = filteredBooks.filter((b: BookInterface) => regex.test(b.name));
  }

  if (reading) {
    filteredBooks = filteredBooks.filter((b: BookInterface) => b.reading === (reading === '1'));
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((b: BookInterface) => b.finished === (finished === '1'));
  }

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((b: BookInterface) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      })),
    },
  });
};

const getBookByIdHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  const { id } = <BookPathParamInterface>request.params;

  const book: BookInterface = books.filter((b: BookInterface) => b.id === id)[0];

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book,
    },
  });
};

const updateBookByIdHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }: AddBookInterface = <AddBookInterface>request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage! > pageCount!) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const { id } = <BookPathParamInterface>request.params;

  const index: number = books.findIndex((b: BookInterface) => b.id === id);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  const finished: boolean = readPage! === pageCount!;
  const updatedAt: string = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year: year as number,
    author: author as string,
    summary: summary as string,
    publisher: publisher as string,
    pageCount: pageCount as number,
    readPage: readPage as number,
    reading: reading as boolean,
    updatedAt,
    finished,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBookByIdHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  const { id } = <BookPathParamInterface>request.params;

  const index: number = books.findIndex((book: BookInterface) => book.id === id);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
