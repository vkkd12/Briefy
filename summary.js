import axios from 'axios';
import { config } from 'dotenv';

config();

const api_token = process.env.INFERENCE_TOKEN;
const model_sum_api = process.env.MODEL_SUM_API;
const headers = { "Authorization": `Bearer ${api_token}`, "Content-Type": "application/json", };


async function summarise(body) {
    try {
        const response = await axios.post(
            model_sum_api,
            { inputs: body },
            { headers }
        );
        return response.data;
    } catch (error) {
        console.log(`Error in summarise: ${error}`);
        return null;
    }
}


export default summarise;