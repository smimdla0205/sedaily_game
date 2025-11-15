'use client'

import { useEffect, useState } from 'react'

interface GameLoadingScreenProps {
  gameType: string
}

export function GameLoadingScreen({ gameType }: GameLoadingScreenProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center space-y-8">
        {/* 애니메이션 로딩 원 */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-600">
                {gameType.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="space-y-2">
          <p className="text-xl font-semibold text-gray-800">
            게임 준비 중{dots}
          </p>
          <p className="text-sm text-gray-500">
            최적의 경험을 위해 콘텐츠를 로딩하고 있습니다
          </p>
        </div>

        {/* 진행 상태 표시 */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-blue-400 via-indigo-600 to-blue-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

