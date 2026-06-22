import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State (re-seeded on boot)
let menuItems = [
  {
    id: 'menu-1',
    name: 'Hokkaido Scallop Crudo',
    price: 32,
    description: 'Hand-dived scallops, finger lime caviar, white soy emulsion, and chilled dashi broth. Finished with a dusting of dehydrated sea kelp.',
    category: 'Appetizers',
    tags: ['Signature', 'GF'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrz70NMCRX0-oOIaxo0AI7-qsVIeBxKmmnxFQ87DeguXUiz7qKaokSPj_1QwQH3IV7Q9eMv8PwZVJ1hQe5gJCsFQSpZJFGxWAG-h3icCH4ew-GwhCfRAQoCHDmbMBn8QgOrsz9F_6bypPsdp9hBrUBUkVo5eKFgMglmcS4-GenBfu5doNLZOb-fyY627NGIfsAWii2B-S4Y2qgRn73D69IRR2su28WOpAyZ4zOvrhJ6WXqtoAJqPgtZUUQi1-nWd1qOevrvUMZAPhe',
    isSignature: true
  },
  {
    id: 'menu-2',
    name: 'Heirloom Beetroot Tartlet',
    price: 24,
    description: 'Smoked goat cheese, aged balsamic, candied walnuts, and micro basil. Encased in a crisp charcoal shell.',
    category: 'Appetizers',
    tags: ['V'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd7904GjtVyeZLHtqfkgqUXMArzl0e9b3io2uA95gDB7TKtaKsPrBwcAF3KMcIQoBrsd0HEI7bwBotEx_g-eAII2ruWst0srh9gI4DIugCX7Yx1_l5wbqNxRpVNY5qQdfUr1a2E_7gsePabXwubWQMbfMy19HzfPLtwjOPzAYfruz8TEL7kAcWfzgSdO3dRpm3-CYrCT3rNG7Je5NM9lQX72SVKmkeGk1W_EYLdrTv394bzmsROnXaFB8qq3tcbr6EHJqTQ8gr8KOY'
  },
  {
    id: 'menu-3',
    name: 'Wagyu Beef Tartare',
    price: 36,
    description: 'A5 Wagyu hand-cut, cured free-range egg yolk, shaved black winter truffle, served on rough stone with house-made crisp brioche points.',
    category: 'Appetizers',
    tags: ['GF'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJlfYVkgi81PjjHHSiH5NEG7pjKS0quezXo9McjnyC3qeKfIRRPzBg2k52uhytLm1F4EPGlFMhzDN4Id0WwruzTiFOuLSFXlcsWJTyHXgKYx9aPYXydU2arTuNF0SZr9_03H-oEihC3Sl7cJW9UtCEcFSm72Ag2eWSHWSF38oD0AUTDHmgrep3FbXZwClgXy33jjl1HQY-QiflKVDA-51cBM2YciqDNnEC3RAkGkT40r1B-t0L6LlDlWNe2lNz_6RP6iVtDILTm_nX'
  },
  {
    id: 'menu-4',
    name: 'Foie Gras Torchon',
    price: 42,
    description: 'Armagnac-infused artisanal foie gras terrine, sour black cherry compote, served alongside warm house-baked pain d\'épices.',
    category: 'Appetizers',
    tags: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvg6-YMG9ngbauhsu-zEHCa5Zea1ZOV-TzYyJ42ZmNnjcmseTJTLv1gVq2wKSbRp2HFXuNJIoHsInsmKDUO_PBM2sjOzmxKxr7RJUuvk5AWQnCgRg5W_LXk6w1jaX5IVQFlMsX9eFRmvqTRSZtR4Hc9zu9jvsFR_-lf-5LF10ZO_a3L4_Wh_OZA19SVEzOMX0ssXepfzvD9NCT_g5FayfP6UvUi3UCN7SbQVy-avGKyeKjDt6EJW1eLdD7bDNtJBaHHoyAoJeTcWGq'
  },
  {
    id: 'menu-5',
    name: 'Clear Tomato Consommé',
    price: 18,
    description: 'Perfectly clarified heirloom tomato water, shimmering basil oil pearls, infused compressed cucumber ribbons.',
    category: 'Appetizers',
    tags: ['V', 'GF'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVER4KHc4flrECOemLeH3jy2kCCS7lk6fmbEt50dAmI1Ppv2zzM5Vd-cMoeG_6Bb_VJmWbAiG9264Omq940NSNDHTHSQ7kSjJUIG7gEZ-cNOQbO-r7E0WLJQQeZevi6rkVN5nm9SZ1cWJn3CkGpFgNLZJfvOcY5FLgcBYBhRol_MaZivfCEU0uMdyvw4HzY4k5W_P2FmoJAi0QuXzRmJ6VDtKPHKVw1N_fycd-ZLxS6feNyptSc_q073Eg5wzFNuOFybGKtx0LbJPk'
  },
  {
    id: 'menu-6',
    name: 'A5 Wagyu & Truffle',
    price: 145,
    description: 'Grade A5 Japanese Wagyu steak, black garlic puree, foraged wild mushrooms, 24k edible gold leaf gilding, reduced veal bone glaze.',
    category: 'Mains',
    tags: ['Signature', 'GF'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLrZsALN9dOJACYjx5QsSq9XYrIu84Fi4xOWcXcCJAQzwggkAEgZ902YCI4p4ISyes1ZL5t6ztxBpQEYi47OnS84eHFDuryrfIHhKQhwwRHEllXU0W3hy3EANnX5TzcVgW0jftQdY6UK6AM3wb64MW1GvufAYtA2xdNEKidDtcjrDCq2GDO8kypDY-q1PxY02DCr6vKvaONquvviclRsRu9TdxeTn5qTkQXRzaEvfk2c5L17KVC4bWs5Sm00p4SUkGHWQfX4Sq_RRH',
    isSignature: true
  },
  {
    id: 'menu-7',
    name: 'Pan-Seared Glacier Toothfish',
    price: 58,
    description: 'Crispy skin toothfish, butter-poached sunchoke puree, sea grapes, finished with an elegant saffron-infused beurre blanc.',
    category: 'Mains',
    tags: ['GF'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXJnsOojBxdtm2BAAvLWcXJvaldns3EzIgITLv-nRoeE5geX_lKMmgQxYSHHhumQpgtLvwujwTlDPQ4etsja6MyFSE5jZe0di-DjZzFiRTIPKGXbB5mTT5-mU2UmiZLnO24qiaHIlO2ianOBSffC8z-WojxKExl6_wdaT-of85vvV98z4L0T3__Oh58YYQwCOfYloLHihuHb2sE9msF87-QZ2LTxM1R_8S9lyhi_c8E605QA_UwriIe6BeZT9FIFDxow8fZySXNID6'
  },
  {
    id: 'menu-8',
    name: 'Dry-Aged Duck Breast',
    price: 52,
    description: '14-day dry-aged Challans duck, roasted parsnips, blood orange glaze, charred baby leeks, and lavender-infused natural reduction.',
    category: 'Mains',
    tags: ['GF'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBCTRDz5kQ84hZBQmdLfNadvWsoCk-ZMuIlUgUKLFVpStZQ47wbpggN4MwSZuNIvh9aLSv0oYxMm8nzKuyBxz7-nJiAhyKjGzdx25HpJ0Im61tlBZ49rJXGYyf8SHfkjfcUY9MRDH95wDu2HhtgDmjY1PyaAwEurYGDhYdJEnlhD3FZn9OOerlYVXCEZAiUDfiyA7ez9Min1tSK0Azzf8DPbR1HVszJIDABbVqW9X3p6nIiBW7HPbPUSAsWIZqwt7CODIAWFoYINOH'
  },
  {
    id: 'menu-9',
    name: 'Midnight Sphere',
    price: 24,
    description: 'A delicate, perfectly spherical dark chocolate shell, rich chocolate ganache quenelle, chocolate soil, vibrant raspberry coulis splash.',
    category: 'Desserts',
    tags: ['Signature', 'V'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR-T1HLvryigJN5rCzDtcbfwf8kvy9sW7gh5PYSExvqHFgg17rbFldpUghq_uAoOVpV3tuYxerLe_Md5xespn53lCSwjyB6njTaGgjEuBzvuGLeNS6IBuPIrUgHdsxPRA6Fkfk7UUWeE8JEMTUhe_0dKSdpxA6-53V5jk3tyOUhqjGm6DBdwhNNg43OiEarlMyX8SXNDLQ3Xib3EDjP2UxoUdjVRrEjBOJYvy9WWLxbTicV76-dJhXMcnWZe76Pmczy5QiXxmxvY1u',
    isSignature: true
  },
  {
    id: 'menu-10',
    name: 'Texture of Cacao',
    price: 26,
    description: 'Varying textures of single-origin Madagascar chocolate: smooth ganache quenelle, delicate chocolate tuiles, dustings of organic cocoa.',
    category: 'Desserts',
    tags: ['V'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuDKViBf5NlzhSuCxN2Ey3HcbSBd2RMuT443rFKf3wvFMyRtl3jnZgDYXdHByUhmpNdQN25tFoad8VCaCG2nsiDm7debBupu5x4gPQkofkOgILlpmMXgcqLGg7Me2kfLPeqrKbp_3WC71JveCcM250Mvy7gzdC_7-CUZCfYAENPR1tpzt-C6xWxM5ggdgmlUoamD5wYYAL_mDP_f9sL_8jDcJlJQOJ3awj9HXnfAvuBWFD1j5VlzCYFKulUq5J14JUYLXFqq32k8BL'
  },
  {
    id: 'menu-11',
    name: 'Domaine de la Romanée-Conti 2015',
    price: 345,
    description: 'Expertly selected Grand Cru vintage Pinot Noir, boasting aromas of wild forest berries, violet petals, and delicate earthy spice.',
    category: 'Wines',
    tags: ['Signature'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLTmc5HgnCABJQqUQycI3zBatcMP3vV7GPgUxw5eCjXEbJacOq8Z1sZSh6p0okrFok-rz2WRpUJ6wTRHoS2vNxo5IHMg7BuFzG-gAvYKdTIVVbPMGBJu9ngm2v3hEjiOyqD1gRSlVnf5UAdE62dmw2UvH4euCBrM-2TcPQ5ucG346-lG1cz6GtJjCRDMx7hbVb5n9j0BwyXotwnmmN40ztU36mWp_jc2t-pJQlKlut3pcBwN3cgLm8NwHHU8aeprOuwHS9GuROFTAQ'
  },
  {
    id: 'menu-12',
    name: 'Krug Clos d\'Ambonnay',
    price: 195,
    description: 'Prestigious Blanc de Noirs Champagne, revealing unmatched richness, toasted brioche undertones, and persistent mineral finish.',
    category: 'Wines',
    tags: ['GF'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJLRGwRAbmqLNoPJ4Fgq5jMaJl3FIUxYjvlthWyYuBBYTpHoeDwmzUOoSmMo8RmLcRXCWQ6uGt5_Si7c-AixeANrKt_0xsOMoLiuJI2i-J-slfZXaFTplrxsrty1uqeRsl_w-KvqiA4JnoudX1fYaRS4wQymsfVcpKfxUExL4YN_Z43lw2xlDLvfzjASNfPvPMlCcenXDbQIzsyPqRWUcaPxVnsXoPCFL9E_obrggLI3oo-XEgE0_uzH0nOWOWXORFbm1zKgEZfQ_h'
  }
];

let reservations = [
  {
    id: 'res-1',
    userName: 'Eleanor Vance',
    email: 'eleanor.vance@vip.com',
    phone: '+1 (555) 123-4567',
    date: '2026-06-25',
    time: '19:00',
    guestsCount: 2,
    specialRequests: 'VIP Treatment • Celebrating Wedding Anniversary.',
    status: 'Confirmed',
    createdAt: '2026-06-22T08:00:00Z'
  },
  {
    id: 'res-2',
    userName: 'Jameson & Co.',
    email: 'j.jameson@jamesoncorp.com',
    phone: '+1 (555) 987-6543',
    date: '2026-06-25',
    time: '20:00',
    guestsCount: 8,
    specialRequests: 'Corporate Dinner • Needs a private room if possible.',
    status: 'Pending',
    createdAt: '2026-06-22T09:15:00Z'
  },
  {
    id: 'res-3',
    userName: 'Sarah Lin',
    email: 'sarah.lin@gmail.com',
    phone: '+1 (555) 444-5555',
    date: '2026-06-26',
    time: '18:15',
    guestsCount: 4,
    specialRequests: 'First time visiting. Severe peanut allergy!',
    status: 'Confirmed',
    createdAt: '2026-06-22T10:10:00Z'
  }
];

// Lazy Gemini API Client Helper
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. AI Assistant will operate with default responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// REST endpoints for the menu items
app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

app.post("/api/menu", (req, res) => {
  const newItem = {
    id: 'menu-' + Date.now(),
    name: req.body.name || 'Untitled Culinary creation',
    price: Number(req.body.price) || 20,
    description: req.body.description || 'Artisanal creation',
    category: req.body.category || 'Mains',
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    image: req.body.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
    isSignature: !!req.body.isSignature
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  const idx = menuItems.findIndex(x => x.id === id);
  if (idx !== -1) {
    menuItems[idx] = {
      ...menuItems[idx],
      name: req.body.name || menuItems[idx].name,
      price: Number(req.body.price) || menuItems[idx].price,
      description: req.body.description || menuItems[idx].description,
      category: req.body.category || menuItems[idx].category,
      tags: Array.isArray(req.body.tags) ? req.body.tags : menuItems[idx].tags,
      image: req.body.image || menuItems[idx].image,
      isSignature: req.body.isSignature !== undefined ? !!req.body.isSignature : menuItems[idx].isSignature
    };
    res.json(menuItems[idx]);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.delete("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  menuItems = menuItems.filter(x => x.id !== id);
  res.json({ success: true });
});

// REST endpoints for reservations
app.get("/api/reservations", (req, res) => {
  res.json(reservations);
});

app.post("/api/reservations", (req, res) => {
  const newRes = {
    id: 'res-' + Date.now(),
    userName: req.body.userName || 'Eleanor Vance',
    email: req.body.email || 'guest@gourmet.com',
    phone: req.body.phone || '+1 (555) 000-0000',
    date: req.body.date || 'Today',
    time: req.body.time || '19:00',
    guestsCount: Number(req.body.guestsCount) || 2,
    specialRequests: req.body.specialRequests || '',
    status: (req.body.status || 'Confirmed') as 'Confirmed' | 'Pending' | 'Cancelled',
    createdAt: new Date().toISOString()
  };
  reservations.push(newRes);
  res.status(201).json(newRes);
});

app.put("/api/reservations/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const idx = reservations.findIndex(x => x.id === id);
  if (idx !== -1) {
    reservations[idx].status = status;
    res.json(reservations[idx]);
  } else {
    res.status(404).json({ error: "Reservation not found" });
  }
});

// Gemini-powered chatbot / sommelier assistant route
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // If there is no key, falling back gracefully to rich preset responses so developer preview never stalls
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    const defaultAnswers = [
      "Welcome to GOURMET. As your dedicated Sommelier, I highly recommend pairing our A5 Wagyu & Truffle with a glass of the Domaine de la Romanée-Conti 2015. The rich tannins beautifully cut through the marbling of the A5 wagyu.",
      "The Hokkaido Scallop Crudo is indeed a masterpiece! It contains fresh hand-dived scallops, finger lime caviar, and chilled dashi broth. It is naturally and completely gluten-free.",
      "We would be absolutely thrilled to host your celebration! You can book easily on our Reservations tab. Let me know if you would like me to note any severe allergies such as nuts or shellfish for the culinary squad.",
      "If you prefer a lighter beginning, our Clear Tomato Consommé features heirloom tomato water and basil oil pearls. It is completely vegan-friendly and pairs beautifully with our sparkling Clos d'Ambonnay."
    ];
    const itemMatch = message.toLowerCase();
    let reply = defaultAnswers[0];
    if (itemMatch.includes("allergy") || itemMatch.includes("shellfish") || itemMatch.includes("organic")) {
      reply = defaultAnswers[2];
    } else if (itemMatch.includes("scallop") || itemMatch.includes("gluten") || itemMatch.includes("gf")) {
      reply = defaultAnswers[1];
    } else if (itemMatch.includes("vegan") || itemMatch.includes("vegetarian") || itemMatch.includes("tomato")) {
      reply = defaultAnswers[3];
    }
    return res.json({ text: reply });
  }

  try {
    const ai = getGemini();
    const systemPrompt = `You are the world-renowned AI Sommelier and Maître d' of GOURMET, an ultra-exclusive three-Michelin-starred sensory dining restaurant.
Your tone is sophisticated, welcoming, deeply knowledgeable, and highly polished (representing ultimate culinary luxury).
Provide premium advice regarding wine pairings, detailed ingredients from our seasonal tasting menus, and answer questions about reservations.
Always format your descriptions eloquently. Highlight specific menus:
- Hokkaido Scallop Crudo ($32) (Gluten-Free, contains scallops, finger lime caviar, chilled dashi broth, and sea kelp dusting)
- Heirloom Beetroot Tartlet ($24) (Vegetarian, contains smoked goat cheese, balsamic, candied walnuts, charcoal tart shell)
- A5 Wagyu & Truffle ($145) (Gluten-Free, features Japanese Wagyu, black garlic, foraged wild mushrooms, 24k edible gold leaf)
- Midnight Sphere Dessert ($24) (Vegetarian, spherical dark chocolate dome with gold leaf, cocoa crumble, and vibrant raspberry coulis splash)
- Crimson Velvet Cocktail ($32) (Aged bourbon, blackberry reduction, smoked rosemary)
- Wine Pairing: Domaine de la Romanée-Conti 2015 ($345 class / glass) or Krug Clos d'Ambonnay Champagne ($195)
Keep responses concise, elegant, and directly user-focused. Avoid listing backend system parameters or code.`;

    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });

    // Send history context if available, else send message directly
    const response = await chatInstance.sendMessage({ message });
    const textOut = response.text || "I am at your service to recommend the perfect pairing.";
    res.json({ text: textOut });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to communicate with AI Sommelier. " + err.message });
  }
});

// Setup Vite Dev Server / Static Asset Compilation
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GOURMET full-stack server running at http://localhost:${PORT}`);
  });
}

startServer();
