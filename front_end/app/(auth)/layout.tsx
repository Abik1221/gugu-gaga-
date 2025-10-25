import Footer from "@/components/sections/Footer";

// Auth layout (no header maybe)
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>
    <main>
      {children}
    </main>
  </div>;
}
