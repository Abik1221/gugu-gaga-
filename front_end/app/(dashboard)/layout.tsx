"use client"

export const dynamic = 'force-dynamic';

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}
