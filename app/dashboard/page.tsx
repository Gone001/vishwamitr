"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  MessageSquare, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  Send,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getProfile } from "@/lib/api"

const subjects = [
  { name: "Physics", color: "from-blue-500 to-cyan-500", progress: 72, icon: "F=ma" },
  { name: "Mathematics", color: "from-indigo-500 to-purple-500", progress: 85, icon: "x+y" },
  { name: "Chemistry", color: "from-emerald-500 to-green-500", progress: 65, icon: "H2O" },
  { name: "History", color: "from-amber-500 to-orange-500", progress: 45, icon: "1947" },
]

const recentTopics = [
  { subject: "Physics", topic: "Newton's Laws of Motion", time: "2 hours ago" },
  { subject: "Mathematics", topic: "Quadratic Equations", time: "Yesterday" },
  { subject: "Chemistry", topic: "Chemical Bonding", time: "2 days ago" },
]

export default function DashboardHome() {
  const router = useRouter()
  const [chatInput, setChatInput] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getProfile()
        if (data.user?.full_name) {
          setUserName(data.user.full_name)
        }
      } catch (err) {
        console.error("Failed to load user:", err)
      }
    }
    loadUser()
  }, [])

  const handleQuickChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim()) {
      router.push(`/dashboard/tutor?q=${encodeURIComponent(chatInput)}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">
              {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}!
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome{userName ? `, ${userName.split(' ')[0]}` : ""}!
          </h1>
          <p className="text-white/80 max-w-lg">
            Continue your learning journey. You have 3 pending quizzes and 2 new topics to explore.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link href="/dashboard/tutor">
              <Button className="bg-white text-primary hover:bg-white/90 gap-2">
                <MessageSquare className="w-4 h-4" />
                Start Chat
              </Button>
            </Link>
            <Link href="/dashboard/quiz">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <BookOpen className="w-4 h-4" />
                Take Quiz
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Weekly Progress", value: "85%", icon: TrendingUp, color: "text-green-500" },
          { label: "Hours Learned", value: "12.5", icon: Clock, color: "text-blue-500" },
          { label: "Quizzes Done", value: "24", icon: Target, color: "text-purple-500" },
          { label: "Topics Covered", value: "38", icon: BookOpen, color: "text-amber-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subjects Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Your Subjects</h2>
            <Link href="/dashboard/subjects" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link href={`/dashboard/subjects/${subject.name.toLowerCase()}`}>
                  <div className="group bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{subject.icon}</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground">{subject.progress}%</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{subject.name}</h3>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${subject.color} rounded-full`}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {subject.progress < 50 ? "Keep going!" : subject.progress < 80 ? "Good progress!" : "Almost there!"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {recentTopics.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.topic}</p>
                    <p className="text-sm text-muted-foreground">{item.subject} • {item.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Chat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Quick Chat</h3>
            <p className="text-sm text-muted-foreground">Ask anything to your AI tutor</p>
          </div>
        </div>
        <form onSubmit={handleQuickChat} className="flex gap-3">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="What would you like to learn today?"
            className="flex-1 h-12 rounded-xl"
          />
          <Button type="submit" className="h-12 px-6 rounded-xl gap-2">
            <Send className="w-4 h-4" />
            Ask
          </Button>
        </form>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Explain photosynthesis", "Solve quadratic equation", "What is Newton's first law?"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setChatInput(suggestion)}
              className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
