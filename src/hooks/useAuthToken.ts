"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthTokenState = {
  /** Raw NextAuth status. "loading" means the session is not known yet. */
  status: AuthStatus;
  /** Routemisr JWT, or null when there is no usable session. */
  token: string | null;
  /** True while NextAuth is still resolving the session. */
  isLoading: boolean;
  /** True only when the session is resolved and a token exists. */
  isAuthenticated: boolean;
  /** Store a freshly issued API JWT in the NextAuth session. */
  setToken: (nextToken: string) => Promise<void>;
};

/**
 * One place to answer: "is the session ready, and do I have a token?".
 *
 * `useSession()` starts as `{ data: null, status: "loading" }`, so
 * `session?.user?.token` is undefined on the first render by design.
 * Wait for `isLoading` to be false, then check `token`/`isAuthenticated`.
 */
export function useAuthToken(): AuthTokenState {
  const { data: session, status, update } = useSession();
  const token = session?.user?.token ?? null;

  const setToken = useCallback(
    async (nextToken: string) => {
      // Reaches the `jwt` callback with `trigger: "update"` and `session.token`.
      await update({ token: nextToken });
    },
    [update],
  );

  return {
    status,
    token,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated" && token !== null,
    setToken,
  };
}
