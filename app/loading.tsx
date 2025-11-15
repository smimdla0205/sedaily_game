import { Loader2 } from "lucide-react"
import { StatePage } from "@/components/layout/StatePage"

export default function Loading() {
  return (
    <StatePage
      icon={<Loader2 className="h-8 w-8 text-blue-600 animate-spin" aria-hidden="true" />}
      title="로딩 중..."
      description="페이지를 준비하고 있습니다."
    />
  )
}
