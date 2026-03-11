export async function handler(event) {
    const JSONBIN_MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    const JSONBIN_ACCESS_KEY = process.env.JSONBIN_ACCESS_KEY;
    const BIN_ID = process.env.JSONBIN_BIN_ID;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (!JSONBIN_MASTER_KEY || !JSONBIN_ACCESS_KEY || !BIN_ID) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Missing JSONBin environment configuration' }),
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            // Fetch scores
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: {
                    'X-Master-Key': JSONBIN_MASTER_KEY,
                    'X-Access-Key': JSONBIN_ACCESS_KEY
                }
            });

            if (!response.ok) throw new Error("Failed to fetch global scores");

            const data = await response.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data.record)
            };
        }

        if (event.httpMethod === 'POST') {
            // Update scores
            const body = JSON.parse(event.body);
            const fetchResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_MASTER_KEY,
                    'X-Access-Key': JSONBIN_ACCESS_KEY
                },
                body: JSON.stringify(body)
            });

            if (!fetchResponse.ok) throw new Error("Failed to update global scores");

            const data = await fetchResponse.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data.record)
            };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    } catch (err) {
        console.error('JSONBin API error:', err.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
