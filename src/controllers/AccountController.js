//const Record = require('../models/Record');
const client = require('../config/db/index');
client.connect();

exports.Login = async function (req, res) {
    try {
        const {username,password} = req.body;
        const db = client.db("DADN");
        const collection = db.collection("account");
        const account = await collection.findOne({username: username, password: password});
        if (!account) {
            res.status(400).send('No matching documents');
        } else {
            res.status(200).send('Login successfully');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }

}
