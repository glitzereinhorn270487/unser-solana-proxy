const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Moralis API Key aus Umgebungsvariablen laden
// process.env.MORALIS_API_KEY wird von Vercel automatisch bereitgestellt
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

// Basis-URL für die Moralis Solana API (kann variieren, siehe Moralis Doku für aktuelle Version)
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2/solana';

// Überprüfung, ob der API-Key gesetzt ist (wichtig für die Fehlersuche)
if (!MORALIS_API_KEY) {
    console.error('ERROR: MORALIS_API_KEY ist in den Umgebungsvariablen nicht gesetzt oder leer!');
} else {
    // Logge nur einen Teil des Schlüssels, niemals den ganzen aus Sicherheitsgründen!
    console.log(`MORALIS_API_KEY read successfully: ${MORALIS_API_KEY.substring(0, 5)}... (truncated)`);
}

// Route für Pump.fun
app.get('/pumpfun', async (req, res) => {
    try {
        // Dies ist ein bekannter Endpunkt für eine Liste von Pump.fun Coins
        // Achtung: Dieser Endpunkt ist nicht offiziell und kann sich jederzeit ändern oder blockiert werden.
        const response = await axios.get('https://pump.fun/api/coins');
        res.json(response.data);
    } catch (error) {
        console.error('Fehler beim Abrufen von Pump.fun:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen von Pump.fun API', details: error.message });
    }
});

    // Route für Dexscreener über Moralis
    app.get('/dexscreener', async (req, res) => {
        try {
            const wSOL_TOKEN_ADDRESS = 'So11111111111111111111111111111111111111112';
            const network = 'mainnet'; // Oder 'devnet', je nachdem, welches Netzwerk du abfragen möchtest

            const response = await axios.get(`${MORALIS_BASE_URL}/token/${network}/${wSOL_TOKEN_ADDRESS}/price`, {
                headers: {
                    'Authorization': `Bearer ${MORALIS_API_KEY}`,
                    'accept': 'application/json'
                },
                // Der 'params' Block ist für diesen Endpunkt nicht mehr nötig und wird entfernt.
                // params: {
                //     chain: 'solana'
                // }
            });
            res.json(response.data); // Sollte die Preisdaten von wSOL zurückgeben

        } catch (error) {
            console.error('Fehler beim Abrufen von Dexscreener über Moralis:', error.message);
            const errorDetails = error.response ? error.response.data : error.message;
            res.status(500).json({ error: 'Fehler beim Abrufen von Dexscreener API über Moralis', details: errorDetails });
    }
});

// Route für GMGN (bleibt beim Platzhalter, da keine offizielle API bekannt)
app.get('/gmgn', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/gmgn-data'); // PLATZHALTER! ERSETZEN!
        res.json(response.data);
    } catch (error) {
        console.error('Fehler beim Abrufen von GMGN:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen von GMGN API', details: error.message });
    }
});

// Route für Fourmemes (bleibt beim Platzhalter, da keine offizielle API bekannt)
app.get('/fourmemes', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/fourmemes-data'); // PLATZHALTER! ERSETZEN!
        res.json(response.data);
    } catch (error) {
        console.error('Fehler beim Abrufen von Fourmemes:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen von Fourmemes API', details: error.message });
    }
});

// Standard-Route für den Fall, dass der Stamm-URL aufgerufen wird
app.get('/', (req, res) => {
    res.send('Solana Memecoin Proxy is running. Use /pumpfun, /dexscreener, /gmgn, or /fourmemes endpoints.');
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy listening on port ${PORT}`);
});
