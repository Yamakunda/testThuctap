//const Record = require('../models/Record');
const client = require('../config/db/index');
client.connect();

exports.Index = async function (req, res) {
    try {
        const db = client.db("DADN");
        const collection = db.collection("record");
        const globalTime = new Date();
        const currentTime = new Date(globalTime.getTime() + 7 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(currentTime.getTime() - (7 * 24 * 60 * 60 * 1000)); // Get date and time 7 days ago
    
        const data = await collection.aggregate([
            {
                $match: {
                    time: {
                        $gt: sevenDaysAgo,
                        $lt: currentTime
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$time" },
                        month: { $month: "$time" },
                        day: { $dayOfMonth: "$time" },
                    },
                    averageHumidity: { $avg: "$humidity" },
                    averageTemp: { $avg: "$temp" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
            }
        ]).toArray();
        res.json(data); // send the last document as a JSON response
    } catch (error) {
        res.status(400).send(error.message);
    }

}
