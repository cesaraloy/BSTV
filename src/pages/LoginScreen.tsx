import { useState } from 'react'
import Logo from '../components/Logo'
import { Mail, Phone } from 'lucide-react'

type Method = 'email' | 'phone'

interface Props {
  onSendEmail: (email: string) => Promise<{ error: string | null }>
  onSendOTP: (phone: string) => Promise<{ error: string | null }>
}

const COUNTRIES = [
  { code: 'ES', flag: '🇪🇸', dial: '+34' },
  { code: 'MX', flag: '🇲🇽', dial: '+52' },
  { code: 'AR', flag: '🇦🇷', dial: '+54' },
  { code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', dial: '+44' },
  { code: 'US', flag: '🇺🇸', dial: '+1' },
]

export default function LoginScreen({ onSendEmail, onSendOTP }: Props) {
  const [method, setMethod] = useState<Method>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState(COUNTRIES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhone = phone.replace(/\D/g, '').length >= 9

  const canSubmit = method === 'email' ? isValidEmail : isValidPhone

  const handleSubmit = async () => {
    if (!canSubmit || loading) return
    setLoading(true)
    setError(null)

    const result = method === 'email'
      ? await onSendEmail(email)
      : await onSendOTP(`${country.dial}${phone.replace(/\D/g, '')}`)

    if (result.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-brand-navy flex items-center justify-center mb-4 shadow-lg shadow-brand-navy/30">
            <span className="text-4xl">⚽</span>
          </div>
          <Logo size="lg" />
          <p className="text-brand-muted text-sm text-center mt-2 leading-relaxed">
            Encuentra bares para ver tus partidos
          </p>
        </div>

        {/* Card */}
        {!sent ? (
          <div className="w-full bg-brand-card border border-brand-border rounded-3xl p-6">
            <p className="text-brand-text font-bold text-base mb-4">Iniciar sesión</p>

            {/* Method toggle */}
            <div className="flex bg-brand-accent border border-brand-border rounded-xl p-1 mb-5">
              {(['email', 'phone'] as Method[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setError(null); setSent(false) }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    method === m
                      ? 'bg-brand-navy text-white shadow'
                      : 'text-brand-muted'
                  }`}
                >
                  {m === 'email'
                    ? <><Mail size={13} /> Email</>
                    : <><Phone size={13} /> SMS <span className="text-[9px] opacity-60 ml-0.5">(próximamente)</span></>
                  }
                </button>
              ))}
            </div>

            {method === 'email' ? (
              <>
                <p className="text-brand-muted text-xs mb-4">
                  Te enviaremos un enlace mágico a tu email. Sin contraseña.
                </p>
                <input
                  type="email"
                  inputMode="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-brand-accent border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm placeholder-brand-muted outline-none focus:border-brand-blue transition-colors mb-4"
                />
              </>
            ) : (
              <>
                <p className="text-brand-muted text-xs mb-4">
                  Te enviaremos un código de 6 dígitos por SMS.
                </p>
                <div className="flex gap-2 mb-4">
                  <select
                    value={country.code}
                    onChange={e => setCountry(COUNTRIES.find(c => c.code === e.target.value)!)}
                    className="bg-brand-accent border border-brand-border rounded-xl px-3 py-3 text-brand-text text-sm outline-none focus:border-brand-blue"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="612 345 678"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setError(null) }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-brand-accent border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm placeholder-brand-muted outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all ${
                canSubmit && !loading
                  ? 'bg-brand-navy active:scale-[0.98] shadow-lg shadow-brand-navy/30'
                  : 'bg-brand-accent text-brand-muted cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Enviando...
                </span>
              ) : method === 'email' ? 'Enviar enlace mágico' : 'Enviar SMS'}
            </button>
          </div>
        ) : (
          /* Sent confirmation */
          <div className="w-full bg-brand-card border border-brand-border rounded-3xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand-navy/20 border border-brand-blue/30 flex items-center justify-center mb-4">
              <Mail size={28} className="text-brand-blue" />
            </div>
            <p className="text-brand-text font-bold text-lg mb-2">
              {method === 'email' ? '¡Revisa tu email!' : '¡Código enviado!'}
            </p>
            <p className="text-brand-muted text-sm leading-relaxed mb-6">
              {method === 'email'
                ? <>Hemos enviado un enlace a <span className="text-brand-text font-mono font-semibold">{email}</span>. Pulsa el enlace para entrar.</>
                : <>Hemos enviado un código a <span className="text-brand-text font-mono font-semibold">{country.dial} {phone}</span>.</>
              }
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-brand-blue font-semibold"
            >
              Usar otro {method === 'email' ? 'email' : 'número'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 pb-10 text-center">
        <p className="text-brand-muted text-[11px] leading-relaxed">
          Al continuar aceptas nuestros{' '}
          <span className="text-brand-blue underline">Términos</span>
          {' '}y{' '}
          <span className="text-brand-blue underline">Política de privacidad</span>.
        </p>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
