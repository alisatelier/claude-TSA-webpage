export default function ShippingReturnsPage() {
  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Shipping &amp; Returns</h1>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="font-heading text-3xl text-navy mb-4">Domestic Shipping</h2>
            <div className="bg-cream rounded-xl p-6 space-y-3 text-sm text-navy/80 leading-relaxed">
              <p>Orders are processed within 2-3 business days.</p>
              <p>Standard shipping: 5-7 business days.</p>
              <p>Free shipping on orders over $75.</p>
              <p>All orders include tracking information sent via email.</p>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl text-navy mb-4">International Shipping</h2>
            <div className="bg-cream rounded-xl p-6 space-y-3 text-sm text-navy/80 leading-relaxed">
              <p>We ship to most countries worldwide.</p>
              <p>International orders typically arrive within 2-4 weeks.</p>
              <p>Customs duties and import taxes are the responsibility of the buyer.</p>
              <p>Tracking is available for all international shipments.</p>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl text-navy mb-4">Returns</h2>
            <div className="bg-cream rounded-xl p-6 space-y-3 text-sm text-navy/80 leading-relaxed">
              <p>We accept returns within 30 days of delivery.</p>
              <p>Items must be unused and in their original packaging.</p>
              <p>Handmade items may have specific return conditions due to their unique nature.</p>
              <p>To initiate a return, please contact us through our contact page.</p>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl text-navy mb-4">Exchanges</h2>
            <div className="bg-cream rounded-xl p-6 space-y-3 text-sm text-navy/80 leading-relaxed">
              <p>Exchanges are available for a different variation of the same product.</p>
              <p>Contact us within 30 days of delivery to arrange an exchange.</p>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl text-navy mb-4">Damaged Items</h2>
            <div className="bg-cream rounded-xl p-6 space-y-3 text-sm text-navy/80 leading-relaxed">
              <p>If your item arrives damaged, please contact us immediately with photos.</p>
              <p>We will arrange a replacement or full refund at no additional cost.</p>
              <p>Please retain all packaging materials until the claim is resolved.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
