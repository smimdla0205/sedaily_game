"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useEmblaCarousel from "embla-carousel-react"
import Fade from "embla-carousel-fade"
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Lightbulb, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/games-data"
import { NewsHeaderBlock } from "./NewsHeaderBlock"
import { AIChatbot } from "./AIChatbot"

type QuestionState = {
  selectedAnswer: string | null
  userAnswer: string
  isAnswered: boolean
  isCorrect: boolean
  showHint: boolean
}

export interface QuizCarouselProps {
  questions: Question[]
  date: string
  gameType: "BlackSwan" | "PrisonersDilemma" | "SignalDecoding"
  themeColor: string
  disableSaveProgress?: boolean
  showArrows?: boolean
  showDots?: boolean
  useFade?: boolean
  loop?: boolean
  className?: string
}

const ACCENT = {
  BlackSwan: { border: "border-[#244961]", hover: "hover:border-[#244961]", hex: "#244961" },
  PrisonersDilemma: { border: "border-[#8B5E3C]", hover: "hover:border-[#8B5E3C]", hex: "#8B5E3C" },
  SignalDecoding: { border: "border-[#DB6B5E]", hover: "hover:border-[#DB6B5E]", hex: "#DB6B5E" },
} as const

export function QuizCarousel({
  questions,
  date,
  gameType,
  disableSaveProgress = false,
  showArrows = true,
  showDots = true,
  useFade = false,
  loop = false,
  className,
}: QuizCarouselProps) {
  const router = useRouter()
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([])
  const [score, setScore] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const accent = ACCENT[gameType]

  // Embla 초기화 - 옵션을 상수로 분리
  const emblaOptions = {
    loop,
    align: "center" as const,
    containScroll: false as const,
    slidesToScroll: 1,
  }
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    emblaOptions,
    useFade ? [Fade()] : []
  )

  // 초기 상태 설정
  useEffect(() => {
    if (questions.length > 0 && questionStates.length === 0) {
      const initialStates = questions.map(() => ({
        selectedAnswer: null,
        userAnswer: "",
        isAnswered: false,
        isCorrect: false,
        showHint: false,
      }))
      setQuestionStates(initialStates)
    }
  }, [questions, questionStates.length])

  const answeredCount = questionStates.filter((state) => state.isAnswered).length

  const getThemeStyles = () => {
    switch (gameType) {
      case "BlackSwan":
        return {
          paperBg: "bg-[#EDEDE9]",
          inkColor: "text-[#0F2233]",
          accentColor: "#244961",
          accentText: "text-[#244961]",
          hairline: "border-[#C9C2B0]",
          badgeBg: "bg-[#244961]/10 border-[#244961]/30",
          badgeText: "text-[#0F2233]",
          correctBorder: "border-[#244961]",
          incorrectBorder: "border-[#DC2626]",
          buttonBg: "bg-[#0F2233] hover:bg-[#244961]",
          buttonText: "text-white",
          explanationBg: "bg-[#244961]/5 border-[#244961]/20",
          explanationAccent: "border-l-[#244961]",
        }
      case "PrisonersDilemma":
        return {
          paperBg: "bg-[#F5F1E6]",
          inkColor: "text-[#3B3128]",
          accentColor: "#8B5E3C",
          accentText: "text-[#8B5E3C]",
          hairline: "border-[#C0B6A4]",
          badgeBg: "bg-[#8B5E3C]/10 border-[#8B5E3C]/30",
          badgeText: "text-[#3B3128]",
          correctBorder: "border-[#8B5E3C]",
          incorrectBorder: "border-[#DC2626]",
          buttonBg: "bg-[#8B5E3C] hover:bg-[#78716C]",
          buttonText: "text-white",
          explanationBg: "bg-[#8B5E3C]/5 border-[#8B5E3C]/20",
          explanationAccent: "border-l-[#8B5E3C]",
        }
      case "SignalDecoding":
        return {
          paperBg: "bg-[#EDEDE9]",
          inkColor: "text-[#184E77]",
          accentColor: "#DB6B5E",
          accentText: "text-[#DB6B5E]",
          hairline: "border-[#C9C2B0]",
          badgeBg: "bg-[#DB6B5E]/10 border-[#DB6B5E]/30",
          badgeText: "text-[#184E77]",
          correctBorder: "border-[#DB6B5E]",
          incorrectBorder: "border-[#DC2626]",
          buttonBg: "bg-[#184E77] hover:bg-[#DB6B5E]",
          buttonText: "text-white",
          explanationBg: "bg-[#DB6B5E]/5 border-[#DB6B5E]/20",
          explanationAccent: "border-l-[#DB6B5E]",
        }
    }
  }

  const themeStyles = getThemeStyles()

  const saveProgress = useCallback((states: QuestionState[], currentScore: number, complete: boolean) => {
    if (disableSaveProgress) return

    const savedKey = `quiz-progress-${gameType}-${date}`
    localStorage.setItem(
      savedKey,
      JSON.stringify({
        questionStates: states,
        score: currentScore,
        isComplete: complete,
        timestamp: Date.now(),
      }),
    )
  }, [disableSaveProgress, gameType, date])

  // Embla 선택 이벤트
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const index = emblaApi.selectedScrollSnap()
    setSelectedIndex(index)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // 키보드 단축키 (객관식 문제용)
  useEffect(() => {
    if (answeredCount === questions.length) return

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (!["A", "B", "C", "D"].includes(key)) return

      const currentQuestion = questions[selectedIndex]
      if (!currentQuestion || currentQuestion.questionType !== "객관식" || !currentQuestion.options) return
      if (questionStates[selectedIndex]?.isAnswered) return

      const optionIndex = key.charCodeAt(0) - 65
      if (optionIndex >= currentQuestion.options.length) return

      handleMultipleChoiceAnswer(selectedIndex, currentQuestion.options[optionIndex])
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [questionStates, answeredCount, questions, selectedIndex])

  const handleMultipleChoiceAnswer = useCallback((questionIndex: number, option: string) => {
    if (!questionStates[questionIndex]) return

    const currentState = questionStates[questionIndex]
    if (currentState.isAnswered) return

    const question = questions[questionIndex]
    const isCorrect = option === question.answer
    const newStates = [...questionStates]
    newStates[questionIndex] = {
      ...currentState,
      selectedAnswer: option,  // 선택한 답 저장
      userAnswer: option,
      isAnswered: true,
      isCorrect,
    }
    setQuestionStates(newStates)

    const correctCount = newStates.filter((state) => state.isCorrect).length
    setScore(correctCount)

    if (!disableSaveProgress) {
      saveProgress(newStates, correctCount, false)
    }

    // 자동으로 다음 문제 또는 완료 화면으로 이동 (1초 후)
    setTimeout(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, 1000)
  }, [questionStates, questions, disableSaveProgress, saveProgress, emblaApi])

  const handleShortAnswerSubmit = (questionIndex: number) => {
    if (!questionStates[questionIndex]) return

    const currentState = questionStates[questionIndex]
    if (currentState.isAnswered || !currentState.userAnswer.trim()) return

    const question = questions[questionIndex]
    const userAnswerNormalized = currentState.userAnswer.trim().toLowerCase()
    const correctAnswerNormalized = question.answer.toLowerCase()
    const isCorrect = userAnswerNormalized === correctAnswerNormalized

    const newStates = [...questionStates]
    newStates[questionIndex] = {
      ...currentState,
      isAnswered: true,
      isCorrect,
    }

    const newScore = isCorrect ? score + 1 : score
    setQuestionStates(newStates)
    setScore(newScore)
    saveProgress(
      newStates,
      newScore,
      newStates.every((state) => state.isAnswered),
    )

    // 자동으로 다음 문제 또는 완료 화면으로 이동 (1초 후)
    setTimeout(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, 1000)
  }

  const handleToggleHint = (questionIndex: number) => {
    if (!questionStates[questionIndex]) return

    const newStates = [...questionStates]
    newStates[questionIndex] = {
      ...questionStates[questionIndex],
      showHint: !questionStates[questionIndex].showHint,
    }
    setQuestionStates(newStates)
  }

  const handleInputChange = (questionIndex: number, value: string) => {
    if (!questionStates[questionIndex]) return

    const newStates = [...questionStates]
    newStates[questionIndex] = {
      ...questionStates[questionIndex],
      userAnswer: value,
    }
    setQuestionStates(newStates)
  }

  const handleRestart = () => {
    const resetStates = questions.map(() => ({
      selectedAnswer: null,
      userAnswer: "",
      isAnswered: false,
      isCorrect: false,
      showHint: false,
    }))
    setQuestionStates(resetStates)
    setScore(0)
    saveProgress(resetStates, 0, false)
    scrollTo(0)
  }

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const canScrollPrev = emblaApi?.canScrollPrev() ?? false
  const canScrollNext = emblaApi?.canScrollNext() ?? false

  if (questionStates.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-3 md:px-4">
        <div className={`${themeStyles.paperBg} border ${themeStyles.hairline} p-6 md:p-8 text-center rounded-2xl shadow-sm`}>
          <p className={`${themeStyles.inkColor}`}>퀴즈를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* 이전/다음 버튼 - 문제 외부에 배치 */}
      {showArrows && questions.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-20",
              "hidden md:flex",
              "bg-white/90 hover:bg-white shadow-lg",
              "transition-opacity duration-200",
              !canScrollPrev && "opacity-0 pointer-events-none"
            )}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="이전 퀴즈"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-20",
              "hidden md:flex",
              "bg-white/90 hover:bg-white shadow-lg",
              "transition-opacity duration-200",
              !canScrollNext && "opacity-0 pointer-events-none"
            )}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="다음 퀴즈"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </>
      )}

      <div className="max-w-3xl mx-auto px-3 md:px-4">
        <div
          className={cn("relative w-full", className)}
          role="region"
          aria-roledescription="carousel"
          aria-label="퀴즈 캐러셀"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
            {questions.map((question, questionIndex) => {
              const state = questionStates[questionIndex]
              if (!state) return null

              return (
                <div
                  key={questionIndex}
                  className="min-w-0 shrink-0 grow-0 flex-[0_0_100%]"
                >
                  <article
                    className={`${themeStyles.paperBg} border ${themeStyles.hairline} rounded-2xl shadow-sm p-6 md:p-8 space-y-4`}
                    style={{
                      backgroundColor: gameType === "PrisonersDilemma" ? "#F0E7D8" : undefined,
                    }}
                  >
                    {question.relatedArticle && (
                      <NewsHeaderBlock
                        logoSrc="/images/sedaily_logo.png"
                        siteUrl="https://www.sedaily.com"
                        headline={question.relatedArticle.title}
                        lede={question.relatedArticle.excerpt}
                        themeStyles={themeStyles}
                      />
                    )}

                    <header
                      className="flex items-center justify-between border-b pb-3"
                      style={{ borderColor: themeStyles.accentColor }}
                    >
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 border ${themeStyles.badgeBg} ${themeStyles.badgeText}`}
                      >
                        <span className="text-xs uppercase tracking-widest">{question.questionType}</span>
                      </div>
                      {question.newsLink && (
                        <a
                          href={question.newsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 text-sm ${themeStyles.inkColor} hover:${themeStyles.accentText} transition-colors uppercase tracking-wide`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>관련 뉴스</span>
                        </a>
                      )}
                    </header>

                    <div>
                      <h3
                        className={`text-[22px] md:text-2xl font-bold leading-tight ${themeStyles.inkColor}`}
                        style={{ lineHeight: "1.4", letterSpacing: "-0.2px", fontWeight: 700 }}
                      >
                        {questionIndex + 1}. {question.question}
                      </h3>
                    </div>

                    <div
                      className="border-t-2 border-dotted my-4"
                      style={{ borderColor: themeStyles.accentColor, opacity: 0.3 }}
                    />

                    {/* 객관식 */}
                    {question.questionType === "객관식" && question.options && (
                      <div className="space-y-5">
                        {question.options.map((option, idx) => {
                          const isSelected = state.selectedAnswer === option
                          const isCorrectOption = option === question.answer
                          const showResult = state.isAnswered

                          return (
                            <button
                              key={idx}
                              onClick={() => handleMultipleChoiceAnswer(questionIndex, option)}
                              disabled={state.isAnswered}
                              className={`w-full p-4 text-left border-2 transition-all choice-card newspaper-focus rounded-xl ${
                                showResult && isCorrectOption
                                  ? `${themeStyles.correctBorder} border-4 bg-[#F5F1E6]`
                                  : showResult && isSelected && !isCorrectOption
                                    ? `${themeStyles.incorrectBorder} border-4 bg-[#FEF2F2]`
                                    : isSelected
                                      ? `${themeStyles.correctBorder} bg-[#F5F1E6]`
                                      : `${themeStyles.hairline} hover:${themeStyles.correctBorder} bg-[#FAFAF9]`
                              } ${state.isAnswered ? "cursor-default" : "cursor-pointer"}`}
                              style={{ fontFamily: "var(--font-news-body)" }}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className="shrink-0 w-7 h-7 border-2 flex items-center justify-center text-sm font-bold rounded-sm"
                                  style={{
                                    color: showResult && isCorrectOption ? "#FFFFFF" : accent.hex,
                                    borderColor: accent.hex,
                                    backgroundColor: showResult && isCorrectOption ? accent.hex : "transparent",
                                  }}
                                >
                                  {isSelected && showResult ? (isCorrectOption ? "●" : "○") : String.fromCharCode(65 + idx)}
                                </span>
                                <span
                                  className={`flex-1 text-[15px] md:text-base ${themeStyles.inkColor}`}
                                  style={{ lineHeight: "1.6", fontWeight: 500 }}
                                >
                                  {option}
                                </span>
                                {showResult && isCorrectOption && (
                                  <CheckCircle2
                                    className="shrink-0 h-5 w-5"
                                    style={{ color: themeStyles.accentColor }}
                                  />
                                )}
                                {showResult && isSelected && !isCorrectOption && <XCircle className="h-5 w-5 text-red-600" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* 주관식 */}
                    {question.questionType === "주관식" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="답을 입력하세요"
                            value={state.userAnswer}
                            onChange={(e) => handleInputChange(questionIndex, e.target.value)}
                            disabled={state.isAnswered}
                            className={`w-full text-lg p-4 border-2 rounded-xl ${themeStyles.hairline} ${themeStyles.paperBg} ${themeStyles.inkColor} newspaper-focus`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !state.isAnswered) {
                                handleShortAnswerSubmit(questionIndex)
                              }
                            }}
                          />
                          {!state.isAnswered && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleShortAnswerSubmit(questionIndex)}
                                disabled={!state.userAnswer.trim()}
                                className={`flex-1 rounded-xl ${themeStyles.buttonBg} ${themeStyles.buttonText}`}
                              >
                                제출하기
                              </Button>
                              {question.hint && (
                                <Button
                                  onClick={() => handleToggleHint(questionIndex)}
                                  variant="outline"
                                  className={`gap-2 rounded-xl ${themeStyles.paperBg} ${themeStyles.inkColor} border-2 ${themeStyles.hairline}`}
                                >
                                  <Lightbulb className="h-4 w-4" />
                                  힌트
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        {state.showHint && question.hint && !state.isAnswered && (
                          <div
                            className={`p-4 border-l-4 rounded-lg ${themeStyles.explanationBg} border ${themeStyles.explanationAccent}`}
                          >
                            <div className="flex gap-2">
                              <Lightbulb
                                className="h-5 w-5 shrink-0 mt-0.5"
                                style={{ color: themeStyles.accentColor }}
                              />
                              <div>
                                <p className={`font-normal text-xs uppercase tracking-wide mb-1 ${themeStyles.inkColor}`}>
                                  힌트
                                </p>
                                <p
                                  className={`${themeStyles.inkColor} leading-relaxed`}
                                  style={{ lineHeight: "1.7", fontWeight: 400 }}
                                >
                                  {question.hint}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {state.isAnswered && (
                          <div
                            className={`p-4 border-l-4 rounded-lg border ${state.isCorrect ? themeStyles.correctBorder : themeStyles.incorrectBorder}`}
                            style={{
                              backgroundColor: state.isCorrect ? `${themeStyles.accentColor}10` : "#FEF2F2",
                              borderLeftColor: state.isCorrect ? themeStyles.accentColor : "#DC2626",
                            }}
                          >
                            <div className="flex gap-2">
                              {state.isCorrect ? (
                                <CheckCircle2
                                  className="h-5 w-5 shrink-0 mt-0.5"
                                  style={{ color: themeStyles.accentColor }}
                                />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className={`font-normal text-xs uppercase tracking-wide mb-1 ${themeStyles.inkColor}`}>
                                  {state.isCorrect ? "정답입니다" : "오답입니다"}
                                </p>
                                {!state.isCorrect && (
                                  <p className={`text-sm ${themeStyles.inkColor}`} style={{ fontWeight: 500 }}>
                                    정답: <span className="font-bold">{question.answer}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI 챗봇 */}
                    <div className="pt-4">
                      <AIChatbot
                        gameType={gameType}
                        questionIndex={questionIndex}
                        questionText={question.question}
                        isAnswered={state.isAnswered}
                        quizArticleUrl={question.newsLink}
                      />
                    </div>

                    {/* 해설 */}
                    {state.isAnswered && (
                      <div className="space-y-4 mt-4">
                        <div
                          className={`p-4 border-l-4 rounded-lg ${themeStyles.explanationBg} border ${themeStyles.explanationAccent}`}
                          style={{
                            backgroundColor: gameType === "PrisonersDilemma" ? "transparent" : undefined,
                            borderLeftColor: accent.hex,
                            borderColor: "rgba(0,0,0,0.08)",
                          }}
                        >
                          <div className="space-y-2">
                            <p className={`font-normal text-xs uppercase tracking-wide ${themeStyles.inkColor}`}>해설</p>
                            <p
                              className={`text-[15px] md:text-base ${themeStyles.inkColor}`}
                              style={{ lineHeight: "1.7", fontWeight: 400 }}
                            >
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 액션 버튼 - 마지막 문제에만 표시 */}
                    {questionIndex === questions.length - 1 && (
                      <div className="pt-6 flex flex-col sm:flex-row gap-3 border-t" style={{ borderColor: themeStyles.accentColor }}>
                        <Button
                          onClick={handleRestart}
                          variant="outline"
                          className={`flex-1 ${themeStyles.paperBg} ${themeStyles.inkColor} border-2 ${themeStyles.hairline} h-11`}
                        >
                          다시 하기
                        </Button>
                        <Button
                          variant="outline"
                          className={`flex-1 ${themeStyles.paperBg} ${themeStyles.inkColor} border-2 ${themeStyles.hairline} h-11`}
                          onClick={() => router.back()}
                        >
                          돌아가기
                        </Button>
                      </div>
                    )}
                  </article>
                </div>
              )
            })}
          </div>
        </div>

        {/* 페이지네이션 점 */}
        {showDots && (
          <div className="flex justify-center gap-2 mt-6">
            {/* 문제 슬라이드용 점들 */}
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === selectedIndex
                    ? "w-6"
                    : "bg-primary/30 hover:bg-primary/50"
                )}
                style={{
                  backgroundColor: index === selectedIndex ? themeStyles.accentColor : undefined,
                }}
                onClick={() => scrollTo(index)}
                aria-label={`슬라이드 ${index + 1} 이동`}
                aria-current={index === selectedIndex ? "true" : "false"}
              />
            ))}
          </div>
        )}
      </div>

      </div>
    </div>
  )
}
