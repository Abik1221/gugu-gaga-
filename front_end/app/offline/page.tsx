export const metadata = {
  title: "Offline | Zemen Pharma",
};

export default function OfflinePage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="max-w-prose text-muted-foreground">
        It looks like you lost your internet connection. You can keep exploring
        cached content or reconnect to access the latest data.
      </p>
    </section>
  );
}
