import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  onBack: () => void
}

const FAQS = [
  {
    q: '¿Cómo activo un recordatorio para un partido?',
    a: 'En cualquier pantalla donde veas un partido, toca el icono de campana. También puedes hacerlo desde el detalle del partido. Recibirás una notificación antes del inicio del partido según tu configuración de antelación.',
  },
  {
    q: '¿Por qué no me llegan las notificaciones?',
    a: 'Asegúrate de haber dado permiso de notificaciones cuando la app te lo pidió. En iOS, las notificaciones solo funcionan si tienes la app instalada en tu pantalla de inicio (PWA). En Android funciona en el navegador sin necesidad de instalación.',
  },
  {
    q: '¿Con cuánta antelación me avisan antes de un partido?',
    a: 'Puedes configurarlo en Perfil → Notificaciones. Las opciones son 15, 30 o 60 minutos antes del inicio. Por defecto son 30 minutos.',
  },
  {
    q: '¿Cómo sigo a un equipo?',
    a: 'Ve a Perfil → Equipos que sigo. Busca tu equipo por nombre o filtra por competición, tócalo para marcarlo y guarda los cambios. Los partidos de tus equipos aparecerán destacados en la pantalla de inicio.',
  },
  {
    q: '¿Cómo encuentro un bar donde ver el partido?',
    a: 'En el detalle de cualquier partido encontrarás la sección "Bares donde verlo". También puedes usar la pestaña del mapa para explorar bares cerca de ti y ver qué partidos retransmiten.',
  },
  {
    q: '¿Cómo añado mi bar?',
    a: 'Por ahora los bares son añadidos por el equipo de BarSportTV tras verificación. Si gestionas un bar deportivo y quieres aparecer en la app, contáctanos en hola@barsporttv.com.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Solo guardamos tu email o teléfono para autenticarte, y tu configuración personal (equipos, recordatorios). No compartimos tus datos con terceros. Puedes eliminar tu cuenta en cualquier momento contactándonos.',
  },
  {
    q: '¿La app es gratuita?',
    a: 'Sí, BarSportTV es completamente gratuita para usuarios. Los bares pueden aparecer de forma destacada a través de acuerdos con la plataforma.',
  },
]

export default function FAQScreen({ onBack }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-10">
      <div className="pt-14 px-5 pb-4 bg-brand-bg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-brand-text" />
          </button>
          <h1 className="text-xl font-bold text-brand-text tracking-tight">Preguntas frecuentes</h1>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-2">
        {FAQS.map((item, i) => (
          <div
            key={i}
            className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-4 text-left gap-3"
            >
              <span className="text-sm font-semibold text-brand-text leading-snug">{item.q}</span>
              {open === i
                ? <ChevronUp size={16} className="text-brand-muted shrink-0" />
                : <ChevronDown size={16} className="text-brand-muted shrink-0" />}
            </button>
            {open === i && (
              <div className="px-4 pb-4 -mt-1">
                <p className="text-sm text-brand-muted leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
