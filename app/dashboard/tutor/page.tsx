"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { 
  Send, 
  Brain,
  Sparkles,
  BookOpen,
  ChevronDown,
  Copy,
  Check,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { askAI } from "@/lib/api"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const subjects = [
  { name: "All Subjects", value: "all" },
  { name: "Physics", value: "physics" },
  { name: "Mathematics", value: "mathematics" },
  { name: "Chemistry", value: "chemistry" },
  { name: "Biology", value: "biology" },
  { name: "History", value: "history" },
]

const suggestedQuestions = [
  "Explain the concept of momentum in physics",
  "How do I solve quadratic equations?",
  "What is the periodic table?",
  "Explain the water cycle",
]

function TutorContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialQuery)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const data = await askAI(`[${selectedSubject !== "all" ? selectedSubject.toUpperCase() : "GENERAL"}] ${messageText}`)
      const responseContent = data.answer || data.error || "Sorry, I couldn't process your request."

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't connect to the AI service. Please make sure the backend server is running.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Tutor</h1>
            <p className="text-sm text-muted-foreground">Your personal study assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Subject Selector */}
          <div className="relative">
            <button
              onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              {subjects.find(s => s.value === selectedSubject)?.name}
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showSubjectDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10"
                >
                  {subjects.map((subject) => (
                    <button
                      key={subject.value}
                      onClick={() => {
                        setSelectedSubject(subject.value)
                        setShowSubjectDropdown(false)
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${
                        selectedSubject === subject.value ? "bg-primary/10 text-primary" : "text-foreground"
                      }`}
                    >
                      {subject.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clearChat} className="rounded-xl">
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground mb-2">Start a Conversation</h2>
              <p className="text-muted-foreground max-w-sm mb-8">
                Ask me anything about your subjects. I am here to help you learn and understand complex topics.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSend(question)}
                    className="p-4 bg-muted/50 hover:bg-muted rounded-xl text-left text-sm text-foreground transition-colors"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, x: message.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${message.role === "user" ? "order-2" : ""}`}>
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                          <Brain className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Vishwa Mitr</span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Vishwa Mitr</span>
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 ml-8">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 h-12 rounded-xl"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              className="h-12 px-6 rounded-xl gap-2"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Tutor...</div>}>
      <TutorContent />
    </Suspense>
  )
}
