require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    .then(r => r.json())
    .then(d => {
        if (!d.models) {
            console.log("No models returned:", d);
            return;
        }
        const embs = d.models.filter(m => m.supportedGenerationMethods.includes('embedContent'));
        console.log(embs.map(m => m.name));
    })
    .catch(console.error);
