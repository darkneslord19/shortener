const MAP = {
  "1VSS1DG": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Shortener.json",
  "2MOR1GS": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/welcome.json",
  "KWQKDRQ": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/welcome.json",
  "NZTPHNA": "https://raw.githubusercontent.com/darkneslord19/darkneslord/main/pastes/Dark.json",
  "BSRFPW2": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Met.json",
  "5IT7AVC": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Mer.json",
  "VPQS1WC": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Yet.json",
  "8333Y4H": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Fat.json",
  "QX4ZNOZ": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/Ger.json"
};

// Cache sistemi
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 dakika

// Rate limiting için basit sayaç
const rateLimit = new Map();

export default async function handler(req, res) {
  // CORS ayarları
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS isteklerini yanıtla
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sadece GET isteklerine izin ver
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: "Method Not Allowed",
      message: "Sadece GET istekleri kabul edilir"
    });
  }

  try {
    // Rate limiting (IP bazlı)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const limitKey = `rate_${ip}`;
    const userRate = rateLimit.get(limitKey) || { count: 0, reset: now + 60000 };
    
    if (now > userRate.reset) {
      userRate.count = 0;
      userRate.reset = now + 60000;
    }
    
    userRate.count++;
    rateLimit.set(limitKey, userRate);
    
    if (userRate.count > 30) { // Dakikada 30 istek
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Çok fazla istek gönderdiniz. Lütfen 1 dakika bekleyin."
      });
    }

    // URL ve parametre kontrolü
    const url = new URL(req.url, `http://${req.headers.host}`);
    const code = url.searchParams.get("code");
    
    if (!code) {
      return res.status(400).json({ 
        error: "Bad Request",
        message: "Kod gerekli. Örnek: ?code=1VSS1DG"
      });
    }

    // Kod doğrulama (sadece alfanumerik, 7 karakter)
    if (!/^[A-Z0-9]{7}$/.test(code)) {
      return res.status(400).json({ 
        error: "Invalid Code",
        message: "Kod 7 karakter uzunluğunda ve büyük harf/rakam içermeli"
      });
    }

    // MAP'te kontrol
    const targetUrl = MAP[code];
    if (!targetUrl) {
      return res.status(404).json({ 
        error: "Not Found",
        message: `"${code}" kodu için kayıt bulunamadı`
      });
    }

    // Cache kontrolü
    const cacheKey = `data_${code}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log(`✅ Cache hit: ${code} (${ip})`);
      return res.status(200).json({
        success: true,
        data: cached.data,
        fromCache: true,
        code: code
      });
    }

    console.log(`🔄 Fetching: ${code} (${ip})`);
    
    // Fetch işlemi
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 saniye timeout
    
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MyApp/1.0',
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache'e kaydet
    cache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    });

    // Başarılı yanıt
    res.status(200).json({
      success: true,
      data: data,
      fromCache: false,
      code: code,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Hata yönetimi
    console.error('❌ Hata:', error.message);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: "Timeout",
        message: "İstek zaman aşımına uğradı. Lütfen tekrar deneyin."
      });
    }
    
    res.status(500).json({ 
      error: "Server Error",
      message: process.env.NODE_ENV === 'development' ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin."
    });
  }
}

// Cache temizleme (her 5 dakikada bir)
setInterval(() => {
  const now = Date.now();
  let deletedCount = 0;
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
      deletedCount++;
    }
  }
  if (deletedCount > 0) {
    console.log(`🧹 Cache temizlendi: ${deletedCount} kayıt silindi`);
  }
}, CACHE_TTL);

// Rate limit temizleme (her dakika)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.reset) {
      rateLimit.delete(key);
    }
  }
}, 60000);

// Kullanım istatistikleri (opsiyonel endpoint)
export async function stats(req, res) {
  if (req.method === 'GET' && req.url.includes('/stats')) {
    return res.status(200).json({
      cacheSize: cache.size,
      rateLimitSize: rateLimit.size,
      totalCodes: Object.keys(MAP).length,
      availableCodes: Object.keys(MAP),
      timestamp: new Date().toISOString()
    });
  }
}
