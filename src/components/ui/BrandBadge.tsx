import React from 'react';
import { getManufacturerBrand, ManufacturerBrand } from '../../data/manufacturerBrands';

interface BrandBadgeProps {
  manufacturer: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showCountry?: boolean;
  className?: string;
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({
  manufacturer,
  size = 'md',
  showWordmark = false,
  showCountry = false,
  className = ''
}) => {
  const brand = getManufacturerBrand(manufacturer);

  const sizeDimensions = {
    xs: { box: 'w-4 h-4', icon: 'w-3 h-3', text: 'text-[10px]', flag: 'text-[9px]' },
    sm: { box: 'w-5 h-5', icon: 'w-3.5 h-3.5', text: 'text-xs', flag: 'text-[10px]' },
    md: { box: 'w-7 h-7', icon: 'w-5 h-5', text: 'text-sm', flag: 'text-xs' },
    lg: { box: 'w-9 h-9', icon: 'w-6 h-6', text: 'text-base', flag: 'text-sm' }
  }[size];

  // Render stylized SVG crests for prominent manufacturers
  const renderCrestSvg = (type: string) => {
    switch (type) {
      case 'ferrari':
        // Prancing Horse Shield Silhouette
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <path
              d="M12 2L4 5v7c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3z"
              fill="#FFEB3B"
              stroke="#D4AF37"
              strokeWidth="1.2"
            />
            {/* Prancing stallion silhouette */}
            <path
              d="M13.5 7c-.5.2-.8.6-.8 1.1 0 .2.2.4.4.5.3.1.5.3.5.6 0 .5-.4 1-.9 1.1l-.3.6c.3.2.7.4 1.1.4.3 0 .6-.1.8-.3.3-.3.4-.7.4-1.1 0-.6-.3-1.1-.8-1.5-.4-.4-.8-.7-1.1-1zM10.8 14.5c.2.5.6.9 1.1 1.1l.6-.4c-.4-.4-.7-.9-.8-1.5l-.9.8z"
              fill="#111111"
            />
            <rect x="8" y="4" width="8" height="1.2" fill="#008000" />
            <rect x="8" y="5.2" width="8" height="1.2" fill="#FFFFFF" />
            <rect x="8" y="6.4" width="8" height="1.2" fill="#DC0000" />
          </svg>
        );

      case 'porsche':
        // Stuttgart Crest Shield
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <path
              d="M12 2L4 5v7c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3z"
              fill="#F2C94C"
              stroke="#B78103"
              strokeWidth="1.2"
            />
            <path d="M12 2v20M4 11h16" stroke="#C60000" strokeWidth="1.2" />
            <rect x="9.5" y="8" width="5" height="6" rx="1" fill="#111111" />
            <circle cx="12" cy="11" r="1.5" fill="#F2C94C" />
          </svg>
        );

      case 'lamborghini':
        // Charging Bull Shield
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <path
              d="M12 2L4 5.5v7c0 5 3.5 9 8 10.5 4.5-1.5 8-5.5 8-10.5v-7L12 2z"
              fill="#18181B"
              stroke="#D4AF37"
              strokeWidth="1.5"
            />
            <path
              d="M8.5 10c1-1 2.5-1.5 3.5-1.5s2.5.5 3.5 1.5c-.8.8-1.8 1.2-3.5 1.2s-2.7-.4-3.5-1.2zM10 13c1 .5 2 .8 3.5.5l.5 1.5c-1.5.5-3 0-4-1l0-1z"
              fill="#E6B800"
            />
          </svg>
        );

