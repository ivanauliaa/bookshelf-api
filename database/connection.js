const { MongoClient } = require('mongodb');

const { DB_URI, DB_NAME } = require('../constants/contants');

// const mongoDBConnect = async () => {
//   // const client = new MongoClient(DB_URI);
//   // await client.connect();

//   // db = client;
//   const mongoClient = new MongoClient(DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   let db;
//   mongoClient.connect((error, client) => {
//     if (error) {
//       console.log('Connection failed');
//     }

//     console.log('DB connected');
//     db = client.db(DB_NAME);
//   });

//   return db;
// };

const getClient = () => {
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client;
};

module.exports = getClient;
