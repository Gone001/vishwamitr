"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  Play,
  BookOpen,
  Loader2,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateQuizQuestions, submitQuizResult, getQuizHistory, getQuizQuestions } from "@/lib/api"

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  subject: string
  difficulty: string
}

interface QuizHistoryItem {
  id: string
  subject: string
  score: number
  total: number
  time_taken: number
  difficulty: string
  completed_at: string
}

type QuizState = "idle" | "loading" | "active" | "completed" | "error" | "gemini-fallback"

const SUBJECTS = ["Physics", "Mathematics", "Chemistry", "Biology", "History", "Geography"]
const DIFFICULTIES = ["easy", "medium", "hard"]

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return "Just now"
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
  return date.toLocaleDateString()
}

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>("idle")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [startTime, setStartTime] = useState<number>(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch quiz history on mount
  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const data = await getQuizHistory()
      if (data.history) {
        setQuizHistory(data.history)
      }
    } catch (err) {
      console.error("Failed to fetch history:", err)
    }
  }

  const startQuizWithDB = async () => {
    setQuizState("loading")
    setErrorMessage("")

    try {
      const data = await getQuizQuestions({
        subject: selectedSubject === "all" ? undefined : selectedSubject,
        difficulty: selectedDifficulty === "all" ? undefined : selectedDifficulty,
      })

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
        setStartTime(Date.now())
        setQuizState("active")
      } else {
        setErrorMessage("No questions available in database for selected filters.")
        setQuizState("error")
      }
    } catch (err: unknown) {
      console.error(err)
      setErrorMessage("Failed to load questions. Please try again.")
      setQuizState("error")
    }
  }

  const startQuiz = async () => {
    setQuizState("loading")
    setErrorMessage("")
    setQuestions([])
    setAnswers([])
    setScore(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(30)

    try {
      const data = await generateQuizQuestions({
        subject: selectedSubject === "all" ? "Mixed" : selectedSubject,
        difficulty: selectedDifficulty === "all" ? "medium" : selectedDifficulty,
      })

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
        setStartTime(Date.now())
        setQuizState("active")
      } else {
        setErrorMessage("No questions available for selected filters. Try different options.")
        setQuizState("error")
      }
    } catch (err: unknown) {
      console.error(err)
      setErrorMessage("Gemini is taking a break. Would you like to try Previous Year Questions instead?")
      setQuizState("gemini-fallback")
    }
  }

  const handleNextQuestion = useCallback(() => {
    if (selectedAnswer !== null && questions[currentQuestion]) {
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)

      if (selectedAnswer === questions[currentQuestion].correct) {
        setScore(prev => prev + 1)
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(30)
    } else {
      // Quiz completed - submit results
      completeQuiz()
    }
  }, [selectedAnswer, answers, currentQuestion, questions])

  const completeQuiz = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    // Submit to backend
    try {
      await submitQuizResult({
        subject: selectedSubject === "all" ? "Mixed" : selectedSubject,
        score,
        total: questions.length,
        time_taken: timeTaken,
        difficulty: selectedDifficulty === "all" ? "mixed" : selectedDifficulty,
        answers: answers.map((ans, idx) => ({
          question_id: questions[idx].id,
          selected_idx: ans ?? -1,
          correct: ans === questions[idx].correct
        }))
      })
      // Refresh history
      fetchHistory()
    } catch (err) {
      console.error("Failed to save quiz result:", err)
    }

    setQuizState("completed")
  }

  // Timer effect
  useEffect(() => {
    if (quizState !== "active" || showResult) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [quizState, showResult, handleNextQuestion])

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
  }

  const resetQuiz = () => {
    setQuizState("idle")
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setShowResult(false)
    setScore(0)
    setTimeLeft(30)
    setErrorMessage("")
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  // Error state
  if (quizState === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Oops!</h2>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        <Button onClick={resetQuiz} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    )
  }

  // Gemini Fallback state - user can choose to try PYQ from database
  if (quizState === "gemini-fallback") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Gemini is Taking a Break</h2>
          <p className="text-muted-foreground mb-6">
            {errorMessage || "The AI is currently unavailable. Would you like to try our Previous Year Questions instead?"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={resetQuiz} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Cancel
            </Button>
            <Button onClick={startQuizWithDB} className="gap-2 bg-amber-500 hover:bg-amber-600">
              <BookOpen className="w-4 h-4" />
              Try PYQ Instead
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Loading state
  if (quizState === "loading") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Loading Questions...</h2>
        <p className="text-muted-foreground">Fetching quiz questions for you</p>
      </div>
    )
  }

  // Idle state
  if (quizState === "idle") {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Ready for a Quiz?</h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Test your knowledge with our adaptive quiz system. Choose your subject and difficulty.
          </p>

          {/* Subject Selection */}
          <div className="max-w-md mx-auto mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Select Subject</label>
            <div className="relative">
              <button
                onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                className="w-full p-3 bg-card border border-border rounded-xl text-left flex items-center justify-between"
              >
                <span>{selectedSubject === "all" ? "All Subjects" : selectedSubject}</span>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {showSubjectDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10"
                  >
                    <button
                      onClick={() => { setSelectedSubject("all"); setShowSubjectDropdown(false) }}
                      className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${selectedSubject === "all" ? "bg-primary/10 text-primary" : "text-foreground"}`}
                    >
                      All Subjects
                    </button>
                    {SUBJECTS.map(subject => (
                      <button
                        key={subject}
                        onClick={() => { setSelectedSubject(subject); setShowSubjectDropdown(false) }}
                        className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${selectedSubject === subject ? "bg-primary/10 text-primary" : "text-foreground"}`}
                      >
                        {subject}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">Select Difficulty</label>
            <div className="flex gap-2 justify-center">
              {["all", ...DIFFICULTIES].map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  {diff === "all" ? "All Levels" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">5</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">30s</div>
              <div className="text-sm text-muted-foreground">Per Question</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{selectedSubject === "all" ? "Mixed" : selectedSubject}</div>
              <div className="text-sm text-muted-foreground">Subject</div>
            </div>
          </div>

          <Button onClick={startQuiz} size="lg" className="gap-2 px-8">
            <Play className="w-5 h-5" />
            Start Quiz
          </Button>
        </motion.div>

        {/* Recent Quiz History */}
        {quizHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Your Quiz History</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizHistory.slice(0, 6).map((quiz) => (
                <div key={quiz.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-foreground">{quiz.subject}</span>
                    <span className="text-sm text-muted-foreground">{formatTimeAgo(quiz.completed_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${quiz.score >= quiz.total * 0.7 ? "bg-green-500" : "bg-amber-500"}`}
                        style={{ width: `${(quiz.score / quiz.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {quiz.score}/{quiz.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  // Completed state
  if (quizState === "completed") {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className={`w-12 h-12 ${percentage >= 70 ? "text-amber-500" : "text-primary"}`} />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Completed!</h2>
          <p className="text-muted-foreground mb-6">
            {percentage >= 80 ? "Excellent work!" : percentage >= 60 ? "Good job!" : "Keep practicing!"}
          </p>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">{questions.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>

          {/* Answer Summary */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-foreground mb-3">Question Summary</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    answers[index] === q.correct
                      ? "bg-green-500/20 text-green-600"
                      : "bg-red-500/20 text-red-600"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={resetQuiz} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Back to Quiz
            </Button>
            <Button onClick={startQuiz} className="gap-2">
              New Quiz
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Active quiz state
  const question = questions[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${timeLeft <= 10 ? "text-red-500" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${timeLeft <= 10 ? "text-red-500" : "text-foreground"}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {question.subject}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              question.difficulty === "easy" ? "bg-green-500/10 text-green-600" :
              question.difficulty === "medium" ? "bg-amber-500/10 text-amber-600" :
              "bg-red-500/10 text-red-600"
            }`}>
              {question.difficulty}
            </span>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correct
              const showCorrectWrong = showResult

              return (
                <motion.button
                  key={index}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    showCorrectWrong
                      ? isCorrect
                        ? "border-green-500 bg-green-500/10"
                        : isSelected
                        ? "border-red-500 bg-red-500/10"
                        : "border-border bg-muted/30"
                      : isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    showCorrectWrong
                      ? isCorrect
                        ? "bg-green-500 text-white"
                        : isSelected
                        ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                      : isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-foreground">{option}</span>
                  {showCorrectWrong && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {showCorrectWrong && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </motion.button>
              )
            })}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-end"
            >
              <Button onClick={handleNextQuestion} className="gap-2">
                {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
