export async function onRequestGet(context) {
    const JSONBIN_MASTER_KEY = "$2a$10$F9AynfZ5TvPUR.6JsxN9/ONFfSx9jqLbEzNYa3UFV5VWGxKWoITXS";
    const JSONBIN_ACCESS_KEY = "$2a$10$6dq79KXkdRVIO59Om6sQFu47dFWLxcmfWV40SFQUKZ/TLE4jtDbJy";
    const BIN_ID = "69afe988aeb53c760cdf1a8d";

    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_MASTER_KEY,
                'X-Access-Key': JSONBIN_ACCESS_KEY
            }
        });

        if (!response.ok) throw new Error("Failed to fetch global scores");

        const data = await response.json();
        return new Response(JSON.stringify(data.record), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    const JSONBIN_MASTER_KEY = "$2a$10$F9AynfZ5TvPUR.6JsxN9/ONFfSx9jqLbEzNYa3UFV5VWGxKWoITXS";
    const JSONBIN_ACCESS_KEY = "$2a$10$6dq79KXkdRVIO59Om6sQFu47dFWLxcmfWV40SFQUKZ/TLE4jtDbJy";
    const BIN_ID = "69afe988aeb53c760cdf1a8d";

    try {
        const body = await context.request.json();
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
        return new Response(JSON.stringify(data.record), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        }
    });
}
