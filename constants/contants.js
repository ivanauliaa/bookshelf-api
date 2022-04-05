const DB_USERNAME = 'root';
const DB_PASSWORD = 'example';
const DB_NAME = 'bookshelf';
const DB_COLLECTION = 'books';
const DB_URI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@localhost:27017/`;

module.exports = { DB_URI, DB_NAME, DB_COLLECTION };
