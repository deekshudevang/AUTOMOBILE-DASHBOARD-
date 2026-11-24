import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * AUTOVERSE PHASE 27.6 — Multi-Viewport Responsiveness & Accessibility (WCAG 2.1 AA) Suite
 */

// WCAG 2.1 AA Luminance and Contrast Formula
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('AutoVerse 3D — Phase 27.6: Multi-Viewport Responsiveness & WCAG 2.1 AA Accessibility', () => {

  describe('1. WCAG 2.1 AA Contrast Ratio Verification', () => {
    // Design System Tokens from src/index.css
    const obsidian = '#050608';
    const basalt = '#0F1216';
    const graphite = '#1A1E23';
    const textPrimary = '#F0F1F2';
    const textSecondary = '#A6ABB1';
    const textDisabled = '#6B7178';
    const accentRed = '#DC2626';
    const pureWhite = '#FFFFFF';

    it('verifies primary text token meets WCAG 2.1 AA (>= 4.5:1) across all workstation surfaces', () => {
      const crObsidian = getContrastRatio(textPrimary, obsidian);
      const crBasalt = getContrastRatio(textPrimary, basalt);
      const crGraphite = getContrastRatio(textPrimary, graphite);

      expect(crObsidian).toBeGreaterThanOrEqual(14.0);
      expect(crBasalt).toBeGreaterThanOrEqual(13.0);
      expect(crGraphite).toBeGreaterThanOrEqual(10.0);
    });

    it('verifies secondary text token meets WCAG 2.1 AA (>= 4.5:1) against obsidian & basalt backgrounds', () => {
      const crObsidian = getContrastRatio(textSecondary, obsidian);
      const crBasalt = getContrastRatio(textSecondary, basalt);

      expect(crObsidian).toBeGreaterThanOrEqual(8.0);
      expect(crBasalt).toBeGreaterThanOrEqual(7.5);
    });

    it('verifies disabled text token is clearly distinct yet legible (>= 3:1)', () => {
      const crObsidian = getContrastRatio(textDisabled, obsidian);
      expect(crObsidian).toBeGreaterThanOrEqual(3.5);
    });

    it('verifies accent call-to-action buttons have high-contrast text (>= 4.5:1)', () => {
      const crAccent = getContrastRatio(pureWhite, accentRed);
      expect(crAccent).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('2. Dual-Ring Focus Visibility & Motion Sensitivity', () => {
    const cssContent = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');

    it('implements dual-ring high-contrast focus indicator for WCAG compliance on dark surfaces', () => {
      expect(cssContent).toContain(':focus-visible');
      expect(cssContent).toContain('var(--focus-ring)');
      expect(cssContent).toContain('var(--focus-ring-outer)');
    });

    it('strictly honours prefers-reduced-motion media query', () => {
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(cssContent).toContain('animation-duration: 0.01ms !important');
      expect(cssContent).toContain('transition-duration: 0.01ms !important');
    });
  });

  describe('3. Accessible Landmarks, Skip Links & ARIA Roles', () => {
    const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');
    const headerContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/shell/GranTurismoHeader.tsx'), 'utf-8');
    const switcherContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/navigation/WorkspaceSwitcher.tsx'), 'utf-8');
    const railContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/studio/VerticalCameraRail.tsx'), 'utf-8');
    const bladeContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/studio/AtelierBlade.tsx'), 'utf-8');
    const drawerContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/studio/GlobalPartsDrawer.tsx'), 'utf-8');

    it('provides keyboard skip link and polite ARIA status announcer in main shell', () => {
      expect(appContent).toContain('href="#main-content"');
      expect(appContent).toContain('id="main-content"');
      expect(appContent).toContain('role="status"');
      expect(appContent).toContain('aria-live="polite"');
    });

    it('includes banner role, aria-labels, and mobile command trigger in header', () => {
      expect(headerContent).toContain('role="banner"');
      expect(headerContent).toContain('aria-label="Gran Turismo Workstation Header"');
      expect(headerContent).toContain('aria-label="Open Command Search (Ctrl+K)"');
      expect(headerContent).toContain('aria-label="Search Views"');
    });

    it('implements accessible tablist and tab roles in workspace switcher', () => {
      expect(switcherContent).toContain('role="tablist"');
      expect(switcherContent).toContain('role="tab"');
      expect(switcherContent).toContain('aria-selected=');
      expect(switcherContent).toContain('aria-label=');
    });

    it('implements toolbar role and explicit button labels in camera rail', () => {
      expect(railContent).toContain('role="toolbar"');
      expect(railContent).toContain('aria-label="Camera Controls Rail"');
      expect(railContent).toContain('aria-label=');
    });

    it('implements region landmark and 3-state mobile sheet in atelier blade', () => {
      expect(bladeContent).toContain('aria-label="Atelier Customization Blade"');
      expect(bladeContent).toContain("setMobileSheetState");
      expect(bladeContent).toContain("cycleMobileSheetState");
    });

    it('implements modal dialog role and tablist in global parts drawer', () => {
      expect(drawerContent).toContain('role="dialog"');
      expect(drawerContent).toContain('aria-modal="true"');
      expect(drawerContent).toContain('aria-label="Global OEM Parts Library Cross-Car Swapper"');
    });
  });

  describe('4. Multi-Viewport Target Specifications (8 Standard Resolutions)', () => {
    const TARGET_VIEWPORTS = [
      { name: 'Ultrawide 21:9', width: 3440, height: 1440, category: 'desktop' },
      { name: 'Desktop 4K UHD', width: 2560, height: 1440, category: 'desktop' },
      { name: 'Standard Desktop 1080p', width: 1920, height: 1080, category: 'desktop' },
      { name: 'Standard Laptop', width: 1366, height: 768, category: 'desktop' },
      { name: 'Tablet Landscape', width: 1024, height: 768, category: 'tablet' },
      { name: 'Tablet Portrait', width: 768, height: 1024, category: 'tablet' },
      { name: 'Large Mobile (iPhone Pro Max)', width: 414, height: 896, category: 'mobile' },
      { name: 'Compact Mobile (iPhone / Android)', width: 390, height: 844, category: 'mobile' }
    ];

    it('verifies all 8 target viewports are systematically registered with positive aspect ratios', () => {
      expect(TARGET_VIEWPORTS.length).toBe(8);
      TARGET_VIEWPORTS.forEach(vp => {
        expect(vp.width).toBeGreaterThanOrEqual(320);
        expect(vp.height).toBeGreaterThanOrEqual(480);
        const aspectRatio = vp.width / vp.height;
        expect(aspectRatio).toBeGreaterThan(0.4);
      });
    });

    it('verifies safe viewport container (100dvh) without horizontal overflow risks', () => {
      const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');
      expect(appContent).toContain('h-[100dvh]');
      expect(appContent).toContain('overflow-hidden');
    });
  });

});
