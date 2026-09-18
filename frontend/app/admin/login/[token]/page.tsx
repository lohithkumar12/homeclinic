"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminLogin, setToken } from "@/lib/api";
import { ADMIN_LOGIN_SECRET, rememberAdminLoginPath } from "@/lib/admin";

export default function SecretAdminLoginPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token === ADMIN_LOGIN_SECRET) {
      rememberAdminLoginPath();
      setAllowed(true);
    } else {
      router.replace("/");
    }
  }, [token, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await adminLogin(email, password);
      setToken(data.access_token);
      router.push("/admin");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (!allowed) {
    return (
      <main className="container page">
        <p className="muted">Loading…</p>
      </main>
    );
  }

  return (
    <main>
      <header className="topbar">
        <div className="container topbar-inner">
          <Link className="topbar-brand" href="/">
            <span className="logo-mark" aria-hidden>
              +
            </span>
            <span className="logo-text">HomeClinic</span>
          </Link>
        </div>
      </header>
      <div className="container page">
        <form className="panel stack" style={{ maxWidth: 420, margin: "2rem auto" }} onSubmit={onSubmit}>
          <h1>Clinic login</h1>
          <p className="muted">Staff dashboard for reviewing patient requests.</p>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <div className="alert alert-urgent">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
