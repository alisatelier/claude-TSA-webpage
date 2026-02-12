export interface Product {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  categories: string[];
  badges: string[];
  includes: string;
  variations: string[];
  variationImages: Record<string, string[]>;
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
  addOn?: { name: string; price: number };
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
  productName: string;
  reviewer: string;
  rating: number;
  text: string;
  verified: boolean;
  owner: boolean; // true if this review was written by the website creator.
}

export const products: Product[] = [
  {
    id: "whims-whispers-journal",
    name: "Whims & Whispers Journal",
    price: 33,
    shortDescription: "For a journaling practice that inspires the best in you.",
    categories: ["Ritual Tools"],
    badges: ["Locally Printed"],
    includes: '5x8", 250 Page Journal.',
    variations: ["Grey", "Pink"],
    variationImages: {
      "Grey": ["/images/products/Journal - Grey - 1pg.jpg", "/images/products/Journal - Grey - 2pg.jpg"],
      "Pink": ["/images/products/Journal - Pink - 1pg.jpg", "/images/products/Journal - Pink - 2pg.jpg"],
    },
    description:
      "The Whims & Whispers Journal was created as a semi-structured companion for intentional reflection. Its design moves in two-page pairs — the first guiding you through daily planning, gratitude, and mood awareness, and the second offering a lined, open space for free-flow thought.\n\nThis balance between structure and openness is deliberate. The prompts provide orientation without rigidity, while the blank page invites honesty without expectation. The journal is intended to sit alongside tarot practice, offering a dedicated space to record your readings and integrate their insight into your lived day.\n\nBy placing reflection and divination within the same pages, the practice becomes cohesive rather than scattered. Its intention is not to produce perfect entries, but to cultivate continuity and a steady return to self, page after page.",
    howToWork:
      "Intentionally structured to be returned to whenever you feel called to practice, this journal is most supportive when approached with presence rather than urgency. Open to the next two-page pair and begin with the structured prompts. Consider what is upcoming, what has already been accomplished, and what may ask for your attention tomorrow. Allow yourself to pause with each question rather than rushing toward completion.\n\nIf you choose to pair your journaling practice with tarot — whether using the Whims & Whispers Tarot Deck or another deck in your collection — record your spread directly within the designated space. Holding your daily reflections alongside your reading allows insight and action to coexist in one place.\n\nWhen you move to the lined page, write what arrives first. Do not aim for eloquence. Do not attempt to perfect the thought before it is written. Patterns emerge over time, and we are supported in our reflection with this tool.",
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
    name: "Whims & Whispers Tarot Deck",
    price: 44,
    shortDescription:
      "For finding clarity, guidance and insight into the questions you wish to answer.",
    categories: ["Ritual Tools", "Divination Tools"],
    badges: ["Locally Printed", "Handcrafted"],
    includes: "62 Card Deck, Guidebook, Drawstring Bag",
    variations: ["Grey", "Pink"],
    variationImages: {
      "Grey": ["/images/products/Tarot - Grey - Major Arcana.jpg", "/images/products/Tarot - Grey - Minor Arcana.jpg"],
      "Pink": ["/images/products/Tarot - Pink - Major Arcana.jpg", "/images/products/Tarot - Pink - Minor Arcana.jpg"],
    },
    description:
      "The Whims & Whispers Tarot is a non-traditional, Marseille-style quick read deck designed to simplify interpretation without diminishing depth. This 62-card system retains the foundational archetypes of tarot while refining its structure.\n\nThe Major Arcana remain rooted in their original framework, yet are renamed and symbolically reinterpreted to reflect a softened but resonant evolution of meaning. The Beloved echoes The Lovers. The Pearl carries the contemplative solitude of The Hermit. The archetype remains intact — the symbolism shifts, allowing meaning to be inferred rather than memorized.\n\nThe Minor Arcana follow a Marseille tradition: pips without narrative imagery. Sparks, Tears, Soil, and Whispers represent Fire, Water, Earth, and Air. Their meaning is elemental and direct. There are no court cards, and no visual storytelling within the pips — only structure, suit, and number. The court cards have been omitted from this deck intentionally. The Whims & Whispers Tarot was created to remove excess without removing substance. Its intention is clarity.",
    howToWork:
      "Begin simply.\n\nPull one card when you seek direction. Lay three when you desire movement. Allow the Major Arcana to speak through symbol and archetype, and let the pips offer elemental context through number and suit.\n\nWith the pips, consider first the suit — Sparks for creative force, Tears for emotional undercurrent, Soil for inner journeys, Whispers for thought and communication. Then observe the pip, which is the number. One suggests beginning. Three implies expansion. Five introduces tension. Meaning forms through combination rather than illustration. Reversals are welcomed and intentionally supported, offering contrast or internalization of the card's energy.\n\nThe guidebook provides grounding when needed, yet the structure of the deck encourages independent interpretation. As familiarity grows, reliance on reference fades, and intuition begins to move with ease.",
    ritual:
      "If you wish to approach the deck ceremonially, prepare your space before shuffling. Clear the surface. Sit upright. Allow your breath to settle before you begin. Shuffle with intention rather than speed.\n\nWhen a card is drawn, pause before reaching for its meaning. Observe the symbol. Notice your first impression. If working with multiple cards, lay them in a structured spread and consider their relationship to one another. The absence of illustrated pips invites you to participate more fully and to sense the energy of the suit and number rather than rely on imagery.\n\nThe Whims & Whispers Tarot rewards presence. It does not overwhelm with narrative. It asks you to engage. Over time, the language of the deck becomes familiar — not because it is complicated, but because it is clear.",
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
    badges: ["Handcrafted", "Locally Printed"],
    includes: '~ 9x11" Spirit Board, Guidebook, Drawstring Bag',
    variations: ["Black", "White"],
    variationImages: {
      "Black": ["/images/products/Spirit Board - Gradient - Navy.svg"],
      "White": ["/images/products/Spirit Board - Gradient - Pink.svg"],
    },
    description:
      'The Whims & Whispers Spirit Board is a ceremonial clarification tool designed to support structured dialogue with Spirit, understood here as your higher power, inner guidance, or personal connection to the unseen.\n\nThough it incorporates a planchette and the familiar language of "hello" and "goodbye," this board is not intended for mediumship, séance, or theatrical spirit communication. Its design is symbolic rather than summoning.\n\nThe layout integrates chakras, elemental suits, zodiac archetypes, lunar phases, and a circular clock face that may represent timing, houses, or cycles. Yes, No, Maybe, and Why provide immediate directional grounding.\n\nThis board was created to organize intuition, not replace it. Its intention is clarity through symbol, allowing guidance to emerge in a structured and interpretive way.',
    howToWork:
      "Begin by forming a clear clarifying question. This board responds best when inquiry is intentional rather than vague.\n\nPlace your hands gently on the planchette and allow movement to occur without force. You may use it independently or following a tarot reading when further confirmation is desired. There is no required sequence beyond greeting and closing — movement across the board is intuitive and responsive.\n\nIf the planchette rests on an element, consider the energetic field influencing your question. If it moves toward a zodiac symbol or moon phase, reflect on archetype or timing. If it lands on a chakra, consider the energetic center asking for attention.\n\nMeaning is not dictated — it is interpreted. The accompanying guidebook offers structure and context, but your relationship with the symbolism deepens through practice.",
    ritual:
      "Approach this board with steadiness and respect.\n\nPrepare your space. Sit comfortably. Ground yourself before placing your hands on the planchette. Clarity thrives in calm presence.\n\nOpen with acknowledgment. Close with gratitude. These gestures create containment, not superstition.\n\nIf you are working with others, establish shared intention before beginning. If working alone, ensure you are rested and emotionally regulated. This tool is not designed for spectacle. It is designed for focus.\n\nUsed with consistency, the Spirit Board becomes less about movement across symbols and more about refinement of question. Over time, it trains discernment.",
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
    badges: ["Handcrafted", "Locally Printed"],
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
      "Imperfect",
    ],
    variationImages: {
      "Black | Gold": ["/images/products/Rune Set - Black - Gold.jpg"],
      "Black | Silver": ["/images/products/Rune Set - Black - Silver.jpg"],
      "Black | Copper": ["/images/products/Rune Set - Black - Copper.jpg"],
      "White | Gold": ["/images/products/Rune Set - White - Gold.jpg"],
      "White | Silver": ["/images/products/Rune Set - White - Silver.jpg"],
      "White | Copper": ["/images/products/Rune Set - White - Copper.jpg"],
      "Sunset": ["/images/products/Rune Set - Sunset.jpg"],
      "Moonrise": ["/images/products/Rune Set - Moonrise.jpg"],
      "Imperfect": ["/images/products/Rune Set - Imperfect.jpg"],
    },
    description:
      'The Whims & Whispers Norse Rune Set is a complete Elder Futhark system composed of 25 runes, including Wyrd — the rune of Mystery.\n\nEach piece is cast in resin and finished in a "gilded metal" style. This design choice is intentional. The metallic finish honors the Iron Age origins of the rune tradition, referencing the cultural significance of metalwork and material craft in Norse history.\n\nThe runes themselves remain true to the structure of the Elder Futhark. Their meanings are not reimagined, but respected. This set was created to bridge historical form with contemporary practice, preserving the integrity of the symbols while offering a durable, accessible medium for modern use.\n\nIts intention is steadiness. The runes are a symbolic language rooted in force, movement, and condition.',
    howToWork:
      "Runes may be drawn individually for daily reflection or cast in multiples to explore the interplay of forces surrounding a question.\n\nWhen pulling a single rune, consider it as a theme influencing your present moment. When pulling several, lay them in a spread like you would for reading tarot. The runes may also be incorporated alongside tarot instead of being used independently. Draw a rune to clarify the energetic undercurrent or greater theme of a card. Where tarot often speaks in narrative, runes speak in condition.\n\nThe accompanying guidebook offers historical context and foundational meanings. With repetition, interpretation becomes less about memorization and more about recognition. Wyrd, the rune of Mystery, does not provide an answer so much as it acknowledges the unknown. It is 'mysteriously' excluded from the guidebook.",
    ritual:
      "Approach the runes with a grounded presence.\n\nStore them in their drawstring bag when not in use. When ready to pull, draw them directly from the bag or a sacred vessel of your choice.\n\nThere is no requirement for ceremony, yet ritual can deepen attention. You may choose to clear your space, sit in stillness, or simply focus your breath before drawing.\n\nThe runes respond best to clarity of question. They are direct in their symbolism and do not dramatize. Over time, the language of the Elder Futhark becomes familiar, not because it is simplified, but because it is consistent.",
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
    badges: ["Handcrafted", "Locally Printed"],
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
    variationImages: {
      "Black | Gold": ["/images/products/Rune Cloth - Black - Gold.jpg"],
      "Black | Silver": ["/images/products/Rune Cloth - Black - Silver.jpg"],
      "Black | Copper": ["/images/products/Rune Cloth - Black - Copper.jpg"],
      "White | Gold": ["/images/products/Rune Cloth - White - Gold.jpg"],
      "White | Silver": ["/images/products/Rune Cloth - White - Silver.jpg"],
      "White | Copper": ["/images/products/Rune Cloth - White - Copper.jpg"],
      "Sunset": ["/images/products/Rune Cloth - Sunset.jpg"],
      "Moonrise": ["/images/products/Rune Cloth - Moonrise.jpg"],
    },
    description:
      "The Whims & Whispers Rune + Casting Cloth system is an advanced forecasting framework developed to bring structure, timing, and life-context to traditional Elder Futhark rune casting.\n\nRooted in ancient Germanic and Norse tradition, the runes themselves remain historically intact. The addition of the twelve-house casting cloth introduces a deliberate architectural overlay, transforming symbolic condition into contextual forecast.\n\nEach house corresponds to a defined area of life: Self, Money, Communication, Family, Creativity, Health, Relationships, Partnerships, Higher Learning, Career, Friendship, and Healing. When a rune lands within a house, its meaning is not only interpreted symbolically, but positioned within a life domain.\n\nThe circular design introduces proportional timing. The center represents the present moment. As the houses fan outward, they create a boundary for a chosen timeline. You could choose one month, three months, six months, one year, etc. This system was created to provide containment, clarity, and forecast-level depth for personal or professional readings.\n\nIts intention is structure without rigidity and interpretation without chaos.",
    howToWork:
      "Before casting, determine your timeframe. Choose a defined period — three months is recommended for clarity and recall — and allow the outer ring of houses to mark the boundary of that progression.\n\nThe center of the cloth represents now. As you cast the runes, observe not only which symbols appear, but where they land within the houses. A rune falling within the House of Career speaks differently than one in the House of Relationships, even if the symbol remains the same.\n\nInterpret first the rune's core meaning. Then consider the life domain. Finally, observe its relative distance from the center — nearer placements suggest immediacy, while outer placements suggest unfolding.\n\nThis system is particularly suited for client readings, where clarity of timeframe and life-area is essential. For personal practice, it is recommended to limit forecasting casts to one three-month reading per quarter and one yearly reading per year to avoid interpretive overlap.\n\nThe cloth does not alter the runes — it organizes them.",
    ritual:
      "Approach this system with steadiness.\n\nLay the cloth flat on a clean surface. Confirm your timeline and intention before casting. Mythologically, the Norse Sky-God, Odin gifted humanity with the runes, and acknowledgement of this before starting always affirms good intention. A quick glance to the sky before casting is recommended.\n\nWhen working with clients, establish the scope of inquiry clearly and avoid casting for undefined periods.\n\nAllow the runes to fall naturally. Resist repositioning. Structure is found in placement, not rearrangement. Close each reading with acknowledgment and integration. Forecasting is not prediction. It is preparation.\n\nUsed consistently, this system refines discernment. It transforms casting into calibrated interpretation, and intuition into measured guidance.",
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
    includes: '5.5x8.5", 208 Page Book.',
    variations: [],
    variationImages: {
      "_default": [
        "/images/products/MIMMDI - Staged.jpg",
        "/images/products/MIMMDI -  Poem.png",
      ],
    },
    description:
      "My Intuition Made Me Do It is a story about the quiet unraveling that happens before we are brave enough to call it transformation.\n\nAt the beginning, she believes love is something you work for. Something you hold together. Something you prove through patience and effort and trying just a little harder.\n\nThen a drumbeat carries her somewhere unexpected.\n\nIn a dim studio, during a Shamanic Journey, a message rises through her like a whisper she can't ignore: You, alone.\n\nShe doesn't leave that day.\nShe doesn't decide anything dramatic.\nShe becomes curious.\n\nA tarot reading from her best friend lands a little too accurately. A festival in the mountains opens her to a version of herself she hasn't yet embodied. An afternoon among vineyards makes something painfully clear. A summer solstice gathering feels less like celebration and more like a crossing.\n\nThe relationship doesn't explode. It shifts.\nAnd so does she.\n\nThis is not a story about walking away in anger.\nIt is a story about walking forward in awareness.",
    howToWork:
      "If you have ever stayed because you believed it was your responsibility to make something work, this story will feel familiar.\n\nIf you have ever felt the subtle ache of knowing something is misaligned but needing time to name it, you will recognize the pauses between her decisions.\n\nSpiritual practice in this novel is not spectacle. It is a mirror.\n\nTarot does not tell her what to do.\nRitual does not fix her life.\nThey simply reveal what she already knows.\n\nHer awakening does not happen in isolation. It happens in kitchens and parking lots and festival fields. It happens in arguments that seem small but feel heavy. It happens in illness. It happens in love.\n\nAnd slowly, she begins to choose herself.",
    ritual:
      "This book is meant to be read the way realization happens — gradually.\n\nAs you move through it, you may begin to notice your own pauses. The places where you stayed longer than you wanted to. The conversations you softened when you meant something sharper. The moments you felt a quiet knowing and chose not to follow it.\n\nYou may find yourself remembering the first time something didn't feel quite right. Or the first time you allowed yourself to imagine something different.\n\nThis story does not ask you to leave anything.\nIt simply asks you to listen.\n\nBy the time the solstice arrives, her life has shifted because she allowed herself to acknowledge what was already there.\n\nAnd perhaps, in the quiet after the final page, you will ask yourself the same gentle question she does:\nWhat is my intuition asking of me now?",
    ctaText: "See The Full Guidance",
    images: [
      "/images/products/MIMMDI -  Roman a Clef.png",
      "/images/products/MIMMDI -  The Journey.png",
      "/images/products/MIMMDI -  TOC.png",
    ],
    stock: 25,
    rating: 4.6,
    reviewCount: 56,
  },
];

