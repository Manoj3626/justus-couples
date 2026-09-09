const dns = require('dns').promises

// Common disposable / temporary email domains & reserved example domains
const DISPOSABLE_DOMAINS = new Set([
  'example.com',
  'example.net',
  'example.org',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'trashmail.com',
  'yopmail.com',
  'dispostable.com',
  'sharklasers.com',
  'guerrillamail.com',
  'getnada.com',
  'throwawaymail.com',
  'temp-mail.org',
  'burnermail.io',
  'maildrop.cc',
  'fakeinbox.com',
  'tempmailo.com',
])

// Strict RFC 5322 Compliant Email Format Regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

/**
 * Authoritative Server-Side Email Validation
 * Validates format, disposable domain, and DNS MX mail receiving capability.
 * @param {string} rawEmail - Email address to validate
 * @returns {Promise<{ valid: boolean, normalizedEmail?: string, message?: string }>}
 */
async function validateEmailAddress(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { valid: false, message: 'Please enter a valid email address.' }
  }

  const normalized = rawEmail.trim().toLowerCase()
  if (!normalized || normalized.length > 254) {
    return { valid: false, message: 'Please enter a valid email address.' }
  }

  // 1. Format Regex Check
  if (!EMAIL_REGEX.test(normalized)) {
    return { valid: false, message: 'Please enter a valid email address.' }
  }

  const parts = normalized.split('@')
  if (parts.length !== 2) {
    return { valid: false, message: 'Please enter a valid email address.' }
  }

  const [localPart, domain] = parts

  // Local part & domain structure checks
  if (!localPart || localPart.length > 64 || !domain || domain.length > 253) {
    return { valid: false, message: 'Please enter a valid email address.' }
  }

  // Check for missing dot in domain or invalid dots
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) {
    return { valid: false, message: 'Please enter a valid email address.' }
  }

  // 2. Disposable Email Filter
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, message: 'Disposable or temporary email addresses are not allowed. Please use a valid email address.' }
  }

  // 3. DNS MX Record Lookup Check for Mail Receiving Capability
  try {
    const mxRecords = await dns.resolveMx(domain)
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, message: 'This email address cannot receive emails. Please use a valid email address.' }
    }
    // Check if MX record is explicit null MX "." (RFC 7505)
    const validMx = mxRecords.some(r => r.exchange && r.exchange !== '.')
    if (!validMx) {
      return { valid: false, message: 'This email address cannot receive emails. Please use a valid email address.' }
    }
  } catch (dnsErr) {
    // If DNS MX lookup fails (ENOTFOUND, ENODATA, SERVFAIL, NXDOMAIN, etc.), domain cannot receive mail
    return { valid: false, message: 'This email address cannot receive emails. Please use a valid email address.' }
  }

  return { valid: true, normalizedEmail: normalized }
}

module.exports = {
  validateEmailAddress,
}
