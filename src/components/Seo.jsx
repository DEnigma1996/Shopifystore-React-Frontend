import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const DEFAULT_TITLE = 'KnitWear Co. — Shopify Knit Store';
const DEFAULT_DESCRIPTION =
  'KnitWear Co. — Premium one-size-fits-all knitted wear for men and women.';
const DEFAULT_IMAGE = heroImage;

const buildTitle = (title) => {
  if (!title) return DEFAULT_TITLE;
  return title.includes('KnitWear Co.') ? title : `${title} | KnitWear Co.`;
};

const upsertMeta = (attr, name, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const removeMeta = (attr, name) => {
  const element = document.querySelector(`meta[${attr}="${name}"]`);
  if (element) element.remove();
};

const resolveUrl = (value) => {
  if (!value) return '';
  try {
    return new URL(value, window.location.origin).toString();
  } catch {
    return value;
  }
};

const upsertLink = (rel, href) => {
  if (!href) return;
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const upsertStructuredData = (data) => {
  const existing = document.getElementById('structured-data');
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  const element =
    existing ?? Object.assign(document.createElement('script'), {
      id: 'structured-data',
      type: 'application/ld+json',
    });
  element.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(element);
};

export default function Seo({
  title,
  description,
  image,
  type = 'website',
  canonical,
  robots = 'index, follow',
  structuredData,
}) {
  const location = useLocation();

  useEffect(() => {
    const resolvedTitle = buildTitle(title);
    const resolvedDescription = description || DEFAULT_DESCRIPTION;
    const resolvedImage = resolveUrl(image || DEFAULT_IMAGE);
    const resolvedCanonical =
      canonical ||
      `${window.location.origin}${location.pathname}${location.search}`;

    document.title = resolvedTitle;
    upsertMeta('name', 'description', resolvedDescription);
    upsertMeta('property', 'og:title', resolvedTitle);
    upsertMeta('property', 'og:description', resolvedDescription);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', resolvedCanonical);
    upsertMeta('property', 'og:image', resolvedImage);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', resolvedTitle);
    upsertMeta('name', 'twitter:description', resolvedDescription);
    upsertMeta('name', 'twitter:image', resolvedImage);
    if (robots) {
      upsertMeta('name', 'robots', robots);
    } else {
      removeMeta('name', 'robots');
    }
    upsertLink('canonical', resolvedCanonical);
    upsertStructuredData(structuredData);
  }, [
    title,
    description,
    image,
    type,
    canonical,
    robots,
    structuredData,
    location.pathname,
    location.search,
  ]);

  return null;
}
