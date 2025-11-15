"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatePage } from "@/components/layout/StatePage"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Global error:", error)
  }, [error])

  return (
    <StatePage
      icon={<AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />}
      title="오류가 발생했습니다"
      description="페이지를 불러오는 중 문제가 발생했습니다."
    >
      <Button onClick={() => reset()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
        다시 시도
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => (window.location.href = "/")}>
        홈으로 돌아가기
      </Button>
      {process.env.NODE_ENV === "development" && error.message && (
        <details className="mt-4 text-left w-full">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            개발자 정보
          </summary>
          <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto">{error.message}</pre>
        </details>
      )}
    </StatePage>
  )
}
