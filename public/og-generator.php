<?php
/**
 * OG Meta Tags Generator for Berita Pages
 * Serve sebagai HTML dengan meta tag OG untuk social media crawler
 *
 * Cara install di VPS:
 * 1. Simpan file ini di /var/www/og-generator/public/ atau folder public website
 * 2. Include snippet Nginx di bawah ke config Nginx website
 */

// CORS & cache headers
header('Content-Type: text/html; charset=UTF-8');
header('X-Robots-Tag: noindex, nofollow');

// Konfigurasi
$API_BASE = 'https://api-lpm.radenfatah.ac.id/api'; // Ganti dengan URL API production
$DEFAULT_IMAGE = 'https://lpm.radenfatah.ac.id/og-default.svg';

// Parse slug dari URL query parameter (dari Nginx rewrite)
// Fallback: parse dari path jika tidak ada query param
$slug = $_GET['slug'] ?? null;
if (!$slug) {
    $requestUri = $_SERVER['REQUEST_URI'];
    $path = parse_url($requestUri, PHP_URL_PATH);
    if (preg_match('#^/berita/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $slug = $matches[1];
    }
}

if (!$slug) {
    http_response_code(400);
    echo '<p>Missing slug parameter</p>';
    exit;
}
$berita = null;
$error = null;

// Fetch dari API
try {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Accept: application/json\r\nX-Language: id\r\n",
            'timeout' => 10,
            'ignore_errors' => true,
        ]
    ]);

    $response = @file_get_contents("$API_BASE/public/beritas/$slug", false, $context);

    if ($response === false) {
        throw new Exception('API request failed');
    }

    $json = json_decode($response, true);

    if (!$json || !($json['success'] ?? false) || !isset($json['data'])) {
        throw new Exception('Invalid API response');
    }

    $berita = $json['data'];

} catch (Exception $e) {
    $error = $e->getMessage();
}

// Helper functions
function stripHtmlTags($html) {
    return preg_replace('/<[^>]*>/', ' ', $html ?? '');
}

function esc($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

function truncate($text, $maxLen = 160) {
    $text = trim($text);
    if (mb_strlen($text) <= $maxLen) return $text;
    return mb_substr($text, 0, $maxLen) . '…';
}

function getImageUrl($gambar, $baseUrl) {
    if (empty($gambar)) return $baseUrl;
    if (str_starts_with($gambar, 'http')) return $gambar;
    if (str_starts_with($gambar, '/')) return "https://lpm.radenfatah.ac.id$gambar";
    return "https://lpm.radenfatah.ac.id/$gambar";
}

// Jika error atau berita tidak ditemukan
if ($berita === null) {
    http_response_code(404);
    echo '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Berita Tidak Ditemukan</title></head><body><p>Berita tidak ditemukan</p></body></html>';
    exit;
}

// Siapkan data
$title = esc($berita['meta_title'] ?? $berita['judul']);
$description = truncate(stripHtmlTags($berita['excerpt'] ?? $berita['konten'] ?? ''), 160);
$imageUrl = esc(getImageUrl($berita['gambar'] ?? null, $DEFAULT_IMAGE));
$url = 'https://lpm.radenfatah.ac.id/berita/' . $berita['slug'];
$kategori = esc($berita['kategori']['nama'] ?? 'Berita');
$author = esc($berita['author']['username'] ?? 'LPM UIN Raden Fatah');
$publishedTime = esc($berita['created_at'] ?? '');
$tags = [];
if (!empty($berita['tags']) && is_array($berita['tags'])) {
    foreach ($berita['tags'] as $tag) {
        $tags[] = esc($tag['nama']);
    }
}
$tagsMeta = !empty($tags)
    ? "\n" . implode("\n", array_map(fn($t) => "  <meta property=\"article:tag\" content=\"$t\" />", $tags))
    : '';

// Output HTML dengan meta tag OG
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= $title ?></title>
  <meta name="description" content="<?= $description ?>" />
  <link rel="canonical" href="<?= esc($url) ?>" />
  <meta name="robots" content="noindex, nofollow" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="<?= $title ?>" />
  <meta property="og:description" content="<?= $description ?>" />
  <meta property="og:image" content="<?= $imageUrl ?>" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="<?= $title ?>" />
  <meta property="og:url" content="<?= esc($url) ?>" />
  <meta property="og:site_name" content="LPM UIN Raden Fatah Palembang" />
  <meta property="og:locale" content="id_ID" />
  <meta property="article:published_time" content="<?= $publishedTime ?>" />
  <meta property="article:author" content="<?= $author ?>" />
  <meta property="article:section" content="<?= $kategori ?>" />
<?= $tagsMeta . "\n" ?>

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= $title ?>" />
  <meta name="twitter:description" content="<?= $description ?>" />
  <meta name="twitter:image" content="<?= $imageUrl ?>" />
  <meta name="twitter:image:alt" content="<?= $title ?>" />
  <meta name="twitter:site" content="@lpmuinrdf" />

  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .card {
      background: #1e3a5f;
      border-radius: 16px;
      max-width: 640px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,.5);
    }
    .card-img-wrap { position: relative; width: 100%; height: 340px; overflow: hidden; }
    .card-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .card-img-fallback {
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #0284c7 100%);
      display: flex; align-items: center; justify-content: center;
    }
    .card-img-fallback span { font-size: 4rem; }
    .card-badge {
      position: absolute; top: 16px; left: 16px;
      background: #fbbf24; color: #1e3a5f;
      font-size: 0.7rem; font-weight: 800;
      text-transform: uppercase; letter-spacing: .08em;
      padding: 4px 12px; border-radius: 99px;
    }
    .card-body { padding: 1.5rem; }
    .card-title { font-size: 1.2rem; font-weight: 700; color: #fff; line-height: 1.4; margin-bottom: .75rem; }
    .card-desc { font-size: .875rem; color: #94a3b8; line-height: 1.65; }
    .card-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255,255,255,.08);
      display: flex; align-items: center; gap: .5rem;
    }
    .card-logo { width: 24px; height: 24px; border-radius: 6px; background: #fbbf24; flex-shrink: 0; }
    .card-site { font-size: .75rem; color: #475569; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-img-wrap">
      <img class="card-img" src="<?= $imageUrl ?>" alt="<?= $title ?>"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
      <div class="card-img-fallback" style="display:none"><span>📰</span></div>
      <div class="card-badge"><?= $kategori ?></div>
    </div>
    <div class="card-body">
      <div class="card-title"><?= $title ?></div>
      <div class="card-desc"><?= $description ?></div>
    </div>
    <div class="card-footer">
      <div class="card-logo"></div>
      <span class="card-site">LPM UIN Raden Fatah Palembang</span>
    </div>
  </div>
</body>
</html>
<?php
