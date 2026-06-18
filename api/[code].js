const MAP = {
  "2T5AF8G": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/welcome.json"
};

export default async function handler(req, res) {
  // URL'den kodu al (örnek: /api/2T5AF8G)
  const code = req.query.code;
  
  if (!code) {
    return res.status(400).json({ error: "Kod gerekli" });
  }

  const targetUrl = MAP[code];
  
  if (!targetUrl) {
    return res.status(404).json({ error: "Kod bulunamadı" });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu" });
  }
}
