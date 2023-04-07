export function responseHeaders(response: Response): Record<string, string> {
  return Object.fromEntries((response.headers as any).entries())
}
