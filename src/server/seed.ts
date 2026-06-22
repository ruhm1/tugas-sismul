import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
const auth = getAuth();

async function seed() {
  console.log('Seeding Firestore database...');

  // 1. Create admin user in Firebase Auth
  try {
    await auth.createUser({
      email: 'admin@gourmet.com',
      password: 'admin123',
      displayName: 'Admin Gourmet',
    });
    console.log('Created admin user: admin@gourmet.com / admin123');
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      console.log('Admin user already exists, skipping.');
    } else {
      console.error('Error creating admin user:', err.message);
    }
  }

  // Also store user profile in Firestore
  await db.collection('users').doc('admin-default').set({
    email: 'admin@gourmet.com',
    name: 'Admin Gourmet',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // 2. Seed categories
  const categories = [
    { name: 'Makanan', slug: 'makanan' },
    { name: 'Minuman', slug: 'minuman' },
    { name: 'Dessert', slug: 'dessert' },
    { name: 'Paket Spesial', slug: 'paket-spesial' },
  ];

  for (const cat of categories) {
    await db.collection('categories').doc(cat.slug).set({
      ...cat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 3. Seed menu items
  const menuItems = [
    {
      name: 'Hokkaido Scallop Crudo',
      price: 32,
      description: 'Hand-dived scallops, finger lime caviar, white soy emulsion, and chilled dashi broth. Finished with a dusting of dehydrated sea kelp.',
      category: 'Makanan',
      tags: ['Signature', 'GF'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrz70NMCRX0-oOIaxo0AI7-qsVIeBxKmmnxFQ87DeguXUiz7qKaokSPj_1QwQH3IV7Q9eMv8PwZVJ1hQe5gJCsFQSpZJFGxWAG-h3icCH4ew-GwhCfRAQoCHDmbMBn8QgOrsz9F_6bypPsdp9hBrUBUkVo5eKFgMglmcS4-GenBfu5doNLZOb-fyY627NGIfsAWii2B-S4Y2qgRn73D69IRR2su28WOpAyZ4zOvrhJ6WXqtoAJqPgtZUUQi1-nWd1qOevrvUMZAPhe',
      isSignature: true,
      isAvailable: true,
    },
    {
      name: 'Wagyu Beef Tartare',
      price: 36,
      description: 'A5 Wagyu hand-cut, cured free-range egg yolk, shaved black winter truffle, served on rough stone with house-made crisp brioche points.',
      category: 'Makanan',
      tags: ['GF'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJlfYVkgi81PjjHHSiH5NEG7pjKS0quezXo9McjnyC3qeKfIRRPzBg2k52uhytLm1F4EPGlFMhzDN4Id0WwruzTiFOuLSFXlcsWJTyHXgKYx9aPYXydU2arTuNF0SZr9_03H-oEihC3Sl7cJW9UtCEcFSm72Ag2eWSHWSF38oD0AUTDHmgrep3FbXZwClgXy33jjl1HQY-QiflKVDA-51cBM2YciqDNnEC3RAkGkT40r1B-t0L6LlDlWNe2lNz_6RP6iVtDILTm_nX',
      isSignature: false,
      isAvailable: true,
    },
    {
      name: 'A5 Wagyu & Truffle',
      price: 145,
      description: 'Grade A5 Japanese Wagyu steak, black garlic puree, foraged wild mushrooms, 24k edible gold leaf gilding, reduced veal bone glaze.',
      category: 'Makanan',
      tags: ['Signature', 'GF'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLrZsALN9dOJACYjx5QsSq9XYrIu84Fi4xOWcXcCJAQzwggkAEgZ902YCI4p4ISyes1ZL5t6ztxBpQEYi47OnS84eHFDuryrfIHhKQhwwRHEllXU0W3hy3EANnX5TzcVgW0jftQdY6UK6AM3wb64MW1GvufAYtA2xdNEKidDtcjrDCq2GDO8kypDY-q1PxY02DCr6vKvaONquvviclRsRu9TdxeTn5qTkQXRzaEvfk2c5L17KVC4bWs5Sm00p4SUkGHWQfX4Sq_RRH',
      isSignature: true,
      isAvailable: true,
    },
    {
      name: 'Midnight Sphere',
      price: 24,
      description: 'A delicate, perfectly spherical dark chocolate shell, rich chocolate ganache quenelle, chocolate soil, vibrant raspberry coulis splash.',
      category: 'Dessert',
      tags: ['Signature', 'V'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR-T1HLvryigJN5rCzDtcbfwf8kvy9sW7gh5PYSExvqHFgg17rbFldpUghq_uAoOVpV3tuYxerLe_Md5xespn53lCSwjyB6njTaGgjEuBzvuGLeNS6IBuPIrUgHdsxPRA6Fkfk7UUWeE8JEMTUhe_0dKSdpxA6-53V5jk3tyOUhqjGm6DBdwhNNg43OiEarlMyX8SXNDLQ3Xib3EDjP2UxoUdjVRrEjBOJYvy9WWLxbTicV76-dJhXMcnWZe76Pmczy5QiXxmxvY1u',
      isSignature: true,
      isAvailable: true,
    },
    {
      name: 'Domaine de la Romanee-Conti 2015',
      price: 345,
      description: 'Expertly selected Grand Cru vintage Pinot Noir, boasting aromas of wild forest berries, violet petals, and delicate earthy spice.',
      category: 'Minuman',
      tags: ['Signature'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLTmc5HgnCABJQqUQycI3zBatcMP3vV7GPgUxw5eCjXEbJacOq8Z1sZSh6p0okrFok-rz2WRpUJ6wTRHoS2vNxo5IHMg7BuFzG-gAvYKdTIVVbPMGBJu9ngm2v3hEjiOyqD1gRSlVnf5UAdE62dmw2UvH4euCBrM-2TcPQ5ucG346-lG1cz6GtJjCRDMx7hbVb5n9j0BwyXotwnmmN40ztU36mWp_jc2t-pJQlKlut3pcBwN3cgLm8NwHHU8aeprOuwHS9GuROFTAQ',
      isSignature: true,
      isAvailable: true,
    },
    {
      name: "Chef's Tasting Experience",
      price: 295,
      description: '14-course micro-pairing custom menu curated by Chef Eleanor Vance. Includes wine pairings, amuse-bouche, and petit fours.',
      category: 'Paket Spesial',
      tags: ['Signature'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvriSxtPLExBTEbGXNc8xNIgEHyQkkp98-BP0Nj9ApJPFUcaNkneFuwhs8jpcdLxpeVAL3yNkiJfhqmNJqfGHk58qJVs6xaF0ATy-fjMugE0J1EoTsw_KyUpuyajAcw74RnJiVjZk39Pz0qjm42g6LbavRzYU0Yd4xiQRDNgDV5ywQRGuJ7n0kXa2lZsly7Q0UuSRv4qpdL7oOu7j_hyhx2TT1pUHA-3Dk_5Y6Ut0Jzq8vAYpmRUO_eTrLuM6S-8fMaQyXXh6mmQZp',
      isSignature: true,
      isAvailable: true,
    },
  ];

  for (const item of menuItems) {
    await db.collection('menus').add({
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${menuItems.length} menu items.`);

  // 4. Seed promotions
  const promotions = [
    {
      title: 'Summer Wine Pairing Special',
      description: 'Enjoy a complimentary glass of Krug Clos d\'Ambonnay Champagne with any main course ordered during our summer tasting event.',
      banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJLRGwRAbmqLNoPJ4Fgq5jMaJl3FIUxYjvlthWyYuBBYTpHoeDwmzUOoSmMo8RmLcRXCWQ6uGt5_Si7c-AixeANrKt_0xsOMoLiuJI2i-J-slfZXaFTplrxsrty1uqeRsl_w-KvqiA4JnoudX1fYaRS4wQymsfVcpKfxUExL4YN_Z43lw2xlDLvfzjASNfPvPMlCcenXDbQIzsyPqRWUcaPxVnsXoPCFL9E_obrggLI3oo-XEgE0_uzH0nOWOWXORFbm1zKgEZfQ_h',
      startDate: new Date('2026-06-01').toISOString(),
      endDate: new Date('2026-08-31').toISOString(),
      isActive: true,
    },
    {
      title: 'Anniversary Dinner for Two',
      description: 'Celebrate your special occasion with our exclusive 7-course anniversary dinner package, including a personalized dessert and champagne toast.',
      banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXJnsOojBxdtm2BAAvLWcXJvaldns3EzIgITLv-nRoeE5geX_lKMmgQxYSHHhumQpgtLvwujwTlDPQ4etsja6MyFSE5jZe0di-DjZzFiRTIPKGXbB5mTT5-mU2UmiZLnO24qiaHIlO2ianOBSffC8z-WojxKExl6_wdaT-of85vvV98z4L0T3__Oh58YYQwCOfYloLHihuHb2sE9msF87-QZ2LTxM1R_8S9lyhi_c8E605QA_UwriIe6BeZT9FIFDxow8fZySXNID6',
      startDate: new Date('2026-06-15').toISOString(),
      endDate: new Date('2026-12-31').toISOString(),
      isActive: true,
    },
  ];

  for (const promo of promotions) {
    await db.collection('promotions').add({
      ...promo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${promotions.length} promotions.`);

  // 5. Seed gallery items
  const galleryItems = [
    {
      title: 'Seared Scallop Artistry',
      category: 'FOOD',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXJnsOojBxdtm2BAAvLWcXJvaldns3EzIgITLv-nRoeE5geX_lKMmgQxYSHHhumQpgtLvwujwTlDPQ4etsja6MyFSE5jZe0di-DjZzFiRTIPKGXbB5mTT5-mU2UmiZLnO24qiaHIlO2ianOBSffC8z-WojxKExl6_wdaT-of85vvV98z4L0T3__Oh58YYQwCOfYloLHihuHb2sE9msF87-QZ2LTxM1R_8S9lyhi_c8E605QA_UwriIe6BeZT9FIFDxow8fZySXNID6',
      description: 'A meticulously plated seared scallop arranged on standard dark stone canvas slate plate, spotlighted for premium contrast.',
    },
    {
      title: 'Main Dining Room',
      category: 'INTERIOR',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjP-RHsBe75Y_K_Duh5yeOla5OrcAwPfbomxrJJpibOx8AS7UH31WD4RcdfwemXRvT9jWG8pCGn_e1uzHboYMIUXL13r_3sOztuDqGw556W4EdHr3hekIXsjNuAkeAXdaGi09IL74Jn0XXXmOYqrKqKEhSg5COcKNfgGrl00LafxLDF5gyWZsn5BGYTDmtjAhWXpwPOcq-sgam8GaBjLi765uQi9-lcI96FtprTIRsCoQBKo7AO4EkaeJFMhaOMquE7Gg1ZfxmNq1P',
      description: 'Expansive view of the grand dining salon set with elegant dark velvet booths and glowing brass lighting.',
    },
    {
      title: 'Precision & Passion',
      category: 'CHEF',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvriSxtPLExBTEbGXNc8xNIgEHyQkkp98-BP0Nj9ApJPFUcaNkneFuwhs8jpcdLxpeVAL3yNkiJfhqmNJqfGHk58qJVs6xaF0ATy-fjMugE0J1EoTsw_KyUpuyajAcw74RnJiVjZk39Pz0qjm42g6LbavRzYU0Yd4xiQRDNgDV5ywQRGuJ7n0kXa2lZsly7Q0UuSRv4qpdL7oOu7j_hyhx2TT1pUHA-3Dk_5Y6Ut0Jzq8vAYpmRUO_eTrLuM6S-8fMaQyXXh6mmQZp',
      description: 'Chef Eleanor Vance putting the concluding final elements with culinary pincers under soft dim overhead lighting.',
    },
    {
      title: 'Private Cellar Dinner',
      category: 'EVENTS',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJLRGwRAbmqLNoPJ4Fgq5jMaJl3FIUxYjvlthWyYuBBYTpHoeDwmzUOoSmMo8RmLcRXCWQ6uGt5_Si7c-AixeANrKt_0xsOMoLiuJI2i-J-slfZXaFTplrxsrty1uqeRsl_w-KvqiA4JnoudX1fYaRS4wQymsfVcpKfxUExL4YN_Z43lw2xlDLvfzjASNfPvPMlCcenXDbQIzsyPqRWUcaPxVnsXoPCFL9E_obrggLI3oo-XEgE0_uzH0nOWOWXORFbm1zKgEZfQ_h',
      description: 'Private candlelit long-table dinner for executive patrons surrounded by rare vintages in the dark cellar vaults.',
    },
  ];

  for (const item of galleryItems) {
    await db.collection('galleries').add({
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${galleryItems.length} gallery items.`);

  // 6. Seed restaurant profile
  await db.collection('restaurant_profiles').doc('default').set({
    name: 'GOURMET',
    description: 'A three-Michelin-starred fine dining restaurant offering an extraordinary culinary journey. Executive Chef Eleanor Vance curates seasonal tasting menus that blend classical French techniques with Japanese minimalism.',
    vision: 'To be the world\'s most celebrated destination for transformative culinary artistry, where every plate tells a story and every visit creates a lasting memory.',
    mission: 'We craft unforgettable dining experiences through seasonal ingredients, artisanal precision, and atmospheric luxury. Every guest receives personalized service that transcends expectations.',
    address: '12 Rue de la Gastronomie, Paris 75008, France',
    phone: '+33 1 42 68 53 00',
    email: 'reservations@gourmet.com',
    operatingHours: 'Wednesday - Sunday: 5:00 PM - 11:30 PM | Monday - Tuesday: Closed',
    socialMedia: {
      instagram: '@gourmet_paris',
      facebook: 'gourmet.paris',
      twitter: '@gourmet_paris',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log('Seeded restaurant profile.');

  // 7. Seed chatbot knowledge base
  const knowledgeItems = [
    {
      question: 'What are your operating hours?',
      answer: 'GOURMET is open Wednesday through Sunday from 5:00 PM to 11:30 PM. We are closed on Mondays and Tuesdays. Executive Cellar bookings require 48 hours advance notice.',
      category: 'general',
      isActive: true,
    },
    {
      question: 'Where is the restaurant located?',
      answer: 'GOURMET is located at 12 Rue de la Gastronomie, Paris 75008, France. We offer valet parking service for all dinner guests.',
      category: 'general',
      isActive: true,
    },
    {
      question: 'Do you accommodate food allergies?',
      answer: 'Absolutely. We take all allergies very seriously. Please inform us during reservation and our culinary team will prepare a safe, equally exquisite alternative menu. We are fully equipped to handle nut, gluten, dairy, and shellfish allergies.',
      category: 'menu',
      isActive: true,
    },
    {
      question: 'What is the dress code?',
      answer: 'We maintain a smart elegant dress code. Gentlemen are encouraged to wear jackets. No sportswear, shorts, or flip-flops please.',
      category: 'general',
      isActive: true,
    },
  ];

  for (const item of knowledgeItems) {
    await db.collection('chatbot_knowledge').add({
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${knowledgeItems.length} knowledge base entries.`);

  // 8. Seed sample reservations
  const reservations = [
    {
      reservationCode: 'GRT-20260625-001',
      userName: 'Eleanor Vance',
      email: 'eleanor.vance@vip.com',
      phone: '+1 (555) 123-4567',
      date: '2026-06-25',
      time: '19:00',
      guestsCount: 2,
      specialRequests: 'VIP Treatment - Celebrating Wedding Anniversary.',
      status: 'Confirmed',
    },
    {
      reservationCode: 'GRT-20260625-002',
      userName: 'Jameson & Co.',
      email: 'j.jameson@jamesoncorp.com',
      phone: '+1 (555) 987-6543',
      date: '2026-06-25',
      time: '20:00',
      guestsCount: 8,
      specialRequests: 'Corporate Dinner - Needs a private room if possible.',
      status: 'Pending',
    },
  ];

  for (const res of reservations) {
    await db.collection('reservations').add({
      ...res,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${reservations.length} reservations.`);

  console.log('\nSeed completed successfully!');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
