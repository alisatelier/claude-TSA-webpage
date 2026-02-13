export default function ShippingReturnsPage() {
  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
            Shipping &amp; Returns
          </h1>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="font-heading text-3xl text-navy mb-4">
              Domestic Shipping
            </h2>
            <div className="bg-cream rounded-xl p-6 space-y-3 text-sm text-navy/80 leading-relaxed">
              <p>Orders are processed within 2-3 business days.</p>
              <p>Standard shipping: 5-7 business days.</p>
              <p>Free shipping on orders over $125.</p>
              <p>All orders include tracking information sent via email.</p>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl text-navy mb-4">
              International Shipping
            </h2>
            <div className="bg-cream rounded-xl p-6 space-y-3 text-sm text-navy/80 leading-relaxed">
              <p>We ship to most countries worldwide.</p>
              <p>International orders typically arrive within 2-4 weeks.</p>
              <p>
                Customs duties and import taxes are the responsibility of the
                buyer.
              </p>
              <p>Tracking is available for all international shipments.</p>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl text-navy mb-4">Returns</h2>
            <div className="bg-cream rounded-xl p-6 space-y-3 text-sm text-navy/80 leading-relaxed">
              <p>
                Each piece from The Spirit Atelier is thoughtfully handmade in
                small batches. Due to the handcrafted nature of our products and
                the narrow margins that sustain this small business, we are
                unable to accommodate returns at this time.
              </p>
              <p>
                If an item isn’t the right fit for you, we warmly encourage
                passing it along as a gift to someone who may truly appreciate
                it. These pieces are created to be cherished, and we trust they
                will find the hands they’re meant for.
              </p>
              <p>
                If your order arrives damaged or incorrect, please reach out
                through our contact page within 7 days of delivery so we can
                make it right.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
