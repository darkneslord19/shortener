const MAP = {
  "1VSS1DG": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Shortener.json",
  "2MOR1GS": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/welcome.json",
  "SLP2FV5": "https://raw.githubusercontent.com/darkneslord19/shortener/refs/heads/main/index.html",
  "YOE4OGR": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Denk.json",
  "TDVLA68": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Katy.json"
};

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const code = url.searchParams.get("code");
  if (!code) return res.status(400).json({ error: "Kod gerekli" });
  const targetUrl = MAP[code];
  if (!targetUrl) return res.status(404).json({ error: "Kod bulunamadı" });
  try { const response = await fetch(targetUrl); const data = await response.json(); res.status(200).json(data); } catch (error) { res.status(500).json({ error: "Hata" }); }
}