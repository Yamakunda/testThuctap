const Record = require('../models/Record');
const client = require('../config/db/index');
const axios = require('axios');
client.connect();

async function getDataFromAPI(Api) {
    try {
        const response = await axios.get(Api);
        return response.data.last_value;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function addDataToAdafruit(Api, value) {
    try {
        const response = await axios.post(Api, {
            value: value
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
exports.Index = async function (req, res) {
    try {
        const fan_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/La_Toh/feeds/fan/');
        const light_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/La_Toh/feeds/ledrgb/');
        const temp_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/La_Toh/feeds/temp/');
        const humidity_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/La_Toh/feeds/humi/');
        const currentTime = new Date();

        // Convert the current time to GMT+7
    const gmtPlus7Time = new Date(currentTime.getTime() + (7 * 60 * 60 * 1000));
    const db = client.db("DADN");
    const collection = db.collection("record");

    const lastDocumentArray = await collection.find().sort({_id: -1}).limit(1).toArray();
    const lastDocument = lastDocumentArray[0]; // Get the last document
    const record = {
        time: gmtPlus7Time,
        temp: Number(temp_lastvalue),
        humidity: Number(humidity_lastvalue),
        light: light_lastvalue,
        fan: fan_lastvalue
    };

    if(lastDocument && (lastDocument.temp !== record.temp || lastDocument.humidity !== record.humidity || lastDocument.light !== record.light || lastDocument.fan !== record.fan)){
        const result = await collection.insertOne(record);
        console.log(record);
    } else {
        console.log('No new data');
    }

        res.json(record); // send the last document as a JSON response
      } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while fetching record');
      } finally {
        //await client.close();
      }
}
exports.Store = async function (req, res) {
    try {
        const data = req.body;
        // console.log(data);
        //add data to adafruit
        if (!(data.light === undefined)) {
            await addDataToAdafruit('https://io.adafruit.com/api/v2/webhooks/feed/fxxXMVgQarrt8fcNvN6JvXxRXzNt', data.light);
        }
        if (!(data.fan === undefined)) {
            await addDataToAdafruit('https://io.adafruit.com/api/v2/webhooks/feed/SfChmJUBi4bASVSQ11fo6115vXvN',  data.fan);
        }
        const fan_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/La_Toh/feeds/fan/');
        const light_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/La_Toh/feeds/ledrgb/');
        const temp_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/La_Toh/feeds/temp/');
        const humidity_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/La_Toh/feeds/humi/');
        const currentTime = new Date();

        // Convert the current time to GMT+7
        const gmtPlus7Time = new Date(currentTime.getTime() + (7 * 60 * 60 * 1000));
        const db = client.db("DADN");
        const collection = db.collection("record");
        const record = {
            time: gmtPlus7Time,
            temp: Number(temp_lastvalue),
            humidity: Number(humidity_lastvalue),
            light: light_lastvalue,
            fan: fan_lastvalue
        };
        const result = await collection.insertOne(record);
        res.json(record); // send the last document as a JSON response
      } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while fetching record');
      } finally {
        //await client.close();
      }
}
// exports.Index = async function (req, res) {
//     try {
//         const db = client.db("DADN");
//         const collection = db.collection("record");
//         const lastDocument = await collection.find().sort({_id: -1}).limit(1).toArray();
//         const object = JSON.parse(JSON.stringify(lastDocument[0]));
//         res.json(object); // send the last document as a JSON response
//       } catch (err) {
//         console.error(err);
//         res.status(500).send('Error occurred while fetching record');
//       } finally {
//         //await client.close();
//       }
// }
// exports.Index = async function (req, res) {
//     try {
//         //load data from adafruit to firebase
//         const fan_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/thanhdanh2754/feeds/fan/');
//         const light_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/thanhdanh2754/feeds/light/');
//         const temp_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/thanhdanh2754/feeds/tempx/');
//         const humidity_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/thanhdanh2754/feeds/humidx/');
//         const lightvalue_lastvalue = await getDataFromAPI('https://io.adafruit.com/api/v2/thanhdanh2754/feeds/lightx/');


//         const currentTime = new Date();

//         // Convert the current time to GMT+7
//         const gmtPlus7Time = new Date(currentTime.getTime() + (7 * 60 * 60 * 1000));

//         const record = {
//             time: gmtPlus7Time.toISOString(),
//             temp: temp_lastvalue,
//             light: light_lastvalue,
//             humidity: humidity_lastvalue,
//             lightvalue: lightvalue_lastvalue,
//             fan: fan_lastvalue
//         };
//         await addDoc(collection(db, 'record'), record);

//         //retrieve data from firebase
//         const recordRef = collection(db, 'record');
//         const q = query(recordRef, orderBy('time', 'desc'), limit(1));
//         const records = await getDocs(q);
//         const recordArray = [];
//         if (records.empty) {
//             res.status(400).send('No records found');
//         } else {
//             records.forEach((doc) => {
//                 const record = new Record(
//                     time = doc.data().time,
//                     doc.data().temp,
//                     doc.data().light,
//                     doc.data().humidity,
//                     doc.data().lightvalue,
//                     doc.data().fan
//                 )
//                 recordArray.push(record);
//             });
//             res.status(200).send(recordArray[recordArray.length - 1]);
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }


// exports.Store = async function (req, res) {
//     try {
//         const data = req.body;

//         //add data to adafruit
//         if (!(data.light === undefined)) {
//             await addDataToAdafruit('https://io.adafruit.com/api/v2/webhooks/feed/EV7Kr8ULbGybCr8BVufY11GMJ6eB', data.light);
//         }
//         if (!(data.fan === undefined)) {
//             await addDataToAdafruit('https://io.adafruit.com/api/v2/webhooks/feed/sUs7BVXhmMBCrh6kJcvMiYEwpqAv', data.fan);
//         }
//         //add data to firebase
//         await addDoc(collection(db, 'record'), data);
//         res.status(200).send('record created successfully');
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

