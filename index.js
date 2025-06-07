const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Route für Pump.fun 
app.get('/pumpfun', async (req, res) => {
    try {
        const network = 'mainnet';
        const exchangeIdentifier = 'pumpfun';
     
                'accept': 'application/json'
            },
            params: {
                limit: 100 // Optional: Limitiere die Anzahl der zurückgegebenen Tokens
            }
        });
        res.json(response.data);

// Route für Dexscreener über Moralis (Token Price Test) - Behalten wir als Beispiel
app.get('/dexscreener', async (req, res) => {
    try {
        const wSOL_TOKEN_ADDRESS = 'So11111111111111111111111111111111111111112';
        const network = 'mainnet';
        const response = await axios.get(`${MORALIS_BASE_URL}/token/${network}/${wSOL_TOKEN_ADDRESS}/price`, {
            headers: {
                'Authorization': `Bearer ${MORALIS_API_KEY}`,
                'accept': 'application/json'
            },
        });
        res.json(response.data);

// NEUE Route: Dexscreener-Details für ein spezifisches Token
app.get('/dexscreener-pair-details/:tokenAddress', async (req, res) => {
    const tokenAddress = req.params.tokenAddress;
    if (!tokenAddress) {
        return res.status(400).json({ error: 'Missing tokenAddress parameter.' });
    }

    try {
        // Dexscreener API Endpunkt, um Paare für eine Token-Adresse zu finden
        const dexscreenerApiUrl = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;

        const response = await axios.get(dexscreenerApiUrl);
        res.json(response.data);

    } catch (error) {
        console.error(`Fehler beim Abrufen von Dexscreener für Token ${tokenAddress}:`, error.message);
        // Dexscreener gibt 404 zurück, wenn keine Paare gefunden werden
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'No pairs found for this token on Dexscreener.', details: error.message });
        }
        const errorDetails = error.response ? error.response.data : error.message;
        res.status(500).json({ error: 'Fehler beim Abrufen von Dexscreener Pair Details', details: errorDetails });
    }
});


// Route für GMGN (bleibt beim Platzhalter)
app.get('/gmgn', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/gmgn-data'); // PLATZHALTER! ERSETZEN!
        res.json(response.data);
    } catch (error) {
        console.error('Fehler beim Abrufen von GMGN:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen von GMGN API', details: error.message });
    }
});

// Route für Fourmemes (bleibt beim Platzhalter)
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
    res.send('Solana Memecoin Proxy is running. Use /pumpfun, /dexscreener, /dexscreener-pair-details/:tokenAddress, /gmgn, or /fourmemes endpoints.');
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy listening on port ${PORT}`);
});
