const { nanoid } = require('nanoid');
const { DB_COLLECTION, DB_NAME } = require('../constants/contants');
const getClient = require('../database/connection');

const addBooksHandler = async (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const client = getClient();
  await client.connect();

  const book = await client.db(DB_NAME).collection(DB_COLLECTION).insertOne({
    _id: id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      book,
    },
  });
  response.code(201);

  client.close();

  return response;
};

const getAllBooksHandler = async (request, h) => {
  const { name, reading, finished } = request.query;

  const client = getClient();
  await client.connect();

  let filteredBooks = await client.db(DB_NAME)
    .collection(DB_COLLECTION)
    .find({})
    .toArray();

  if (name !== undefined) {
    if (name !== '') {
      const regex = new RegExp(name, 'i');
      filteredBooks = filteredBooks.filter((book) => regex.test(book.name));
    }
  }

  if (reading !== undefined) {
    if (reading === '1') {
      filteredBooks = filteredBooks.filter((book) => book.reading === true);
    } else {
      filteredBooks = filteredBooks.filter((book) => book.reading === false);
    }
  }

  if (finished !== undefined) {
    console.log('OK');
    if (finished === '1') {
      console.log('finished', finished);
      filteredBooks = filteredBooks.filter((book) => book.finished === true);
    } else {
      console.log('unfinished', finished);
      filteredBooks = filteredBooks.filter((book) => book.finished === false);
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        _id: book._id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);

  return response;
};

const getBookByIdHandler = async (request, h) => {
  const { id } = request.params;

  const client = getClient();
  await client.connect();

  const selectedBook = await client.db(DB_NAME).collection(DB_COLLECTION).findOne({ _id: id });

  if (!selectedBook) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: selectedBook,
    },
  });
  response.code(200);

  return response;
};

const editBookByIdHandler = async (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  const client = getClient();
  await client.connect();

  const { modifiedCount } = await client.db(DB_NAME).collection(DB_COLLECTION)
    .updateOne({ _id: id }, {
      $set: {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      },
    });

  if (modifiedCount === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);

    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);

  return response;
};

const deleteBookByIdHandler = async (request, h) => {
  const { id } = request.params;

  const client = getClient();
  await client.connect();

  const { deletedCount } = await client.db(DB_NAME).collection(DB_COLLECTION)
    .deleteOne({ _id: id });

  if (deletedCount === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);

    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);

  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
