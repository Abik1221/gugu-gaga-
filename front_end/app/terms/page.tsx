import Link from "next/link";
import MarketingLayout from "@/app/(marketing)/layout";

const sections = [
  {
    heading: "1. Acceptance of terms",
    body: `By creating an account, accessing, or using any Zemen Pharma services, you agree to be bound by these Terms of Service ("Terms"). If you are using the Services on behalf of an organization, you confirm that you have authority to bind that organization and that it also accepts these Terms.`,
  },
  {
    heading: "2. Definitions",
    body: `"Platform" refers to the Zemen Pharma web and mobile applications, APIs, and related infrastructure. "Tenant" means the licensed pharmacy or organization that signs up for the Platform. "User" means anyone who authenticates to the Platform, including owners, staff, affiliates, and administrators.`,
  },
  {
    heading: "3. Eligibility and registration",
    body: `You must provide complete and accurate information during registration, including corporate identity, licensing, and Know Your Customer (KYC) documentation. We may suspend or terminate access if supplied details are incomplete, fraudulent, or fail regulatory checks.`,
  },
  {
    heading: "4. Account security",
    body: `You are responsible for safeguarding login credentials, using strong passwords, maintaining device security, and promptly reporting suspected unauthorized access to the Zemen Pharma support team.`,
  },
  {
    heading: "5. Subscription and billing",
    body: `Fees, billing cycles, and payment methods are communicated during onboarding or via the Platform. All fees are non-refundable except where local consumer legislation requires otherwise. Late or missing payments may result in restricted functionality or suspension.`,
  },
  {
    heading: "6. Acceptable use",
    body: `Users must comply with all applicable laws, avoid interfering with Platform performance, refrain from reverse engineering, and must not upload malicious code. We reserve the right to remove content or disable accounts that violate these obligations.`,
  },
  {
    heading: "7. Data ownership",
    body: `Tenants retain ownership of patient, inventory, and financial data ingested into the Platform. By using the Platform, Tenants grant Zemen Pharma a limited license to host, process, and analyze such data strictly to deliver services, comply with law, and improve Platform reliability.`,
  },
  {
    heading: "8. Service availability",
    body: `We aim for continuous availability but do not guarantee uninterrupted service. Planned maintenance windows will be communicated in advance whenever possible. We are not liable for outages caused by external networks, third-party providers, or force majeure events.`,
  },
  {
    heading: "9. Third-party integrations",
    body: `The Platform may integrate with payment processors, logistics providers, and other third parties. Use of third-party services is subject to their terms, and Zemen Pharma is not responsible for any damages arising from those services.`,
  },
  {
    heading: "10. Confidentiality",
    body: `Both parties agree to protect each other's confidential information. We will not disclose tenant-specific data to third parties except as required by law or to deliver agreed services. Tenants must likewise safeguard any confidential material shared by Zemen Pharma.`,
  },
  {
    heading: "11. Compliance and audits",
    body: `Tenants are responsible for ensuring their use of the Platform complies with healthcare, pharmacy, and data protection regulations applicable in their jurisdiction. Zemen Pharma may request evidence of compliance or conduct audits where legally mandated.`,
  },
  {
    heading: "12. Suspension and termination",
    body: `We may suspend or terminate access for breach of these Terms, non-payment, failure to pass KYC, or unlawful activity. Tenants may terminate by providing 30 days written notice. On termination, we will provide data exports upon request, subject to outstanding fees.`,
  },
  {
    heading: "13. Disclaimers",
    body: `The Platform is provided "as is" without warranties of merchantability or fitness for a particular purpose. We do not guarantee accuracy of analytics or third-party data feeds. Tenants remain responsible for clinical or business decisions based on Platform insights.`,
  },
  {
    heading: "14. Limitation of liability",
    body: `To the fullest extent permitted by law, Zemen Pharma is not liable for indirect, incidental, or consequential damages. Our aggregate liability for claims arising out of or related to the Terms will not exceed the fees paid by the Tenant in the preceding six months.`,
  },
  {
    heading: "15. Indemnification",
    body: `Tenants agree to indemnify and hold Zemen Pharma harmless from claims arising from misuse of the Platform, breach of laws, or violation of these Terms by the Tenant or its authorized users.`,
  },
  {
    heading: "16. Changes to terms",
    body: `We may update these Terms to reflect operational, legal, or regulatory changes. Material updates will be announced through the Platform or via email at least 14 days before taking effect. Continued use after the effective date constitutes acceptance.`,
  },
  {
    heading: "17. Governing law",
    body: `These Terms are governed by the laws of the Federal Democratic Republic of Ethiopia, without regard to conflict of law principles. Disputes shall be settled through negotiation, and if unresolved, by the competent courts located in Addis Ababa.`,
  },
  {
    heading: "18. Contact information",
    body: `For questions about these Terms, email legal@zemenpharma.com or write to Zemen Pharma Legal, Bole, Addis Ababa, Ethiopia.`,
  },
];

export const metadata = {
  title: "Terms of Service | Zemen Pharma",
  description: "Review the binding terms and conditions that govern use of the Zemen Pharma platform.",
};

function TermsContent() {
  return (
    <div className="relative mx-auto max-w-4xl space-y-12 px-2 text-emerald-50 sm:px-4 lg:px-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-500/10 to-transparent" />
      <header className="relative space-y-4">
        <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        <p className="text-sm text-emerald-100/80">
          These Terms of Service ("Terms") explain your rights and obligations when accessing or using the Zemen Pharma
          platform. Please read them carefully before onboarding your pharmacy or organization.
        </p>
        <p className="text-xs text-emerald-100/60">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="relative space-y-10">
        {sections.map((section) => (
          <article
            key={section.heading}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_120px_-60px_rgba(16,185,129,0.6)] backdrop-blur"
          >
            <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">{section.body}</p>
          </article>
        ))}
      </section>

      <footer className="relative flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-emerald-100/80">
        <div>
          Need something clarified? <Link className="font-semibold text-emerald-200 hover:text-white" href="/contact">Contact support</Link>
        </div>
        <Link className="font-semibold text-emerald-200 hover:text-white" href="/privacy">
          Read our privacy policy
        </Link>
      </footer>
    </div>
  );
}

export default function TermsPage() {
  return (
    <MarketingLayout>
      <TermsContent />
    </MarketingLayout>
  );
}
