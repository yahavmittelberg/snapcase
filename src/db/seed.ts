import { db } from "./index";
import { categories, products, reviews } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.execute(sql`TRUNCATE reviews, orders, products, categories RESTART IDENTITY CASCADE`);

  // Categories
  const cats = await db
    .insert(categories)
    .values([
      {
        name: "Beaded Charms",
        slug: "beaded-charms",
        description: "Handcrafted beaded phone charms in every color of the rainbow",
        image: "/images/collection-1.jpg",
      },
      {
        name: "Chain Charms",
        slug: "chain-charms",
        description: "Elegant metal chain phone charms for a sophisticated look",
        image: "/images/collection-3.jpg",
      },
      {
        name: "Nature Charms",
        slug: "nature-charms",
        description: "Earth-inspired phone charms with natural materials",
        image: "/images/collection-2.jpg",
      },
      {
        name: "Character Charms",
        slug: "character-charms",
        description: "Fun and playful character phone charms",
        image: "/images/product-3.jpg",
      },
    ])
    .returning();

  const [beaded, chain, nature, character] = cats;

  // Products
  const prods = await db
    .insert(products)
    .values([
      {
        name: "Rainbow Bliss Charm",
        slug: "rainbow-bliss-charm",
        description:
          "A joyful explosion of color! Our Rainbow Bliss Charm features hand-selected pastel beads in every shade of the rainbow, finished with a tiny smiley face pendant that radiates positive vibes.",
        details:
          "• Length: 15cm adjustable\n• Materials: Glass beads, acrylic smiley pendant, nylon cord\n• Attachment: Universal phone loop compatible with all cases\n• Care: Wipe clean with damp cloth\n• Handmade — slight variations make each piece unique",
        price: "18.99",
        compareAtPrice: "24.99",
        categoryId: beaded.id,
        images: ["/images/product-1.jpg", "/images/collection-1.jpg", "/images/hero.jpg"],
        tags: ["bestseller", "colorful", "kawaii"],
        featured: true,
        stockCount: 45,
      },
      {
        name: "Pearl Luxe Chain",
        slug: "pearl-luxe-chain",
        description:
          "Elevate your phone with timeless elegance. The Pearl Luxe Chain pairs freshwater pearls with gold-plated beads for a charm that transitions seamlessly from brunch to boardroom.",
        details:
          "• Length: 20cm\n• Materials: Freshwater pearls, 18K gold-plated beads, stainless steel chain\n• Attachment: Lobster clasp with universal adapter\n• Care: Avoid water exposure; store in provided pouch\n• Each pearl is naturally unique",
        price: "32.99",
        categoryId: chain.id,
        images: ["/images/product-2.jpg", "/images/collection-3.jpg", "/images/hero.jpg"],
        tags: ["elegant", "pearls", "luxury"],
        featured: true,
        stockCount: 28,
      },
      {
        name: "Fruity Pop Charm",
        slug: "fruity-pop-charm",
        description:
          "Sweet as summer! Tiny handmade polymer clay fruits — strawberries, cherries, and peaches — dangle playfully from a coordinating beaded chain. The perfect conversation starter.",
        details:
          "• Length: 14cm\n• Materials: Polymer clay charms, glass seed beads, nylon cord\n• Attachment: Universal phone loop\n• Care: Handle gently; avoid dropping\n• Each fruit charm is individually hand-sculpted",
        price: "21.99",
        compareAtPrice: "27.99",
        categoryId: character.id,
        images: ["/images/product-3.jpg", "/images/product-1.jpg", "/images/collection-1.jpg"],
        tags: ["fun", "fruity", "handmade"],
        featured: true,
        stockCount: 62,
      },
      {
        name: "Geo Minimal Chain",
        slug: "geo-minimal-chain",
        description:
          "Clean lines, modern vibes. Our Geo Minimal Chain features precision-crafted geometric shapes in brushed silver and rose gold for the design-conscious minimalist.",
        details:
          "• Length: 18cm\n• Materials: Stainless steel, rose gold plating\n• Attachment: Slim lobster clasp with silicone adapter\n• Care: Polish with microfiber cloth\n• Tarnish-resistant finish",
        price: "28.99",
        categoryId: chain.id,
        images: ["/images/product-4.jpg", "/images/collection-3.jpg", "/images/hero.jpg"],
        tags: ["minimal", "geometric", "modern"],
        featured: true,
        stockCount: 35,
      },
      {
        name: "Vintage Key Charm",
        slug: "vintage-key-charm",
        description:
          "Unlock your style with this enchanting vintage-inspired charm. Antique brass key and clock pendants pair with warm amber crystals for a look that's pure cottagecore magic.",
        details:
          "• Length: 16cm\n• Materials: Antique brass charms, amber crystal beads, waxed cotton cord\n• Attachment: Universal loop with brass connector\n• Care: Will develop natural patina over time\n• Inspired by Victorian-era aesthetics",
        price: "24.99",
        categoryId: nature.id,
        images: ["/images/product-5.jpg", "/images/collection-2.jpg", "/images/hero.jpg"],
        tags: ["vintage", "cottagecore", "antique"],
        featured: false,
        stockCount: 41,
      },
      {
        name: "Butterfly Dreams",
        slug: "butterfly-dreams",
        description:
          "Channel Y2K energy with this stunning butterfly charm. Holographic beads catch the light while delicate butterfly pendants flutter in purple and blue — pure nostalgic glamour.",
        details:
          "• Length: 17cm\n• Materials: Holographic acrylic beads, enamel butterfly charms, stretch cord\n• Attachment: Universal phone loop\n• Care: Keep away from direct sunlight to preserve holographic finish\n• The butterflies change color in different lighting",
        price: "22.99",
        compareAtPrice: "29.99",
        categoryId: beaded.id,
        images: ["/images/product-6.jpg", "/images/product-1.jpg", "/images/collection-1.jpg"],
        tags: ["y2k", "butterfly", "holographic"],
        featured: true,
        stockCount: 55,
      },
      {
        name: "Ocean Breeze Charm",
        slug: "ocean-breeze-charm",
        description:
          "Bring the beach everywhere you go. Tiny seashells, aquamarine glass beads, and a starfish pendant create a charm that captures the essence of sun-kissed shores.",
        details:
          "• Length: 15cm\n• Materials: Natural mini shells, aquamarine glass beads, starfish pendant, nylon cord\n• Attachment: Universal phone loop\n• Care: Avoid prolonged water exposure\n• Real shells mean each piece is one-of-a-kind",
        price: "19.99",
        categoryId: nature.id,
        images: ["/images/collection-2.jpg", "/images/product-5.jpg", "/images/hero.jpg"],
        tags: ["beach", "shells", "summer"],
        featured: false,
        stockCount: 38,
      },
      {
        name: "Golden Hour Chain",
        slug: "golden-hour-chain",
        description:
          "Catch the last light with this warm-toned masterpiece. Sun and moon pendants hang from a delicate gold chain with amber and citrine-colored crystals.",
        details:
          "• Length: 19cm\n• Materials: 14K gold-filled chain, cubic zirconia crystals, brass celestial charms\n• Attachment: Premium lobster clasp with universal adapter\n• Care: Store flat; avoid chemicals\n• Our most premium charm",
        price: "38.99",
        compareAtPrice: "48.99",
        categoryId: chain.id,
        images: ["/images/collection-3.jpg", "/images/product-2.jpg", "/images/product-4.jpg"],
        tags: ["luxury", "gold", "celestial"],
        featured: true,
        stockCount: 18,
      },
      {
        name: "Daisy Chain Charm",
        slug: "daisy-chain-charm",
        description:
          "Flower power meets phone fashion. Dainty enamel daisies bloom between white and yellow seed beads on this cheerful, garden-inspired charm.",
        details:
          "• Length: 14cm\n• Materials: Enamel daisy charms, glass seed beads, elastic cord\n• Attachment: Universal phone loop\n• Care: Wipe gently with soft cloth\n• Stackable with other SnapCase charms",
        price: "16.99",
        categoryId: beaded.id,
        images: ["/images/product-1.jpg", "/images/collection-1.jpg", "/images/product-3.jpg"],
        tags: ["floral", "daisy", "cheerful"],
        featured: false,
        stockCount: 72,
      },
      {
        name: "Cosmic Sparkle",
        slug: "cosmic-sparkle",
        description:
          "For the stargazer in your life. Swarovski-style crystals in deep sapphire and amethyst tones alternate with silver star charms on this celestial showstopper.",
        details:
          "• Length: 16cm\n• Materials: Crystal glass beads, silver-plated star charms, stainless steel wire\n• Attachment: Magnetic quick-release adapter\n• Care: Polish with included cloth\n• Comes in a velvet gift box",
        price: "34.99",
        categoryId: chain.id,
        images: ["/images/product-6.jpg", "/images/collection-3.jpg", "/images/product-4.jpg"],
        tags: ["cosmic", "sparkle", "gift"],
        featured: false,
        stockCount: 22,
      },
      {
        name: "Woodland Walk",
        slug: "woodland-walk",
        description:
          "Forest bathing for your phone. Wooden beads, tiny acorn charms, and a miniature leaf pendant make this the coziest charm in our collection.",
        details:
          "• Length: 15cm\n• Materials: Sustainable wood beads, zinc alloy charms, hemp cord\n• Attachment: Universal phone loop\n• Care: Oil wood beads occasionally\n• Eco-friendly packaging",
        price: "20.99",
        categoryId: nature.id,
        images: ["/images/collection-2.jpg", "/images/product-5.jpg", "/images/product-3.jpg"],
        tags: ["woodland", "eco", "cozy"],
        featured: false,
        stockCount: 50,
      },
      {
        name: "Lucky Cat Charm",
        slug: "lucky-cat-charm",
        description:
          "Maneki-neko meets modern style. This adorable beckoning cat charm pairs with red and gold beads for a lucky accessory that's too cute to resist.",
        details:
          "• Length: 13cm\n• Materials: Ceramic cat charm, glass beads, silk cord\n• Attachment: Universal phone loop with gold connector\n• Care: Handle ceramic charm carefully\n• A symbol of good fortune",
        price: "17.99",
        compareAtPrice: "22.99",
        categoryId: character.id,
        images: ["/images/product-3.jpg", "/images/product-1.jpg", "/images/collection-1.jpg"],
        tags: ["lucky", "cat", "kawaii"],
        featured: false,
        stockCount: 60,
      },
    ])
    .returning();

  // Reviews
  const reviewData: {
    productId: number;
    author: string;
    rating: number;
    title: string;
    body: string;
    verified: boolean;
  }[] = [];

  const reviewTemplates = [
    { author: "Sarah M.", rating: 5, title: "Absolutely in love!", body: "This charm exceeded all my expectations. The quality is incredible and it looks even better in person. I get compliments every single day!", verified: true },
    { author: "Jessica L.", rating: 5, title: "Perfect gift!", body: "Bought this for my best friend and she was obsessed. Already ordered two more for myself. The packaging was beautiful too.", verified: true },
    { author: "Emma R.", rating: 4, title: "Beautiful but slightly short", body: "The charm itself is gorgeous and really well made. I just wish it was a tiny bit longer. Still love it though!", verified: true },
    { author: "Mia K.", rating: 5, title: "So unique and pretty", body: "I've been looking for a phone charm that doesn't look cheap and this is IT. Premium quality, beautiful colors, and super secure attachment.", verified: true },
    { author: "Olivia P.", rating: 5, title: "Obsessed 😍", body: "I've bought three different charms now and they're all amazing. The attention to detail is remarkable. Will keep coming back!", verified: true },
    { author: "Ava T.", rating: 4, title: "Great quality", body: "Really nice charm. The materials feel premium and it's held up great after a month of daily use. Highly recommend.", verified: false },
    { author: "Isabella W.", rating: 5, title: "Better than expected", body: "The photos don't do it justice! It's even more beautiful in real life. The beads catch the light perfectly.", verified: true },
    { author: "Sophia H.", rating: 3, title: "Nice but pricey", body: "It's a lovely charm and good quality, but I think the price is a bit high for what it is. That said, it is very pretty.", verified: false },
    { author: "Charlotte D.", rating: 5, title: "My new favorite accessory", body: "I literally cannot imagine my phone without this charm now. It makes me smile every time I pick up my phone. Worth every penny!", verified: true },
    { author: "Amelia J.", rating: 4, title: "Cute and sturdy", body: "Very cute design and it feels really sturdy. The attachment mechanism is secure. Only giving 4 stars because shipping took a bit.", verified: true },
    { author: "Luna G.", rating: 5, title: "Stunning!", body: "The craftsmanship on this is just *chef's kiss*. You can tell so much care went into making it. Already eyeing my next one!", verified: true },
    { author: "Chloe B.", rating: 5, title: "Makes my phone so cute", body: "My plain black phone case went from boring to adorable in seconds. Love how it dangles just right.", verified: true },
  ];

  for (const prod of prods) {
    // Each product gets 3-5 reviews
    const numReviews = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...reviewTemplates].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numReviews; i++) {
      const tmpl = shuffled[i];
      reviewData.push({
        productId: prod.id,
        ...tmpl,
      });
    }
  }

  await db.insert(reviews).values(reviewData);

  console.log(
    `✅ Seeded ${cats.length} categories, ${prods.length} products, ${reviewData.length} reviews`
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
