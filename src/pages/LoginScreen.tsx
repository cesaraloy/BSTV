import { useState } from 'react'
import Logo from '../components/Logo'

const COUNTRIES = [
  { code: 'ES', flag: '🇪🇸', dial: '+34', name: 'España' },
  { code: 'MX', flag: '🇲🇽', dial: '+52', name: 'México' },
  { code: 'AR', flag: '🇦🇷', dial: '+54', name: 'Argentina' },
  { code: 'CO', flag: '🇨🇴', dial: '+57', name: 'Colombia' },
  { code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', dial: '+44', name: 'Reino Unido' },
  { code: 'US', flag: '🇺🇸', dial: '+1',  name: 'Estados Unidos' },
  { code: 'DE', flag: '🇩🇪', dial: '+49', name: 'Alemania' },
  { code: 'FR', flag: '🇫🇷', dial: '+33', name: 'Francia' },
  { code: 'IT', flag: '🇮🇹', dial: '+39', name: 'Italia' },
  { code: 'PT', flag: '🇵🇹', dial: '+351', name: 'Portugal' },
]

interface Props {
  onSendOTP: (phone: string) => Promise<{ error: string | null }>
}

export default function LoginScreen({ onSendOTP }: Props) {
  const [country, setCountry] = useState(COUNTRIES[0])
  const [phone, setPhone] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fullPhone = `${country.dial}${phone.replace(/\D/g, '')}`
  const isValid = phone.replace(/\D/g, '').length >= 9

  const handleSubmit = async () => {
    if (!isValid || loading) return
    setLoading(true)
    setError(null)
    const { error } = await onSendOTP(fullPhone)
    if (error) setError(error)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      {/* Top area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
        {/* Logo */}
        <div className="mb-3">
          <div className="w-20 h-20 rounded-3xl bg-brand-navy flex items-center justify-center mb-4 mx-auto shadow-lg shadow-brand-navy/30">
            <span className="text-4xl">⚽</span>
          </div>
          <Logo size="lg" className="block text-center" />
        </div>

        <p className="text-brand-muted text-sm text-center mt-2 mb-10 leading-relaxed">
          Encuentra los mejores bares para ver{'\n'}tus partidos favoritos
        </p>

        {/* Card */}
        <div className="w-full bg-brand-card border border-brand-border rounded-3xl p-6">
          <p className="text-brand-text font-bold text-base mb-1">Entra con tu teléfono</p>
          <p className="text-brand-muted text-xs mb-5">
            Te enviaremos un código SMS para verificar tu número.
          </p>

          {/* Phone input */}
          <div className="flex gap-2 mb-4">
            {/* Country picker button */}
            <button
              onClick={() => setShowPicker(v => !v)}
              className="flex items-center gap-1.5 px-3 py-3 bg-brand-accent border border-brand-border rounded-xl shrink-0 min-w-[88px]"
            >
              <span className="text-lg leading-none">{country.flag}</span>
              <span className="text-sm font-semibold text-brand-text">{country.dial}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-muted">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Number input */}
            <input
              type="tel"
              inputMode="numeric"
              placeholder="612 345 678"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="flex-1 bg-brand-accent border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm font-medium placeholder-brand-muted outline-none focus:border-brand-blue transition-colors"
            />
          </div>

          {/* Country picker dropdown */}
          {showPicker && (
            <div className="mb-4 bg-brand-surface border border-brand-border rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
              {COUNTRIES.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCountry(c); setShowPicker(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    c.code === country.code ? 'bg-brand-navy/20' : 'hover:bg-brand-accent'
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="text-sm text-brand-text flex-1">{c.name}</span>
                  <span className="text-xs text-brand-muted font-mono">{c.dial}</span>
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* CTA button */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all ${
              isValid && !loading
                ? 'bg-brand-navy active:scale-[0.98] shadow-lg shadow-brand-navy/30'
                : 'bg-brand-accent text-brand-muted cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                Enviando SMS...
              </span>
            ) : (
              'Enviar código SMS'
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-10 text-center">
        <p className="text-brand-muted text-[11px] leading-relaxed">
          Al continuar aceptas nuestros{' '}
          <span className="text-brand-blue underline">Términos y condiciones</span>
          {' '}y la{' '}
          <span className="text-brand-blue underline">Política de privacidad</span>.
        </p>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
