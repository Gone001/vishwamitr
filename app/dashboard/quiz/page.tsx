"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Clock, 
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  Play,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  subject: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is Newton's First Law of Motion also known as?",
    options: ["Law of Acceleration", "Law of Inertia", "Law of Action-Reaction", "Law of Gravity"],
    correct: 1,
    subject: "Physics"
  },
  {
    id: 2,
    question: "What is the derivative of sin(x)?",
    options: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"],
    correct: 1,
    subject: "Mathematics"
  },
  {
    id: 3,
    question: "What is the atomic number of Carbon?",
    options: ["4", "6", "8", "12"],
    correct: 1,
    subject: "Chemistry"
  },
  {
    id: 4,
    question: "Which of the following is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    correct: 2,
    subject: "Physics"
  },
  {
    id: 5,
    question: "What is the value of pi (π) to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    correct: 1,
    subject: "Mathematics"
  },
]

type QuizState = "idle" | "active" | "completed"

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>("idle")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)

  const handleNextQuestion = useCallback(() => {
    if (selectedAnswer !== null) {
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
      setQuizState("completed")
    }
  }, [selectedAnswer, answers, currentQuestion])

  useEffect(() => {
    if (quizState !== "active" || showResult) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizState, showResult, handleNextQuestion])

  const startQuiz = () => {
    setQuizState("active")
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setShowResult(false)
    setTimeLeft(30)
    setScore(0)
  }

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
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

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
            Test your knowledge with our adaptive quiz system. Answer questions across multiple subjects.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{questions.length}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">30s</div>
              <div className="text-sm text-muted-foreground">Per Question</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">Mixed</div>
              <div className="text-sm text-muted-foreground">Subjects</div>
            </div>
          </div>

          <Button onClick={startQuiz} size="lg" className="gap-2 px-8">
            <Play className="w-5 h-5" />
            Start Quiz
          </Button>
        </motion.div>

        {/* Recent Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Quiz Results</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { subject: "Physics", score: 8, total: 10, date: "Yesterday" },
              { subject: "Mathematics", score: 9, total: 10, date: "2 days ago" },
              { subject: "Chemistry", score: 7, total: 10, date: "3 days ago" },
            ].map((quiz, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">{quiz.subject}</span>
                  <span className="text-sm text-muted-foreground">{quiz.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
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
      </div>
    )
  }

  if (quizState === "completed") {
    const percentage = Math.round((score / questions.length) * 100)
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
            <div className="flex justify-center gap-2">
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

          <div className="flex gap-4 justify-center">
            <Button onClick={resetQuiz} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
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
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {question.subject}
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
