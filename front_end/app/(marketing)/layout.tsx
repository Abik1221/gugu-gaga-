// Marketing-specific layout (header with nav, footer)
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold">Zemen Pharma</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/#about" className="hover:text-emerald-700">About</Link>
            <Link href="/#contact" className="hover:text-emerald-700">Contact</Link>
            <Link href="/login" className="text-emerald-700 border border-emerald-200 rounded px-3 py-1 hover:bg-emerald-50">Login</Link>
            <Link href="/register" className="bg-emerald-600 text-white rounded px-3 py-1 hover:bg-emerald-700">Register</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between text-sm text-gray-600">
          <div>© {new Date().getFullYear()} Zemen Pharma. All rights reserved.</div>
          <div className="flex gap-3">
            <Link href="/#about" className="hover:text-emerald-700">About</Link>
            <Link href="/#contact" className="hover:text-emerald-700">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
