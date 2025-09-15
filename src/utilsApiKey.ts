// Utilidad para obtener headers seguros con la API key
export function getApiKeyHeaders(extraHeaders?: Record<string, string>) {
  const apiKey = import.meta.env.VITE_API_KEY;
  return {
    ...(extraHeaders || {}),
    'x-api-key': apiKey
  };
}
