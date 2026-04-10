"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  BookOpen, 
  ArrowRight,
  Clock,
  FileText,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/button"

const subjects = [
  { 
    name: "Physics", 
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
    progress: 72, 
    chapters: 15,
    completed: 11,
    icon: "F=ma",
    topics: ["Mechanics", "Thermodynamics", "Waves", "Optics"]
  },
  { 
    name: "Mathematics", 
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-600",
    progress: 85, 
    chapters: 18,
    completed: 15,
    icon: "x+y",
    topics: ["Algebra", "Calculus", "Trigonometry", "Statistics"]
  },
  { 
    name: "Chemistry", 
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    progress: 65, 
    chapters: 16,
    completed: 10,
    icon: "H2O",
    topics: ["Organic", "Inorganic", "Physical", "Biochemistry"]
  },
  { 
    name: "Biology", 
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-600",
    progress: 58, 
    chapters: 20,
    completed: 12,
    icon: "DNA",
    topics: ["Botany", "Zoology", "Genetics", "Ecology"]
  },
  { 
    name: "History", 
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    progress: 45, 
    chapters: 12,
    completed: 5,
    icon: "1947",
    topics: ["Ancient", "Medieval", "Modern", "World History"]
  },
  { 
    name: "Geography", 
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-600",
    progress: 52, 
    chapters: 14,
    completed: 7,
    icon: "Map",
    topics: ["Physical", "Human", "Economic", "Environmental"]
  },
]

export default function SubjectsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground">Explore and master your subjects with AI assistance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-foreground">4 subjects in progress</span>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Link href={`/dashboard/subjects/${subject.name.toLowerCase()}`}>
              <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Header with gradient */}
                <div className={`h-24 bg-gradient-to-r ${subject.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-blue-900/20" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">{subject.icon}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="text-white/80 text-sm">{subject.completed}/{subject.chapters} chapters</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                    <span className="text-2xl font-bold text-primary">{subject.progress}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${subject.color} rounded-full`}
                    />
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {subject.topics.slice(0, 3).map((topic) => (
                      <span 
                        key={topic} 
                        className={`px-2 py-1 text-xs rounded-lg ${subject.bgColor} ${subject.textColor}`}
                      >
                        {topic}
                      </span>
                    ))}
                    {subject.topics.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-lg bg-muted text-muted-foreground">
                        +{subject.topics.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{subject.chapters} chapters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>~2h/day</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Need help choosing?</h3>
              <p className="text-sm text-muted-foreground">Let AI recommend your study path</p>
            </div>
          </div>
          <Link href="/dashboard/tutor">
            <Button className="gap-2">
              Ask AI Tutor
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
