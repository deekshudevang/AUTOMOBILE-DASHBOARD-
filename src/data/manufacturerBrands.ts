// AUTOVERSE — Automotive Manufacturer Brand Identity & Heritage Registry

export interface ManufacturerBrand {
  name: string;
  country: string;
  countryCode: string;
  brandColor: string;
  accentColor: string;
  founded: number;
  headquarters: string;
  heritageTagline: string;
  badgeType: string;
}

export const MANUFACTURER_BRANDS: Record<string, ManufacturerBrand> = {
  'Ferrari': {
    name: 'Ferrari',
    country: 'Italy',
    countryCode: 'IT',
    brandColor: '#DC0000',
    accentColor: '#FFEB3B',
    founded: 1939,
    headquarters: 'Maranello, Italy',
    heritageTagline: 'Essere Ferrari • Pure Racing Passion',
    badgeType: 'ferrari'
  },
  'Porsche': {
    name: 'Porsche',
    country: 'Germany',
    countryCode: 'DE',
    brandColor: '#C60000',
    accentColor: '#F2C94C',
    founded: 1931,
    headquarters: 'Stuttgart, Germany',
    heritageTagline: 'There is No Substitute • Engineering Precision',
    badgeType: 'porsche'
  },
  'Lamborghini': {
    name: 'Lamborghini',
    country: 'Italy',
    countryCode: 'IT',
    brandColor: '#E6B800',
    accentColor: '#D4AF37',
    founded: 1963,
    headquarters: "Sant'Agata Bolognese, Italy",
    heritageTagline: 'Expect the Unexpected • Uncompromising Power',
    badgeType: 'lamborghini'
  },
  'McLaren': {
    name: 'McLaren',
    country: 'United Kingdom',
    countryCode: 'GB',
    brandColor: '#FF8000',
    accentColor: '#1A1A1A',
    founded: 1963,
    headquarters: 'Woking, United Kingdom',
    heritageTagline: 'Fearlessly Forward • Formula 1 Aerodynamics',
    badgeType: 'mclaren'
  },
  'Bugatti': {
    name: 'Bugatti',
    country: 'France',
    countryCode: 'FR',
    brandColor: '#0B5ED7',
    accentColor: '#002664',
    founded: 1909,
    headquarters: 'Molsheim, France',
    heritageTagline: 'Pur Sang • Art, Forme, Technique',
    badgeType: 'bugatti'
  },
  'Koenigsegg': {
    name: 'Koenigsegg',
    country: 'Sweden',
    countryCode: 'SE',
    brandColor: '#005293',
    accentColor: '#D4AF37',
    founded: 1994,
    headquarters: 'Ängelholm, Sweden',
    heritageTagline: 'The Ghost Squadron • Megacar Innovation',
    badgeType: 'koenigsegg'
  },
  'Pagani': {
    name: 'Pagani',
    country: 'Italy',
    countryCode: 'IT',
    brandColor: '#C5A059',
    accentColor: '#4A5568',
    founded: 1992,
    headquarters: 'San Cesario sul Panaro, Italy',
    heritageTagline: 'Art and Science • Carbon-Titanium Atelier',
    badgeType: 'pagani'
  },
  'Aston Martin': {
    name: 'Aston Martin',
    country: 'United Kingdom',
    countryCode: 'GB',
    brandColor: '#004225',
    accentColor: '#A39264',
    founded: 1913,
    headquarters: 'Gaydon, United Kingdom',
    heritageTagline: 'Power, Beauty and Soul • British Heritage',
    badgeType: 'aston_martin'
  },
  'BMW': {
    name: 'BMW',
    country: 'Germany',
    countryCode: 'DE',
    brandColor: '#0066B1',
    accentColor: '#E53935',
    founded: 1916,
    headquarters: 'Munich, Germany',
    heritageTagline: 'The Ultimate Driving Machine • M Motorsport',
    badgeType: 'bmw'
  },
  'Mercedes-AMG': {
    name: 'Mercedes-AMG',
    country: 'Germany',
    countryCode: 'DE',
    brandColor: '#9EA2A2',
    accentColor: '#FFB300',
    founded: 1967,
    headquarters: 'Affalterbach, Germany',
    heritageTagline: 'Driving Performance • One Man, One Engine',
    badgeType: 'mercedes'
  },
  'Mercedes-Benz': {
    name: 'Mercedes-Benz',
    country: 'Germany',
    countryCode: 'DE',
    brandColor: '#9EA2A2',
    accentColor: '#0072CE',
    founded: 1926,
    headquarters: 'Stuttgart, Germany',
    heritageTagline: 'The Best or Nothing • Silver Arrows Legacy',
    badgeType: 'mercedes'
  },
  'Mercedes-Maybach': {
    name: 'Mercedes-Maybach',
    country: 'Germany',
    countryCode: 'DE',
    brandColor: '#8D7352',
    accentColor: '#D4AF37',
    founded: 1909,
    headquarters: 'Stuttgart, Germany',
    heritageTagline: 'Ultimate Luxury • Haute Horlogerie Craft',
    badgeType: 'mercedes'
  },
  'Audi': {
    name: 'Audi',
    country: 'Germany',
    countryCode: 'DE',
    brandColor: '#BB0A30',
    accentColor: '#212529',
    founded: 1909,
    headquarters: 'Ingolstadt, Germany',
    heritageTagline: 'Vorsprung durch Technik • Quattro Dominance',
    badgeType: 'audi'
  },
  'Lexus': {
    name: 'Lexus',
    country: 'Japan',
    countryCode: 'JP',
    brandColor: '#1E88E5',
    accentColor: '#212121',
    founded: 1989,
    headquarters: 'Nagoya, Japan',
    heritageTagline: 'Experience Amazing • Takumi Craftsmanship',
    badgeType: 'lexus'
  },
  'Nissan': {
    name: 'Nissan',
    country: 'Japan',
    countryCode: 'JP',
    brandColor: '#C00000',
    accentColor: '#2B2B2B',
    founded: 1933,
    headquarters: 'Yokohama, Japan',
    heritageTagline: 'Innovation that Excites • Nismo Motorsport',
    badgeType: 'nissan'
  },
  'Toyota': {
    name: 'Toyota',
    country: 'Japan',
    countryCode: 'JP',
    brandColor: '#EB0A1E',
    accentColor: '#111111',
    founded: 1937,
    headquarters: 'Toyota City, Japan',
    heritageTagline: 'Gazoo Racing • Pushing Limits for Better',
    badgeType: 'toyota'
  },
  'Chevrolet': {
    name: 'Chevrolet',
    country: 'United States',
    countryCode: 'US',
    brandColor: '#D4AF37',
    accentColor: '#E53935',
    founded: 1911,
    headquarters: 'Detroit, Michigan, USA',
    heritageTagline: 'An American Icon • Mid-Engine Flat-Plane V8',
    badgeType: 'chevrolet'
  },
  'Ford': {
    name: 'Ford',
    country: 'United States',
    countryCode: 'US',
    brandColor: '#002C6C',
    accentColor: '#F5F5F5',
    founded: 1903,
    headquarters: 'Dearborn, Michigan, USA',
    heritageTagline: 'Go Further • Le Mans Heritage',
    badgeType: 'ford'
  },
  'Dodge': {
    name: 'Dodge',
    country: 'United States',
    countryCode: 'US',
    brandColor: '#C62828',
    accentColor: '#1E1E1E',
    founded: 1900,
    headquarters: 'Auburn Hills, Michigan, USA',
    heritageTagline: 'Domestic. Not Domesticated • Supercharged Power',
    badgeType: 'dodge'
  },
  'Rolls-Royce': {
    name: 'Rolls-Royce',
    country: 'United Kingdom',
    countryCode: 'GB',
    brandColor: '#302244',
    accentColor: '#E0E0E0',
    founded: 1906,
    headquarters: 'Goodwood, United Kingdom',
    heritageTagline: 'Strive for Perfection • Magic Carpet Ride',
    badgeType: 'rolls_royce'
  },
  'Bentley': {
    name: 'Bentley',
    country: 'United Kingdom',
    countryCode: 'GB',
    brandColor: '#0B4734',
    accentColor: '#D4AF37',
    founded: 1919,
    headquarters: 'Crewe, United Kingdom',
    heritageTagline: 'The Silent Sports Car • Grand Touring Mastery',
    badgeType: 'bentley'
  },
  'Maserati': {
    name: 'Maserati',
    country: 'Italy',
    countryCode: 'IT',
    brandColor: '#002B49',
    accentColor: '#BB0A30',
    founded: 1914,
    headquarters: 'Modena, Italy',
    heritageTagline: 'Luxury, Sports and Style • Nettuno Pre-Chamber V6',
    badgeType: 'maserati'
  },
  'Mazda': {
    name: 'Mazda',
    country: 'Japan',
    countryCode: 'JP',
    brandColor: '#990000',
    accentColor: '#2B2B2B',
    founded: 1920,
    headquarters: 'Hiroshima, Japan',
    heritageTagline: 'Celebrate Driving • Rotary Spirit & Jinba Ittai',
    badgeType: 'mazda'
  },
  'Honda': {
    name: 'Honda',
    country: 'Japan',
    countryCode: 'JP',
    brandColor: '#CC0000',
    accentColor: '#F5F5F5',
    founded: 1948,
    headquarters: 'Tokyo, Japan',
    heritageTagline: 'The Power of Dreams • VTEC & Type R Purity',
    badgeType: 'honda'
  },
  'Mitsubishi': {
    name: 'Mitsubishi',
    country: 'Japan',
    countryCode: 'JP',
    brandColor: '#EE1C25',
    accentColor: '#1A1A1A',
    founded: 1870,
    headquarters: 'Tokyo, Japan',
    heritageTagline: 'Drive Your Ambition • World Rally Championship Legend',
    badgeType: 'mitsubishi'
  },
  'Subaru': {
    name: 'Subaru',
    country: 'Japan',
    countryCode: 'JP',
    brandColor: '#003399',
    accentColor: '#D4AF37',
    founded: 1953,
    headquarters: 'Tokyo, Japan',
    heritageTagline: 'Confidence in Motion • Symmetrical AWD & Boxer',
    badgeType: 'subaru'
  }
};

const DEFAULT_BRAND: ManufacturerBrand = {
  name: 'AutoVerse Performance',
  country: 'Global',
  countryCode: 'GL',
  brandColor: '#E53935',
  accentColor: '#F0F1F2',
  founded: 2026,
  headquarters: 'Global Motorsport Engineering',
  heritageTagline: 'Precision 3D Engineering & Automotive CAD',
  badgeType: 'generic'
};

export function getManufacturerBrand(manufacturer: string): ManufacturerBrand {
  if (!manufacturer) return DEFAULT_BRAND;

  // Direct match
  if (MANUFACTURER_BRANDS[manufacturer]) {
    return MANUFACTURER_BRANDS[manufacturer];
  }

  // Case-insensitive or partial match
  const lower = manufacturer.toLowerCase();
  for (const [key, brand] of Object.entries(MANUFACTURER_BRANDS)) {
    if (lower === key.toLowerCase() || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return brand;
    }
  }

  return {
    ...DEFAULT_BRAND,
    name: manufacturer
  };
}