export const services: Service[] = [
  {
    id: "tarot-reading",
    name: "Tarot Reading",
    duration: "60 Minutes",
    startingPrice: 60,
    description:
      "A personalized tarot reading session designed to bring clarity and insight to the questions that weigh most on your heart. Using the Whims & Whispers Tarot, we gently explore the energies surrounding your inquiry with care, intention, and honesty.",
    includes: [
      "Coming into Ceremony",
      "Unlimited Questions",
      "Virtual Video Call",
      "Integration Guidance",
    ],
    addOn: { name: "Digital Summary of Your Spread, With Key Insights", price: 15 },
    icon: "tarot",
  },
  {
    id: "rune-reading",
    name: "Norse Rune Reading",
    duration: "30 Minutes",
    startingPrice: 40,
    description:
      "A focused Elder Futhark rune casting offering direct, grounded insight into the patterns shaping your present path. The runes speak plainly — illuminating themes, cycles, and forces at work beneath the surface of your current season.",
    includes: [
      "Coming Into Ceremony",
      "Timeline & Theme Discussion",
      "Virtual Video Call",
      "Integration Guidance",
    ],
    addOn: { name: "Digital Summary of Your Cast, With Key Insights", price: 15 },
    icon: "runes",
  },
  {
    id: "tarot-rune-reading",
    name: "Tarot & Norse Rune Reading",
    duration: "60 Minutes",
    startingPrice: 80,
    description:
      "For those who want both the map and the medicine.\n\nThis combined session offers the grounded clarity of the Norse runes alongside the layered narrative of tarot. The runes reveal the structural forces and timeline at play; the tarot brings emotional nuance, relational insight, and spiritual guidance. Together, they create a full-spectrum reading — practical, intuitive, and deeply integrative.",
    includes: [
      "Coming Into Ceremony",
      "20-Minute Norse Rune Reading",
      "40-Minute Tarot Reading",
      "Unlimited Questions",
      "Virtual Video Call",
      "Integration Guidance",
    ],
    addOn: { name: "Digital Summary of Your Cast & Spread, With Key Insights", price: 30 },
    icon: "combined",
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
    productName: "Whims & Whispers Tarot Deck",
    reviewer: "A. K. Bird",
    rating: 5,
    text: "This deck was truly a joy to make! I was able to flex my knowledge and experience with the tarot and create a unique experience for reading the cards. Now, I get to use them in my own practice which is immensely special and rewarding. I hope you find plentiful benefit and guidance in them as was intended when I crafted them.",
    verified: true,
    owner: true,
  },
  {
    id: "r2",
    productId: "whims-whispers-journal",
    productName: "Whims & Whispers Journal",
    reviewer: "A. K. Bird.",
    rating: 5,
    text: "I made this Journal as a reflection of my own practice. As someone who has struggled with tasking and rigid routines, I wanted to create a tool that encourages presence without pressure. It is meant to be returned to whenever you feel called to practice, rather than approached with urgency. I hope it supports you in finding your own rhythm.",
    verified: true,
    owner: true,
  },
  {
    id: "r3",
    productId: "norse-runes",
    productName: "Norse Runes",
    reviewer: "A. K. Bird.",
    rating: 5,
    text: " The Norse Runes were the first product I created, and they hold a special place in my heart. I have been working with the Elder Futhark since the woman from my Shamanic Journey crafted her first set of runes from clay. My intention was to create a tool that bridges historical form with contemporary practice, preserving the integrity of the symbols while offering a steady, grounded experience.",
    verified: true,
    owner: true,
  },
  {
    id: "r4",
    productId: "norse-runes-cloth",
    productName: "Norse Runes & Cloth",
    reviewer: "A. K. Bird",
    rating: 5,
    text: "Have you ever encountered a casting cloth quite like this? I hadn’t! So I created one. I longed for a way to weave structure, timing, and lived context into traditional rune casting without diminishing its spirit. The Norse were deeply spiritual, holding layered cosmologies much like the interwoven systems we see in modern practice. The twelve astrological houses felt like a natural bridge and a contemporary framework through which ancient rune casting could continue to speak.",
    verified: true,
    owner: true,
  },
    {
    id: "r5",
    productId: "whims-whispers-spirit-board",
    productName: "Whims & Whispers Spirit Board",
    reviewer: "A. K. Bird",
    rating: 5,
    text: "I was inspired to create the Spirit Board at the very start of The Spirit Atelier's conception. I wanted to offer a tool that is symbolic rather than summoning, and provides a direct connecting to Spirit. These will forever be in short supply, as they are extremely finicky to make! If you are drawn to this tool, I encourage you to claim it when you can.",
    verified: true,
    owner: true,
  },
   {
    id: "r6",
    productId: "my-intuition-made-me-do-it",
    productName: "My Intuition Made Me Do It",
    reviewer: "A. K. Bird",
    rating: 5,
    text: "As a roman à clef, this story is rooted in lived experience. During a training, I was asked, 'If you could do anything, without limitation, what would it be?' The answer came instantly and without hesitation: to write my memories down — if only to affirm that they were real. What is published now is only part of a much larger unfolding.",
    verified: true,
    owner: true,
  }
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
        a: "We accept returns within 30 days of delivery for unused items in their original packaging. Handcrafted items may have a different return policy due to their unique nature.",
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
        a: "Yes, all materials are sourced with intention and care. Our Handcrafted items are crafted locally, and we prioritize sustainable practices wherever possible.",
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
        a: "Earn Ritual Credits with every purchase ($1 = 1 Credit), plus bonus credits for creating an account (50), writing reviews (100), referrals (200 + 200), and on your birthday (75). Redeem 250 Credits for $10 off or 500 Credits for $20 off your order.",
      },
      {
        q: "Do my Ritual Credits expire?",
        a: "Ritual Credits do not currently expire. Your balance is always visible in your customer portal dashboard.",
      },
    ],
  },
];
