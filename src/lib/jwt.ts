/**
 * Reads a JWT payload on the client. The signature is not verified here — this
 * is only used for UI hints (e.g. "is this review mine?"). The API still
 * enforces authorization on every mutation.
 */
export function decodeJwtPayload<T extends Record<string, unknown>>(
  token: string,
): T | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
}
