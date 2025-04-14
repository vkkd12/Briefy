import { email_priority_keywords } from './priorityKeywords.js';

const weights = [0.2, 0.3, 0.3, 0.2];

function get_category(email_body) {
    if (typeof email_body !== 'string') {
        throw new TypeError("email_body must be a string");
    }

    const cleaned_body = email_body.toLowerCase().replace(/[\t\n]/g, " ");
    const words = new Set(cleaned_body.split(" ").filter(word => word.length > 0));

    const freq = [0, 0, 0, 0];
    for (const word of words) {
        for (let i = 1; i <= 4; i++) {
            if (email_priority_keywords[i].has(word)) {
                freq[i - 1]++;
            }
        }
    }

    let maxScore = -1;
    let category = 1;

    for (let i = 0; i < 4; i++) {
        const score = freq[i] * weights[i];
        if (score > maxScore) {
            maxScore = score;
            category = i + 1;
        }
    }

    return category;
}

export default get_category;