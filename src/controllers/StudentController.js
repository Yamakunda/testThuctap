const client = require('../config/db/index');
client.connect();

exports.Post = async function (req, res) {
    const db = client.db("DADN");
    const collection = db.collection("students");

    const { name, studentId, academicYear } = req.body;
    const existingStudent = await collection.findOne({ studentId });
    if (existingStudent) {
        return res.status(400).json({ message: 'Student ID already exists' });
    }
    const student = {
        name,
        studentId,
        academicYear
    };
    try {
        const savedStudent = await collection.insertOne(student);
        res.json(savedStudent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.Index = async function (req, res) {
    const db = client.db("DADN");
    const collection = db.collection("students");
    try {
        const student = await collection.findOne({ studentId: req.params.id });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.Getname = async function (req, res) {
    const db = client.db("DADN");
    const collection = db.collection("students");

    try {
        const students = await collection.find({ name: new RegExp(req.params.name, 'i') }).toArray();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.Getall = async function (req, res) {
    const db = client.db("DADN");
    const collection = db.collection("students");
    try {
        const students = await collection.find().toArray();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}