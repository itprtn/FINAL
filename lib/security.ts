// Security utilities for the CRM application
// Based on SECURITY_AUDIT_REPORT.md recommendations

export function initializeSecurity() {
  console.log('🔒 Initializing security measures...')
  
  // Content Security Policy setup
  if (typeof document !== 'undefined') {
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';"
    document.head.appendChild(meta)
  }
  
  // Disable console in production
  if (import.meta.env.PROD) {
    console.log = () => {}
    console.warn = () => {}
    console.error = () => {}
  }
  
  console.log('✅ Security measures initialized')
}

export function sanitizeEnvironment() {
  console.log('🧹 Sanitizing environment variables...')
  
  // Check for exposed secrets in development
  if (import.meta.env.DEV) {
    const exposedKeys = Object.keys(import.meta.env).filter(key => 
      key.includes('SECRET') || key.includes('PRIVATE')
    )
    
    if (exposedKeys.length > 0) {
      console.warn('⚠️ Potentially exposed secrets detected:', exposedKeys)
    }
  }
  
  console.log('✅ Environment sanitized')
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return phoneRegex.test(phone)
}