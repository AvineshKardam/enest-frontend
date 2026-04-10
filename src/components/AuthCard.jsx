import { useEffect, useRef, useState } from "react";
import { Globe, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";

function loadGoogleScript() {
  const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
  if (existing) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load Google Sign-In"));
    document.head.appendChild(script);
  });
}

export function AuthCard({ onCredential, loading }) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  function chooseAccount() {
    try {
      if (!window.google?.accounts?.id) return;
      // Force the account chooser instead of silently reusing the last account.
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.prompt();
    } catch (e) {
      // ignore
    }
  }

  function signInNow() {
    if (!window.google?.accounts?.id) {
      setError("Google Sign-In is not ready yet. Please wait a moment and try again.");
      return;
    }

    setError("");
    window.google.accounts.id.disableAutoSelect();
    window.google.accounts.id.prompt();
  }

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Missing VITE_GOOGLE_CLIENT_ID in client/.env");
      return undefined;
    }

    let cancelled = false;
    setReady(false);
    setError("");
    setScriptLoaded(false);

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !buttonRef.current) {
          return;
        }

        setScriptLoaded(true);
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              onCredential(response.credential);
            }
          },
        });

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: "320",
          text: "signin_with",
        });

        setReady(true);
      })
      .catch((loadError) => {
        setError(loadError.message || "Google Sign-In could not be loaded");
      });

    return () => {
      cancelled = true;
      try {
        window.google?.accounts?.id?.cancel?.();
      } catch {
        // ignore
      }
      if (buttonRef.current) {
        buttonRef.current.innerHTML = "";
      }
    };
  }, [onCredential]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
          <LockKeyhole className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Sign in to Expense Tracker
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-slate-500">
          Google authentication is required before you can add, review, filter, or
          delete expenses.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Protected dashboard access
          </div>
          <p className="text-sm text-slate-500">
            Your session starts only after Google verifies your account and the backend
            issues a signed app session.
          </p>
        </div>

        <div className="mt-6 flex min-h-12 items-center justify-center">
          {loading ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing you in...
            </div>
          ) : (
            <div className="w-full max-w-[320px]">
              <div ref={buttonRef} className="min-h-[44px]" />

              <button
                type="button"
                onClick={signInNow}
                disabled={!scriptLoaded}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Globe className="h-4 w-4 text-slate-600" />
                Sign in with Google
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={chooseAccount}
            disabled={!ready || loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Choose another Gmail
          </button>
        </div>

        {!ready && !loading && !error ? (
          <p className="mt-4 text-center text-xs text-slate-400">Loading Google Sign-In...</p>
        ) : null}

        {error ? <p className="mt-4 text-center text-sm text-red-600">{error}</p> : null}
      </section>
    </div>
  );
}