export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.pump.fun/api/tokens");
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Fehler bei Pump.fun" });
  }
}
