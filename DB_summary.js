import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const summarySchema = new Schema({
    summary: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true,
    },
});

const Summary = mongoose.model('Summary', summarySchema);

export default Summary;
