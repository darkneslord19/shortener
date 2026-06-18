const MAP = {};

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const code = url.searchParams.get('code');

  if (!code) {
    return res.status(400).json({ error: "Lütfen bir kod girin" });
  }

  const targetUrl = MAP[code];

  if (!targetUrl) {
    return res.status(404).json({ error: "Bu kod bulunamadı" });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu" });
  }
}
