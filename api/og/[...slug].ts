// Vercel Edge Function to serve Open Graph meta tags for berita pages
// This intercepts crawler requests and injects proper meta tags into the HTML

export const config = {
  runtime: 'edge',
};

// List of crawler user agents
const crawlers = [
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'pinterest',
  'slackbot',
  'whatsapp',
  'googlebot',
  'bingbot',
  'duckduckbot',
  'telegrambot',
];

function isCrawler(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return crawlers.some(crawler => ua.includes(crawler));
}

function generateHtmlWithMetaTags(
  originalHtml: string,
  title: string,
  description: string,
  imageUrl: string,
  url: string
): string {
  // Find the head tag and inject meta tags after it
  const metaTags = `
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${title.replace(/"/g, '&quot;')}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <link rel="canonical" href="${url}" />
  `;

  // Inject meta tags after the <head> tag
  return originalHtml.replace(
    /<head>/i,
    `<head>${metaTags}`
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const userAgent = req.headers.get('user-agent') || '';

  // Only handle berita routes
  const pathname = url.pathname;
  if (!pathname.startsWith('/berita/') || pathname === '/berita' || pathname === '/berita/') {
    // Not a berita detail page, return default response
    return new Response('Not found', { status: 404 });
  }

  // Extract slug from pathname
  const slug = pathname.replace('/berita/', '').split('/')[0];

  // Check if it's a crawler
  if (!isCrawler(userAgent)) {
    // Not a crawler, redirect to the actual page (let SPA handle it)
    return new Response(null, {
      status: 307,
      headers: {
        'Location': pathname,
      },
    });
  }

  try {
    // Fetch berita data from API
    const apiBaseUrl = process.env.API_URL || 'https://api-lpm.test/api';
    const apiUrl = `${apiBaseUrl}/public/beritas/${slug}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'X-Language': 'id',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error('Invalid API response');
    }

    const berita = data.data;

    // Build full URLs
    const baseUrl = url.origin;
    const fullUrl = `${baseUrl}/berita/${berita.slug}`;
    const imageUrl = berita.gambar
      ? (berita.gambar.startsWith('http') ? berita.gambar : `${baseUrl}${berita.gambar}`)
      : `${baseUrl}/og-default.jpg`;

    // Extract description
    const excerpt = berita.excerpt || berita.konten || '';
    const plainText = stripHtml(excerpt);
    const description = truncateText(plainText, 160);

    // Get title
    const title = berita.meta_title || berita.judul;

    // Read the index.html file
    // In production, this should be cached or pre-loaded
    const indexHtmlResponse = await fetch(new URL('/index.html', url.origin));
    const indexHtml = await indexHtmlResponse.text();

    // Inject meta tags and return
    const htmlWithMeta = generateHtmlWithMetaTags(
      indexHtml,
      title,
      description,
      imageUrl,
      fullUrl
    );

    return new Response(htmlWithMeta, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching berita for OG tags:', error);

    // On error, return the default index.html
    try {
      const indexHtmlResponse = await fetch(new URL('/index.html', url.origin));
      const indexHtml = await indexHtmlResponse.text();
      return new Response(indexHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    } catch {
      return new Response('Error loading page', { status: 500 });
    }
  }
}
