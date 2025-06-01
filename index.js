const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Moralis API Key aus Umgebungsvariablen laden
// process.env.MORALIS_API_KEY wird von Vercel automatisch bereitgestellt
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

// KORRIGIERTE BASIS-URL für die Moralis Solana API
// Dies ist die korrekte Gateway-URL für Solana-spezifische Endpunkte
const MORALIS_BASE_URL = 'https://solana-gateway.moralis.io';

// Überprüfung, ob der API-Key gesetzt ist (wichtig für die Fehlersuche)
if (!MORALIS_API_KEY) {
    console.error('ERROR: MORALIS_API_KEY ist in den Umgebungsvariablen nicht gesetzt oder leer!');
} else {
    // Logge nur einen Teil des Schlüssels, niemals den ganzen aus Sicherheitsgründen!
    console.log(`MORALIS_API_KEY read successfully: ${MORALIS_API_KEY.substring(0, 5)}... (truncated)`);
}

// Route für Pump.fun (jetzt über den spezifischen Moralis Pump.fun Endpunkt)
app.get('/pumpfun', async (req, res) => {
    try {
        const network = 'mainnet'; // Das Netzwerk für Solana
        const exchangeIdentifier = 'pumpfun'; // Der spezifische Bezeichner für Pump.fun in der Moralis API

        // Der korrekte Moralis-Endpunkt für neue Pump.fun-Tokens
        const moralisPumpFunUrl = `${MORALIS_BASE_URL}/token/${network}/exchange/${exchangeIdentifier}/new`;

        const response = await axios.get(moralisPumpFunUrl, {
            headers: {
                'Authorization': `Bearer ${MORALIS_API_KEY}`,
                'accept': 'application/json'
            },
            params: {
                limit: 100 // Optional: Limitiere die Anzahl der zurückgegebenen Tokens
            }
        });

        // Die Antwort von Moralis wird direkt zurückgegeben
        res.json(response.data);

    } catch (error) {
        console.error('Fehler beim Abrufen von Pump.fun API über Moralis:', error.message);
        const errorDetails = error.response ? error.response.data : error.message;
        res.status(500).json({ error: 'Fehler beim Abrufen von Pump.fun API über Moralis', details: errorDetails });
    }
});

            params: {
                exchange: exchangeName // Der Query-Parameter für die Exchange
            }
        });

        // Die Antwort von Moralis wird direkt zurückgegeben
        res.json(response.data);

    } catch (error) {
        console.error('Fehler beim Abrufen von Pump.fun über Moralis:', error.message);
        const errorDetails = error.response ? error.response.data : error.message;
        res.status(500).json({ error: 'Fehler beim Abrufen von Pump.fun API über Moralis', details: errorDetails });
    }
});


// Route für Dexscreener über Moralis
app.get('/dexscreener', async (req, res) => {
    try {
        const wSOL_TOKEN_ADDRESS = 'So11111111111111111111111111111111111111112';
        const network = 'mainnet'; // Das Netzwerk muss als Teil des Pfades übergeben werden

        // Der axios-Aufruf verwendet jetzt die korrigierte Basis-URL
        const response = await axios.get(`${MORALIS_BASE_URL}/token/${network}/${wSOL_TOKEN_ADDRESS}/price`, {
            headers: {
                'Authorization': `Bearer ${MORALIS_API_KEY}`, // Authentifizierung mit JWT als Bearer-Token
                'accept': 'application/json'
            },
            // Der 'params' Block für 'chain' wird hier nicht benötigt, da 'network' im Pfad ist.
        });
        res.json(response.data); // Sollte die Preisdaten von wSOL zurückgeben

    } catch (error) {
        console.error('Fehler beim Abrufen von Dexscreener über Moralis:', error.message);
        const errorDetails = error.response ? error.response.data : error.message;
        res.status(500).json({ error: 'Fehler beim Abrufen von Dexscreener API über Moralis', details: errorDetails });
    }
});

// Route für GMGN
app.get('/gmgn', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/gmgn-data'); // PLATZHALTER! ERSETZEN!
        res.json(response.data);
    } catch (error) {
        console.error('Fehler beim Abrufen von GMGN:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen von GMGN API', details: error.message });
    }
});

// Route für Fourmemes
app.get('/fourmemes', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/fourmemes-data'); // PLATZHALTER! ERSETZEN!
        res.json(response.data);
    } catch (error) {
        console.error('Fehler beim Abrufen von Fourmemes:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen von Fourmemes API', details: error.message });
    }
});

// Standard-Route
app.get('/', (req, res) => {
    res.send('Solana Memecoin Proxy is running. Use /pumpfun, /dexscreener, /gmgn, or /fourmemes endpoints.');
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy listening on port ${PORT}`);
});
