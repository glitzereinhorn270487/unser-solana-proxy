const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Moralis API Key aus Umgebungsvariablen laden
// process.env.MORALIS_API_KEY wird von Vercel automatisch bereitgestellt
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

// Basis-URL für die Moralis Solana API (kann variieren, siehe Moralis Doku für aktuelle Version)
// Dies ist ein gängiger Pfad, aber überprüfe die Moralis Doku für die V2.2 oder höher.
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2/solana';

// Überprüfung, ob der API-Key gesetzt ist (wichtig für die Fehlersuche)
if (!MORALIS_API_KEY) {
    console.error('ERROR: MORALIS_API_KEY ist in den Umgebungsvariablen nicht gesetzt!');
    // Eine robustere Anwendung würde hier den Start verhindern oder einen 500er-Fehler zurückgeben
    // bevor Anfragen verarbeitet werden. Für diesen Proxy lassen wir es weiterlaufen.
}


// Route für Pump.fun (bleibt vorerst beim internen Endpunkt, da Moralis keine Pump.fun-Listen bietet)
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

// NEUE Route für Dexscreener über Moralis
app.get('/dexscreener', async (req, res) => {
    try {
        // Moralis API-Aufruf, um die Top-Paare (oder ähnliche Daten) zu erhalten.
        // Die exakten Moralis-Endpunkte können variieren.
        // Beispiel: Abrufen von Top-Token-Preisen oder Swap-Daten auf Solana.
        // HINWEIS: Es gibt keinen direkten Moralis-Endpunkt, der "Top 10 Dexscreener Pairs" nach Marktanteil liefert,
        // wie der alte Dexscreener-Endpunkt. Moralis liefert eher Daten pro Token/Paar.
        // Du müsstest hier genau den Moralis-Endpunkt finden, der für deine Bedürfnisse am besten passt.
        // Ein gängiger Anwendungsfall wäre 'getPairAddresses' oder 'getTradeHistory'.
        // Für eine Liste von Token-Preisen könnte man 'getTokenPrice' für bekannte Token-Adressen nutzen.

        // Beispiel für Moralis API: Abrufen von "Top DEXs by Volume" oder ähnlichem,
        // um daraus Paare zu finden. Dieser Endpunkt existiert so nicht direkt in Moralis,
        // du müsstest spezifische Token-Adressen abfragen oder über Swap-Daten gehen.

        // Hier ist ein Platzhalter-Beispiel für einen Moralis-Aufruf, der Token-Preise abrufen *könnte*,
        // wenn du eine Liste von Token-Adressen hättest (was du für "Top 10 Paare" bräuchtest):
        // (Dies ist nur ein Beispiel, Moralis hat spezifische Endpunkte für DEX-Daten)
        const response = await axios.get(`${MORALIS_BASE_URL}/nft/getMultipleOwners`, { // <-- HIER MÜSSTEST DU DEN KORREKTEN MORALIS ENDPUNKT FÜR DEX-DATEN NUTZEN
            headers: {
                'X-API-Key': MORALIS_API_KEY,
                'Content-Type': 'application/json' // Oder 'application/json', je nach Moralis Doku
            },
            // Die Parameter hängen stark vom gewählten Moralis-Endpunkt ab.
            // Z.B. für DEX-Daten:
            // params: {
            //     exchange: 'orca', // Oder 'raydium', etc.
            //     limit: 10
            // }
            // Oder für spezifische Paare:
            // params: {
            //     pairAddress: '...',
            //     chain: 'solana'
            // }
            // Da wir "Top 10 Paare" wie bei Dexscreener wollen:
            // Moralis hat keinen direkten "Top-Liste"-Endpunkt. Du würdest entweder:
            // 1. Eine Liste bekannter Top-Token abfragen (getTokenPrice für jede).
            // 2. DEX-Transaktionshistorien analysieren, um "Top-Paare" zu identifizieren.
            // Dies erfordert mehr Logik als einen einfachen API-Aufruf.

            // Für einen initialen Test, um zu sehen, ob Moralis überhaupt antwortet,
            // können wir einen allgemeinen Moralis-Endpunkt nehmen, der Metadaten liefert.
            // Beispiel: getSOLPrice (aber das gibt dir nur den SOL-Preis, keine Token-Paare)
            // Oder: getTokenMetadata, wenn du eine Token-Adresse hättest.

            // VORSCHLAG FÜR ERSTEN TEST: Ein einfacher Moralis-Endpunkt, der funktioniert.
            // 'getSolanaWalletNFTs' ist ein einfacher Aufruf, der zeigt, ob dein API-Key funktioniert.
            // Du müsstest eine echte Wallet-Adresse als Parameter übergeben.
            // const response = await axios.get(`${MORALIS_BASE_URL}/wallet/<wallet_address>/nft`, { // Ersetze <wallet_address> mit einer echten SOL-Wallet
            //     headers: {
            //         'X-API-Key': MORALIS_API_KEY,
            //         'accept': 'application/json'
            //     },
            //     params: {
            //         chain: 'solana',
            //         format: 'decimal'
            //     }
            // });

            // Oder, um einen 404 zu vermeiden, aber Moralis-Anbindung zu testen:
            // Das ist der allgemeine Moralis Base URL, ohne /solana
            const testResponse = await axios.get('https://deep-index.moralis.io/api/v2.2/info/endpoints', {
                headers: { 'X-API-Key': MORALIS_API_KEY, 'accept': 'application/json' }
            });
            res.json(testResponse.data); // Das wird eine Liste von Moralis-Endpunkten zurückgeben, wenn der API-Key funktioniert.

        } catch (error) {
            console.error('Fehler beim Abrufen von Dexscreener über Moralis:', error.message);
            // Überprüfen, ob es ein Moralis-Fehler ist (z.B. 401 Unauthorized, 400 Bad Request)
            const errorDetails = error.response ? error.response.data : error.message;
            res.status(500).json({ error: 'Fehler beim Abrufen von Dexscreener API über Moralis', details: errorDetails });
        }
    }
);

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
