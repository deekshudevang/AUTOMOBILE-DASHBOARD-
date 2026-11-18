import path from 'path';

export class SecurityViolationError extends Error {
  public code: string;
  constructor(message: string, code: string = 'SEC_INVALID_INPUT') {
    super(`Security Violation [${code}]: ${message}`);
    this.name = 'SecurityViolationError';
    this.code = code;
  }
}

export class SecuritySanitizer {
  private static MAX_PROJECT_JSON_BYTES = 25 * 1024 * 1024; // 25 MB ceiling
  private static MAX_MESH_BYTES = 100 * 1024 * 1024;        // 100 MB ceiling

  private static BANNED_PATH_PATTERNS = [
    /\.\./,             // Directory traversal (..)
    /\0/,               // Null byte injection
    /[<>:"|?*]/,        // Illegal Windows filename characters
    /^[a-zA-Z]:/,       // Absolute drive letter paths (e.g. C:\)
    /^\//,              // Absolute Unix root paths (/etc)
    /^\\/               // Absolute Windows UNC paths (\\)
  ];

  private static DANGEROUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.py', '.js', '.mjs', '.cjs',
    '.dll', '.so', '.bin', '.com', '.scr', '.hta', '.jar'
  ];

  /**
   * Validate and sanitize file paths against path traversal and system directory probing
   */
  public static sanitizeRelativePath(untrustedPath: string, allowedRoot?: string): string {
    if (!untrustedPath || typeof untrustedPath !== 'string') {
      throw new SecurityViolationError('Path must be a non-empty string.', 'SEC_EMPTY_PATH');
    }

    const trimmed = untrustedPath.trim();

    for (const pattern of this.BANNED_PATH_PATTERNS) {
      if (pattern.test(trimmed)) {
        throw new SecurityViolationError(
          `Potential path traversal or illegal path pattern detected in: '${trimmed}'`,
          'SEC_PATH_TRAVERSAL'
        );
      }
    }

    const normalized = path.normalize(trimmed).replace(/^(\.\.(\/|\\|$))+/, '');
    if (normalized.includes('..')) {
      throw new SecurityViolationError(
        `Path traversal resolution failed for: '${trimmed}'`,
        'SEC_PATH_TRAVERSAL'
      );
    }

    return normalized;
  }

  /**
   * Validate uploaded file payload against byte size limits and executable disguise
   */
  public static validateFilePayload(
    filename: string,
    contentBytes: number,
    type: 'project_json' | 'mesh_stl_step'
  ): void {
    const ext = path.extname(filename).toLowerCase();

    if (this.DANGEROUS_EXTENSIONS.includes(ext)) {
      throw new SecurityViolationError(
        `File extension '${ext}' is classified as dangerous executable code. Disallowed.`,
        'SEC_DANGEROUS_EXTENSION'
      );
    }

    const limit = type === 'project_json' ? this.MAX_PROJECT_JSON_BYTES : this.MAX_MESH_BYTES;
    if (contentBytes > limit) {
      throw new SecurityViolationError(
        `Payload size (${Math.round(contentBytes / (1024 * 1024))}MB) exceeds security ceiling of ${Math.round(limit / (1024 * 1024))}MB.`,
        'SEC_PAYLOAD_TOO_LARGE'
      );
    }
  }

  /**
   * Validate OpenFOAM dictionary parameters to prevent shell injection / unvalidated interpolation
   */
  public static sanitizeOpenFoamParam(param: string | number): string {
    const str = String(param).trim();
    // Only allow alphanumeric, underscore, dot, hyphen, plus, scientific notation
    if (!/^[a-zA-Z0-9_\.\-\+\s\(\)]+$/.test(str)) {
      throw new SecurityViolationError(
        `Illegal characters detected in OpenFOAM parameter: '${str}'. Only safe numeric/alphanumeric strings permitted.`,
        'SEC_INJECTION_RISK'
      );
    }
    return str;
  }
}
