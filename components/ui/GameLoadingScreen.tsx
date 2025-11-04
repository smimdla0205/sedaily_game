import { Loader2 } from "lucide-react"

interface GameLoadingScreenProps {
  gameType: "g1" | "g2" | "g3"
  message?: string
}

const GAME_CONFIG = {
  g1: {
    background: "url('/backgrounds/g1-ripple-pattern.png')",
    gradient: "bg-linear-to-b from-[#102C55]/60 via-[#1E3A8A]/50 to-[#2B4B8A]/60",
    spinnerColor: "text-white",
    textColor: "text-white korean-text",
    defaultMessage: "블랙스완 퀴즈를 불러오는 중..."
  },
  g2: {
    background: "url('/backgrounds/g2-silhouettes-clean.png')",
    gradient: "bg-linear-to-r from-[#EFECE7]/40 via-[#E7DFD3]/35 to-[#E2DAD2]/40",
    spinnerColor: "text-[#8B5E3C]",
    textColor: "text-[#8B5E3C]",
    defaultMessage: "죄수의 딜레마 퀴즈를 불러오는 중..."
  },
  g3: {
    background: "url('/backgrounds/g3-signal-waves.png')",
    gradient: "bg-linear-to-b from-[#E89482]/70 via-[#F0D2C0]/65 to-[#F0D2C0]/70",
    spinnerColor: "text-[#184E77]",
    textColor: "text-[#184E77] korean-text",
    defaultMessage: "시그널 디코딩 퀴즈를 불러오는 중..."
  }
}

export function GameLoadingScreen({ gameType, message }: GameLoadingScreenProps) {
  const config = GAME_CONFIG[gameType]
  const displayMessage = message || config.defaultMessage

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: config.background,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${config.gradient}`} />

      {/* Loading Content */}
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`h-12 w-12 animate-spin ${config.spinnerColor}`} aria-hidden="true" />
          <p className={`text-lg ${config.textColor}`}>{displayMessage}</p>
        </div>
      </div>
    </div>
  )
}