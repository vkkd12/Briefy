import express from 'express';
import summarise from './summary.js';
import get_category from './category.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DB_summary from './DB_summary.js';

dotenv.config();

const app = express();
const port = 3000;
const h = process.env.Dev ? "http://" : "https://";


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post("/store", async (req, res) => {
    try {
        const { uid, mail } = req.body;

        if (!uid || !mail) {
            return res.status(400).json({ error: "UID and Mail are required." });
        }

        const existingEntry = await DB_summary.findOne({ uid });

        if (existingEntry) {
            return res.status(200).json({ message: "UID already exists" });
        }

        let summarizedText = mail;
        if (mail.length() > 100) {
            let summaryResult = await summarise(mail);
            summarizedText = summaryResult[0]?.summary_text;
            if (!summarizedText) throw new Error("First summarization failed");

            if (summarizedText.length() > mail.length()) {
                summaryResult = await summarise(summarizedText);
                summarizedText = summaryResult[0]?.summary_text;
                if (!summarizedText) throw new Error("Second summarization failed");
            }
        }

        const category = get_category(summarizedText);
        const newEntry = new DB_summary({
            summary: summarizedText,
            category,
            uid,
        });

        await newEntry.save();
        res.status(200).json({ message: "Summary stored successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message || "Bad Request" });
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

