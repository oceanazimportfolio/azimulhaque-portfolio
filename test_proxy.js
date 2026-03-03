const GROQ_API_KEY = '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';
const LOCAL_URL = 'http://localhost:5175/api/groq/openai/v1/chat/completions';

async function test() {
    const messages = [
        { role: 'system', content: 'You are a test' },
        {
            role: 'assistant',
            content: "Hi! I'm Azimul's AI assistant.",
        },
        { role: 'user', content: 'test message' },
    ];

    try {
        const response = await fetch(LOCAL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 200,
            }),
        });

        console.log("Status:", response.status);
        console.log("Headers:");
        response.headers.forEach((value, name) => {
            console.log(`${name}: ${value}`);
        });

        const bodyText = await response.text();
        console.log("Data:", bodyText);
    } catch (err) {
        console.log("Fetch Error:", err);
    }
}

test();
