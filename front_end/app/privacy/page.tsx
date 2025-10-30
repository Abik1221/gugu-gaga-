import Link from "next/link";
import MarketingLayout from "@/app/(marketing)/layout";

const sections = [
  {
    heading: "1. Overview",
    body: `Zemen Pharma respects your privacy and is committed to safeguarding personal data processed through our platform. This Privacy Policy explains the information we collect, how it is used, and the choices you have.`,
  },
  {
    heading: "2. Information we collect",
    body: `We collect information that you voluntarily provide during onboarding (such as contact details, pharmacy documents, and financial data) and data generated automatically while using the platform (such as access logs, device metadata, and transactions).`,
  },
  {
    heading: "3. Patient information",
    body: `Patient information entered into the platform is protected health data. We act as a processor on behalf of tenant pharmacies, and we only process patient information to deliver contracted services. Tenants are responsible for obtaining necessary consents and complying with applicable healthcare regulations.`,
  },
  {
    heading: "4. Use of information",
    body: `We use collected information to provide and improve the platform, personalize dashboards, ensure compliance, prevent fraud, and communicate essential updates. Aggregated and anonymized analytics may be used to improve system reliability and performance.`,
  },
  {
    heading: "5. Legal bases",
    body: `We process personal data based on tenant contracts, legal obligations, vital interests of patients or staff, and Zemen Pharma's legitimate interests in maintaining secure, compliant services.`,
  },
  {
    heading: "6. Sharing of information",
    body: `We share information with trusted service providers (such as hosting, analytics, and payment partners) under strict confidentiality agreements. We may disclose information if required by law or to defend our legal rights. Zemen Pharma does not sell personal data.`,
  },
  {
    heading: "7. International transfers",
    body: `If data is transferred outside Ethiopia, we implement appropriate safeguards, including contractual clauses and security controls, to protect personal information.`,
  },
  {
    heading: "8. Security measures",
    body: `We employ industry-standard technical and organizational measures, including encryption in transit, access controls, audit logging, and regular security assessments. Tenants must also maintain secure devices and user access policies.`,
  },
  {
    heading: "9. Data retention",
    body: `We retain tenant and user data for the duration of active contracts and as required by law. Upon termination, we follow documented retention schedules and can provide exports or delete data upon written request, subject to legal obligations.`,
  },
  {
    heading: "10. Data subject rights",
    body: `Individuals may request access, correction, deletion, or restriction of their personal data, subject to verification and legal limitations. Requests can be made through the tenant administrator or by contacting privacy@zemenpharma.com.`,
  },
  {
    heading: "11. Cookies and tracking",
    body: `We use essential cookies for authentication and session management, as well as analytics cookies to understand platform performance. You can adjust browser settings to manage cookies, but essential cookies are required for secure access.`,
  },
  {
    heading: "12. Children",
    body: `The platform is not intended for individuals under 18 unless they are registered as staff by an authorized tenant. We do not knowingly collect personal data from minors outside legitimate pharmacy operations.`,
  },
  {
    heading: "13. Policy changes",
    body: `We may update this Privacy Policy from time to time. Material updates will be communicated through the platform or email. Continued use after updates constitutes acceptance.`,
  },
  {
    heading: "14. Contact us",
    body: `If you have questions or concerns about this Privacy Policy, contact privacy@zemenpharma.com or write to Zemen Pharma Privacy Office, Bole, Addis Ababa, Ethiopia.`,
  },
];

export const metadata = {
  title: "Privacy Policy | Zemen Pharma",
  description: "Understand how Zemen Pharma collects, uses, and protects your personal data.",
};

function PrivacyContent() {
  return (
    <div className="relative mx-auto max-w-4xl space-y-12 px-2 text-emerald-50 sm:px-4 lg:px-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-500/10 to-transparent" />
      <header className="relative space-y-4">
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="text-sm text-emerald-100/80">
          This Privacy Policy describes how Zemen Pharma collects, uses, discloses, and safeguards personal data when you engage with our platform and services.
        </p>
        <p className="text-xs text-emerald-100/60">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="relative space-y-10">
        {sections.map((section) => (
          <article
            key={section.heading}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_120px_-60px_rgba(59,130,246,0.6)] backdrop-blur"
          >
            <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">{section.body}</p>
          </article>
        ))}
      </section>

      <footer className="relative flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-emerald-100/80">
        <Link className="font-semibold text-emerald-200 hover:text-white" href="/terms">
          Review our Terms of Service
        </Link>
        <div>
          Need assistance? <Link className="font-semibold text-emerald-200 hover:text-white" href="/contact">Contact support</Link>
        </div>
      </footer>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <PrivacyContent />
    </MarketingLayout>
  );
}
