import { useEffect } from 'react';

const SITE_URL = 'https://intelleo.net';
const DEFAULT_TITLE = 'Intelleo - Security Intelligence Dashboard';
const DEFAULT_DESCRIPTION = 'Daily cybersecurity threat intelligence briefings in simple English. Free, accessible, and actionable security insights.';

function setMetaTag(attribute, value, content) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Sets document title, meta description, and Open Graph / Twitter tags.
 * Restores defaults on unmount.
 *
 * @param {{ title?: string, description?: string, path?: string, type?: string }} options
 */
export function useDocumentMeta({ title, description, path = '', type = 'website' } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Intelleo` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path}`;

    // Title
    document.title = fullTitle;

    // Standard meta
    setMetaTag('name', 'description', desc);

    // Open Graph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', url);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', desc);

    return () => {
      // Restore defaults on unmount
      document.title = DEFAULT_TITLE;
      setMetaTag('name', 'description', DEFAULT_DESCRIPTION);
      setMetaTag('property', 'og:title', DEFAULT_TITLE);
      setMetaTag('property', 'og:description', DEFAULT_DESCRIPTION);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:url', SITE_URL);
    };
  }, [title, description, path, type]);
}
