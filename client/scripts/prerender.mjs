import { promises as fs, createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

const ROUTES = ['/home', '/privacy-policy', '/terms-of-service', '/accessibility'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const startServer = () =>
  new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const candidate = path.join(distDir, urlPath);
      const tryServe = filePath => {
        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
          return false;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        createReadStream(filePath).pipe(res);

        return true;
      };

      if (tryServe(candidate)) {
        return;
      }

      if (tryServe(path.join(candidate, 'index.html'))) {
        return;
      }

      tryServe(path.join(distDir, 'index.html'));
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });

const waitForRouteContent = async page => {
  await page.waitForSelector('main h1, h1', { timeout: 15000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
};

const sanitizeRendered = async page => {
  await page.evaluate(() => {
    document.querySelectorAll('script[type="application/json"][id^="prerender"]').forEach(node => {
      node.remove();
    });
  });
};

const MOTION_STYLE_RE = /(transform|will-change|opacity|transform-origin|perspective)\b/i;

const stripMotionStyles = html => {
  return html.replace(/\sstyle="([^"]*)"/g, (full, value) => {
    if (!MOTION_STYLE_RE.test(value)) {
      return full;
    }
    const kept = value
      .split(';')
      .map(decl => decl.trim())
      .filter(decl => decl && !MOTION_STYLE_RE.test(decl.split(':')[0] || ''))
      .join('; ');
    return kept ? ` style="${kept}"` : '';
  });
};

const prerenderRoute = async (launchOptions, baseUrl, route) => {
  const browser = await chromium.launch(launchOptions);

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      locale: 'he-IL',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.addInitScript(() => {
      const realSetInterval = window.setInterval;
      const realSetTimeout = window.setTimeout;
      window.setInterval = () => 0;
      window.setTimeout = (fn, delay, ...args) => {
        if (typeof delay === 'number' && delay > 250) return 0;
        return realSetTimeout.call(window, fn, delay, ...args);
      };
      window.__realSetInterval = realSetInterval;
      window.__realSetTimeout = realSetTimeout;
    });

    const url = `${baseUrl}${route}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await waitForRouteContent(page);
    await sanitizeRendered(page);

    const html = stripMotionStyles(await page.content());
    const outPath = path.join(distDir, route.replace(/^\//, ''), 'index.html');
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf-8');

    const sizeKb = (Buffer.byteLength(html) / 1024).toFixed(1);
    console.log(`  ✓ ${route} -> ${path.relative(distDir, outPath)} (${sizeKb} KB)`);
  } finally {
    await browser.close();
  }
};

const resolveLaunchOptions = async () => {
  if (process.env.VERCEL) {
    const sparticuz = (await import('@sparticuz/chromium')).default;
    return {
      args: sparticuz.args,
      executablePath: await sparticuz.executablePath(),
      headless: true,
    };
  }

  return { headless: true };
};

const main = async () => {
  if (!existsSync(distDir)) {
    throw new Error(`dist directory not found at ${distDir}. Run "vite build" first.`);
  }

  console.log('[prerender] starting static server + chromium');
  const { server, port } = await startServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  const launchOptions = await resolveLaunchOptions();

  const failures = [];

  try {
    for (const route of ROUTES) {
      try {
        await prerenderRoute(launchOptions, baseUrl, route);
      } catch (err) {
        failures.push({ route, err });
        console.error(`  ✗ ${route} failed: ${err?.message || err}`);
      }
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }

  if (failures.length > 0) {
    console.error(`[prerender] ${failures.length}/${ROUTES.length} route(s) failed`);
    process.exit(1);
  }

  console.log('[prerender] done');
};

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
