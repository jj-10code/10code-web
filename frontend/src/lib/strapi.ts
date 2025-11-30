import qs from 'qs';

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://strapi:1337';
const PUBLIC_STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface FetchOptions {
  endpoint: string;
  query?: Record<string, any>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - Query parameters to include in the request
 * @param wrappedByKey - The key to unwrap the response data from
 * @param wrappedByList - Whether the response data is wrapped in a list
 * @returns The response data from the Strapi API
 */
export async function fetchStrapi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: FetchOptions): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${STRAPI_URL}/api/${endpoint}`);

  if (query) {
    url.search = qs.stringify(query);
  }

  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`Failed to fetch data from Strapi: ${res.statusText}`);
    }

    let data = await res.json();

    if (wrappedByKey) {
      data = data[wrappedByKey];
    }

    if (wrappedByList) {
      data = data[0];
    }

    return data as T;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
}

/**
 * Get the full URL for a Strapi media file
 * @param url - The URL path from Strapi
 * @returns The full URL to the media file
 */
export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  // If the URL is already absolute, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Otherwise, prepend the Strapi URL
  return `${PUBLIC_STRAPI_URL}${url}`;
}

/**
 * Format a date string
 * @param dateString - The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
