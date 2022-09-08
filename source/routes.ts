import { ResponseToolkit, Request, ResponseObject } from '@hapi/hapi';
import {
  addBookHandler,
  deleteBookByIdHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
} from './handlers';

const routes: {
  method: string,
  path: string,
  handler: (request: Request, h: ResponseToolkit) => Promise<ResponseObject>
}[] = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler,
  },
];

export default routes;
