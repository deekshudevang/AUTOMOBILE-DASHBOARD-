import { describe, it, expect } from 'vitest';
import { SecuritySanitizer, SecurityViolationError } from '../src/security/sanitizer';
import { ProjectManager } from '../src/projects/projectManager';

describe('AutoVerse 3D — Security, Reliability & Stress Hardening Suite (Phase 15)', () => {
  it('blocks path traversal and system directory probing attempts', () => {
    const maliciousPaths = [
      '../../etc/passwd',
      '..\\..\\Windows\\System32\\cmd.exe',
      'C:\\Windows\\System32\\drivers\\etc\\hosts',
      '/root/.ssh/id_rsa',
      'projects/\0/hack.json',
      'projects/file<name>.json',
      'projects/file|pipe.json'
    ];

    for (const badPath of maliciousPaths) {
      expect(() => SecuritySanitizer.sanitizeRelativePath(badPath)).toThrow(SecurityViolationError);
    }

    // Clean paths pass safely
    const cleanPath = SecuritySanitizer.sanitizeRelativePath('geometry/porsche_body.stl');
    expect(cleanPath).toContain('geometry');
  });

  it('rejects dangerous executable files and oversized payload injections', () => {
    const maliciousExtensions = ['script.bat', 'payload.sh', 'trojan.exe', 'macro.vbs', 'backdoor.js'];
    for (const badFile of maliciousExtensions) {
      expect(() => SecuritySanitizer.validateFilePayload(badFile, 1024, 'project_json')).toThrow(
        /dangerous executable code/
      );
    }

    // Oversized project JSON (> 25 MB)
    expect(() =>
      SecuritySanitizer.validateFilePayload('huge_project.json', 30 * 1024 * 1024, 'project_json')
    ).toThrow(/exceeds security ceiling/);

    // Valid STL passes
    expect(() =>
      SecuritySanitizer.validateFilePayload('wing.stl', 5 * 1024 * 1024, 'mesh_stl_step')
    ).not.toThrow();
  });

  it('sanitizes OpenFOAM dictionary parameters against shell command injection', () => {
    const maliciousParams = [
      '40.0; rm -rf /',
      '$(whoami)',
      '`cat /etc/shadow`',
      '40.0 & echo pwned',
      '40.0 | bash'
    ];

    for (const badParam of maliciousParams) {
      expect(() => SecuritySanitizer.sanitizeOpenFoamParam(badParam)).toThrow(/Illegal characters/);
    }

    // Valid inputs pass
    expect(SecuritySanitizer.sanitizeOpenFoamParam(40.0)).toBe('40');
    expect(SecuritySanitizer.sanitizeOpenFoamParam('1.5e-5')).toBe('1.5e-5');
    expect(SecuritySanitizer.sanitizeOpenFoamParam('(40 0 0)')).toBe('(40 0 0)');
  });

  it('verifies multi-cycle project lifecycle disposal without memory leakage', () => {
    const initialMem = process.memoryUsage().heapUsed;

    for (let cycle = 0; cycle < 50; cycle++) {
      const proj = ProjectManager.forkReferenceVehicle('porsche_911_gt3_rs_992', `Stress Cycle ${cycle}`);
      proj.dimensions.overallLengthM += cycle * 0.001;
      proj.components.push({
        id: `temp_comp_${cycle}`,
        name: `Temp Comp ${cycle}`,
        semanticType: 'custom',
        attachmentPoints: [],
        material: { materialId: 'm', type: 'body_paint' },
        provenance: 'user-created',
        massEstimateKg: { value: 1.0, isEstimate: true },
        locked: false,
        visible: true,
        geometryHash: `hash_${cycle}`
      });
      // Snapshot export and cleanup
      ProjectManager.exportProjectBundle(proj);
    }

    // Force garbage collection if exposed or check heap delta
    if (global.gc) {
      global.gc();
    }

    const finalMem = process.memoryUsage().heapUsed;
    const deltaMb = (finalMem - initialMem) / (1024 * 1024);

    // 50 cycles of complete vehicle generation and serialization must not balloon memory (> 50MB)
    expect(deltaMb).toBeLessThan(50);
  });
});
