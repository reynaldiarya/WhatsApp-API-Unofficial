const crypto = require('crypto');

/**
 * Generates a cryptographically secure random token.
 */
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Timing-safe token comparison.
 */
function timingSafeCompare(a, b) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = { generateSecureToken, timingSafeCompare };
