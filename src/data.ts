import { MenuItem, GalleryItem, Reservation } from './types';

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
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
  // Mains
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
  // Desserts
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
  // Wines
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
    name: 'Krug Clos d\'Ambonnay Champagne',
    price: 195,
    description: 'Prestigious Blanc de Noirs Champagne, revealing unmatched richness, toasted brioche undertones, and persistent mineral finish.',
    category: 'Wines',
    tags: ['GF'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJLRGwRAbmqLNoPJ4Fgq5jMaJl3FIUxYjvlthWyYuBBYTpHoeDwmzUOoSmMo8RmLcRXCWQ6uGt5_Si7c-AixeANrKt_0xsOMoLiuJI2i-J-slfZXaFTplrxsrty1uqeRsl_w-KvqiA4JnoudX1fYaRS4wQymsfVcpKfxUExL4YN_Z43lw2xlDLvfzjASNfPvPMlCcenXDbQIzsyPqRWUcaPxVnsXoPCFL9E_obrggLI3oo-XEgE0_uzH0nOWOWXORFbm1zKgEZfQ_h'
  }
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Seared Scallop Artistry',
    category: 'FOOD',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXJnsOojBxdtm2BAAvLWcXJvaldns3EzIgITLv-nRoeE5geX_lKMmgQxYSHHhumQpgtLvwujwTlDPQ4etsja6MyFSE5jZe0di-DjZzFiRTIPKGXbB5mTT5-mU2UmiZLnO24qiaHIlO2ianOBSffC8z-WojxKExl6_wdaT-of85vvV98z4L0T3__Oh58YYQwCOfYloLHihuHb2sE9msF87-QZ2LTxM1R_8S9lyhi_c8E605QA_UwriIe6BeZT9FIFDxow8fZySXNID6',
    description: 'A meticulously plated seared scallop arranged on standard dark stone canvas slate plate, spotlighted for premium contrast.'
  },
  {
    id: 'gal-2',
    title: 'Main Dining Room',
    category: 'INTERIOR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjP-RHsBe75Y_K_Duh5yeOla5OrcAwPfbomxrJJpibOx8AS7UH31WD4RcdfwemXRvT9jWG8pCGn_e1uzHboYMIUXL13r_3sOztuDqGw556W4EdHr3hekIXsjNuAkeAXdaGi09IL74Jn0XXXmOYqrKqKEhSg5COcKNfgGrl00LafxLDF5gyWZsn5BGYTDmtjAhWXpwPOcq-sgam8GaBjLi765uQi9-lcI96FtprTIRsCoQBKo7AO4EkaeJFMhaOMquE7Gg1ZfxmNq1P',
    description: 'Expansive view of the grand dining salon set with elegant dark velvet booths and glowing brass lighting.'
  },
  {
    id: 'gal-3',
    title: 'Precision & Passion',
    category: 'CHEF',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvriSxtPLExBTEbGXNc8xNIgEHyQkkp98-BP0Nj9ApJPFUcaNkneFuwhs8jpcdLxpeVAL3yNkiJfhqmNJqfGHk58qJVs6xaF0ATy-fjMugE0J1EoTsw_KyUpuyajAcw74RnJiVjZk39Pz0qjm42g6LbavRzYU0Yd4xiQRDNgDV5ywQRGuJ7n0kXa2lZsly7Q0UuSRv4qpdL7oOu7j_hyhx2TT1pUHA-3Dk_5Y6Ut0Jzq8vAYpmRUO_eTrLuM6S-8fMaQyXXh6mmQZp',
    description: 'Chef Eleanor Vance putting the concluding final elements with culinary pincers under soft dim overhead lighting.'
  },
  {
    id: 'gal-4',
    title: 'Texture of Cacao',
    category: 'FOOD',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuDKViBf5NlzhSuCxN2Ey3HcbSBd2RMuT443rFKf3wvFMyRtl3jnZgDYXdHByUhmpNdQN25tFoad8VCaCG2nsiDm7debBupu5x4gPQkofkOgILlpmMXgcqLGg7Me2kfLPeqrKbp_3WC71JveCcM250Mvy7gzdC_7-CUZCfYAENPR1tpzt-C6xWxM5ggdgmlUoamD5wYYAL_mDP_f9sL_8jDcJlJQOJ3awj9HXnfAvuBWFD1j5VlzCYFKulUq5J14JUYLXFqq32k8BL',
    description: 'An elegant composition exploring the limits of fine single-origin Madagascar cacao with raspberry coulis.'
  },
  {
    id: 'gal-5',
    title: 'Private Cellar Dinner',
    category: 'EVENTS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJLRGwRAbmqLNoPJ4Fgq5jMaJl3FIUxYjvlthWyYuBBYTpHoeDwmzUOoSmMo8RmLcRXCWQ6uGt5_Si7c-AixeANrKt_0xsOMoLiuJI2i-J-slfZXaFTplrxsrty1uqeRsl_w-KvqiA4JnoudX1fYaRS4wQymsfVcpKfxUExL4YN_Z43lw2xlDLvfzjASNfPvPMlCcenXDbQIzsyPqRWUcaPxVnsXoPCFL9E_obrggLI3oo-XEgE0_uzH0nOWOWXORFbm1zKgEZfQ_h',
    description: 'Private candlelit long-table dinner for executive patrons surrounded by rare vintages in the dark cellar vaults.'
  },
  {
    id: 'gal-6',
    title: 'The Reserve Cellar',
    category: 'INTERIOR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLTmc5HgnCABJQqUQycI3zBatcMP3vV7GPgUxw5eCjXEbJacOq8Z1sZSh6p0okrFok-rz2WRpUJ6wTRHoS2vNxo5IHMg7BuFzG-gAvYKdTIVVbPMGBJu9ngm2v3hEjiOyqD1gRSlVnf5UAdE62dmw2UvH4euCBrM-2TcPQ5ucG346-lG1cz6GtJjCRDMx7hbVb5n9j0BwyXotwnmmN40ztU36mWp_jc2t-pJQlKlut3pcBwN3cgLm8NwHHU8aeprOuwHS9GuROFTAQ',
    description: 'Floor-to-ceiling custom dark timber climate controlled wine shelves showcasing rare legendary vintages.'
  }
];

export const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    reservationCode: 'GRT-20260625-001',
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
    reservationCode: 'GRT-20260625-002',
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
    reservationCode: 'GRT-20260626-003',
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
