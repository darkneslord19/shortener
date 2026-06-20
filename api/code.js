const MAP = {
  "NU88U7I": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Merhaba.json",
  "Z2VU9NT": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/welcome.json",
  "NJUH2W9": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/damar.json",
  "WNYYPGN": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Semer.json",
  "1AUPVDH": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Point.json",
  "W7F57OF": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Federasyon.json",
  "4QDRUJF": "https://raw.githubusercontent.com/darkneslord19/pasteler/main/pastes/Dltest.json",
  "LTMS479": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Noel.json"
};

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const code = url.searchParams.get("code");
  if (!code) return res.status(400).json({ error: "Kod gerekli" });
  const targetUrl = MAP[code];
  if (!targetUrl) return res.status(404).json({ error: "Kod bulunamadı" });
  try { const response = await fetch(targetUrl); const data = await response.json(); res.status(200).json(data); } catch (error) { res.status(500).json({ error: "Hata" }); }
}