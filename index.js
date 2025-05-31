const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // CORS für alle Anfragen aktivieren

// Route für Pump.fun
app.get('/pumpfun', async (req, res) => {
  try {
    // Dies ist ein bekannter Endpunkt für eine Liste von Pump.fun Coins
    const response = await axios.get('https://api.pump.fun/coins');
    res.json(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen von Pump.fun:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen von Pump.fun API', details: error.message });
  }
});

// Route für Dexscreener
app.get('/dexscreener', async (req, res) => {
  try {
    // Beispiel-URL, die die ersten 10 Paare für Solana abruft.
    // Du kannst 'limit=10' entfernen oder anpassen.
    const response = await axios.get('https://api.dexscreener.com/latest/dexes/solana/pairs?limit=10');
    res.json(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen von Dexscreener:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen von Dexscreener API', details: error.message });
  }
});

// Route für GMGN (angenommene API-URL, da keine offizielle GMGN-API bekannt ist)
app.get('/gmgn', async (req, res) => {
  try {
    // *** WICHTIG: ERSETZE DIESE URL durch die ECHTE GMGN API-URL! ***
    // Wenn GMGN keine öffentliche API hat, müssen wir hier eine andere Lösung finden (z.B. Web Scraping, ist aber komplexer).
    // Für den Test könntest du hier eine einfache Test-URL verwenden, die JSON zurückgibt, z.B.
    // 'https://jsonplaceholder.typicode.com/todos/1'
    const response = await axios.get('https://api.example.com/gmgn-data'); // PLATZHALTER! ERSETZEN!
    res.json(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen von GMGN:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen von GMGN API', details: error.message });
  }
});

// Route für Fourmemes (angenommene API-URL, da keine offizielle API bekannt ist)
app.get('/fourmemes', async (req, res) => {
    try {
        // *** WICHTIG: ERSETZE DIESE URL durch die ECHTE FOURMEMES API-URL! ***
        // Wenn Fourmemes keine öffentliche API hat, müssen wir hier eine andere Lösung finden.
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
  // In einer Vercel-Umgebung ist localhost nicht direkt zugänglich,
  // aber diese Log-Meldung ist gut für lokale Tests.
  console.log(`Access at: http://localhost:${PORT}`);
});
