
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const uri = "mongodb+srv://sonnguyenyamakun:V0x82B2gjfy4tR6b@dadn.bwepi3i.mongodb.net/?retryWrites=true&w=majority&appName=DADN";
const app = express();
const cors = require('cors');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
app.use(cors());
app.get('/record', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("DADN");
    const collection = db.collection("record");
    const lastDocument = await collection.find().sort({_id: -1}).limit(1).toArray();
    const object = JSON.parse(JSON.stringify(lastDocument[0]));
    res.json(object); // send the last document as a JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send('Error occurred while fetching record');
  } finally {
    await client.close();
  }
});

app.listen(3000,'192.168.1.9', () => console.log('Server is running on port 3000'));

