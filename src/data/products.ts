// Product Configuration with Color Themes and Dummy Images

export interface ProductTheme {
  id: string;
  name: string;
  brandName: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  benefits: string;
  usage: string;
  ingredients: string;
  color: {
    primary: string;
    gradient: string;
    accent: string;
    bgLight: string;
  };
  images: {
    main: string;
    thumbnail: string;
    lifestyle: string;
  };
}

export const PRODUCT_CATALOG: ProductTheme[] = [
  {
    id: '1',
    name: 'Bio-Collagen Sachet',
    brandName: 'ONLY BIO-COLLAGEN',
    slug: 'bio-collagen',
    category: 'Wellness',
    description: 'Premium collagen supplement for comprehensive health and beauty from within',
    price: 2499,
    benefits: 'Skin Health & Anti-Aging, Hair & Nail Strength, Muscle Recovery & Lean Mass Strength, Gut & Tissue Repair, Longevity Support',
    usage: 'Mix one sachet with water or your favorite beverage daily',
    ingredients: 'Hydrolyzed Marine Collagen, Vitamin C, Hyaluronic Acid, Biotin',
    color: {
      primary: '#FFD700',
      gradient: 'from-amber-100 via-yellow-50 to-amber-100',
      accent: '#F4C430',
      bgLight: '#FFF9E6'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop', // Gold supplement sachet
      thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=800&fit=crop'
    }
  },
  {
    id: '2',
    name: 'Revive Female Health Sachet',
    brandName: 'ONLY REVIVE',
    slug: 'revive-female-health',
    category: 'Wellness',
    description: 'Comprehensive female wellness formula targeting PCOS and overall hormonal health',
    price: 2799,
    benefits: 'PCOS Support, Hormonal Balance, Female Overall Health, Reproductive Wellness, Energy & Vitality',
    usage: 'Take one sachet daily with meals',
    ingredients: 'Myo-Inositol, D-Chiro-Inositol, Vitamin D3, Folic Acid, Chromium',
    color: {
      primary: '#FF69B4',
      gradient: 'from-pink-100 via-rose-50 to-pink-100',
      accent: '#FF1493',
      bgLight: '#FFF0F5'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop', // Pink wellness sachet
      thumbnail: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=1200&h=800&fit=crop'
    }
  },
  {
    id: '3',
    name: 'Day & Night 24 Hrs Magic',
    brandName: 'ONLY DAY & NIGHT',
    slug: 'anti-aging-capsule',
    category: 'Skincare',
    description: "India's First 24 Hrs Anti-Aging Regimen - Advanced formula working around the clock",
    price: 3299,
    benefits: 'Advanced Anti-Aging Formula, 24-Hour Protection, Cellular Renewal, Skin Radiance, Wrinkle Reduction',
    usage: 'Take Day capsule in morning, Night capsule before bed',
    ingredients: 'Resveratrol, Coenzyme Q10, Vitamin E, Retinol, Melatonin (Night)',
    color: {
      primary: '#9370DB',
      gradient: 'from-purple-100 via-violet-50 to-purple-100',
      accent: '#8B00FF',
      bgLight: '#F5F0FF'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop', // Purple supplement bottle
      thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&h=800&fit=crop'
    }
  },
  {
    id: '4',
    name: 'Cell Repair Serum',
    brandName: 'ONLY CELL REPAIR',
    slug: 'cell-repair-serum',
    category: 'Skincare',
    description: 'Ultra advanced face serum with dual peptide effect for intensive cellular renewal',
    price: 3999,
    benefits: 'Cellular Repair, Collagen Boost, Fine Line Reduction, Skin Firmness, Hydration Lock',
    usage: 'Apply 2-3 drops to clean face, morning and evening',
    ingredients: 'Dual Peptide Complex, Niacinamide, Hyaluronic Acid, Vitamin C, Ceramides',
    color: {
      primary: '#00CED1',
      gradient: 'from-cyan-100 via-teal-50 to-cyan-100',
      accent: '#20B2AA',
      bgLight: '#E0FFFF'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1620916297894-5c66b8afa2d7?w=800&h=800&fit=crop', // Turquoise serum bottle
      thumbnail: 'https://images.unsplash.com/photo-1620916297894-5c66b8afa2d7?w=400&h=400&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=800&fit=crop'
    }
  },
  {
    id: '5',
    name: 'Solligent SPF Shield',
    brandName: 'ONLY SOLLIGENT',
    slug: 'solligent-spf',
    category: 'Skincare',
    description: 'Next-generation hybrid intelligent sunscreen + antioxidant skincare shield',
    price: 2299,
    benefits: 'Broad Spectrum SPF 50+, Blue Light Protection, Anti-Pollution Shield, Antioxidant Defense, Lightweight Formula',
    usage: 'Apply generously 15 minutes before sun exposure, reapply every 2 hours',
    ingredients: 'Zinc Oxide, Titanium Dioxide, Vitamin E, Niacinamide, Green Tea Extract',
    color: {
      primary: '#FF8C00',
      gradient: 'from-orange-100 via-amber-50 to-orange-100',
      accent: '#FFA500',
      bgLight: '#FFF5E6'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop', // Orange sunscreen tube
      thumbnail: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1200&h=800&fit=crop'
    }
  },
  {
    id: '6',
    name: 'ExoSkin DNA Gel-Serum',
    brandName: 'ONLY EXOSKIN',
    slug: 'exoskin-dna-serum',
    category: 'Skincare',
    description: 'Highly advanced, multi-action skin elixir combining exosomes, PDRN, peptides, vitamins, and ceramides',
    price: 5999,
    benefits: 'Salmon Sperm DNA, Exosome Technology, PDRN Repair, Multi-Peptide Complex, Barrier Restoration',
    usage: 'Apply 3-4 drops to clean skin, gently massage until absorbed',
    ingredients: 'Salmon DNA (PDRN), Exosomes, Triple Peptides, Vitamin B5, Ceramide Complex',
    color: {
      primary: '#40E0D0',
      gradient: 'from-teal-100 via-cyan-50 to-teal-100',
      accent: '#48D1CC',
      bgLight: '#E0FFFF'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=800&fit=crop', // Aqua luxury serum
      thumbnail: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&h=800&fit=crop'
    }
  },
  {
    id: '7',
    name: 'Biome Gut Repair Gummies',
    brandName: 'ONLY BIOME',
    slug: 'biome-gut-repair',
    category: 'Wellness',
    description: 'Next-gen gut health gummy with probiotic + prebiotic + postbiotic + polyphenols',
    price: 1999,
    benefits: 'Microbiome Balance, Digestive Health, Metabolic Support, Immune Boost, Nutrient Absorption',
    usage: 'Take 2 gummies daily with or without food',
    ingredients: 'Probiotic Blend, Prebiotic Fiber, Postbiotics, Polyphenols, Micronutrients',
    color: {
      primary: '#32CD32',
      gradient: 'from-green-100 via-emerald-50 to-green-100',
      accent: '#00FA9A',
      bgLight: '#F0FFF0'
    },
    images: {
      main: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop', // Green gummy bottle
      thumbnail: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=800&fit=crop'
    }
  }
];

// Helper function to get product by slug
export const getProductBySlug = (slug: string) => {
  return PRODUCT_CATALOG.find(p => p.slug === slug);
};

// Helper function to get products by category
export const getProductsByCategory = (category: string) => {
  return PRODUCT_CATALOG.filter(p => p.category === category);
};

// Product categories
export const PRODUCT_CATEGORIES = [
  {
    name: 'All Products',
    slug: 'all',
    icon: '🧬'
  },
  {
    name: 'Skincare',
    slug: 'skincare',
    icon: '✨',
    color: '#40E0D0'
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    icon: '💊',
    color: '#FFD700'
  }
];
