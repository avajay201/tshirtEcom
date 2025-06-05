import { Loader2 } from "lucide-react"

export function LoaderOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="flex flex-col items-center gap-4">
        <Loader2 style={{color: '#a855f7'}} className="w-8 h-8  animate-spin" />
      </div>
    </div>
  );
}
