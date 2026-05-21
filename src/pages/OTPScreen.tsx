import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'

interface Props {
  contact: string          // phone number or email address
  type: 'sms' | 'email'
  onVerify: (code: string) => Promise<{ error: string | null }>
  onBack: () => void
  onResend: () => Promise<{ error: string | null }>
}

const CODE_LENGTH = 6

function maskContact(contact: string, type: 'sms' | 'email') {
  if (type === 'email') {
    const [user, domain] = contact.split('@')
    if (!domain) return contact
    const visible = user.slice(0, 2)
    return `${visible}${'·'.repeat(Math.max(user.length - 2, 2))}@${domain}`
  }
  return contact.replace(/(\+\d{2,3})(\d+)(\d{3})/, (_, c, m, e) =>
    `${c} ${'·'.repeat(m.length)} ${e}`
  )
}

export default function OTPScreen({ contact, type, onVerify, onBack, onResend }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(30)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(() => setResendCooldown(v => v - 1), 1000)
    return () => clearInterval(t)
  }, [resendCooldown])

  const attemptVerify = useCallback(async (code: string) => {
    if (code.length !== CODE_LENGTH || loading) return
    setLoading(true)
    setError(null)
    const { error } = await onVerify(code)
    if (error) {
      setError(error)
      setDigits(Array(CODE_LENGTH).fill(''))
      refs.current[0]?.focus()
    }
    setLoading(false)
  }, [loading, onVerify])

  const handleChange = useCallback((index: number, value: string) => {
    if (value.length === CODE_LENGTH && /^\d{6}$/.test(value)) {
      const next = value.split('')
      setDigits(next)
      refs.current[CODE_LENGTH - 1]?.focus()
      attemptVerify(next.join(''))
      return
    }
    const digit = value.replace(/\D/g, '').slice(-1)
    setDigits(prev => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    setError(null)
    if (digit && index < CODE_LENGTH - 1) refs.current[index + 1]?.focus()
  }, [attemptVerify])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }, [digits])

  const fullCode = digits.join('')
  useEffect(() => {
    if (fullCode.length === CODE_LENGTH) attemptVerify(fullCode)
  }, [fullCode, attemptVerify])

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setError(null)
    setDigits(Array(CODE_LENGTH).fill(''))
    const { error } = await onResend()
    if (error) setError(error)
    else setResendCooldown(30)
  }

  const isEmail = type === 'email'

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="flex-1 flex flex-col px-8 pt-14">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center mb-8"
        >
          <ArrowLeft size={18} className="text-brand-text" />
        </button>

        <Logo size="md" className="mb-6" />

        <h2 className="text-2xl font-black text-brand-text mb-2">
          {isEmail ? 'Código de email' : 'Código SMS'}
        </h2>
        <p className="text-brand-muted text-sm mb-2 leading-relaxed">
          Introduce el código de 6 dígitos que enviamos a{' '}
          <span className="text-brand-text font-semibold font-mono">
            {maskContact(contact, type)}
          </span>
        </p>

        {isEmail && (
          <p className="text-brand-muted text-xs mb-6 leading-relaxed">
            También puedes pulsar el enlace del email para entrar directamente.
          </p>
        )}

        {!isEmail && <div className="mb-6" />}

        {/* OTP inputs */}
        <div className="flex gap-3 mb-4 justify-center">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onFocus={e => e.target.select()}
              autoFocus={i === 0}
              className={`w-12 h-14 text-center text-xl font-black rounded-2xl border-2 outline-none transition-all bg-brand-card text-brand-text
                ${d ? 'border-brand-blue' : 'border-brand-border'}
                ${error ? 'border-red-500 bg-red-500/5' : ''}
                focus:border-brand-blue focus:shadow-lg focus:shadow-brand-navy/20`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-xs text-center">{error}</p>
          </div>
        )}

        <button
          onClick={() => attemptVerify(fullCode)}
          disabled={fullCode.length !== CODE_LENGTH || loading}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all mb-6 ${
            fullCode.length === CODE_LENGTH && !loading
              ? 'bg-brand-navy active:scale-[0.98] shadow-lg shadow-brand-navy/30'
              : 'bg-brand-accent text-brand-muted cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Verificando...
            </span>
          ) : 'Verificar código'}
        </button>

        <div className="flex items-center justify-center gap-1.5">
          <span className="text-brand-muted text-sm">¿No lo recibiste?</span>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`text-sm font-semibold transition-colors ${
              resendCooldown > 0 ? 'text-brand-muted' : 'text-brand-blue'
            }`}
          >
            {resendCooldown > 0
              ? `Reenviar en ${resendCooldown}s`
              : isEmail ? 'Reenviar email' : 'Reenviar SMS'}
          </button>
        </div>
      </div>

      <div className="px-8 pb-10">
        <div className="flex items-center gap-2 justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-muted">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <p className="text-brand-muted text-[11px]">
            {isEmail ? 'Tu email no se comparte con terceros' : 'Tu número no se comparte con terceros'}
          </p>
        </div>
      </div>
    </div>
  )
}
