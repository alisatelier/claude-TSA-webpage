export default function PrivacyPage() {
  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Privacy Policy</h1>
          <p className="text-white/50 text-sm">Last updated: February 2026</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-sm text-navy/80 leading-relaxed">
          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Information We Collect</h2>
            <p>We collect information you provide directly to us, including your name, email address, shipping address, payment information, and any other information you choose to provide when creating an account, making a purchase, or contacting us.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">How We Use Your Information</h2>
            <p>We use the information we collect to process your orders, communicate with you about your purchases, send marketing communications (with your consent), improve our website and services, and comply with legal obligations.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Cookies</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Data Sharing</h2>
            <p>We do not sell your personal information. We may share your information with service providers who assist us in operating our website, processing payments, and fulfilling orders.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us at hello@thespiritatelier.com.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including SSL encryption and PCI-compliant payment processing.</p>
          </div>
        </div>
      </section>
    </>
  );
}
