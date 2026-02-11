export interface Product {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  categories: string[];
  badges: string[];
  includes: string;
  variations: string[];
  description: string;
  howToWork: string;
  ritual: string;
  ctaText: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  startingPrice: number;
  description: string;
  includes: string[];
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  featured: boolean;
}

export interface Review {
  id: string;
  productId: string;
  reviewer: string;
  rating: number;
  text: string;
  verified: boolean;
}

export const products: Product[] = [
  {
    id: "whims-whispers-journal",
    name: "Whims & Whispers Journal",
    price: 33,
    shortDescription: "For a journaling practice that inspires the best in you.",
    categories: ["Ritual Tools"],
    badges: ["Locally Printed"],
    includes: '5x8", 250 Page Journal',
    variations: ["Ash", "Blush"],
    description:
      "The Whims & Whispers Journal was created as a semi-structured companion for intentional reflection. Its design moves in two-page pairs — the first guiding you through daily planning, gratitude, and mood awareness, and the second offering a lined, open space for free-flow thought.\n\nThis balance between structure and openness is deliberate. The prompts provide orientation without rigidity, while the blank page invites honesty without expectation. The journal is intended to sit alongside tarot practice, offering a dedicated space to record your readings and integrate their insight into your lived day.\n\nBy placing reflection and divination within the same pages, the practice becomes cohesive rather than scattered. Its intention is not to produce perfect entries, but to cultivate continuity and a steady return to self, page after page.",
    howToWork:
      "Intentionally structured to be returned to whenever you feel called to practice, this journal is most supportive when approached with presence rather than urgency. Open to the next two-page pair and begin with the structured prompts. Consider what is upcoming, what has already been accomplished, and what may ask for your attention tomorrow. Allow yourself to pause with each question rather than rushing toward completion.\n\nIf you choose to pair your journaling practice with tarot — whether using the Whims & Whispers Tarot Cards or another deck in your collection — record your spread directly within the designated space. Holding your daily reflections alongside your reading allows insight and action to coexist in one place.\n\nWhen you move to the lined page, write what arrives first. Do not aim for eloquence. Do not attempt to perfect the thought before it is written. Patterns emerge over time, and we are supported in our reflection with this tool.",
    ritual:
      "If you wish to enter your journaling practice ceremonially, begin by preparing your space in a way that feels meaningful to you. You may choose to light a candle, cleanse the air with herbs, or simply sit quietly for a few moments before opening the journal. If flame is not appropriate, begin instead with breath.\n\nAllow your body to settle. Close your eyes briefly and notice the quality of stillness available to you in that moment. When you feel ready, open to the next two-page spread and move through the structured prompts slowly. If you intend to incorporate tarot into your ritual, pause at the reading section, choose your spread, and pull your cards with presence. Record them as they appear, without rushing to interpretation.\n\nWhen you turn to the lined page, write what surfaces first. Try not to censor your thoughts, yet do not feel compelled to confront what you are not prepared to hold. Ritual is not performance — it is practice. With repetition, this rhythm becomes familiar. The journal begins to feel less like a task, and more like a returning.",
    ctaText: "See The Full Guidance",
    images: ["/images/products/journal-1.jpg"],
    stock: 15,
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "whims-whispers-tarot",
    name: "Whims & Whispers Tarot Cards",
    price: 44,
    shortDescription:
      "For finding clarity, guidance and insight into the questions you wish to answer.",
    categories: ["Ritual Tools", "Divination Tools"],
    badges: ["Locally Printed", "Handmade Element", "Written to Inspire"],
    includes: "62 Card Deck, Guidebook, Drawstring Bag",
    variations: ["Ash", "Blush"],
    description:
      "The Whims & Whispers Tarot is a non-traditional, Marseille-style quick read deck designed to simplify interpretation without diminishing depth. This 62-card system retains the foundational archetypes of tarot while refining its structure.\n\nThe Major Arcana remain rooted in their original framework, yet are renamed and symbolically reinterpreted to reflect a softened but resonant evolution of meaning. The Beloved echoes The Lovers. The Pearl carries the contemplative solitude of The Hermit. The archetype remains intact — the symbolism shifts, allowing meaning to be inferred rather than memorized.\n\nThe Minor Arcana follow a Marseille tradition: pips without narrative imagery. Sparks, Tears, Soil, and Whispers represent Fire, Water, Earth, and Air. Their meaning is elemental and direct.",
    howToWork:
      "Begin simply.\n\nPull one card when you seek direction. Lay three when you desire movement. Allow the Major Arcana to speak through symbol and archetype, and let the pips offer elemental context through number and suit.\n\nWith the pips, consider first the suit — Sparks for creative force, Tears for emotional undercurrent, Soil for inner journeys, Whispers for thought and communication. Then observe the pip, which is the number. One suggests beginning. Three implies expansion. Five introduces tension. Meaning forms through combination rather than illustration.",
    ritual:
      "If you wish to approach the deck ceremonially, prepare your space before shuffling. Clear the surface. Sit upright. Allow your breath to settle before you begin. Shuffle with intention rather than speed.\n\nWhen a card is drawn, pause before reaching for its meaning. Observe the symbol. Notice your first impression. If working with multiple cards, lay them in a structured spread and consider their relationship to one another.",
    ctaText: "See The Full Guidance",
    images: ["/images/products/tarot-1.jpg"],
    stock: 8,
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: "whims-whispers-spirit-board",
    name: "Whims & Whispers Spirit Board",
    price: 111,
    shortDescription: "For guiding yourself to Spirit, through symbolism.",
    categories: ["Ritual Tools", "Divination Tools"],
    badges: ["Handmade", "Locally Printed", "Written to Inspire"],
    includes: '~ 9x11" Spirit Board, Guidebook, Drawstring Bag',
    variations: ["Black", "White"],
    description:
      'The Whims & Whispers Spirit Board is a ceremonial clarification tool designed to support structured dialogue with Spirit, understood here as your higher power, inner guidance, or personal connection to the unseen.\n\nThough it incorporates a planchette and the familiar language of "hello" and "goodbye," this board is not intended for mediumship, séance, or theatrical spirit communication. Its design is symbolic rather than summoning.\n\nThe layout integrates chakras, elemental suits, zodiac archetypes, lunar phases, and a circular clock face that may represent timing, houses, or cycles.',
    howToWork:
      "Begin by forming a clear clarifying question. This board responds best when inquiry is intentional rather than vague.\n\nPlace your hands gently on the planchette and allow movement to occur without force. You may use it independently or following a tarot reading when further confirmation is desired.",
    ritual:
      "Approach this board with steadiness and respect.\n\nPrepare your space. Sit comfortably. Ground yourself before placing your hands on the planchette. Clarity thrives in calm presence.\n\nOpen with acknowledgment. Close with gratitude. These gestures create containment, not superstition.",
    ctaText: "See The Full Guidance",
    images: ["/images/products/spirit-board-1.jpg"],
    stock: 3,
    rating: 5.0,
    reviewCount: 18,
  },
  {
    id: "norse-runes",
    name: "Norse Runes",
    price: 55,
    shortDescription: "For receiving ancient wisdom and guidance.",
    categories: ["Ritual Tools", "Divination Tools"],
    badges: ["Handmade", "Locally Printed"],
    includes: "25 Norse Runes, Guidebook, Drawstring Bag",
    variations: [
      "Black | Gold",
      "Black | Silver",
      "Black | Copper",
      "White | Gold",
      "White | Silver",
      "White | Copper",
      "Sunset",
      "Moonrise",
    ],
    description:
      'The Whims & Whispers Norse Rune Set is a complete Elder Futhark system composed of 25 runes, including Wyrd — the rune of Mystery.\n\nEach piece is cast in resin and finished in a "gilded metal" style. This design choice is intentional. The metallic finish honors the Iron Age origins of the rune tradition, referencing the cultural significance of metalwork and material craft in Norse history.',
    howToWork:
      "Runes may be drawn individually for daily reflection or cast in multiples to explore the interplay of forces surrounding a question.\n\nWhen pulling a single rune, consider it as a theme influencing your present moment. When pulling several, lay them in a spread like you would for reading tarot.",
    ritual:
      "Approach the runes with a grounded presence.\n\nStore them in their drawstring bag when not in use. When ready to pull, draw them directly from the bag or a sacred vessel of your choice.\n\nThere is no requirement for ceremony, yet ritual can deepen attention.",
    ctaText: "See The Full Guidance",
    images: ["/images/products/runes-1.jpg"],
    stock: 12,
    rating: 4.7,
    reviewCount: 31,
  },
  {
    id: "norse-runes-cloth",
    name: "Norse Runes & Cloth",
    price: 77,
    shortDescription:
      "For uncovering the upcoming highlights and hurdles you face.",
    categories: ["Ritual Tools", "Divination Tools"],
    badges: ["Handmade", "Locally Printed"],
    includes:
      "25 Runes, Forecast Casting Cloth, Guidebook, Index Card, Drawstring Bag",
    variations: [
      "Black | Gold",
      "Black | Silver",
      "Black | Copper",
      "White | Gold",
      "White | Silver",
      "White | Copper",
      "Sunset",
      "Moonrise",
    ],
    description:
      "The Whims & Whispers Rune + Casting Cloth system is an advanced forecasting framework developed to bring structure, timing, and life-context to traditional Elder Futhark rune casting.\n\nRooted in ancient Germanic and Norse tradition, the runes themselves remain historically intact. The addition of the twelve-house casting cloth introduces a deliberate architectural overlay, transforming symbolic condition into contextual forecast.",
    howToWork:
      "Before casting, determine your timeframe. Choose a defined period — three months is recommended for clarity and recall — and allow the outer ring of houses to mark the boundary of that progression.\n\nThe center of the cloth represents now. As you cast the runes, observe not only which symbols appear, but where they land within the houses.",
    ritual:
      "Approach this system with steadiness.\n\nLay the cloth flat on a clean surface. Confirm your timeline and intention before casting. Mythologically, the Norse Sky-God, Odin gifted humanity with the runes, and acknowledgement of this before starting always affirms good intention.",
    ctaText: "See The Full Guidance",
    images: ["/images/products/runes-cloth-1.jpg"],
    stock: 6,
    rating: 4.9,
    reviewCount: 15,
  },
  {
    id: "my-intuition-made-me-do-it",
    name: "My Intuition Made Me Do It",
    price: 22,
    shortDescription:
      "For following your intuition and uncovering your calling.",
    categories: ["Literature"],
    badges: ["Written to Inspire"],
    includes: '5.5x8.5", 208 Page Book',
    variations: [],
    description:
      "My Intuition Made Me Do It is a story about the quiet unraveling that happens before we are brave enough to call it transformation.\n\nAt the beginning, she believes love is something you work for. Something you hold together. Something you prove through patience and effort and trying just a little harder.\n\nThen a drumbeat carries her somewhere unexpected.",
    howToWork:
      "This book is meant to be read the way realization happens — gradually.\n\nAs you move through it, you may begin to notice your own pauses. The places where you stayed longer than you wanted to. The conversations you softened when you meant something sharper.",
    ritual:
      "If you have ever stayed because you believed it was your responsibility to make something work, this story will feel familiar.\n\nIf you have ever felt the subtle ache of knowing something is misaligned but needing time to name it, you will recognize the pauses between her decisions.",
    ctaText: "See The Full Guidance",
    images: ["/images/products/book-1.jpg"],
    stock: 25,
    rating: 4.6,
    reviewCount: 56,
  },
];

