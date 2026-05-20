import { ChevronLeft } from 'lucide-react'
import { AvatarPreset } from '../components/AvatarPreset'
import { useApp } from '../lib/context'

interface Props {
  onBack: () => void
}

export default function AvatarPickerScreen({ onBack }: Props) {
  const { avatarPreset, setAvatarPreset } = useApp()

  function handleSelect(index: number) {
    setAvatarPreset(index)
    onBack()
  }

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="pt-14 px-5 pb-4 flex items-center gap-3 bg-brand-bg">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center shrink-0"
        >
          <ChevronLeft size={18} className="text-brand-text" />
        </button>
        <h1 className="text-xl font-bold text-brand-text">Elige tu avatar</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {/* Column headers */}
        <div className="flex mb-5">
          <div className="flex-1 flex justify-center">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Masculino</span>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Femenino</span>
          </div>
        </div>

        {/* 9 rows, each with M and F pair */}
        <div className="flex flex-col gap-5">
          {Array.from({ length: 9 }, (_, i) => {
            const mIdx = i
            const fIdx = i + 9
            return (
              <div key={i} className="flex items-center">
                <div className="flex-1 flex justify-center">
                  <AvatarButton index={mIdx} selected={avatarPreset === mIdx} onSelect={handleSelect} />
                </div>
                <div className="flex-1 flex justify-center">
                  <AvatarButton index={fIdx} selected={avatarPreset === fIdx} onSelect={handleSelect} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AvatarButton({ index, selected, onSelect }: {
  index: number; selected: boolean; onSelect: (i: number) => void
}) {
  return (
    <button
      onClick={() => onSelect(index)}
      className={`rounded-full transition-all active:scale-95 ${
        selected
          ? 'ring-4 ring-brand-blue ring-offset-4 ring-offset-brand-bg'
          : 'ring-2 ring-transparent'
      }`}
    >
      <AvatarPreset index={index} size="xl" />
    </button>
  )
}
