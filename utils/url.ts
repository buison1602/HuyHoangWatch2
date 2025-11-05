export function withQuery(
  path: string,
  params: Record<string, string | string[] | undefined>
): string {
  const url = new URL(
    path,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  );
  
  const sp =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    sp.delete(k);
    Array.isArray(v) ? v.forEach((val) => sp.append(k, val)) : sp.set(k, v);
  }

  const qs = sp.toString();
  return url.pathname + (qs ? `?${qs}` : '');
}