export const services: Service[] = [
  {
    id: "tarot-reading",
    name: "Intuitive Tarot Reading",
    duration: "45-60 minutes",
    startingPrice: 75,
    description:
      "A personalized tarot reading session designed to bring clarity and insight to the questions that weigh most on your heart. Using the Whims & Whispers Tarot, we explore the energies surrounding your inquiry with care, intention, and honesty.",
    includes: [
      "Pre-session intention setting",
      "45-60 minute virtual or in-person reading",
      "Digital summary of your spread and key insights",
      "Post-session integration guidance",
    ],
    icon: "tarot",
  },
  {
    id: "rune-casting",
    name: "Rune Casting & Forecast",
    duration: "60-90 minutes",
    startingPrice: 95,
    description:
      "An in-depth Elder Futhark rune casting using the Whims & Whispers casting cloth system. This session provides a structured forecast over your chosen timeline, mapping the forces at work across key areas of your life.",
    includes: [
      "Timeline and intention discussion",
      "60-90 minute casting session",
      "Detailed written forecast report",
      "Follow-up email for questions",
    ],
    icon: "runes",
  },
  {
    id: "spiritual-mentorship",
    name: "Spiritual Mentorship Session",
    duration: "60 minutes",
    startingPrice: 120,
    description:
      "A one-on-one mentorship session for those seeking guidance in developing or deepening their spiritual practice. Whether you are beginning your journey or refining an established one, this session meets you where you are.",
    includes: [
      "Pre-session questionnaire",
      "60 minute guided conversation",
      "Personalized practice recommendations",
      "Resource list and next steps",
    ],
    icon: "mentorship",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "choose-first-divination-tool",
    title: "How to Choose Your First Divination Tool",
    category: "Divination Wisdom",
    excerpt:
      "Choosing your first divination tool is less about finding the right one and more about allowing the right one to find you. Here is how to begin.",
    content: "",
    image: "/images/blog/divination-tool.jpg",
    author: "The Spirit Atelier",
    featured: true,
  },
  {
    id: "creating-sacred-space",
    title: "Creating a Sacred Space: A Beginner's Guide",
    category: "Rituals & Practices",
    excerpt:
      "Your sacred space does not need to be elaborate. It simply needs to be yours. Learn how to create a space that supports your practice.",
    content: "",
    image: "/images/blog/sacred-space.jpg",
    author: "The Spirit Atelier",
    featured: false,
  },
  {
    id: "art-of-ritual",
    title: "The Art of Ritual: Daily Practices for Grounding",
    category: "Rituals & Practices",
    excerpt:
      "Ritual does not require perfection. It requires presence. Discover simple daily practices that anchor you in intention and awareness.",
    content: "",
    image: "/images/blog/daily-ritual.jpg",
    author: "The Spirit Atelier",
    featured: false,
  },
  {
    id: "moon-phases-manifestation",
    title: "Moon Phases and Manifestation",
    category: "Seasonal Guides",
    excerpt:
      "The moon has guided seekers for millennia. Learn how to align your intentions with lunar cycles for deeper manifestation practice.",
    content: "",
    image: "/images/blog/moon-phases.jpg",
    author: "The Spirit Atelier",
    featured: false,
  },
  {
    id: "tarot-self-reflection",
    title: "Tarot for Self-Reflection: Getting Started",
    category: "Divination Wisdom",
    excerpt:
      "Tarot is not about predicting the future. It is about understanding the present. Here is how to begin using tarot as a mirror.",
    content: "",
    image: "/images/blog/tarot-reflection.jpg",
    author: "The Spirit Atelier",
    featured: false,
  },
  {
    id: "power-of-journaling",
    title: "The Power of Journaling in Your Practice",
    category: "Rituals & Practices",
    excerpt:
      "Writing is one of the oldest forms of self-communion. Explore how journaling deepens your spiritual practice and reveals hidden patterns.",
    content: "",
    image: "/images/blog/journaling.jpg",
    author: "The Spirit Atelier",
    featured: false,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "whims-whispers-tarot",
    reviewer: "Luna M.",
    rating: 5,
    text: "This deck has become my daily companion. The simplicity of the pips invites me to truly listen rather than rely on imagery. Beautiful craftsmanship.",
    verified: true,
  },
  {
    id: "r2",
    productId: "whims-whispers-tarot",
    reviewer: "Sage R.",
    rating: 5,
    text: "I have used many tarot decks over the years, but the Whims & Whispers deck brings a clarity I have not experienced before. The guidebook is thoughtful and thorough.",
    verified: true,
  },
  {
    id: "r3",
    productId: "whims-whispers-journal",
    reviewer: "Aria K.",
    rating: 5,
    text: "The structured prompts alongside free pages create the perfect balance. I finally have a journaling practice that feels sustainable and meaningful.",
    verified: true,
  },
  {
    id: "r4",
    productId: "norse-runes",
    reviewer: "Rowan T.",
    rating: 4,
    text: "The quality of these runes is exceptional. The metallic finish is stunning and each piece feels substantial in the hand. The guidebook is clear and well-written.",
    verified: true,
  },
  {
    id: "r5",
    productId: "whims-whispers-spirit-board",
    reviewer: "Ember J.",
    rating: 5,
    text: "Beautifully crafted and deeply thoughtful. The integration of chakras, elements, and zodiac symbols creates a rich interpretive experience.",
    verified: true,
  },
];

