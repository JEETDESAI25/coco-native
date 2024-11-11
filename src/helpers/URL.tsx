/*
 * Helpers for creating API calls with network
 */

export function fromEndpointAndParams(
  endpoint: string,
  params: Record<string, string>,
): string {
  let result = endpoint;
  const queryChar = result.includes('?') ? '&' : '?';
  const queryParams = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

  return `${result}${queryChar}${queryParams}`;
}

export function parseDeepLinkURL(url: string): Record<string, string> | null {
  try {
    const queryStart = url.indexOf('?');
    if (queryStart === -1) return null;

    const queryString = url.slice(queryStart + 1);
    return queryString
      .split('&')
      .reduce((acc: Record<string, string>, param) => {
        const [key, value] = param.split('=');
        acc[decodeURIComponent(key)] = decodeURIComponent(value);
        return acc;
      }, {});
  } catch (err) {
    console.error('Error parsing deep link URL:', err);
    return null;
  }
}