      case 'mclaren':
        // Speedmark Swoosh
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <circle cx="12" cy="12" r="10" fill="#18181B" stroke="#333338" strokeWidth="1" />
            <path
              d="M7 14c3-6 10-6 11-2-1 3-5 5-9 4-1-.5-2-1.2-2-2z"
              fill="#FF8000"
            />
          </svg>
        );

      case 'bugatti':
        // Oval EB Emblem
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <ellipse cx="12" cy="12" rx="10" ry="7" fill="#CC0000" stroke="#FFFFFF" strokeWidth="1" />
            <text
              x="12"
              y="14"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="monospace"
              fontWeight="900"
              fontSize="7"
            >
              EB
            </text>
          </svg>
        );

      case 'koenigsegg':
        // Ghost Squadron Shield
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <path
              d="M12 2L4 6v6c0 6 4 9.5 8 11 4-1.5 8-5 8-11V6l-8-4z"
              fill="#005293"
              stroke="#D4AF37"
              strokeWidth="1.2"
            />
            <path d="M7 8l5 4-5 4M17 8l-5 4 5 4" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'aston_martin':
        // Spread Wings Emblem
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <path
              d="M2 12c4-3 8-3 10-1 2-2 6-2 10 1-3 3-7 3-10 1-3 2-7 2-10-1z"
              fill="#004225"
              stroke="#A39264"
              strokeWidth="1.2"
            />
            <rect x="7" y="11" width="10" height="2.5" rx="0.5" fill="#121212" stroke="#FFFFFF" strokeWidth="0.5" />
          </svg>
        );

      case 'bmw':
        // Propeller Roundel
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <circle cx="12" cy="12" r="10" fill="#111111" stroke="#E5E7EB" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="6.5" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
            <path d="M12 5.5A6.5 6.5 0 0 1 18.5 12H12V5.5z" fill="#0066B1" />
            <path d="M12 18.5A6.5 6.5 0 0 1 5.5 12H12v6.5z" fill="#0066B1" />
            <path d="M5.5 12A6.5 6.5 0 0 1 12 5.5V12H5.5z" fill="#FFFFFF" />
            <path d="M18.5 12A6.5 6.5 0 0 1 12 18.5V12h6.5z" fill="#FFFFFF" />
          </svg>
        );

      case 'mercedes':
        // Three-Pointed Star
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <circle cx="12" cy="12" r="10" fill="#18181B" stroke="#D1D5DB" strokeWidth="1.5" />
            <path
              d="M12 3v9M12 12l-7.8 4.5M12 12l7.8 4.5"
              stroke="#E5E7EB"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'audi':
        // Four Interlocked Rings
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <circle cx="7.5" cy="12" r="3.2" stroke="#E5E7EB" strokeWidth="1.2" />
            <circle cx="10.5" cy="12" r="3.2" stroke="#E5E7EB" strokeWidth="1.2" />
            <circle cx="13.5" cy="12" r="3.2" stroke="#E5E7EB" strokeWidth="1.2" />
            <circle cx="16.5" cy="12" r="3.2" stroke="#E5E7EB" strokeWidth="1.2" />
          </svg>
        );

      case 'nissan':
        // Nismo / Nissan Roundel
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.5" />
            <rect x="4" y="9.5" width="16" height="5" rx="1" fill="#C00000" stroke="#FFFFFF" strokeWidth="0.8" />
          </svg>
        );

      case 'toyota':
        // Triple Ellipses
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <ellipse cx="12" cy="12" rx="9" ry="6.5" stroke="#EB0A1E" strokeWidth="1.4" />
            <ellipse cx="12" cy="12" rx="3.5" ry="5.5" stroke="#EB0A1E" strokeWidth="1.2" />
            <ellipse cx="12" cy="9.5" rx="5" ry="2.2" stroke="#EB0A1E" strokeWidth="1.2" />
          </svg>
        );

      case 'chevrolet':
        // Gold Bowtie
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <path
              d="M4 10h16v4H4z"
              fill="#D4AF37"
              stroke="#B78103"
              strokeWidth="1"
            />
            <path
              d="M9 7h6v10H9z"
              fill="#D4AF37"
              stroke="#B78103"
              strokeWidth="1"
            />
          </svg>
        );

      default:
        // Generic Supercar Shield
        return (
          <svg viewBox="0 0 24 24" fill="none" className={sizeDimensions.icon}>
            <path
              d="M12 2L4 5v7c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3z"
              fill="#181F28"
              stroke={brand.brandColor}
              strokeWidth="1.5"
            />
            <circle cx="12" cy="11" r="3" fill={brand.brandColor} />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Icon Capsule */}
      <div
        className={`${sizeDimensions.box} rounded-md flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105`}
        style={{
          backgroundColor: '#0F1216',
          borderColor: `${brand.brandColor}40`
        }}
        title={`${brand.name} • ${brand.headquarters}`}
      >
        {renderCrestSvg(brand.badgeType)}
      </div>

      {/* Wordmark and Origin Info */}
      {showWordmark && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-heading font-bold text-white tracking-wide truncate ${sizeDimensions.text}`}
            >
              {brand.name}
            </span>
            {showCountry && (
              <span className={`font-mono text-zinc-400 uppercase ${sizeDimensions.flag}`}>
                [{brand.countryCode}]
              </span>
            )}
          </div>
          <span className="text-[10px] text-zinc-400 truncate mt-0.5 font-mono">
            {brand.heritageTagline.split('•')[0].trim()}
          </span>
        </div>
      )}
    </div>
  );
};
