"use client"

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
  ArrowDown
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

const weeklyProgress = [
  { day: "Mon", hours: 2.5, score: 75 },
  { day: "Tue", hours: 3.2, score: 82 },
  { day: "Wed", hours: 2.8, score: 78 },
  { day: "Thu", hours: 4.0, score: 88 },
  { day: "Fri", hours: 3.5, score: 85 },
  { day: "Sat", hours: 5.0, score: 92 },
  { day: "Sun", hours: 4.2, score: 89 },
]

const subjectPerformance = [
  { subject: "Physics", score: 85, color: "#3B82F6" },
  { subject: "Maths", score: 92, color: "#8B5CF6" },
  { subject: "Chemistry", score: 78, color: "#10B981" },
  { subject: "History", score: 65, color: "#F59E0B" },
]

const topicDistribution = [
  { name: "Mechanics", value: 25, color: "#3B82F6" },
  { name: "Algebra", value: 20, color: "#8B5CF6" },
  { name: "Organic Chem", value: 18, color: "#10B981" },
  { name: "Thermodynamics", value: 15, color: "#F59E0B" },
  { name: "Calculus", value: 12, color: "#EC4899" },
  { name: "Others", value: 10, color: "#6B7280" },
]

const stats = [
  { 
    label: "Total Study Hours", 
    value: "25.2h", 
    change: "+12%", 
    trend: "up",
    icon: Clock,
    color: "text-blue-500"
  },
  { 
    label: "Average Score", 
    value: "84%", 
    change: "+5%", 
    trend: "up",
    icon: Target,
    color: "text-green-500"
  },
  { 
    label: "Topics Completed", 
    value: "38", 
    change: "+8", 
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
]

const recentActivity = [
  { action: "Completed Quiz", subject: "Physics - Newton's Laws", score: "9/10", time: "2 hours ago" },
  { action: "Study Session", subject: "Mathematics - Calculus", score: "45 min", time: "5 hours ago" },
  { action: "Completed Quiz", subject: "Chemistry - Bonding", score: "8/10", time: "Yesterday" },
  { action: "Study Session", subject: "Physics - Thermodynamics", score: "60 min", time: "Yesterday" },
]

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
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

      {/* Stats Grid */}
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

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
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

        {/* Subject Performance */}
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

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topic Distribution */}
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.action.includes("Quiz") ? "bg-green-500/20" : "bg-blue-500/20"
                }`}>
                  {activity.action.includes("Quiz") ? (
                    <Target className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{activity.subject}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{activity.score}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
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
