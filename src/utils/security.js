const crypto = require('crypto');

/**
 * Generates a cryptographically secure random token.
 * @returns {string} The generated token.
 */
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Compares two tokens using a timing-safe comparison to prevent timing attacks.
 * @param {string} a First token.
 * @param {string} b Second token.
 * @returns {boolean} True if tokens match.
 */
function timingSafeCompare(a, b) {
  if (!a || !b) return false;

  // We need to ensure both buffers are the same length for timingSafeEqual
  // If lengths differ, we still do a "dummy" comparison to avoid leaking length info
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    // Dummy comparison with a constant-time check
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
  generateSecureToken,
  timingSafeCompare,
};
