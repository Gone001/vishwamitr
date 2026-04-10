"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  GraduationCap, 
  FileText,
  Star,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  BookOpen,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const pyqs = [
  {
    id: 1,
    year: "2025",
    subject: "Physics",
    title: "JEE Main 2025 - Physics Paper",
    questions: 30,
    duration: "60 min",
    difficulty: "Hard",
    important: true
  },
  {
    id: 2,
    year: "2025",
    subject: "Mathematics",
    title: "JEE Main 2025 - Mathematics Paper",
    questions: 30,
    duration: "60 min",
    difficulty: "Hard",
    important: true
  },
  {
    id: 3,
    year: "2024",
    subject: "Chemistry",
    title: "NEET 2024 - Chemistry Section",
    questions: 45,
    duration: "45 min",
    difficulty: "Medium",
    important: true
  },
  {
    id: 4,
    year: "2024",
    subject: "Physics",
    title: "CBSE Board 2024 - Physics",
    questions: 35,
    duration: "180 min",
    difficulty: "Medium",
    important: false
  },
  {
    id: 5,
    year: "2023",
    subject: "Mathematics",
    title: "CBSE Board 2023 - Mathematics",
    questions: 38,
    duration: "180 min",
    difficulty: "Medium",
    important: false
  },
]

const importantTopics = [
  { subject: "Physics", topic: "Laws of Motion", weight: "15%" },
  { subject: "Physics", topic: "Electromagnetic Induction", weight: "12%" },
  { subject: "Mathematics", topic: "Calculus", weight: "20%" },
  { subject: "Chemistry", topic: "Organic Chemistry", weight: "18%" },
]

export default function ExamsPage() {
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredPyqs = pyqs.filter(pyq => {
    const matchesSubject = selectedSubject === "all" || pyq.subject.toLowerCase() === selectedSubject
    const matchesSearch = pyq.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSubject && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exam Preparation</h1>
          <p className="text-muted-foreground">Practice with previous year questions and important topics</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers..."
            className="pl-10 h-12 rounded-xl"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 h-12 bg-muted rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="capitalize">{selectedSubject === "all" ? "All Subjects" : selectedSubject}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10"
            >
              {["all", "physics", "mathematics", "chemistry"].map((subject) => (
                <button
                  key={subject}
                  onClick={() => {
                    setSelectedSubject(subject)
                    setShowFilters(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors capitalize ${
                    selectedSubject === subject ? "bg-primary/10 text-primary" : "text-foreground"
                  }`}
                >
                  {subject === "all" ? "All Subjects" : subject}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Important Topics Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-foreground">Important Topics for Exams</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {importantTopics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-xl p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-amber-600 bg-amber-500/20 px-2 py-1 rounded-full">
                  {item.subject}
                </span>
                <span className="text-sm font-bold text-primary">{item.weight}</span>
              </div>
              <h3 className="font-medium text-foreground">{item.topic}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PYQs List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Previous Year Questions</h2>
          <span className="text-sm text-muted-foreground">{filteredPyqs.length} papers found</span>
        </div>

        <div className="space-y-4">
          {filteredPyqs.map((pyq, index) => (
            <motion.div
              key={pyq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {pyq.subject}
                    </span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      {pyq.year}
                    </span>
                    {pyq.important && (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-600 text-xs font-medium rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Important
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{pyq.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{pyq.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{pyq.duration}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      pyq.difficulty === "Hard" 
                        ? "bg-red-500/20 text-red-600" 
                        : "bg-green-500/20 text-green-600"
                    }`}>
                      {pyq.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard/tutor">
                    <Button variant="outline" className="gap-2 rounded-xl">
                      <Sparkles className="w-4 h-4" />
                      Solve with AI
                    </Button>
                  </Link>
                  <Button className="gap-2 rounded-xl">
                    <BookOpen className="w-4 h-4" />
                    Practice
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Need personalized exam strategy?</h3>
              <p className="text-sm text-white/80">Let AI create a study plan for your target exam</p>
            </div>
          </div>
          <Link href="/dashboard/tutor">
            <Button variant="secondary" className="gap-2">
              Get AI Help
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
