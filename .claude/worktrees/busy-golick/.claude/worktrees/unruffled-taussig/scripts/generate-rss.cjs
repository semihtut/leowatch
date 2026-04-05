#!/usr/bin/env node

/**
 * Generate RSS 2.0 feed from index.json briefings
 * Usage: node scripts/generate-rss.cjs
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://intelleo.net';
const FEED_TITLE = 'Intelleo - Security Intelligence';
const FEED_DESCRIPTION = 'Daily cybersecurity threat intelligence briefings in simple English. Free, accessible, and actionable security insights.';

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRss() {
  const indexPath = path.join(__dirname, '..', 'public', 'data', 'index.json');

  if (!fs.existsSync(indexPath)) {
    console.error('Error: index.json not found at', indexPath);
    process.exit(1);
  }

  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const briefings = indexData.briefings || [];

  // Take latest 30 briefings for the feed
  const feedBriefings = briefings.slice(0, 30);

  const now = new Date().toUTCString();

  const items = feedBriefings.map((b) => {
    const pubDate = new Date(b.date + 'T12:00:00Z').toUTCString();
    const link = `${SITE_URL}/briefing/${b.id}`;
    const categories = [
      ...(b.tags || []),
      b.severity ? `severity:${b.severity}` : null,
    ].filter(Boolean);

    return `    <item>
      <title>${escapeXml(b.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(b.excerpt || '')}</description>
      <pubDate>${pubDate}</pubDate>
${categories.map((c) => `      <category>${escapeXml(c)}</category>`).join('\n')}
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/shield.svg</url>
      <title>${escapeXml(FEED_TITLE)}</title>
      <link>${SITE_URL}</link>
    </image>
${items.join('\n')}
  </channel>
</rss>
`;

  const outputPath = path.join(__dirname, '..', 'public', 'feed.xml');
  fs.writeFileSync(outputPath, rss, 'utf-8');
  console.log(`RSS feed generated: ${outputPath}`);
  console.log(`  ${feedBriefings.length} briefings included`);
}

generateRss();
