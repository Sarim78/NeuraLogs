interface DemoBannerProps {
  onDismiss: () => void
}

export default function DemoBanner({ onDismiss }: DemoBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10 backdrop-blur-sm">
      <p className="text-white/60 text-xs">
        This is sample data. Upload your own export to see your mind.
      </p>
      <button
        onClick={onDismiss}
        className="text-white/30 hover:text-white transition-colors text-xs"
      >
        Dismiss
      </button>
    </div>
  )
}