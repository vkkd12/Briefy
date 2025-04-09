import express from 'express';
import summarise from './summary.js';
import get_category from './summary.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post("/get", (req, res) => {
    const { id, pass, mail } = req.body;
    // validate user

    const { subject, body } = mail;
    const summary = summarise(body);
    const category = get_category(subject + body);

    res.send({ summary, category });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



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

