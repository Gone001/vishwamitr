"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  BookOpen,
  Trophy,
  Calendar,
  ArrowUp,
  ArrowDown,
  Loader2
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { getQuizHistory } from "@/lib/api"

interface QuizHistoryItem {
  id: string
  subject: string
  score: number
  total: number
  time_taken: number
  difficulty: string
  completed_at: string
}

const weeklyProgress = [
  { day: "Mon", hours: 2.5, score: 75 },
  { day: "Tue", hours: 3.2, score: 82 },
  { day: "Wed", hours: 2.8, score: 78 },
  { day: "Thu", hours: 4.0, score: 88 },
  { day: "Fri", hours: 3.5, score: 85 },
  { day: "Sat", hours: 5.0, score: 92 },
  { day: "Sun", hours: 4.2, score: 89 },
]

const topicDistribution = [
  { name: "Mechanics", value: 25, color: "#3B82F6" },
  { name: "Algebra", value: 20, color: "#8B5CF6" },
  { name: "Organic Chem", value: 18, color: "#10B981" },
  { name: "Thermodynamics", value: 15, color: "#F59E0B" },
  { name: "Calculus", value: 12, color: "#EC4899" },
  { name: "Others", value: 10, color: "#6B7280" },
]

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

export default function ReportsPage() {
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    {
      label: "Total Study Hours",
      value: "0h",
      change: "0%",
      trend: "up" as "up" | "down",
      icon: Clock,
      color: "text-blue-500"
    },
    {
      label: "Average Score",
      value: "0%",
      change: "0%",
      trend: "up" as "up" | "down",
      icon: Target,
      color: "text-green-500"
    },
    {
      label: "Quizzes Completed",
      value: "0",
      change: "0",
      trend: "up" as "up" | "down",
      icon: BookOpen,
      color: "text-purple-500"
    },
    {
      label: "Current Streak",
      value: "0 days",
      change: "+0",
      trend: "up" as "up" | "down",
      icon: Trophy,
      color: "text-amber-500"
    },
  ])

  const [subjectPerformance, setSubjectPerformance] = useState<{ subject: string; score: number; color: string }[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await getQuizHistory()
      if (data.history && data.history.length > 0) {
        setQuizHistory(data.history)

        const subjectScores: Record<string, { total: number; count: number }> = {}
        data.history.forEach((quiz: QuizHistoryItem) => {
          if (!subjectScores[quiz.subject]) {
            subjectScores[quiz.subject] = { total: 0, count: 0 }
          }
          subjectScores[quiz.subject].total += (quiz.score / quiz.total) * 100
          subjectScores[quiz.subject].count += 1
        })

        const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#6B7280"]
        const performance = Object.entries(subjectScores).map(([subject, data], index) => ({
          subject,
          score: Math.round(data.total / data.count),
          color: colors[index % colors.length]
        }))
        setSubjectPerformance(performance)

        const avgScore = Math.round(data.history.reduce((acc: number, q: QuizHistoryItem) => acc + (q.score / q.total) * 100, 0) / data.history.length)
        const totalStudyMinutes = data.history.reduce((acc: number, q: QuizHistoryItem) => acc + q.time_taken, 0)
        const hours = Math.round(totalStudyMinutes / 60 * 10) / 10

        setStats([
          {
            label: "Total Study Hours",
            value: `${hours}h`,
            change: "+12%",
            trend: "up",
            icon: Clock,
            color: "text-blue-500"
          },
          {
            label: "Average Score",
            value: `${avgScore}%`,
            change: "+5%",
            trend: "up",
            icon: Target,
            color: "text-green-500"
          },
          {
            label: "Quizzes Completed",
            value: data.history.length.toString(),
            change: "+3",
            trend: "up",
            icon: BookOpen,
            color: "text-purple-500"
          },
          {
            label: "Current Streak",
            value: "12 days",
            change: "+3",
            trend: "up",
            icon: Trophy,
            color: "text-amber-500"
          },
        ])
      }
    } catch (err) {
      console.error("Failed to fetch quiz history:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance Reports</h1>
          <p className="text-muted-foreground">Track your learning progress and achievements</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Last 7 days</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === "up" ? "text-green-500" : "text-red-500"
              }`}>
                {stat.trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Weekly Progress</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Score</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyProgress}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorHours)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Subject Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="subject" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={70} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {subjectPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Topic Distribution</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={topicDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {topicDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {topicDistribution.slice(0, 4).map((topic) => (
              <div key={topic.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }} />
                <span className="text-sm text-muted-foreground truncate">{topic.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : quizHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No quiz history yet. Take a quiz to see your activity here.
              </div>
            ) : (
              quizHistory.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/20">
                    <Target className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{activity.subject}</p>
                    <p className="text-sm text-muted-foreground">Completed Quiz</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{activity.score}/{activity.total}</p>
                    <p className="text-sm text-muted-foreground">{formatTimeAgo(activity.completed_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Strength</span>
            </div>
            <p className="text-foreground font-medium">Mathematics</p>
            <p className="text-sm text-muted-foreground">92% average score</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">Needs Work</span>
            </div>
            <p className="text-foreground font-medium">History</p>
            <p className="text-sm text-muted-foreground">Focus on Modern History</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Recommended</span>
            </div>
            <p className="text-foreground font-medium">Practice Thermodynamics</p>
            <p className="text-sm text-muted-foreground">High exam weightage</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}