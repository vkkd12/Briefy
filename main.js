import express from 'express';
import summarise from './summary.js';
import get_category from './category.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DB_summary from './DB_summary.js';

dotenv.config();

const app = express();
const port = 3000;
const h = process.env.DEV ? "http://" : "https://";


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post("/store", async (req, res) => {
    try {
        const { uid, mail } = req.body;
        console.log(uid, mail);
        const { body } = mail;

        const summary = await summarise(body);
        const arr = summary[0].summary_text
        const category = get_category(body);

        const new_object = new DB_summary({ summary: arr, category: category, uid: uid });
        await new_object.save();


        res.status(200);
    } catch (err) {
        res.status(400).send({ error: err.message || 'Bad Request' });
    }

});

app.post("/get_summary", async (req, res) => {
    try {
        const { uids } = req.body;
        const mails = await DB_summary.find({ uid: { $in: uids } });
        if (mails) {
            res.status(200).json(mails);
        } else throw Error
    } catch (err) {
        res.status(400).send({ error: err.message || 'Bad Request' });
    }
});

// Connect to MongoDB
const backendServer = app.listen(port, () => {
    console.log(`Server running at ${h}://localhost:${port}`);
});

mongoose.connect(process.env.MONGO_URI).then(() => console.log("connected to Database"));

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing server');
    backendServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGTERM signal received: closing server');
    backendServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

