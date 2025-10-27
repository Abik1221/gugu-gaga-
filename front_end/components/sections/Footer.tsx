import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald-700 text-emerald-50 border-t border-emerald-600">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Zemen Pharma</h3>
            <p className="mt-3 text-sm text-emerald-50/80">
              Smart solutions for modern business. Reliable. Scalable. Secure.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-50">
              Product
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  className="transition-colors hover:underline"
                  href="/(marketing)/products/pos"
                >
                  POS
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:underline"
                  href="/(marketing)/products/inventory"
                >
                  Inventory
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:underline"
                  href="/(marketing)/products/ai"
                >
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:underline"
                  href="/(marketing)/about"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-50">
              Resources
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  className="transition-colors hover:underline"
                  href="/(auth)/login"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:underline"
                  href="/(auth)/register"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-50">
              Stay in touch
            </h4>
            <p className="mt-4 text-sm text-emerald-50/80">
              Get updates about new features and product releases.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-emerald-500 bg-emerald-600/30 px-2 py-1 text-xs text-emerald-50 placeholder:text-emerald-100/60 outline-none focus:ring-1 focus:ring-emerald-400/60"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-emerald-600 pt-6 flex flex-col items-center justify-center gap-4">
          <p className="text-xs text-emerald-50/80 text-center">
            © {year} Zemen Pharma. All rights reserved.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-50/90">
            <Link className="transition-colors hover:underline" href="/terms">
              Terms
            </Link>
            <span className="opacity-50">•</span>
            <Link className="transition-colors hover:underline" href="/privacy">
              Privacy
            </Link>
            <span className="opacity-50">•</span>
            <Link className="transition-colors hover:underline" href="/status">
              Status
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
