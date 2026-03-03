const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function test() {
    const messages = [
        { role: 'system', content: 'You are a test' },
        {
            role: 'assistant',
            content: "Hi! I'm Azimul's AI assistant.",
        },
        { role: 'user', content: 'test message' },
    ];

    const response = await fetch(GROQ_API_URL, {
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

    const data = await response.json();
    console.log("Data:", data.error || data.choices[0]);
}

test();
