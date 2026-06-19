const MAP = {
  "1VSS1DG": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Shortener.json",
  "2MOR1GS": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/welcome.json",
  "KWQKDRQ": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/welcome.json",
  "NZTPHNA": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Dark.json",
  "BSRFPW2": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Met.json",
  "5IT7AVC": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Mer.json",
  "VPQS1WC": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Yet.json",
  "8333Y4H": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Fat.json",
  "QX4ZNOZ": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Ger.json",
  "1UY9FMZ": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Dark.json",
  "K3G0NOM": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Point.json",
  "1BZLIVL": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Semer.json",
  "KULA5X7": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/damar.json"
};

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const code = url.searchParams.get("code");
  if (!code) return res.status(400).json({ error: "Kod gerekli" });
  const targetUrl = MAP[code];
  if (!targetUrl) return res.status(404).json({ error: "Kod bulunamadı" });
  try { const response = await fetch(targetUrl); const data = await response.json(); res.status(200).json(data); } catch (error) { res.status(500).json({ error: "Hata" }); }
}