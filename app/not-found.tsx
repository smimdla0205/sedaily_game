import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatePage } from "@/components/layout/StatePage"

export default function NotFound() {
  return (
    <StatePage
      icon={<FileQuestion className="h-8 w-8 text-blue-600" aria-hidden="true" />}
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 존재하지 않거나 이동되었습니다."
    >
      <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
      <Button asChild variant="outline" className="flex-1">
        <Link href="/games">게임 보기</Link>
      </Button>
    </StatePage>
  )
}
