const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sonnguyenyamakun:V0x82B2gjfy4tR6b@dadn.bwepi3i.mongodb.net/?retryWrites=true&w=majority&appName=DADN";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
module.exports = firebaseApp;
