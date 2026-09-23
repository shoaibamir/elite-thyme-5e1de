const fs = require('fs');
const path = require('path');
const { sourcebitDataClient } = require('sourcebit-target-next');

const SITE_URL = (process.env.SITE_URL || 'https://pakistancargoexpress.com').replace(/\/$/, '');
const OUT_DIR = path.join(__dirname, '..', 'out');

function escapeXml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

async function generateSitemap() {
    const paths = await sourcebitDataClient.getStaticPaths();
    const allPaths = ['/', ...paths.filter((urlPath) => urlPath !== '/')];

    const indexablePaths = [];
    for (const urlPath of allPaths) {
        const props = await sourcebitDataClient.getStaticPropsForPageAtPath(urlPath);
        const robots = props && props.page && props.page.seo && props.page.seo.robots;
        const isNoindex = Array.isArray(robots) && robots.includes('noindex');
        if (isNoindex) {
            console.log(`generate-sitemap: excluding noindex page ${urlPath}`);
            continue;
        }
        indexablePaths.push(urlPath);
    }

    const urlEntries = indexablePaths
        .map((urlPath) => {
            const loc = escapeXml(SITE_URL + urlPath.replace(/\/?$/, '/'));
            return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

    if (!fs.existsSync(OUT_DIR)) {
        throw new Error(`generate-sitemap: "out" directory not found at ${OUT_DIR} - run "next build" first`);
    }

    fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), xml);
    console.log(`generate-sitemap: wrote ${indexablePaths.length} URLs to out/sitemap.xml`);
}

generateSitemap().catch((err) => {
    console.error('generate-sitemap: failed', err);
    process.exit(1);
});