export const faqCategories = [
  {
    name: "Shipping & Delivery",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Domestic orders typically arrive within 5-7 business days. International shipping times vary by location and may take 2-4 weeks.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. Please note that customs duties and import taxes are the responsibility of the buyer.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you will receive a confirmation email with your tracking number. You can also track your order through your customer portal.",
      },
    ],
  },
  {
    name: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery for unused items in their original packaging. Handmade items may have a different return policy due to their unique nature.",
      },
      {
        q: "How do I initiate a return?",
        a: "Contact us through our contact page or email us directly. We will provide you with return instructions and a prepaid shipping label where applicable.",
      },
    ],
  },
  {
    name: "Product Care",
    questions: [
      {
        q: "How should I care for my resin runes?",
        a: "Store your runes in the provided drawstring bag when not in use. Avoid prolonged exposure to direct sunlight or extreme heat, as this may affect the finish over time.",
      },
      {
        q: "Are your products ethically sourced?",
        a: "Yes, all materials are sourced with intention and care. Our handmade items are crafted locally, and we prioritize sustainable practices wherever possible.",
      },
    ],
  },
  {
    name: "Services & Bookings",
    questions: [
      {
        q: "How do I book a service?",
        a: "Visit our Services page and select the service you are interested in. Choose your preferred date and time, fill in your details, and complete your booking.",
      },
      {
        q: "Can I reschedule my appointment?",
        a: "Yes, you may reschedule up to 24 hours before your appointment time. Contact us directly or use your booking confirmation link.",
      },
      {
        q: "Are sessions virtual or in-person?",
        a: "We offer both virtual and in-person sessions. Virtual sessions are conducted via video call, and a link will be sent to you prior to your appointment.",
      },
    ],
  },
  {
    name: "Payment & Security",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards, PayPal, Apple Pay, and Google Pay. All transactions are processed securely through our payment gateway.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption and PCI-compliant payment processing to ensure your information is always protected.",
      },
    ],
  },
  {
    name: "Account & Rewards",
    questions: [
      {
        q: "How does the rewards program work?",
        a: "Earn points with every purchase ($1 = 1 point), plus bonus points for creating an account, writing reviews, referrals, and on your birthday. Redeem 100 points for $5 off your order.",
      },
      {
        q: "Do my points expire?",
        a: "Points do not currently expire. Your balance is always visible in your customer portal dashboard.",
      },
    ],
  },
];
