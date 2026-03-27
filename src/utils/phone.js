/**
 * Normalizes phone numbers to a standard format (62XXX).
 */
function normalizePhone(phone) {
  if (!phone) return '';
  let normalized = phone.toString().replace(/\D/g, ''); // Remove non-digits

  if (normalized.startsWith('0')) {
    normalized = '62' + normalized.slice(1);
  } else if (normalized.startsWith('8')) {
    normalized = '62' + normalized;
  } else if (normalized.startsWith('+')) {
    normalized = normalized.slice(1);
  }

  return normalized;
}

module.exports = { normalizePhone };
