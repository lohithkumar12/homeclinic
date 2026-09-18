/** Secret admin login path helpers (password still required). */

export const ADMIN_LOGIN_SECRET =
  process.env.NEXT_PUBLIC_ADMIN_LOGIN_SECRET || "12345678901234567abcdsed";

export function getAdminLoginPath(): string {
  return `/admin/login/${ADMIN_LOGIN_SECRET}`;
}

export function rememberAdminLoginPath(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("hc_admin_login_path", getAdminLoginPath());
}

export function resolveAdminLoginPath(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("hc_admin_login_path");
    if (stored) return stored;
  }
  return getAdminLoginPath();
}
